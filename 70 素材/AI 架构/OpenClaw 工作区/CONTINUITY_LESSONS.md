# CONTINUITY_LESSONS.md - 连续性试点经验回灌

## Goal
把 `daily-intel-brief` 与 `continuity-*` 试点中已经验证有效的机制，回灌成主系统规则，避免经验只停留在单个工作流里。

---

## 1. Validated Lessons

### Lesson 1: 任务必须有状态真相源
仅靠聊天、日志或 MEMORY 不足以支撑连续执行。

已验证：
- `state/tasks/active/*.json`
- `state/tasks/completed/*.json`

有效原因：
- 能明确当前任务是否在跑
- 能记录下一步
- 能把完成记录和活跃记录分开

### Lesson 2: 项目需要独立恢复入口
会话不是长期入口，项目才是长期入口。

已验证：
- `state/projects/agent-evolution.md`
- `state/projects/agent-evolution-artifacts.md`
- `state/continuity/active-context.json`

有效原因：
- 新会话能直接找到“现在最重要的项目”
- 不需要先翻聊天记录
- 能快速定位产物和下一步

### Lesson 3: recurring workflow 不能只存一次输出
周期性任务若只留下单次日志，连续性仍然很弱。

已验证：
- `state/continuity/daily-intel-brief-index.md`
- `state/continuity/daily-intel-brief-schedule.json`
- per-run completed tasks

有效原因：
- 能区分 latest / previous / next
- 能表达 recurring workflow 的节奏和状态
- 能记录 carrier 决策

### Lesson 4: backflow 必须显式定义
如果没有明确 backflow 规则，结果会散落在 logs 和聊天里。

已验证：
- `skills/daily-intel-brief/references/backflow.md`
- `STATE_UPDATE_RULES.md`

有效原因：
- 结果、任务、项目、continuity hub 会同步更新
- 避免“做了但系统接不住”

### Lesson 5: carrier 决策要晚于 workflow 质量验证
不要太早把新工作流接到 cron。

已验证：
- `WORKFLOW_CARRIER_DECISIONS.md`
- `daily-intel-brief` 采用 on-demand primary / heartbeat-ready secondary

有效原因：
- 先验证质量和回流
- 再决定是否固定时间自动运行
- 减少把质量问题误当成调度问题

---

## 2. New Default Rules

### Rule A
任何跨阶段任务，都应优先考虑建立 task state。

### Rule B
任何重要项目，都应建立项目入口与 artifact index。

### Rule C
任何 recurring workflow，都应至少有：
- workflow hub
- per-run completed tasks
- schedule/config

### Rule D
任何真实工作流在第一次接入连续性系统时，都应先用 on-demand 跑通，再考虑 heartbeat 或 cron。

### Rule E
新会话恢复时，默认顺序应是：
1. active context
2. active project
3. active/completed task state
4. recurring hub（如果相关）
5. daily memory
6. long-term memory

---

## 3. What Is Still Not Proven
以下内容还没有被充分验证：
- heartbeat 真实接线
- cron 真实接线
- 子会话任务结果自动回流
- blocked -> resumed 的长期稳定流转
- 多项目并行时的 active-context 切换

这些不应被假定为“已经解决”。

---

## 4. Promotion Criteria
以下条件满足后，才把当前连续性系统从试点升级为更通用默认：
1. 至少两个不同类型工作流接入成功
2. 至少一个 blocked/resume 链条真实跑通
3. 至少一次新会话恢复能明显依赖 state 而不是聊天历史
4. 至少一个非 brief 类工作流也完成完整回流

---

## 5. Immediate Recommendation
下一批最值得接入连续性系统的，不是再做一个简报，而是：
- 一个真正跨文件、跨阶段的项目执行工作流
- 或一个需要子会话/子代理持续推进的长任务

因为 `openclaw-self-maintenance` 已经成为第一条非 brief 类 continuity 样本。
真正跨文件、跨阶段的项目执行工作流

这样才能验证连续性系统是否能超越“简报类任务”。
