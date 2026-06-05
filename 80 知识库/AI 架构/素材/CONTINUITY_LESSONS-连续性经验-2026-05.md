---
source: "70 素材/AI 架构/OpenClaw 工作区/CONTINUITY_LESSONS.md"
source_live: "~/.openclaw/workspace/CONTINUITY_LESSONS.md"
date: 2026-05-26
topic: AI 架构
---

# CONTINUITY_LESSONS — 连续性试点经验回灌

## 目标

把 `daily-intel-brief` 与 `continuity-*` 试点中已验证有效的机制，回灌成主系统规则——避免经验只停留在单个工作流里。

## 5 条已验证经验

### Lesson 1：任务必须有状态真相源
仅靠聊天/日志/MEMORY 不足以支撑连续执行。

✅ 验证方案：`state/tasks/active/*.json` + `state/tasks/completed/*.json`

有效原因：能明确任务是否在跑 / 记录下一步 / 把完成和活跃记录分开

### Lesson 2：项目需要独立恢复入口
> **会话不是长期入口，项目才是长期入口。**

✅ 验证方案：`state/projects/<name>.md` + `state/continuity/active-context.json`

有效原因：新会话能直接找到"现在最重要的项目"，不需要先翻聊天记录

### Lesson 3：recurring workflow 不能只存一次输出
周期性任务若只留下单次日志，连续性仍然很弱。

✅ 验证方案：workflow hub + per-run completed tasks + schedule.json

有效原因：能区分 latest/previous/next；能表达 recurring workflow 的节奏和状态

### Lesson 4：backflow 必须显式定义
没有明确 backflow 规则，结果会散落在 logs 和聊天里。

✅ 验证方案：skills/<name>/references/backflow.md + STATE_UPDATE_RULES.md

有效原因：结果/任务/项目/continuity hub 同步更新；避免"做了但系统接不住"

### Lesson 5：carrier 决策要晚于 workflow 质量验证
> **不要太早把新工作流接到 cron。**

✅ 验证方案：先 on-demand，质量和回流验证后再决定定时自动运行

有效原因：减少把质量问题误当成调度问题

## 5 条衍生新规则（从 Lessons 直接提炼）

| Rule | 规则 |
|---|---|
| A | 任何跨阶段任务，都应优先考虑建立 task state |
| B | 任何重要项目，都应建立项目入口与 artifact index |
| C | 任何 recurring workflow，都应至少有：workflow hub + per-run completed tasks + schedule/config |
| D | 任何真实工作流第一次接入连续性系统时，都应先用 on-demand 跑通，再考虑 heartbeat/cron |
| E | 新会话恢复默认顺序：active context → active project → active/completed task state → recurring hub → daily memory → long-term memory |

## 尚未验证的部分（⚠️ 不应假定已解决）

- heartbeat 真实接线
- cron 真实接线
- 子会话任务结果自动回流
- blocked → resumed 长期稳定流转
- 多项目并行时的 active-context 切换

## 升级标准（以下 4 条满足后才从试点升级为通用默认）

1. 至少两个不同类型工作流接入成功
2. 至少一个 blocked/resume 链条真实跑通
3. 至少一次新会话恢复明显依赖 state 而不是聊天历史
4. 至少一个非 brief 类工作流完成完整回流

## See Also

- [[CONTINUITY_ARCHITECTURE-连续性架构-2026-05]] — 系统架构设计
- [[SESSION_RECOVERY_SYSTEM-旧会话恢复-2026-05]] — 这份文件的前身（已被超越）
- [[OPENCLAW_EVOLUTION_PLAN-演化路线图-2026-05]] — Phase 3 的进度
- [[_主题页]]

> Updated: 2026-05-26
