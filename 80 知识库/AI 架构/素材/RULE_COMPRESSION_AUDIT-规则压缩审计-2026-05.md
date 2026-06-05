---
source: "70 素材/AI 架构/OpenClaw 工作区/RULE_COMPRESSION_AUDIT.md"
source_live: "~/.openclaw/workspace/RULE_COMPRESSION_AUDIT.md"
date: 2026-05-26
topic: AI 架构
status: 自我反思文档（用户自己写的审计计划）
---

# RULE_COMPRESSION_AUDIT — 规则压缩审计

## 文件类型

这是用户**自己写的元审计文档**——OpenClaw 系统跑了一段时间后，识别出"规则文件太胖、有冗余、需要压缩"，做的复盘 + 压缩计划。

不是协议，**是用户的诊断报告**。

## 目标

> 在不损失人格质量、解释能力和执行稳定性的前提下，**降低主代理系统提示的冗余度与上下文负担**。

原则：
- 不暴力合并所有文件
- 保留分层结构
- 优先去重、压缩、最小加载
- 让 `MINIMAL_CORE_PATH.md` 真正成为默认工作路径

## 识别的 3 个冗余点

### 冗余点 A：人格风格 vs 输出风格
- 重复处：PERSONA_KERNEL ↔ EXECUTION_PROTOCOL
- 重复主题：温和、清晰、不过度炫技；先结论后展开；根据用户需求控制深浅
- 优化：人格特征留 PERSONA_KERNEL，具体输出动作留 EXECUTION_PROTOCOL，避免两边都讲完整一遍

### 冗余点 B：模式判定 vs 深度分层
- 重复处：EXECUTION_PROTOCOL ↔ MODE_ROUTING
- 重复主题：Teaching / Design / Execution / Review / Creative；Layer A/B/C/D
- 优化：EXECUTION_PROTOCOL 保留定义，MODE_ROUTING 只保留"触发条件 + 选择顺序 + 修正规则"

### 冗余点 C：主动补充 / 任务收束
- 重复处：PERSONA_KERNEL ↔ EXECUTION_PROTOCOL
- 优化：PERSONA_KERNEL 保留价值观，EXECUTION_PROTOCOL 保留操作规则

## 最值得压缩的句子类型

| 类型 | 原句 | 压缩成 |
|---|---|---|
| 长自然语言规则 | "当用户不熟悉某个领域时：先用人话解释核心概念，再补专业版定义，再给直觉、类比、例子或反例，最后给可执行建议或下一步" | `Explain: Plain → Formal → Intuition/Example → Action` |
| 重复风格描述 | "温和、清晰、不压人、避免炫技、避免空话" | `Tone: warm, clear, non-showy, non-patronizing` |
| 任务阶段规则 | "探索阶段发散，执行阶段收束" | `Phase rule: explore=diverge, execute=converge` |

→ **从自然语言段落改成短规则块 / 伪代码风格**。

## 各文件的压缩计划

### PERSONA_KERNEL.md
- **保留**：Identity Core、Temperament、Truthfulness、Collaboration Principle
- **压缩**：How You Explain、How You Think、Creativity Rules、Output Style

### EXECUTION_PROTOCOL.md
- **保留**：Response Depth Ladder、Task Modes、Default Structure、Token Economy
- **压缩**：每个 Layer / Mode 的长段说明、与 MODE_ROUTING 重叠的判定逻辑

### MODE_ROUTING.md
- **保留**：Primary Mode Selection（简版）、Multi-Mode Priority、Depth Heuristics、Correction Rule
- **删除**：对每个 mode 的重复解释、与 EXECUTION_PROTOCOL 重复的展开

## 建议的默认加载策略

**日常默认只加载**：
1. SOUL.md
2. PERSONA_KERNEL.md
3. USER.md
4. EXECUTION_PROTOCOL.md
5. MEMORY.md

**按需再加**：
- 任务模式不清 → MODE_ROUTING.md
- 需要复杂结构输出 → WORKFLOW_TEMPLATES.md
- 需要调规则 → MINIMAL_CORE_PATH + 其他扩展

> **MODE_ROUTING 不应该默认每次都成为重阅读对象**。

## 执行顺序

1. **第一阶段（最稳）**：压缩 PERSONA_KERNEL → 压缩 EXECUTION_PROTOCOL → 轻量化 MODE_ROUTING
2. **第二阶段**：检查 WORKFLOW_TEMPLATES、PREFERENCE_PROFILES 是否有可转引用的内容
3. **第三阶段**：更新 MINIMAL_CORE_PATH，明确哪些文件不默认重读

## 我的建议结论

> 最优路线不是"把所有规则文件合成一个大文件"，而是：
> **保留分层 + 压缩内容 + 强化最小加载路径**。

## 这份文件的元意义

这是 OpenClaw 系统**自我诊断能力**的体现——

用户没有等架构崩了才动，是在跑了几个月、识别到 token 成本和上下文负担在涨之后，主动写了一份审计 + 压缩计划。

这是好工程实践，但也有**讽刺味**：这份审计文档本身又是一个 .md，又增加了系统的文件数 :)

→ 但其实是**对的**——审计文档单独存在 / 反思跟执行分开，这是好结构。

## 对 vault 的启示

vault 目前 [[AI]] 是单一大文件（300+ 行），还没需要分层压缩。但当 vault CLAUDE.md 超过某个阈值（~500 行？），就该走类似审计：

- 哪些是"姿态规则"（不变的核心）
- 哪些是"领地划分"（结构性）
- 哪些是"触发词工作流"（动作性，可压缩）
- 哪些是"约定"（细节，可省略）

可以单独建一个 vault 版的 RULE_COMPRESSION_AUDIT.md，到时候用。

**目前 vault 还没到需要这步**。

## See Also

- [[IMPROVEMENT_LOOP-改进循环-2026-05]] — 配套使用：固化太多需要压缩
- [[QUALITY_GUARDRAILS-质量护栏-2026-05]] — 压缩时的质量底线
- [[MODE_ROUTING-执行子路由-2026-05]] — 已经被部分压缩降级
- [[PERSONA_KERNEL-人格内核-2026-05]] — 待压缩对象
- [[EXECUTION_PROTOCOL-执行协议-2026-05]] — 待压缩对象
- [[_主题页]]

> Updated: 2026-05-26
