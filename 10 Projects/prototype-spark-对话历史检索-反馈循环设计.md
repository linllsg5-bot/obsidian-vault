---
author: Claude Opus 4.8
date: 2026-05-31
status: 技术探索
project: prototype-spark v2
context: 从"对话历史检索"这个小问题入手，设计反馈循环而非固定算法
based_on: [[10 Projects/Spark-核心设计哲学]]
---

# 对话历史检索的反馈循环设计

> **核心思想**：系统不决定"显示几条历史"，而是观察用户行为，让"显示几条"从互动中涌现。

---

## 问题重述

当用户在某个 Block 上开启新对话时，系统应该调出哪些历史对话？

**传统方案**（违反哲学）：
- 固定显示 3 条（预设）
- 相似度 > 0.75 就显示（机械阈值）
- 用户手动选择（用户管理系统）

**我们要的**：
- 系统观察用户行为
- 系统根据行为调整呈现
- "显示几条"从互动中涌现

---

## 设计：三层呈现 + 行为追踪

### 第一层：全量检索，多维度排列

系统找出所有相关的历史对话，不设数量上限。

按多个维度排列：
1. **语义相关度**（embedding 相似度）
2. **时间接近度**（最近的对话）
3. **被引用次数**（用户在其他对话中提到过这段历史）
4. **沉积质量**（这段历史产生的沉积是否被后续对话引用）
5. **对话深度**（这段历史的对话轮次、用户投入的时间）

每个维度给一个分数，但**不做加权求和**（那还是预设）。

### 第二层：视觉化呈现，让用户自己看到"核心 vs 边缘"

不是"显示前 3 条，隐藏其他"，而是：

**把所有历史都呈现出来，但用视觉方式区分核心和边缘。**

可能的视觉方式：
- **字体大小**：核心的大，边缘的小
- **透明度**：核心的实，边缘的虚
- **位置**：核心的在上/中心，边缘的在下/外围
- **折叠状态**：核心的默认展开，边缘的默认折叠（但可以展开）

**关键**：边缘的历史不是"不显示"，而是"显示但弱化"。用户如果想看，随时可以看到。

### 第三层：行为追踪，调整下次呈现

系统观察用户的行为：

| 行为 | 信号 | 系统的反应 |
|------|------|-----------|
| 用户点击了某条历史 | 这条历史对用户有用 | 下次，相似的历史提升权重 |
| 用户展开了某条折叠的历史 | 边缘的历史也有用 | 下次，降低"折叠阈值" |
| 用户忽略了某条历史（没点击、没展开） | 这条历史对用户无用 | 下次，相似的历史降低权重 |
| 用户在某条历史上停留很久 | 这条历史很重要 | 下次，这个维度（比如"时间接近度"）提升权重 |
| 用户在对话中引用了某条历史 | 这条历史被吸纳 | 这条历史的权重永久提升 |

**关键**：系统不是在"学习用户偏好"（那是引导），而是在"学习哪些维度对这个 Block 更重要"。

---

## 具体实现

### 数据结构

```python
# Block 的历史检索配置（动态生成，不是预设）
{
  "block_id": "block_abc",
  "retrieval_weights": {
    "semantic_similarity": 1.0,  # 初始权重都是 1.0
    "temporal_proximity": 1.0,
    "reference_count": 1.0,
    "sediment_quality": 1.0,
    "conversation_depth": 1.0
  },
  "interaction_history": [
    {
      "session_id": "sess_001",
      "retrieved_sessions": ["sess_010", "sess_015", "sess_020"],
      "user_actions": {
        "sess_010": {"clicked": True, "dwell_time": 120},
        "sess_015": {"clicked": False, "dwell_time": 0},
        "sess_020": {"clicked": True, "dwell_time": 300, "referenced": True}
      }
    }
  ]
}
```

### 检索流程

