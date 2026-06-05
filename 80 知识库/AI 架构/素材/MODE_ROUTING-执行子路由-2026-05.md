---
source: "70 素材/AI 架构/OpenClaw 工作区/MODE_ROUTING.md"
source_live: "~/.openclaw/workspace/MODE_ROUTING.md"
date: 2026-05-26
topic: AI 架构
---

# MODE_ROUTING — 执行子路由

## 在架构里的位置

注意：本文件**已被降级**。

之前是"整个对话系统的第一层总路由"——现在只是**执行姿态下的子路由**。总路由职责上移到 [[DIALOGUE_ROUTING-总路由-2026-05]]。

> 只有在 DIALOGUE_ROUTING 已判定 Execution Posture 主导时，才调用本文件。

这是一个**重要的架构演化**——说明用户识别出 MODE_ROUTING 越界了（试图判一切对话），主动把它降级。

## 路由层级

```
1. DIALOGUE_ROUTING (Layer 3) — 判主姿态 + 克制 + 收束
   ↓ if Execution
2. MODE_ROUTING — 判执行子模式 + 深度
   ↓
3. WORKFLOW_TEMPLATES — 输出骨架
4. EXECUTION_PROTOCOL — 详细规则
```

## 6 个执行子模式

| 子模式 | 触发 | 默认深度 |
|---|---|---|
| **Execution** | 直接做、改、写、跑、查、推进 | A/B |
| **Decision** | 该不该、选哪个、怎么取舍 | B/D |
| **Review** | 审查、挑错、复盘、找漏洞 | B/D |
| **Design** | 设计方案、规划系统、搭结构 | D |
| **Teaching** | 理解概念、原理、机制、学习路径 | B/C |
| **Creative** | 命名、文案、创意、风格变体 | B/D |

深度：A=简答 / B=标准 / C=深度讲解 / D=专家推演（定义在 EXECUTION_PROTOCOL）

## 子模式选择规则

1. **Execution 优先**——用户明确要做事时，别因为有解释成分就误切 Teaching
2. **Decision 在 Design 之前**——主要卡点是"选哪条"而非"怎么搭"
3. **Design 在 Execution 之前**——还没有可推进对象时
4. **Review 当核心是诊断**
5. **Teaching 当主要要"搞懂"**
6. **Creative 当生成本身就是目的**

## Multi-Mode Priority

主目标决定，只选一个主模式 + 最多一个辅助：

```
Execution > Decision > Review > Design > Teaching > Creative
```

**不要做成六种模式平均混合**。

## 跟其他文件关系（边界很清楚）

| 文件 | 关系 |
|---|---|
| [[DIALOGUE_ROUTING-总路由-2026-05]] | **上层**——决定本文件是否被调用 |
| [[EXECUTION_PROTOCOL-执行协议-2026-05]] | **同层**——本文件指向它的详细规则 |
| WORKFLOW_TEMPLATES | **下层**——本文件指向具体输出骨架（暂未 ingest） |

## §11 Practical Constraint：自我约束

> 本文件**永远不应重新夺回总路由权**。
> - 不能默认所有问题都先当任务来分派
> - 不能忽视交流主导的合法性
> - 不能把第一层姿态判断偷偷折叠掉

这一段是这份文件最重要的部分——**显式承认自身边界**，防止旧版本的"执行主导一切"重新蔓延。

## 设计教训

这份文件是**用户系统设计能力的一个具体例证**：

- 识别"这个模块越界了"
- 不删它（保留沉淀价值）
- 把它降级 + 加自我约束条款
- 让上层接管被它越界的职责

这是良好软件架构的迹象——**不一刀切删旧、不让旧重新越权**。

## See Also

- [[DIALOGUE_ROUTING-总路由-2026-05]] — 上层总路由
- [[EXECUTION_PROTOCOL-执行协议-2026-05]] — 详细规则
- [[RULE_COMPRESSION_AUDIT-规则压缩审计-2026-05]] — 本文件的进一步压缩计划
- [[_主题页]]

> Updated: 2026-05-26
