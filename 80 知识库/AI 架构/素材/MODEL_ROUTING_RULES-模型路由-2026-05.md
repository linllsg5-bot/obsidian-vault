---
source: "70 素材/AI 架构/OpenClaw 工作区/MODEL_ROUTING_RULES.md"
source_live: "~/.openclaw/workspace/MODEL_ROUTING_RULES.md"
date: 2026-05-26
topic: AI 架构
---

# MODEL_ROUTING_RULES — Gemini ↔ Codex 任务分流

## 在架构里的位置

**横切路由器**——跟 DIALOGUE_ROUTING / MODE_ROUTING 正交。它不判**怎么在场**，判**用哪个模型**。

> 在保证质量的前提下，尽量降低 `openai-codex/gpt-5.4` 消耗，把更便宜、更快的任务优先分流给 Gemini。

注意：**默认倾向，不是绝对硬规则**。

## A. 默认走 Gemini 的任务

低风险、轻推理、整理 / 检索型：
- 一般性解释、概念说明
- 轻量总结、摘要、长内容压缩
- 网页搜索 + 多源整合
- 初步草稿、提纲、初版方案
- 低精度代码外围（解释含义、粗看报错）

## B. 默认保留给 Codex 的任务

高风险、高精度、需要稳定工程判断：
- **真正改代码**——修改、重构、修 bug、调配置
- **复杂架构推理**——系统设计、多约束取舍、长链路故障
- **高风险操作**——网关、权限、插件、可能服务中断
- **精细代码审查**——复杂 diff、生产复盘

## C. 升级条件

即使表面像"整理 / 总结"，满足任一也升级到 Codex：
- 判断错误代价高
- 影响后续关键操作
- 上下文复杂、需长链路推理
- 用户要的不只是说明，是最终判断
- 已从探索阶段进入执行前决策阶段

## D. 混合策略：Gemini 先行，Codex 收尾

适合：先用低成本模型缩小问题空间，再让 Codex 做最终动作。

```
Gemini：搜资料 / 总结 / 提初版方案
   ↓
Codex：最终判断 / 执行修改 / 输出可落地方案
```

典型场景：GitHub 调研、新方向摸底、需求探索、大项目第一轮信息收集。

## E. 节流原则

**避免浪费 Codex**：
- 概念什么意思
- 帮我总结一下
- 搜一下社区在说什么
- 帮我列几个备选

**即使贵也该 Codex**：
- 要动文件
- 要给最终工程判断
- 要承担错误代价
- 任务链复杂到需要稳定推理

## F. 现实限制

- **Gemini**：速率/配额限制；memory embeddings 已出现过 429
- **Codex**：贵，应该少用在搜索/解释/整理

## G. 一句话策略

> **先搜、先整、先压缩：默认偏 Gemini**
> **真改、真判、真执行：默认偏 Codex**
> **一旦代价变高或链路变长：立即允许升级**

## 跟 OpenClaw 当前配置的实际对应

从 [[70 素材/AI 架构/OpenClaw 工作区]] 的 openclaw.json 看到：

- **primary**: `freemodel/claude-opus-4-7`（Claude 4.7 Opus）
- **fallbacks**: `google-ai/gemini-3.1-flash-lite-preview`、`freemodel/claude-sonnet-4-6`
- **memorySearch**: Gemini embedding-001

也就是说，**实际配置跟本文件描述的 Gemini/Codex 策略不完全一致**——实际用 Claude 4.7 Opus 为主、Gemini Flash Lite 为 fallback。这份文件可能是**早期阶段（Codex 还是主用时）写的**，配置后来变了但文件没更新。

⚠️ 这是一个**rule drift**——文件描述 vs 实际配置的偏差，lint 时该报告。

## See Also

- [[DIALOGUE_ROUTING-总路由-2026-05]] — 横切关系
- [[QUALITY_GUARDRAILS-质量护栏-2026-05]] — "成本不能让质量塌"——本文件的硬约束
- [[_主题页]]

> Updated: 2026-05-26
