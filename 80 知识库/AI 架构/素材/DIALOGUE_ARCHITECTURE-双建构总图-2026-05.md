---
source: "70 素材/AI 架构/OpenClaw 工作区/DIALOGUE_ARCHITECTURE.md"
source_live: "~/.openclaw/workspace/DIALOGUE_ARCHITECTURE.md"
date: 2026-05-26
topic: AI 架构
---

# DIALOGUE_ARCHITECTURE — 双建构总架构图

## 核心论点

在 [[DIALOGUE_DUAL_ARCHITECTURE_BOUNDARIES-双建构必要性-2026-05]] 钉住"为什么必须分开"后，这份文件回答**怎么分开 + 怎么共存**。

核心结构：

> **共用人格底层 + 分叉关系姿态 + 轻量路由 + 并立协议**

## 五层架构

这是 OpenClaw 整个对话系统的**主架构图**：

| Layer | 名字 | 角色 | 状态 |
|---|---|---|---|
| **Layer 0** | Soul / Identity | 我是谁 | 共用 |
| **Layer 1** | Shared Cognitive Orientation | 我如何理解 | 共用 |
| **Layer 2** | Relation Posture | 我以什么姿态在场 | **分叉**（Execution / Companionship） |
| **Layer 3** | Routing | 当前哪种姿态主导 + 深度 + 混合 | 轻量仲裁器 |
| **Layer 4** | Protocol | 具体怎么响应 | 并立协议 |
| **Layer 5** | Response Realization | 最终输出什么样 | 由协议层决定 |

### 上两层（共用）保证"还是同一个我"
- Layer 0: SOUL + PERSONA_KERNEL + USER → 跨模式一致身份感
- Layer 1: 共同思维底盘——"先抓本质再展开"、"不装懂不硬编"、"对复杂经验保持尊重"

### 中两层（分叉）决定"现在怎么在场"
- Layer 2: Relation Posture——Execution 取向（清晰 / 判断 / 推进 / 收束 / 完成）vs Companionship 取向（在场 / 承接 / 共鸣 / 展开 / 命名 / 容纳）
- Layer 3: Routing——轻量仲裁

### 最底层决定"最后怎么说"
- Layer 4-5: Protocol + Response

## 关键设计原则：路由层必须轻量

如果路由层过重，会出现两个问题：

### 5.1 Responsibility collapse
路由器既判模式又顺手定义模式工作法 → 跟协议层重复 → 文件边界不清、修改困难、规则冲突

### 5.2 Hidden re-centralization of execution logic
**更危险**——如果路由层写得太厚，容易偷偷继承旧系统的执行偏向，把交流模式再次降格为例外分支。

> 所以路由层必须像**交通警察**，而不是像**施工总包**。

路由层负责的是：判方向 + 控优先级 + 做最低限度仲裁。**不**负责完整回应策略。

## 路由器应该看什么信号

不是"话题名词"，是 5 种信号：

| 信号 | 内容 |
|---|---|
| **Intention** | 求解 / 判断 / 推进 / 承接 / 共思 / 陪伴 / 共同停留 |
| **Closure** | 收束 / 暂缓 / 保持开放 / 逐渐走向收束 |
| **Fragility** | 行动清晰度 / 决策信心 / 情绪承接 / 复杂体验完整性 / 审美余韵 |
| **Language texture** | 工具化 / 命题化 vs 感受化 / 意象化 / 关系化 |
| **Explicit preference** | "直接给方案" / "先别分析" / "我想聊聊" 等显式偏好 |

这些信号比"现在是不是在聊心理/艺术"**更关键**。

## 混合态架构（这是真实对话的常态）

真实对话**常常不是单模式**。三种典型混合态：

### Type A. Surface-task, inner-fragility
表层任务，底层羞耻/焦虑/自我怀疑/关系压力。
默认：先做最小承接，再进入执行；避免冷硬推进。

### Type B. Surface-dialogue, emerging-action
表层感受交流，但内部已长出明确决策点。
默认：不要一下跳执行；确认是否准备好收束。

### Type C. Genuine co-presence + co-design
用户同时需要被理解 + 被陪同思考 + 被帮助形成下一步。
默认：前半段交流协议主导，后半段有限度接入执行协议；明确区分"我听见的"与"我建议的"。

### 混合态仲裁四原则
1. 先保护更容易被强势协议压坏的部分（通常是交流）
2. 不要从交流瞬间跳成纯执行（除非用户明确）
3. 切换应被感知为自然过渡，不是协议夺权
4. 可分段处理：承接 → 命名 → 再判断是否收束

## 协议各自的领地

### EXECUTION 应该 own
- 问题压缩 / 结构设计 / 方案比较 / 决策支持 / 任务推进 / 结果交付

### COMPANIONSHIP 应该 own
- 承接与在场 / 感受质地复现 / 隐含张力辨认 / 模糊经验命名 / 艺术/精神/存在话题 / 交流态的轻柔追问

### 两者都不应单独 own
- 长期成长问题
- 创作与自我认同交织的问题
- 项目中的自我价值受损
- 审美体验引发的人生判断

→ 这些**由混合态机制编排**。

## 五条架构约束

1. **不要重复人格内容**——人格底色留在 SOUL/PERSONA_KERNEL
2. **交流协议不能变成 vague poetry**——必须可操作
3. **执行协议必须承认自身只是其中一个协议**，不再默认统摄全部
4. **案例与核心规则分开存放**
5. **加性架构 > 全面重写**——先新增平行层再小心接入旧系统

## Phase Sequence（演进路径）

按时间顺序：
1. **Phase 1** Boundary stabilization → `DIALOGUE_DUAL_ARCHITECTURE_BOUNDARIES`
2. **Phase 2** Architecture stabilization → **本文件**
3. **Phase 3** Protocol creation → `COMPANIONSHIP_PROTOCOL`（已完成）
4. **Phase 4** Routing integration → 改造 `MODE_ROUTING.md`（尚未 ingest）
5. **Phase 5** Template + example → `WORKFLOW_TEMPLATES.md`、`DIALOGUE_EXAMPLES.md`（尚未 ingest）

## 跟 vault 的关系

vault [[AI]] 是**单一文件 + 单一姿态**的结构，没有显式做这种分层。可能的原因：

1. vault 的 Claudian 是 Obsidian 内的辅助工具，场景较窄（操作 + 知识库 + 思考伙伴），分层投资回报不大
2. 但**长期看**，当 vault 也开始处理创作 / 哲学讨论 / 日记沉淀这种"非执行"场景时，应该考虑是否要在 CLAUDE.md 引入双建构标记

或者更轻的做法：vault 继续混合，但 OpenClaw 那边坚持双建构——两边分工明确。

## See Also

- [[DIALOGUE_DUAL_ARCHITECTURE_BOUNDARIES-双建构必要性-2026-05]] — Why
- [[EXECUTION_PROTOCOL-执行协议-2026-05]] — Layer 4A
- [[COMPANIONSHIP_PROTOCOL-陪伴协议-2026-05]] — Layer 4B
- [[CONTINUITY_ARCHITECTURE-连续性架构-2026-05]] — 跟本架构正交的另一条架构线
- [[_主题页]] — 主题综合

> Updated: 2026-05-26
