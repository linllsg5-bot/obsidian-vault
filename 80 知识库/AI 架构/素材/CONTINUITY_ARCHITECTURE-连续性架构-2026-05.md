---
source: "70 素材/AI 架构/OpenClaw 工作区/CONTINUITY_ARCHITECTURE.md"
source_live: "~/.openclaw/workspace/CONTINUITY_ARCHITECTURE.md"
date: 2026-05-26
topic: AI 架构
---

# CONTINUITY_ARCHITECTURE — 连续性架构

## 核心论点

把 "**会话一断就像任务停了 / 昨天结果找不到 / 说了继续执行却没真正推进**" 这类零散体验问题，**收束成一套可实现的系统架构**。

> 目标不是单纯增强记忆，而是同时解决：执行状态是否真实存在 / 项目是否有稳定入口 / 跨会话能否快速恢复 / 长任务能否在主对话外持续推进。

## 问题诊断

当前痛点不是单一问题，是**三类问题叠加**：

| 类别 | 问题 |
|---|---|
| **A. 交互问题** | 回复会结束当前回合；"我继续执行"如果没出结果，就是空转声明 |
| **B. 执行问题** | 缺任务状态层；任务跑到哪、下一步是什么没有系统事实承载 |
| **C. 连续性问题** | 旧会话难找；找到也未必能快速恢复项目；结果/决策/产物缺统一入口 |

**结论**：这不是"记忆不够"，是 **执行状态 + 项目连续性 + 持续执行载体** 没打通。

## 5 层模型（跟对话架构正交）

| Layer | 名字 | 职责 |
|---|---|---|
| **Layer 0** | Short-Term Context | 当前对话临时工作集 |
| **Layer 1** | **Task State** | 把"执行"变成有状态对象（task_id, status, current_stage, next_step, blockers, artifacts） |
| **Layer 2** | **Project Continuity** | 任务聚合到项目入口，解决"昨天做到哪了" |
| **Layer 3** | **Sustained Execution** | 让任务不依赖单个主对话回合存活 |
| **Layer 4** | Long-Term Memory | 只保留长期偏好、长期决策、高价值经验 |

注意：这跟 [[DIALOGUE_ARCHITECTURE-双建构总图-2026-05]] 是**两条不同的架构线**——
- DIALOGUE 处理"一轮对话内"该如何在场
- CONTINUITY 处理"跨会话/跨时间"该如何持续

## 核心原则：会话不是长期入口，项目才是

> 真正需要恢复的，不是"某一段聊天"，而是：项目当前状态 / 关键产物在哪 / 上次为什么这么做 / 下一步是什么。

因此：
- **会话** = 交互载体
- **任务** = 执行单位
- **项目** = 连续性入口

## 三类执行载体（Layer 3）

任务不应只能在主对话里跑。分三类载体：

| 载体 | 适用 |
|---|---|
| **主回合执行** | 短任务、轻任务 |
| **子会话 / 子代理** | 开放式长任务、编码、重型整理 |
| **cron / heartbeat** | 周期任务、批处理、巡检、简报 |

任务调度按性质选载体——不是所有任务都在主对话里跑完。

## Minimum Viable Architecture (MVP)

| MVP 阶段 | 引入 | 目标 |
|---|---|---|
| MVP-1 | `state/tasks/<task-id>.json` | 至少知道当前任务是否存在、跑到哪、下一步 |
| MVP-2 | `state/projects/<project-id>.md` + `state/projects/index.json` | 新会话优先恢复项目 |
| MVP-3 | `CONTINUITY_START.md` 入口规则 | 新会话先看项目入口和活跃任务 |
| MVP-4 | Sustained execution routing | 短/长/周期任务分流 |

## 推荐文件布局

```
state/
├── tasks/
│   ├── active/
│   ├── completed/
│   └── blocked/
├── projects/
│   ├── index.json
│   └── <project-id>.md
└── continuity/
    ├── active-context.json
    └── recovery-notes.md
```

## 三个关键设计决策

> **Decision 1**：不要把"持续执行"塞进 MEMORY.md。长期记忆应保持稀疏、稳定、抽象。
>
> **Decision 2**：不要把"项目恢复"继续完全建立在聊天记录上。聊天是过程，不是最好的索引结构。
>
> **Decision 3**：把"继续执行"拆成**载体问题**而不是风格问题。没有执行载体，纪律再好也只能做到"先做一段再回复"，做不到真正持续运行。

第 3 条最深——它指出了**纪律 vs 架构**的区别。
[[EXECUTION_PROTOCOL-执行协议-2026-05]] §7 提供的是纪律（不口头执行）；
CONTINUITY 架构提供的是载体（让任务能在主对话外存活）。
两者缺一不可。

## 成功标准

如果架构成功，用户应该明显感受到：

1. 新会话不再像失忆
2. 昨天的结果更容易找回
3. 任务是否在进行有明确状态
4. 长任务不会因为主对话切换就完全蒸发
5. 项目恢复成本明显低于重新解释一遍

## 试点反馈（§13）

> 第一批试点（`continuity-*` + `daily-intel-brief`）已经验证：
> - task state 是必要的
> - project entry 比单纯聊天记录更适合作为恢复入口
> - recurring workflow 需要 hub + per-run tasks + schedule 三件套
> - backflow 和 carrier 决策必须显式化

经验已收束到 `CONTINUITY_LESSONS.md`（待 ingest）。

## 跟 vault 的关系

vault [[AI]] 中 [[80 知识库]] + `10 Projects/` + `00 Inbox/` 的分工，**结构上对应** CONTINUITY 架构：

| OpenClaw CONTINUITY | vault 对应 |
|---|---|
| `state/projects/*` | `10 Projects/*.md` |
| `state/tasks/active/*` | （目前 vault 没有显式 task state——靠 Claudian session 维护） |
| `state/continuity/active-context.json` | （vault 没有显式 active-context——CLAUDE.md 部分承担） |
| Long-term memory | `80 知识库/` |
| `CONTINUITY_START.md` 入口 | [[HOME.md]] |

差异：
- vault 没有 task state 层——这是 vault Claudian 的**真实弱点**之一。每次新对话 Claudian 不知道"现在哪个任务正在跑"
- 这也是**接入 OpenClaw 的真正价值之一**——OpenClaw 的 task state + project state 能补 vault 的盲区
- 反之亦然：OpenClaw 没有 vault 那种"主题目录 + 素材页 + See Also"的网状知识结构

两个系统**互补**。

## See Also

- [[DIALOGUE_ARCHITECTURE-双建构总图-2026-05]] — 正交的另一条架构线（对话层）
- [[EXECUTION_PROTOCOL-执行协议-2026-05]] — §7 Execution Discipline 提供纪律层
- [[SESSION_RECOVERY_SYSTEM-旧会话恢复-2026-05]] — 旧方案，已被本架构超越
- [[HOME.md]] — vault 这边的连续性入口
- [[_主题页]] — 主题综合

> Updated: 2026-05-26
