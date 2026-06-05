---
author: Claude Opus 4.8 (深度思考模式)
date: 2026-05-31
status: 设计提案 v2
project: prototype-spark v2
context: 从小林的核心哲学出发，重新设计对话历史的语义追踪层
replaces: prototype-spark-v2-对话历史语义追踪层设计.md (v1 是通用 RAG 模式，未深入哲学)
---

# prototype-spark v2 — 对话历史语义追踪层设计 v2

> **核心问题**：如何让 AI 在新对话中自动读取相关的历史对话，而不是全量读取（token 地狱）或手动挂载（用户负担）？
>
> **v2 与 v1 的根本区别**：v1 是通用的 RAG 检索模式。v2 从小林的核心哲学出发，把哲学翻译成技术约束。

---

## 第一步：从哲学到技术约束

从小林与 antigravity、Gemini 3.1 Pro、Claude 的架构讨论中，提取出以下**技术约束**：

### 1. "沉积 = 尾迹，不是总结"

**原话**（小林校正 3.1 Pro）：
> 关键不在于总结。用户做的以及问的才需要保留。用户与 AI 的对话才是重要的，不需要刻意总结，只需要保留。

**技术约束**：
- 沉积不是对话的摘要，是**对原型的新切面**
- 沉积的检索权重应该**远高于**普通对话
- 沉积应该是**独立的检索维度**，不是被稀释在对话文本里

### 2. "创造来自阻力而不是便利"

**原话**（小林确认）：
> 这句话很有意思，值得作为核心去看待。如果创造意味着突破，那确实对应着感受到阻力或者世界的局限与束缚需要去触摸、尝试。

**技术约束**：
- 检索不能只返回"最相似"的历史
- 需要**故意引入张力** — 偶尔调出"不太像但有冲突感"的东西
- 相似度检索 + 反相似度机制（controlled serendipity）

### 3. "系统跟踪用户在乎什么"

**原话**（小林与 Claude Opus 的共识）：
> 不是用户在管理系统，是系统在跟踪用户在乎什么。用户在对话中自然发生的姿态（引用某句话继续写、把某条材料展开），系统识别到这个动作，悄悄记录。

**技术约束**：
- 用户的自然姿态（引用某句话、展开某条材料）= 信号
- 不只是"用户问了什么"，还要看"用户在对话中做了什么"
- 跨 Block 的创作共振要能被捕捉

### 4. "软件形态是创作本身的投影"

**原话**（小林的核心设计哲学）：
> 写一首短诗时，工具就该像一首短诗——几乎空的界面。写一部史诗时，工具应该长成一座城——层叠的原型、交织的沉积、密集的脉络。工具没有预设的体积。创作行为本身在搭建它，用户甚至不需要意识到搭建在发生。

**技术约束**：
- 写短诗时（1-2 个 Block，少量对话）→ 检索应该克制，只调最核心的
- 写史诗时（10+ 个 Block，密集对话）→ 检索应该丰富，跨 Block 关联
- **检索策略随创作体量动态调整**

### 5. "材料应尊重原样保留"

**原话**（小林校正 3.1 Pro）：
> "高度克制的塔罗牌式卡片"：错了。看似精炼的卡片其实是自以为是，抹杀原型所关联作品材料带来的感觉。应该尊重材料原样并尽可能保留。

**技术约束**：
- 检索到的历史对话，不要"精炼"或"总结"
- 保留原文，让用户自己看到当时的语气、犹豫、转折

### 6. "Pre-AI 区边界"

**原话**（小林的领地划分，见 AI.md）：
> Journal 区（`00 Journal/`）是 Pre-AI 区，AI 只读不写。

**技术约束**：
- 如果 Block 原文来自 Journal 区（Pre-AI），检索时应该排除那些内容
- 或者至少标记"这是 Pre-AI 区的内容，谨慎使用"

---

## 第二步：三层检索 + 动态策略

基于以上约束，设计一个**三层检索 + 动态策略**的机制：

### 层 1：沉积优先检索（Sediment-First Retrieval）

**核心思想**：沉积是最高价值尾迹，单独检索，权重最高。

