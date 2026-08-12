---
type: conversation-index
date: 2026-08-12
participants: 小林, Arena(A/B方案), Claude Sonnet 4.6, Claude Opus 4.7
source: "[[raw]]"
annotated: "[[标注]]"
topic: Cognos 雏形设计改进、方案对比 (A/B) 与多模型深探
---

# Cognos 雏形设计改进、方案对比 (A/B) 与多模型深探 — 结构化尾迹

## 核心摘要

本会话收束了关于 Cognos 第一阶段数字承载方案的漫长讨论。
比较了 A 方案（CLI 创世防线）与 B 方案（Web 三栏空间/关系与记忆/Context Builder），否决了 A 方案机械拼接 Prompt 的做法，吸收了 A 的“防线意识”与 B 的“数据模型/关系依附空间”，并由 Sonnet 4.6 和 Opus 4.7 细化了“判断是透支”、“活的关系 `effect` 行为”、“动态位置涌现”与“ABCD 错误黑名单”。

---

## 关键张力与纠正

### 1. 否决 A 方案的 CLI 机械拼接 (`〔校正〕`)
- **小林顶回**：单纯依靠 CLI 把 4 个文件强行拼接在 Prompt 最前面是“非常烂的方案”，就像每次开会把整本手册念一遍，缺乏情境与层级。

### 2. 吸收 A 与 B 的融合路线 (`〔实〕`)
- **A 方案保留**：宪法级强制防线（阻止 AI 目的丢失与退化为普通客服）。
- **B 方案保留**：关系依附于空间（`Relation.space_id` 强外键）、`ObjectInSpace` 共存记录、Web 三栏空间、SQLite + Obsidian 双写。

### 3. 核心概念的精确确认 (`〔实〕`)
- **判断 = 透支**：尝试的高效、一次性展开，直接折叠可能；
- **活的关系**：带 `effect` 行为，决定后续 Context Builder 如何修改注入；
- **位置**：动态涌现，非预先设死的岗位；
- **主体**：开放 `type`，概念/项目/代码结果亦可作为位置发言。

---

## 给下次 AI 的操作指引

1. **严格执行 A 骨架 + B 补丁路线**：
   - 数据库必须包含 `Space`, `EntityObject`, `ObjectInSpace`, `Relation` (必须含 `space_id`), `Movement` (包含 `residue`);
   - 强行禁止静态 SaaS 表（如单纯 `User`, `Task`）；
2. **Context Builder 分层注入**：
   - 常驻层 (300字以内) + 情境层 (空间目的/活关系) + 动态检索层；
3. **沉淀未采纳残余**：
   - 在多 AI 或人机对话中，被否决的提案自动入库 `unadopted_residues`，绝不擦除。

---

## See Also
- [[AI/认识论-核心]]
- [[AI/认识论-框架]]
- [[AI/信念谱系]]
- [[AI/当前主线]]
