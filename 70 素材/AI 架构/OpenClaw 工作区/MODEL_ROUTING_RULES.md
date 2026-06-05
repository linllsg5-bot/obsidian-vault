# MODEL_ROUTING_RULES.md - Claude / Gemini 模型路由规则

> **2026-05-26 更新**：实际配置已从早期 Gemini ↔ Codex 切换到 Claude Opus 主用 + Gemini Flash Lite fallback。本文件已 sync 到当前 openclaw.json 状态。

## 当前配置实际状况

参考 `~/.openclaw/openclaw.json` 的 agents.defaults.model 段：

- **primary**: `freemodel/claude-opus-4-7`（Claude 4.7 Opus，via freemodel 代理）
- **fallbacks**:
  - `google-ai/gemini-3.1-flash-lite-preview`（Gemini Flash Lite，快 + 便宜）
  - `freemodel/claude-sonnet-4-6`（Claude 4.6 Sonnet，中端备用）
- **memorySearch**: `gemini-embedding-001`（无替代选择，硬选 Gemini）
- **imageGeneration**: `google/gemini-3-pro-image-preview`（无替代）

可用模型还包括 Claude 4.6 Sonnet、Claude 4.7 Opus、Claude 4.6 Opus、Claude 4.5 Haiku（都通过 freemodel 代理）+ Gemini 3.1 Pro Preview。

## Goal

在保证质量的前提下，让模型路由匹配任务需要——重要任务用强模型，琐碎任务用轻模型，**不为省成本踩质量底线**（见 [[QUALITY_GUARDRAILS.md]]）。

注意：**本文件定义的是默认路由倾向，不是绝对硬规则**。只要任务代价高、上下文复杂、影响后续关键动作，就允许直接升级到最高质量模型。

---

## A. 默认走轻模型（Gemini Flash Lite / Claude Haiku / Claude Sonnet）的任务

适用于：低风险、轻推理、偏整理与检索型任务。

### 1. 一般性解释
- 概念解释 / 术语说明 / 非关键判断的原理说明 / 常识型问答

### 2. 轻量总结
- 对话总结 / 文章摘要 / 会议纪要粗整理 / 长内容压缩成要点

### 3. 网页搜索 + 资料整合
- 搜新闻、社区动态、文档 / 拉取网页后做结构化整理 / 多来源并列总结

### 4. 初步草稿
- 提纲 / 初稿文案 / 粗版方案 / 初版答复框架

### 5. 低精度代码外围
- 解释代码含义 / 粗看报错原因 / 生成非关键样例 / 给排查方向（不动核心代码）

**推荐分配**：
- 上下文小、单步：Gemini Flash Lite（最快最便宜）
- 上下文中等、需要结构感：Claude 4.5 Haiku 或 Claude 4.6 Sonnet
- 上下文大、需要长链路理解：Claude 4.7 Opus（即使是轻任务也别用 Gemini Flash Lite，否则会丢上下文）

---

## B. 默认保留给主模型（Claude 4.7 Opus）的任务

适用于：高风险、高精度、需要稳定工程判断或深度推理的任务。

### 1. 真正改代码
- 修改源码 / 重构逻辑 / 修 bug / 调配置 / 涉及可运行结果的工程改动

### 2. 复杂架构推理
- 系统设计 / 多约束取舍 / 长链路故障定位 / 跨模块依赖分析

### 3. 高风险操作
- 网关配置 / 权限相关修改 / 插件/channel/provider 调整 / 任何可能服务中断的操作

### 4. 精细审查
- 复杂 diff review / 生产问题复盘 / 需要高可靠性的修复建议

### 5. 用户深层对话
- COMPANIONSHIP 主导的对话（陪伴、共思、命名、克制要求高）
- 经验复杂、模糊、艺术 / 精神 / 灵魂类话题

### 6. 多步长链路任务
- 一次需要规划多步、跨多领域的复杂任务
- 上下文大、需要持续保持注意力的任务

---

## C. 升级条件

即使任务表面上像"解释 / 整理 / 总结"，**只要满足以下任一也直接升级**到 Claude Opus：

- 判断错误代价高
- 会影响后续关键操作
- 上下文复杂，需要稳定长链路推理
- 用户要的不只是说明，而是最终判断
- 任务已从探索阶段进入执行前决策阶段
- COMPANIONSHIP 姿态下需要克制 + 精确——这是 Opus 的强项

---

## D. 混合策略：Gemini 先行，Opus 收尾

适合：先用低成本模型缩小问题空间，再让 Opus 做最终动作。

典型流程：
1. **Gemini Flash Lite**：搜资料 / 做初版总结 / 提粗版方案
2. **Claude 4.7 Opus**：做最终判断 / 执行修改 / 输出可落地方案

推荐场景：
- GitHub / 文档 / 社区调研
- 新方向摸底
- 需求还不清晰时的探索
- 大项目的第一轮信息收集

---

## E. 节流原则

### 避免浪费 Opus 的情况
- 单纯"这个概念什么意思"
- 单纯"把这段话总结一下"
- 单纯"搜一下现在社区怎么说"
- 单纯"帮我列几个备选方案"
- 简单的本地文件查询

### 即使贵也该上 Opus 的情况
- 要动文件
- 要给最终工程判断
- 要承担错误代价
- 任务链已经复杂到需要稳定推理
- 用户进入 COMPANIONSHIP-led 深层对话

---

## F. 现实限制

### Gemini Flash Lite 的限制
- 有速率 / 配额限制（manage 时注意 429）
- 长上下文表现下降
- 复杂推理容易跑偏

### Claude 4.6 Sonnet（中端备用）的定位
- 比 Opus 便宜，但仍保持稳定推理
- 适合"Opus 没必要，但 Gemini 又不够"的中间地带
- 是 Opus 主用挂了时的合理 fallback

### Claude 4.7 Opus 的定位
- 贵，但深度推理 / 长上下文 / 克制对话最强
- 不应用在"搜索、解释、整理"这种前置环节
- COMPANIONSHIP 姿态下首选

### Memory search 没的选
- `gemini-embedding-001` 是当前唯一接入的 embedding 模型
- 检索质量依赖 Gemini，不可替代（除非接入新 embedding provider）

---

## G. 实用一句话策略

- **先搜、先整、先压缩**：默认偏 Gemini Flash Lite（或 Haiku）
- **真改、真判、真执行**：默认 Claude 4.7 Opus
- **中间地带（执行但低风险）**：Claude 4.6 Sonnet
- **一旦代价变高或链路变长**：立即允许升级到 Opus
- **COMPANIONSHIP 姿态**：永远 Opus（克制 + 精确是它的强项）

---

## H. 历史 drift 说明

本文件**早期版本**定义的是 Gemini ↔ `openai-codex/gpt-5.4` 路由策略——当时 OpenClaw 主用 Codex 做执行。后来主模型切换到 Claude 4.7 Opus（via freemodel 代理），但本文件长时间没同步。

**2026-05-26 同步**：vault [[80 知识库/AI 架构/_主题页]] ingest 时发现这个 drift，用户确认更新到当前实际配置。

教训：**模型路由文件应该跟 openclaw.json 同步**。任何模型 provider 切换都应该同时更新这个文件。
