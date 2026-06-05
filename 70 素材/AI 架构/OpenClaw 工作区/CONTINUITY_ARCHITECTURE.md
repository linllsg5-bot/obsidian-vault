# CONTINUITY_ARCHITECTURE.md - 持续执行与连续性架构

## Goal
把“会话一断就像任务停了”“昨天结果找不到”“说了继续执行却没有真正推进”这类问题，从零散体验问题，收束成一套可实现的系统架构。

目标不是单纯增强记忆，而是同时解决：
- 执行状态是否真实存在
- 项目是否有稳定入口
- 跨会话能否快速恢复
- 长任务能否在主对话外持续推进

---

## 1. Problem Definition
当前痛点不是一个问题，而是三类问题叠加：

### A. 交互问题
- 回复会结束当前回合
- “我继续执行”如果没有先做出结果，就会变成空转声明

### B. 执行问题
- 缺少任务状态层
- 任务是否正在跑、跑到哪、下一步是什么，没有系统事实承载

### C. 连续性问题
- 旧会话难找
- 找到了会话，也未必能快速恢复项目
- 结果、决策、产物、阻塞点缺少统一入口

结论：
这不是“记忆不够”的单点问题，而是 **执行状态 + 项目连续性 + 持续执行载体** 没有打通。

---

## 2. Architectural Position
本主题不应只放进 memory，也不应只做成一个独立后台模块。

更合理的位置是一个跨层架构：
1. **Execution Discipline Layer**：防止口头执行
2. **Task State Layer**：保存任务当前状态
3. **Project Continuity Layer**：保存项目入口与恢复信息
4. **Sustained Execution Layer**：为长任务提供持续执行载体
5. **Long-Term Memory Layer**：只保留长期偏好、长期决策和高价值经验

---

## 3. Layered Model

### Layer 0 - Short-Term Context
作用：当前对话的临时工作集。

包含：
- 当前请求
- 最近几轮上下文
- 当前局部工作假设

特点：
- 生命周期短
- 不适合作为项目恢复入口

### Layer 1 - Task State
作用：把“执行”变成有状态对象，而不是口头描述。

每个任务至少包含：
- `task_id`
- `title`
- `project_id`（可空）
- `status`: planned | running | paused | blocked | completed | cancelled
- `current_stage`
- `last_completed_step`
- `next_step`
- `blockers`
- `artifacts`
- `updated_at`

### Layer 2 - Project Continuity
作用：把任务聚合到项目级入口，解决“昨天做到哪了”。

每个项目至少包含：
- `project_id`
- `name`
- `summary`
- `status`
- `current_focus`
- `recent_tasks`
- `key_decisions`
- `artifact_index`
- `next_actions`
- `related_sessions`
- `updated_at`

### Layer 3 - Sustained Execution
作用：让任务不依赖单个主对话回合存活。

执行载体分三类：
- **主回合执行**：短任务、轻任务
- **子会话/子代理执行**：开放式长任务、编码、重型整理
- **cron/heartbeat 执行**：周期任务、批处理、巡检、简报

### Layer 4 - Long-Term Memory
作用：保存长期偏好、长期知识、长期决策。

不承担：
- 当前任务是否正在跑
- 当前项目最新阶段细节

否则会污染长期记忆层。

---

## 4. Core Principle
### 会话不是长期入口，项目才是长期入口
真正需要恢复的，不是“某一段聊天”，而是：
- 项目当前状态
- 关键产物在哪
- 上次为什么这么做
- 下一步是什么

因此：
- 会话是交互载体
- 任务是执行单位
- 项目是连续性入口

---

## 5. Integration Points

### Integration Point A - Before execution starts
在真正进入执行态前：
- 生成或绑定 `task_id`
- 若属于某个项目，则绑定 `project_id`
- 初始化任务状态

### Integration Point B - After each natural phase
完成一个自然阶段后：
- 更新 `current_stage`
- 更新 `last_completed_step`
- 更新 `next_step`
- 写入新产物路径

### Integration Point C - At session boundary
对重要任务：
- 把状态摘要回写到项目入口
- 把相关会话挂到项目索引
- 不依赖用户手动去翻历史聊天

