---
author: Claude Opus 4.8
date: 2026-05-31
status: 设计提案
project: prototype-spark v2
context: 基于 antigravity 的 Block-centric 架构，设计对话历史的语义追踪层
---

# prototype-spark v2 — 对话历史语义追踪层设计

> **核心问题**：如何让 AI 在新对话中自动读取相关的历史对话，而不是全量读取（token 地狱）或手动挂载（用户负担）？

---

## 设计原则（来自 2026-05-28 架构讨论）

1. **不是用户手动挂载** — 系统自动"读穿用户所涉及到的范围"
2. **不是全量读取** — 避免 token 地狱
3. **Block-level 绑定** — 对话历史绑定到具体的 Block（原型片段）
4. **系统跟踪用户在乎什么** — 用户的自然姿态（引用某句话、展开某条材料）= 系统识别的信号

---

## 架构设计

### 数据模型

```python
# Block（原型片段）
{
  "id": "block_abc123",
  "text": "原型文本...",
  "created_at": "2026-05-25T10:30:00",
  "updated_at": "2026-05-30T15:20:00",
  "embedding": [0.123, -0.456, ...],  # 768 维向量
  "sessions": [
    {
      "session_id": "sess_001",
      "date": "2026-05-25T10:35:00",
      "materials": [...],  # 搜到的材料
      "conversation": [...],  # 对话历史
      "sediment": "...",  # 沉积
      "embedding": [0.234, -0.567, ...]  # 整个会话的语义向量
    }
  ]
}
```

### 核心机制：语义相似度检索

当用户在某个 Block 上开启新对话时：

1. **提取当前上下文向量**
   - 用户的第一句话 + Block 当前文本 → embedding
   
2. **检索相关历史会话**
   - 遍历该 Block 的所有历史 sessions
   - 计算余弦相似度：`cosine_similarity(current_embedding, session_embedding)`
   - 相似度 > 0.75 的会话 → 候选集
   
3. **智能截断与拼接**
   - 按相似度排序，取 top 3
   - 每个会话只取最后 N 轮对话（N = 5-10）
   - 拼接成上下文：
     ```
     【相关历史 1】（2026-05-25，相似度 0.82）
     用户：...
     AI：...
     
     【相关历史 2】（2026-05-28，相似度 0.78）
     用户：...
     AI：...
     
     【当前对话】
     用户：[新问题]
     ```

4. **动态调整**
   - 如果 token 预算不够，只取 top 1
   - 如果用户明确引用某次历史（"上次你说的 X"），强制加载那次会话

---

## 技术实现

### 1. Embedding 生成

使用 OpenAI `text-embedding-3-small`（便宜、快）：

```python
import openai

def get_embedding(text: str) -> list[float]:
    """生成文本的 embedding 向量"""
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding
```

**成本**：
- $0.02 / 1M tokens
- 一个 Block（500 字）≈ 0.0001 美元
- 一次会话（5000 字）≈ 0.001 美元

### 2. 相似度计算

```python
import numpy as np

def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    """计算两个向量的余弦相似度"""
    a = np.array(vec1)
    b = np.array(vec2)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

### 3. 历史检索

```python
def retrieve_relevant_sessions(
    block: dict,
    current_query: str,
    top_k: int = 3,
    threshold: float = 0.75
) -> list[dict]:
    """检索相关的历史会话"""
    
    # 1. 生成当前上下文的 embedding
    current_text = f"{block['text']}\n\n用户问：{current_query}"
    current_emb = get_embedding(current_text)
    
    # 2. 计算与所有历史会话的相似度
    sessions_with_score = []
    for session in block['sessions']:
        if 'embedding' not in session:
            # 如果历史会话没有 embedding，现在生成
            session_text = format_session_for_embedding(session)
            session['embedding'] = get_embedding(session_text)
        
        score = cosine_similarity(current_emb, session['embedding'])
        if score >= threshold:
            sessions_with_score.append((session, score))
    
    # 3. 按相似度排序，取 top_k
    sessions_with_score.sort(key=lambda x: x[1], reverse=True)
    return [s for s, score in sessions_with_score[:top_k]]


