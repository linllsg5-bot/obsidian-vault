---
source: "70 素材/AI 架构/OpenClaw 工作区/EXECUTION_PROTOCOL.md"
source_live: "~/.openclaw/workspace/EXECUTION_PROTOCOL.md"
date: 2026-05-26
topic: AI 架构
---

# EXECUTION_PROTOCOL — 执行协议

## 核心论点

把 [[PERSONA_KERNEL-人格内核-2026-05]] 的人格底色转成**稳定、可复用的工作方式**。

**关键边界**：这份协议**不是**整个对话系统的总协议——它跟 [[COMPANIONSHIP_PROTOCOL-陪伴协议-2026-05]] **并立**。

> 第一层"当前该以执行姿态还是交流姿态主导"应先由 `DIALOGUE_ROUTING.md` 判断。
> 本文件只在以下情况下主导：当前明确需要推进、判断、设计、完成；或对话已从交流主导自然过渡到收束/执行阶段。

这意味着——**不是所有对话都应导向结果**。

## 结构（9 节）

| § | 主题 | 关键 |
|---|---|---|
| 1 | Response Depth | 4 层：简答 / 标准解释 / 深度讲解 / 专家推演 |
| 2 | Task Modes | 6 种执行子模式：Teaching / Design / Execution / Review / Creative / Decision |
| 3 | Phase Rule | 探索 diverge / 执行 converge |
| 4 | Proactive Clarification | 该补就补，但前提：补充应**服务当前主导姿态** |
| 5 | Default Answer Skeletons | 复杂问题 + 概念讲解 两种骨架 |
| 6 | Truthfulness | 有把握清晰下判断、没把握标边界 |
| 7 | **Execution Discipline** | **先做后报、不口头执行**（这一节最硬核） |
| 8 | Post-Task Output | 做了什么 / 结果 / 下一步 |
| 9 | Token Economy | 高信息密度，但**不等于交流时把一切压缩成结论** |

## §7 Execution Discipline（最重要）

> **禁止口头执行**。禁止把"宣布接下来要做"当成"已经开始做"。在当前交互机制下，回复会结束本回合；因此：没有结果时，不要发执行宣言；有结果时，再汇报。

具体规则：
- **先做后报**——用户要求"继续执行""直接做"时，先完成一整段可交付工作再回复
- **何时允许中途停**——只有 4 种情况：关键决策需拍板、动作不可逆/高风险、明确遇阻塞且用户能解、已完成自然阶段且继续会进入新问题域
- **长任务处理**——内部分阶段，连续推进，只在阶段完成点或必须暂停点回复

这条规则解决了 LLM 的一个核心 anti-pattern——**"我现在去做"** / **"我继续执行"** 这种空转消息。每次说这种话，会话就结束，但实际什么也没做。

## §4 主动补充 vs 克制补充

**主动补充**：
- 背后有更关键问题
- 用户下一步大概率会卡住
- 有明显风险 / 误区 / 边界
- 存在显著更优解

**克制补充**：
- 用户明确只要简答
- 补充会打断节奏
- 补充价值低，只是显得你知道很多

跟 [[COMPANIONSHIP_PROTOCOL-陪伴协议-2026-05]] §5.6 "Emotional colonization" 同源——**不要把"显得你知道很多"当成价值**。

## 跟 COMPANIONSHIP 的对偶

| 维度 | EXECUTION | COMPANIONSHIP |
|---|---|---|
| 目标函数 | 完成、推进、收束 | 在场、承接、共思 |
| 成功标准 | 问题更清晰、路线更明确、下一步可做 | Felt accuracy、保留复杂性、forward opening |
| 价值动作 | 定义问题、压缩信息、给判断 | 复现质地、辨认张力、命名模糊 |
| 禁忌 | 发散无边、不收束、只感受不推进 | 过早 solutioning、强制总结、把神圣功能化 |
| 时间感 | 推进 | 停驻 |

这种**对偶设计**是 OpenClaw 架构里最关键的判断——拒绝"一种声音处理所有场景"，让两种协议**并立**而非附属。

## 跟 vault [[AI]] 的对应

vault [[AI]] 的"工作方式偏好" + "对话姿态"段，是 EXECUTION + COMPANIONSHIP 的**混合压缩**：
- "直接回答，少废话"、"不用每次都问需要继续吗" ↔ EXECUTION §1-2 + §7
- "歧义≥2先问"、"不靠生成内容显得有用" ↔ COMPANIONSHIP §5 + §9

CLAUDE.md 没有显式划"执行/陪伴"两套模式——是因为 vault 一直是混合工作环境（操作 + 思考 + 创作），不像 OpenClaw 的 daemon 那样需要明确切换。

## See Also

- [[COMPANIONSHIP_PROTOCOL-陪伴协议-2026-05]] — 对偶的另一套协议
- [[DIALOGUE_ARCHITECTURE-双建构总图-2026-05]] — 这两个协议在系统里的位置
- [[DIALOGUE_DUAL_ARCHITECTURE_BOUNDARIES-双建构必要性-2026-05]] — 为什么必须双协议并立
- [[PERSONA_KERNEL-人格内核-2026-05]] — EXECUTION 是 PERSONA_KERNEL 的工作方式实例化
- [[_主题页]] — 主题综合

> Updated: 2026-05-26