### Integration Point D - After sustained execution finishes
子会话 / cron / heartbeat / 后台任务结束后：
- 回流到 task state
- 回流到 project continuity
- 更新 artifact index

---

## 6. Minimal Viable Architecture (MVP)
第一版不要上复杂自动化平台，先做最小闭环。

### MVP-1: Task state files
引入：
- `state/tasks/<task-id>.json`

目标：
- 至少知道当前任务是否存在、跑到哪、下一步是什么

### MVP-2: Project state files
引入：
- `state/projects/<project-id>.md`
- `state/projects/index.json`

目标：
- 新会话优先恢复项目，而不是翻聊天记录

### MVP-3: Recovery entry
引入：
- `CONTINUITY_START.md` 或等价入口规则

目标：
- 新会话时先看项目入口和活跃任务，而不是全量日志

### MVP-4: Sustained execution routing
先不自动化一切，只定义分流：
- 短任务 → 当前回合做完
- 长任务 → 子会话/子代理
- 周期任务 → heartbeat/cron

---

## 7. Recommended File Layout
```text
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

说明：
- `tasks/` 存机器可更新状态
- `projects/` 存项目入口与人类可读摘要
- `continuity/` 存当前活跃上下文和恢复提示

---

## 8. Interaction with Existing Files

### Continue using
- `MEMORY.md`：长期偏好/长期事实
- `memory/YYYY-MM-DD.md`：日常流水和重要事件
- `OPENCLAW_EVOLUTION_PLAN.md`：系统路线图

### Reduce responsibility of
- `PROJECT_LOG.md`：不再承担所有项目和所有任务的唯一入口
- `SESSION_RECOVERY_SYSTEM.md`：从旧方案迁移为新架构参考，而不是最终结构

### New responsibility
- `state/tasks/*`：执行状态真相源
- `state/projects/*`：项目恢复真相源

---

## 9. Design Decisions

### Decision 1
**不要把“持续执行”塞进 MEMORY.md。**
理由：长期记忆应保持稀疏、稳定、抽象。

### Decision 2
**不要把“项目恢复”继续完全建立在聊天记录上。**
理由：聊天是过程，不是最好的索引结构。

### Decision 3
**把“继续执行”拆成载体问题，而不是风格问题。**
理由：没有执行载体，纪律再好也只能做到“先做一段再回复”，做不到真正持续运行。

---

## 10. Roadmap

### Phase A - Schema + file layout
- 建立 `state/` 目录
- 定义 task/project schema
- 建立最小示例

### Phase B - Recovery path
- 定义新会话恢复顺序
- 优先从 project/task state 恢复
- 次级再读 daily memory 与长期记忆
- 参考：`CONTINUITY_START.md`

### Phase C - Sustained execution routing
- 明确何时用主回合、子会话、heartbeat、cron
- 为不同任务类型指定默认执行载体
- 参考：`SUSTAINED_EXECUTION_ROUTING.md`

### Phase D - Result backflow
- 任何长任务完成后，自动/半自动回写到 state 与项目入口
- 参考：`STATE_UPDATE_RULES.md`

---

## 11. Success Criteria
如果架构成功，用户应明显感受到：
1. 新会话不再像失忆
2. 昨天的结果更容易找回
3. 任务是否在进行有明确状态
4. 长任务不会因为主对话切换就完全蒸发
5. 项目恢复成本明显低于重新解释一遍

---

## 12. Current Judgment
当前最值得先做的，不是继续扩充长期记忆，而是：
1. 建 `state/tasks`
2. 建 `state/projects`
3. 建新的恢复入口
4. 再把持续执行调度接进来

先把“状态真相源”建立起来，再谈更强的自动化。

## 13. Trial Feedback
第一批试点（`continuity-*` + `daily-intel-brief`）已经验证：
- task state 是必要的
- project entry 比单纯聊天记录更适合作为恢复入口
- recurring workflow 需要 hub + per-run tasks + schedule 三件套
- backflow 和 carrier 决策必须显式化

这些经验已进一步收束到 `CONTINUITY_LESSONS.md`。