```python
def retrieve_history_with_feedback(block, current_query, user_state):
    """
    检索历史对话，基于反馈循环
    """
    
    # 1. 全量检索，计算多维度分数
    all_sessions = block['sessions']
    scored_sessions = []
    
    for session in all_sessions:
        scores = {
            'semantic_similarity': compute_semantic_similarity(current_query, session),
            'temporal_proximity': compute_temporal_proximity(session),
            'reference_count': count_references(session, block),
            'sediment_quality': compute_sediment_quality(session, block),
            'conversation_depth': compute_conversation_depth(session)
        }
        
        # 获取这个 Block 的动态权重
        weights = block.get('retrieval_weights', {
            'semantic_similarity': 1.0,
            'temporal_proximity': 1.0,
            'reference_count': 1.0,
            'sediment_quality': 1.0,
            'conversation_depth': 1.0
        })
        
        # 加权求和（但权重是动态的，从用户行为中学习的）
        final_score = sum(scores[dim] * weights[dim] for dim in scores)
        
        scored_sessions.append({
            'session': session,
            'scores': scores,
            'final_score': final_score
        })
    
    # 2. 排序
    scored_sessions.sort(key=lambda x: x['final_score'], reverse=True)
    
    # 3. 视觉化呈现（不是"只显示前 3 条"）
    presentation = []
    for i, item in enumerate(scored_sessions):
        # 根据分数决定视觉权重
        visual_weight = item['final_score'] / scored_sessions[0]['final_score']
        
        presentation.append({
            'session': item['session'],
            'visual_weight': visual_weight,  # 0-1，用于控制字体大小、透明度等
            'default_expanded': visual_weight > 0.7,  # 高权重的默认展开
            'position': i  # 位置
        })
    
    return presentation


def track_user_interaction(block, session_id, retrieved_sessions, user_actions):
    """
    追踪用户行为，调整权重
    """
    
    # 分析用户行为
    for retrieved_id, actions in user_actions.items():
        if actions.get('clicked'):
            # 用户点击了这条历史，分析是哪个维度起作用
            session = find_session(retrieved_id)
            
            # 找出这条历史在哪个维度得分最高
            top_dimension = max(session['scores'], key=session['scores'].get)
            
            # 提升这个维度的权重
            block['retrieval_weights'][top_dimension] *= 1.1
        
        if not actions.get('clicked') and actions.get('shown'):
            # 用户忽略了这条历史
            session = find_session(retrieved_id)
            top_dimension = max(session['scores'], key=session['scores'].get)
            
            # 降低这个维度的权重
            block['retrieval_weights'][top_dimension] *= 0.9
        
        if actions.get('referenced'):
            # 用户在对话中引用了这条历史，这是最强的信号
            session = find_session(retrieved_id)
            for dim in session['scores']:
                if session['scores'][dim] > 0.5:
                    block['retrieval_weights'][dim] *= 1.3
    
    # 归一化权重（防止无限增长）
    total = sum(block['retrieval_weights'].values())
    for dim in block['retrieval_weights']:
        block['retrieval_weights'][dim] /= total
    
    # 保存交互历史
    block.setdefault('interaction_history', []).append({
        'session_id': session_id,
        'retrieved_sessions': retrieved_sessions,
        'user_actions': user_actions
    })
```

---

## 这个设计如何满足 9 条约束

### 1. 软件的形态是创作本身的投影

- ✅ 没有预设"显示 3 条"
- ✅ 显示的数量和方式，从用户的行为中涌现
- ✅ 用户写得少时，历史少，呈现自然简洁
- ✅ 用户写得多时，历史多，呈现自然丰富

### 2. 架构的重量跟随用户的创作

- ✅ 用户的创作轻（少量对话），检索结果就轻（少量历史）
- ✅ 用户的创作重（大量对话），检索结果就重（大量历史）
- ✅ 重量不是被隐藏的，而是被呈现的（通过视觉权重）

### 3. 不是用户在管理系统，是系统在跟踪用户在乎什么

- ✅ 用户不需要手动选择"挂载哪段历史"
- ✅ 系统观察用户的行为（点击、忽略、引用）
- ✅ 系统根据行为调整呈现

### 8. 读穿用户所涉及到的范围

- ✅ 不是机械的相似度阈值
- ✅ 系统判断"这段历史在当前对话中是否真的需要"（通过多维度 + 动态权重）
- ✅ 一切看情况（权重是动态的，从用户行为中学习的）

---

## 初始状态问题

**问题**：第一次使用时，系统还没有用户行为数据，怎么办？

**答案**：
1. 初始权重都是 1.0（平等对待所有维度）
2. 第一次检索，系统按多维度平均分呈现
3. 用户的第一次行为，开始调整权重
4. 之后，权重逐渐收敛到"这个 Block 真正需要的维度"

**关键**：初始状态不是"预设"，而是"中性"。系统不假设用户需要什么，而是从用户的行为中学习。

---

## 跨 Block 的问题

**问题**：不同 Block 的检索权重应该独立吗？

**答案**：
- **是的，应该独立。**
- 因为不同 Block 的创作性质可能不同
- 有的 Block 可能更依赖"时间接近度"（最近的思考）
- 有的 Block 可能更依赖"语义相关度"（跨时间的主题）
- 系统不预设，而是从用户在每个 Block 上的行为中学习

---

## 下一步

这个设计是"对话历史检索"这个小问题的反馈循环方案。

如果这个方向对，可以：
1. **实现这个反馈循环**（在 Streamlit 原型中验证）
2. **用经典作品测试**（按你的提议：前期 → 完整 → 中期，观察生长）
3. **推广到其他问题**（材料搜索、沉积呈现、枝桠组织）

---

## 待讨论

1. **视觉化呈现的具体方式**：字体大小、透明度、位置 — 哪种最合适？
2. **权重调整的速度**：1.1 / 0.9 / 1.3 这些系数是否合理？
3. **归一化策略**：权重总和归一化，是否会导致某些维度被过度压制？
4. **初始状态**：所有维度权重都是 1.0，是否合理？还是应该有某种"先验"？

---

## See Also

- [[10 Projects/Spark-核心设计哲学]] — 9 条约束
- [[10 Projects/prototype-spark-v2-对话历史语义追踪层设计-v2]] — v2 设计（已废弃，违反约束）
