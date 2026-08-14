---
type: conversation-lineage-protocol
audience: 小林 + AI
status: draft
updated: 2026-08-14
---

# Conversation Lineage

## 目的

会话归档不仅记录一次对话，还记录一次发生如何在后续继续展开。

现有结构：

```
conversation
├── raw
├── annotation
├── index
└── interpretation history
```

解决的是：同一次发生如何被重新理解。

Lineage 增加：

```
event
  |
lineage
  |
branches
  |
interpretations
```

解决的是：同一次发生如何产生多个继续方向。

## 基本区分

### Event

实际发生。

- raw 保存发生顺序。
- 不因为后续理解变化而修改。

### Lineage

发生之间的连续关系。

表示：

- 哪些会话共享历史来源；
- 哪些是自然延伸；
- 哪些是分叉探索。

### Interpretation

某个时间点对发生的理解。

可以变化，但变化不覆盖历史。

## 约束

1. 不把 AI 总结当成发生本身。
2. 不因为后续解释更合理而修改过去。
3. 当前 schema 装不下的内容，先保留缺口。
4. 分叉不代表冲突，可能只是展开方向不同。

## 当前实验

Cognos 相关多轮 GPT / Antigravity / Claudian 对话可作为 lineage 实验材料。

第一阶段只记录关系，不强制建立新的数据模型。