```python
def search_in_sediments(query: str, all_blocks: list, top_k: int = 5) -> list:
    """
    在所有 Block 的沉积中检索（跨 Block）
    
    为什么跨 Block：
    - 沉积是"对原型的新切面"，不只是"对话摘要"
    - 一个 Block 的沉积，可能对另一个 Block 的创作有启发
    - 沉积通常很短，embedding 成本低
    """
    query_emb = get_embedding(query)
    
    sediment_candidates = []
    for block in all_blocks:
        for session in block['sessions']:
            if not session.get('sediment'):
                continue
            
            # 每条沉积单独 embedding（不是整个 session）
            sediment_text = session['sediment']
            if 'sediment_embedding' not in session:
                session['sediment_embedding'] = get_embedding(sediment_text)
            
            score = cosine_similarity(query_emb, session['sediment_embedding'])
            sediment_candidates.append({
                'block_id': block['id'],
                'block_name': block['name'],
                'session_date': session['date'],
                'sediment': sediment_text,
                'score': score
            })
    
    # 按相似度排序，取 top_k
    sediment_candidates.sort(key=lambda x: x['score'], reverse=True)
    return sediment_candidates[:top_k]
```

**为什么这样设计**：
- 沉积 = 尾迹 → 独立检索维度
- 跨 Block 检索 → 捕捉创作共振
- 单独 embedding → 语义密度高，相似度更准确

---

### 层 2：对话历史检索 + 反相似度机制

**核心思想**：不只返回"最相似"的，偶尔故意返回"有张力"的。

```python
def search_similar_sessions(
    query: str,
    block: dict,
    top_k: int = 3,
    threshold: float = 0.75
) -> list:
    """正常的相似度检索（本 Block 内）"""
    query_emb = get_embedding(query)
    
    sessions_with_score = []
    for session in block['sessions']:
        if 'embedding' not in session:
            session_text = format_session_for_embedding(session)
            session['embedding'] = get_embedding(session_text)
        
        score = cosine_similarity(query_emb, session['embedding'])
        if score >= threshold:
            sessions_with_score.append((session, score))
    
    sessions_with_score.sort(key=lambda x: x[1], reverse=True)
    return [s for s, score in sessions_with_score[:top_k]]


def search_dissimilar_but_temporally_close(
    query: str,
    block: dict,
    time_window_days: int = 7,
    similarity_range: tuple = (0.3, 0.5)
) -> list:
    """
    反相似度检索：找到"语义不太像，但在创作时间线上接近"的会话
    
    为什么这样设计：
    - "创造来自阻力" → 不能只给"最像"的，要有冲突感
    - 时间窗口 → 最近的创作状态更相关
    - 相似度 0.3-0.5 → 不是完全无关，是"有点像但不太像"
    """
    from datetime import datetime, timedelta
    
    query_emb = get_embedding(query)
    now = datetime.now()
    cutoff = now - timedelta(days=time_window_days)
    
    candidates = []
    for session in block['sessions']:
        session_date = datetime.fromisoformat(session['date'])
        if session_date < cutoff:
            continue
        
        if 'embedding' not in session:
            session_text = format_session_for_embedding(session)
            session['embedding'] = get_embedding(session_text)
        
        score = cosine_similarity(query_emb, session['embedding'])
        
        # 只要相似度在指定范围内的
        if similarity_range[0] <= score <= similarity_range[1]:
            candidates.append((session, score))
    
    # 按时间倒序（最近的优先）
    candidates.sort(key=lambda x: x[0]['date'], reverse=True)
    return [s for s, score in candidates[:2]]
```

**为什么这样设计**：
- 创造来自阻力 → 80% 相似 + 20% 反相似
- 时间窗口 → 最近 7 天的创作状态更相关
- 相似度 0.3-0.5 → "有点像但不太像"，制造张力

---

### 层 3：跨 Block 共振检索

**核心思想**：捕捉跨 Block 的创作张力，不只是语义相似。

