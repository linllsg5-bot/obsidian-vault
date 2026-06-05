---
source: "70 素材/AI 架构/OpenClaw 工作区/SESSION_RECOVERY_SYSTEM.md"
source_live: "~/.openclaw/workspace/SESSION_RECOVERY_SYSTEM.md"
date: 2026-05-26
topic: AI 架构
status: legacy（已被 CONTINUITY_ARCHITECTURE 超越）
---

# SESSION_RECOVERY_SYSTEM — 旧版会话恢复系统（legacy）

## 状态：已被超越

文件本身明确标注：

> 本文件记录的是较早一版"会话恢复"方案。新的主方案已迁移到 `CONTINUITY_ARCHITECTURE.md` 和 `state/` 目录，重点从"记忆恢复"升级为"任务状态 + 项目入口 + 持续执行载体"的联合架构。

所以**这份文件主要作为历史参考**，不是当前权威方案。

## 核心思路（三层记忆结构）

旧方案的设计：

```
LEVEL 1: 持久项目状态 (PROJECT_LOG.md)
  • 项目进展、已完成任务、待办事项
  • 更新频率：关键节点时
LEVEL 2: 每日详细日志 (memory/YYYY-MM-DD.md)
  • 当日所有任务细节、工具调用结果
  • 更新频率：会话结束时
LEVEL 3: 用户记忆 (MEMORY.md)
  • 用户个人信息、偏好、长期决策
  • 更新频率：偶尔
```

## 跟新方案的关键差异

| 维度 | 旧（本文件） | 新（[[CONTINUITY_ARCHITECTURE-连续性架构-2026-05]]） |
|---|---|---|
| 关注重心 | **记忆恢复**（让 AI 不失忆） | **任务/项目状态 + 执行载体**（让任务能存活） |
| 数据形态 | markdown 日志 | structured task/project state + 长期记忆分离 |
| 主入口 | PROJECT_LOG.md（顶层文件） | `state/projects/*` + `CONTINUITY_START.md` |
| 长任务 | 没解 | 显式分载体（主回合 / 子会话 / cron） |
| 旧文件命运 | PROJECT_LOG 是中心 | PROJECT_LOG **减少职责**，task/project state 接管 |

## 为什么被超越

旧方案的核心问题：**把记忆当作连续性的全部**。

但用户的真实痛点不只是"AI 忘了我说过什么"，更是：
- "任务说在跑，到底在跑没跑？" → 需要 task state，不是更详细的日志
- "昨天做到哪了？" → 需要 project entry，不是翻聊天记录
- "AI 说继续执行，但根本没动作" → 需要执行纪律 + 执行载体，不是记忆

旧方案把所有问题都试图用"更多更结构化的记录"解决；新方案识别出这是**架构问题**而不是记忆问题。

## 文件保留的价值

- **作为复盘材料**——理解为什么旧方案不够、新方案为什么这样设计
- **某些子部分仍有用**——比如"会话启动检查表"、"指令模板"这类 UX-level 的提示仍可被新架构借鉴
- **PROJECT_LOG.md 的概念延续**——只是被降级（不再是唯一入口，而是其中一个组件）

## See Also

- [[CONTINUITY_ARCHITECTURE-连续性架构-2026-05]] — 当前权威方案
- [[EXECUTION_PROTOCOL-执行协议-2026-05]] — 跟旧方案"会话启动检查表"思路有连接
- [[_主题页]] — 主题综合

> Updated: 2026-05-26
> 状态：legacy reference