def format_session_for_embedding(session: dict) -> str:
    """把会话格式化为适合 embedding 的文本"""
    parts = []
    
    # 材料摘要
    if session.get('materials'):
        parts.append("搜到的材料：" + 
                    ", ".join(m['source'] for m in session['materials'][:5]))
    
    # 对话摘要（只取关键轮次）
    conv = session.get('conversation', [])
    if len(conv) > 10:
        # 取开头 3 轮 + 结尾 3 轮
        key_turns = conv[:3] + conv[-3:]
    else:
        key_turns = conv
    
    for msg in key_turns:
        role = "用户" if msg['role'] == 'user' else "AI"
        parts.append(f"{role}：{msg['content'][:200]}")  # 每条最多 200 字
    
    # 沉积
    if session.get('sediment'):
        parts.append(f"沉积：{session['sediment']}")
    
    return "\n".join(parts)
```

### 4. 上下文拼接

```python
def build_context_with_history(
    block: dict,
    current_query: str,
    max_tokens: int = 4000
) -> str:
    """构建包含相关历史的上下文"""
    
    relevant_sessions = retrieve_relevant_sessions(block, current_query)
    
    parts = [f"【原型】\n{block['text']}\n"]
    
    # 添加相关历史
    for i, session in enumerate(relevant_sessions, 1):
        parts.append(f"\n【相关历史 {i}】（{session['date'][:10]}）")
        
        # 只取最后 5 轮对话
        conv = session['conversation'][-5:]
        for msg in conv:
            role = "用户" if msg['role'] == 'user' else "AI"
            parts.append(f"{role}：{msg['content']}")
        
        if session.get('sediment'):
            parts.append(f"沉积：{session['sediment']}")
    
    # 添加当前问题
    parts.append(f"\n【当前对话】\n用户：{current_query}")
    
    context = "\n".join(parts)
    
    # Token 预算控制（粗略估算：1 token ≈ 1.5 字符）
    if len(context) > max_tokens * 1.5:
        # 只保留 top 1 历史
        return build_context_with_history(
            block, current_query, max_tokens
        ) if len(relevant_sessions) > 1 else context[:int(max_tokens * 1.5)]
    
    return context
```

---

## 优化策略

### 1. 缓存 Embedding

- Block 的 embedding 只在文本修改时重新生成
- Session 的 embedding 在会话结束时生成一次，永久缓存
- 避免重复计算

### 2. 增量更新

- 新会话结束时，立即生成 embedding 并存储
- 不需要批量重新计算

### 3. 降级策略

- 如果 embedding API 不可用，降级为关键词匹配
- 提取用户问题中的关键词，在历史会话中搜索

### 4. 用户信号增强

当用户明确引用历史时（"上次你说的 X"），强制加载：

```python
def detect_explicit_reference(query: str) -> bool:
    """检测用户是否明确引用历史"""
    keywords = ["上次", "之前", "那次", "你说过", "我们讨论过"]
    return any(kw in query for kw in keywords)
```

---

## 成本估算

假设一个活跃用户：
- 10 个 Block（原型）
- 每个 Block 平均 5 次会话
- 每次会话 10 轮对话

**Embedding 成本**：
- Block embedding：10 × $0.0001 = $0.001
- Session embedding：50 × $0.001 = $0.05
- 检索时的 current query embedding：可忽略

**总成本**：约 $0.05 / 用户 / 月（embedding）

**对话成本**（主要开销）：
- 每次对话带 3 个历史会话上下文 ≈ 额外 2000 tokens
- 如果用 Claude Opus：$15 / 1M input tokens
- 额外成本：$0.03 / 次对话

---

## 实现路线图

### Phase 1：基础检索（1-2 天）
- [ ] 实现 embedding 生成和存储
- [ ] 实现余弦相似度检索
- [ ] 在 Streamlit 原型中验证

### Phase 2：智能截断（1 天）
- [ ] Token 预算控制
- [ ] 动态调整历史数量
- [ ] 降级策略

### Phase 3：用户信号增强（1 天）
- [ ] 检测明确引用
- [ ] 用户反馈机制（"这次历史有用吗？"）
- [ ] 根据反馈调整相似度阈值

### Phase 4：性能优化（1 天）
- [ ] Embedding 缓存
- [ ] 批量检索优化
- [ ] 监控和日志

---

## 待讨论的问题

1. **相似度阈值**：0.75 是否合适？需要实际测试调整
2. **历史数量**：top 3 是否够？还是 top 5？
3. **Token 预算**：4000 tokens 给历史是否合理？
4. **降级策略**：关键词匹配的具体实现
5. **跨 Block 检索**：是否需要在其他 Block 的历史中也搜索相关内容？

---

## See Also

- [[10 Projects/spark-sessions/2026-05-28-antigravity-架构讨论/index]] — v2 架构讨论
- [[10 Projects/AI应用构思 - 原型刺激器路线]] — 项目路线图
- [[AI/当前主线]] — 当前主线 A