```python
def extract_cross_block_references(conversation_history: list) -> list:
    """
    从对话历史中提取用户"引用"或"提到"的其他 Block
    
    信号：
    - 用户说"像我之前写的 X"
    - 用户说"跟 Y 那个原型有关"
    - 用户在对话中粘贴了其他 Block 的文本
    """
    referenced_blocks = []
    
    for msg in conversation_history:
        if msg['role'] != 'user':
            continue
        
        # 简单的关键词检测（实际应该用 LLM 判意图）
        keywords = ["之前写的", "那个原型", "另一个", "上次的"]
        if any(kw in msg['content'] for kw in keywords):
            # 这里需要更复杂的逻辑来识别具体是哪个 Block
            # 暂时标记为"需要跨 Block 检索"
            referenced_blocks.append({
                'signal': msg['content'],
                'confidence': 0.7  # 需要 LLM 判断
            })
    
    return referenced_blocks


def search_cross_block_sessions(
    query: str,
    referenced_blocks: list,
    all_blocks: list,
    top_k_per_block: int = 1
) -> list:
    """在被引用的 Block 中检索相关会话"""
    cross_block_sessions = []
    
    for ref in referenced_blocks:
        # 根据信号找到对应的 Block（这里简化处理）
        # 实际应该用语义匹配或 LLM 判断
        for block in all_blocks:
            sessions = search_similar_sessions(
                query=query,
                block=block,
                top_k=top_k_per_block
            )
            for session in sessions:
                session['cross_block_source'] = block['name']
                cross_block_sessions.append(session)
    
    return cross_block_sessions
```

**为什么这样设计**：
- 系统跟踪用户在乎什么 → 用户提到的其他 Block = 信号
- 跨 Block 共振 → 不是语义相似，是创作张力
- 标记来源 → 让用户知道"这是从另一个 Block 调来的"

---

### 动态策略：随创作体量调整

**核心思想**：软件形态是创作本身的投影 → 检索策略随体量变化。

```python
def get_retrieval_strategy(user_state: dict) -> dict:
    """
    根据用户的创作体量，动态调整检索策略
    
    为什么这样设计：
    - 短诗时克制 → 避免信息过载
    - 史诗时丰富 → 支持复杂的跨 Block 关联
    """
    total_blocks = len(user_state['blocks'])
    total_sessions = sum(len(b['sessions']) for b in user_state['blocks'])
    
    if total_blocks <= 2 and total_sessions <= 5:
        # 短诗模式：克制，只调最核心的
        return {
            'sediment_top_k': 2,
            'session_top_k': 1,
            'cross_block': False,
            'dissimilar_ratio': 0,  # 不引入反相似度
            'mode': '短诗'
        }
    
    elif total_blocks <= 10 and total_sessions <= 30:
        # 中篇模式：平衡
        return {
            'sediment_top_k': 3,
            'session_top_k': 2,
            'cross_block': True,
            'dissimilar_ratio': 0.1,  # 10% 反相似度
            'mode': '中篇'
        }
    
    else:
        # 史诗模式：丰富，跨 Block 关联
        return {
            'sediment_top_k': 5,
            'session_top_k': 3,
            'cross_block': True,
            'dissimilar_ratio': 0.2,  # 20% 反相似度
            'mode': '史诗'
        }
```

**为什么这样设计**：
- 软件形态是投影 → 检索策略不是固定的，是动态的
- 短诗时克制 → 只调 1-2 条最核心的历史
- 史诗时丰富 → 调 5+ 条，跨 Block 关联，引入反相似度

---

### Pre-AI 边界守护

**核心思想**：尊重小林的领地划分，Pre-AI 区的内容不进入检索。

```python
def filter_pre_ai_content(sessions: list, pre_ai_paths: list) -> list:
    """
    过滤掉来自 Pre-AI 区的内容
    
    为什么这样设计：
    - 小林的领地划分：Journal 区是 Pre-AI 区
    - AI 只读不写，检索时也应该尊重这个边界
    """
    filtered = []
    for session in sessions:
        block_path = session.get('block_path', '')
        
        # 检查是否在 Pre-AI 区
        is_pre_ai = any(block_path.startswith(path) for path in pre_ai_paths)
        
        if not is_pre_ai:
            filtered.append(session)
        else:
            # 或者标记但不完全排除（让用户决定）
            session['warning'] = '⚠️ Pre-AI 区内容，谨慎使用'
            filtered.append(session)
    
    return filtered
```

---

## 第三步：完整流程

```python
def retrieve_context_for_new_conversation(
    current_block: dict,
    current_query: str,
    user_state: dict,
    all_blocks: list
) -> dict:
    """
    为新对话检索相关上下文
    
    返回：
    {
        'sediments': [...],           # 沉积（跨 Block）
        'similar_sessions': [...],    # 相似会话（本 Block）
        'dissimilar_sessions': [...], # 反相似会话（本 Block）
        'cross_block_sessions': [...],# 跨 Block 会话
        'strategy': {...}             # 使用的策略
    }
    """
    
    # 0. 获取动态策略
    strategy = get_retrieval_strategy(user_state)
    
    # 1. 沉积优先检索（跨所有 Block）
    sediment_results = search_in_sediments(
        query=current_query,
        all_blocks=all_blocks,
        top_k=strategy['sediment_top_k']
    )
    
    # 2. 本 Block 的对话历史检索
    similar_sessions = search_similar_sessions(
        query=current_query,
        block=current_block,
        top_k=strategy['session_top_k']
    )
    
    # 3. 反相似度检索（如果策略允许）
    dissimilar_sessions = []
    if strategy['dissimilar_ratio'] > 0:
        dissimilar_sessions = search_dissimilar_but_temporally_close(
            query=current_query,
            block=current_block,
            time_window_days=7,
            similarity_range=(0.3, 0.5)
        )
        # 按比例混合
        n_dissimilar = int(strategy['session_top_k'] * strategy['dissimilar_ratio'])
        dissimilar_sessions = dissimilar_sessions[:n_dissimilar]
    
    # 4. 跨 Block 共振检索（如果策略允许）
    cross_block_sessions = []
    if strategy['cross_block']:
        referenced_blocks = extract_cross_block_references(
            conversation_history=current_block.get('current_conversation', [])
        )
        if referenced_blocks:
            cross_block_sessions = search_cross_block_sessions(
                query=current_query,
                referenced_blocks=referenced_blocks,
                all_blocks=all_blocks,
                top_k_per_block=1
            )
    
    # 5. Pre-AI 边界过滤
    all_sessions = similar_sessions + dissimilar_sessions + cross_block_sessions
    filtered_sessions = filter_pre_ai_content(
        sessions=all_sessions,
        pre_ai_paths=user_state.get('pre_ai_paths', ['00 Journal/'])
    )
    
    return {
        'sediments': sediment_results,
        'similar_sessions': similar_sessions,
        'dissimilar_sessions': dissimilar_sessions,
        'cross_block_sessions': cross_block_sessions,
        'strategy': strategy
    }
```

---

## 第四步：上下文构建

```python
def build_context(
    block: dict,
    retrieval_result: dict,
    query: str
) -> str:
    """
    构建包含相关历史的上下文
    
    格式：
    - 原型文本
    - 沉积（跨 Block，标注来源）
    - 相似会话（本 Block）
    - 反相似会话（本 Block，标注"张力"）
    - 跨 Block 会话（标注来源）
    - 当前问题
    """
    parts = []
    
    # 1. 原型文本
    parts.append(f"【原型】\n{block['text']}\n")
    
    # 2. 沉积（最高优先级）
    if retrieval_result['sediments']:
        parts.append("\n【相关沉积】")
        for i, sed in enumerate(retrieval_result['sediments'], 1):
            source = f"来自 {sed['block_name']}" if sed['block_id'] != block['id'] else "本原型"
            parts.append(f"\n{i}. {source}（{sed['session_date'][:10]}）")
            parts.append(sed['sediment'])
    
    # 3. 相似会话
    if retrieval_result['similar_sessions']:
        parts.append("\n【相关历史对话】")
        for i, session in enumerate(retrieval_result['similar_sessions'], 1):
            parts.append(f"\n第 {i} 次（{session['date'][:10]}）")
            # 只取最后 5 轮对话
            conv = session['conversation'][-5:]
            for msg in conv:
                role = "用户" if msg['role'] == 'user' else "AI"
                parts.append(f"{role}：{msg['content']}")
    
    # 4. 反相似会话（标注"张力"）
    if retrieval_result['dissimilar_sessions']:
        parts.append("\n【可能有张力的历史】")
        for i, session in enumerate(retrieval_result['dissimilar_sessions'], 1):
            parts.append(f"\n第 {i} 次（{session['date'][:10]}，语义不太像但时间接近）")
            conv = session['conversation'][-3:]  # 只取最后 3 轮
            for msg in conv:
                role = "用户" if msg['role'] == 'user' else "AI"
                parts.append(f"{role}：{msg['content']}")
    
    # 5. 跨 Block 会话（标注来源）
    if retrieval_result['cross_block_sessions']:
        parts.append("\n【跨原型共振】")
        for i, session in enumerate(retrieval_result['cross_block_sessions'], 1):
            source = session.get('cross_block_source', '?')
            parts.append(f"\n来自原型「{source}」（{session['date'][:10]}）")
            conv = session['conversation'][-3:]
            for msg in conv:
                role = "用户" if msg['role'] == 'user' else "AI"
                parts.append(f"{role}：{msg['content']}")
    
    # 6. 当前问题
    parts.append(f"\n【当前对话】\n用户：{query}")
    
    # 7. 策略说明（可选，调试用）
    strategy = retrieval_result['strategy']
    parts.append(f"\n（检索策略：{strategy['mode']}模式）")
    
    return "\n".join(parts)
```

---

## 成本估算

### Embedding 成本

假设一个活跃用户：
- 10 个 Block（原型）
- 每个 Block 平均 5 次会话
- 每次会话 10 轮对话，产生 1 条沉积

**一次性成本**（初始化）：
- Block embedding：10 × $0.0001 = $0.001
- Session embedding：50 × $0.001 = $0.05
- Sediment embedding：50 × $0.0001 = $0.005

**持续成本**（每次新对话）：
- Current query embedding：$0.00001（可忽略）

**总成本**：约 $0.056 / 用户（一次性）+ 可忽略的持续成本

### 对话成本（主要开销）

**短诗模式**（2 沉积 + 1 会话）：
- 额外上下文：约 1000 tokens
- 成本：$0.015 / 次对话（Claude Opus）

**史诗模式**（5 沉积 + 3 会话 + 反相似 + 跨 Block）：
- 额外上下文：约 3000 tokens
- 成本：$0.045 / 次对话（Claude Opus）

**关键优势**：动态策略让成本随创作体量增长，而不是一开始就很高。

---

## 与 v1 的对比

| 维度 | v1（通用 RAG） | v2（哲学驱动） |
|------|---------------|---------------|
| **沉积处理** | 稀释在对话文本里 | 独立检索维度，权重最高 |
| **检索策略** | 固定（top 3） | 动态（短诗/中篇/史诗） |
| **张力机制** | 无 | 反相似度检索（0.3-0.5） |
| **跨 Block** | 无 | 捕捉用户引用信号 |
| **Pre-AI 边界** | 无 | 过滤或标记 |
| **哲学对齐** | 工程上干净 | 哲学上对 |

---

## 实现路线图

### Phase 1：沉积优先检索（2 天）
- [ ] 实现沉积独立 embedding
- [ ] 跨 Block 沉积检索
- [ ] 在 Streamlit 原型中验证

### Phase 2：动态策略（1 天）
- [ ] 实现短诗/中篇/史诗模式判断
- [ ] 动态调整检索参数
- [ ] 验证不同体量下的效果

### Phase 3：反相似度机制（1 天）
- [ ] 实现时间窗口 + 相似度范围检索
- [ ] 混合策略（80% 相似 + 20% 反相似）
- [ ] 用户反馈机制（"这条历史有用吗？"）

### Phase 4：跨 Block 共振（2 天）
- [ ] 实现用户引用信号检测
- [ ] 跨 Block 会话检索
- [ ] 标记来源和置信度

### Phase 5：Pre-AI 边界（1 天）
- [ ] 实现路径过滤
- [ ] 标记 Pre-AI 区内容
- [ ] 用户确认机制

---

## 待讨论的问题

1. **反相似度的相似度范围**：0.3-0.5 是否合适？需要实际测试
2. **跨 Block 引用检测**：关键词匹配太粗，是否需要 LLM 判意图？
3. **Pre-AI 边界策略**：完全排除 vs 标记但保留，哪个更符合小林的意图？
4. **动态策略的阈值**：短诗/中篇/史诗的 Block 数量和会话数量阈值是否合理？
5. **成本控制**：史诗模式下 3000 tokens 额外上下文，是否可接受？

---

## 核心差异总结

**v1 是"怎么做"（技术实现）**
**v2 是"为什么这样做"（哲学驱动）**

v1 能跑，但它是通用的 RAG 检索。
v2 也能跑，但它是**小林的** RAG 检索 — 每个设计决策都能追溯到小林的核心哲学。

---

## See Also

- [[10 Projects/spark-sessions/2026-05-28-antigravity-架构讨论/index]] — v2 架构讨论
- [[10 Projects/AI应用构思 - 原型刺激器路线]] — 项目路线图
- [[AI/当前主线]] — 当前主线 A
- [[AI/认识论]] — "尝试 → 存在"的倒置
