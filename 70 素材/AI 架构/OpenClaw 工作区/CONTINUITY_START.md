# CONTINUITY_START.md - 新会话恢复入口

## Goal
在新会话中优先恢复“项目与任务状态”，而不是先翻散落日志。

## Recommended recovery order
1. Read `WORKBOARD.md`
2. Read `state/continuity/active-context.json`
3. Read `state/projects/index.json`
4. Read the active project file(s)
5. Read `state/tasks/active/*.json`
6. Only if needed, read `TODAY_SUMMARY_2026-03-17.md` for day-level recap
7. Only if needed, read `CONTINUITY_LESSONS.md` for default recovery/execution heuristics
8. Only if needed, read `STATE_UPDATE_RULES.md` if execution needs to continue across stages
9. Only if needed, read `SUSTAINED_EXECUTION_ROUTING.md` if task-carrier choice matters
10. Then read today's and yesterday's `memory/YYYY-MM-DD.md`
11. Only then consult `MEMORY.md` for long-term preference / identity / stable context

## Fast recovery questions
恢复时优先回答：
- 现在最重要的项目是什么？
- 当前正在跑的任务是什么？
- 上一个自然阶段已经完成了什么？
- 下一步应该接什么？
- 关键产物在哪？

## Current active project
- `agent-evolution` → `state/projects/agent-evolution.md`
- artifact index → `state/projects/agent-evolution-artifacts.md`

## Current active tasks
- `continuity-implementation` → `state/tasks/active/continuity-implementation.json`

## Recently completed task samples
- `continuity-architecture` → `state/tasks/completed/continuity-architecture.json`
- `daily-intel-brief-integration` → `state/tasks/completed/daily-intel-brief-integration.json`
- `openclaw-self-maintenance-integration` → `state/tasks/completed/openclaw-self-maintenance-integration.json`

## Current active context
Default surfaces:
- `WORKBOARD.md`
- `state/continuity/active-context.json`
- `state/continuity/recovery-notes.md`

On-demand supporting surfaces:
- `TODAY_SUMMARY_2026-03-17.md`
- `FRESH_SESSION_RECOVERY_SIMULATION_2026-03-17.md`
- `RECOVERY_VALIDATION_2026-03-17.md`
- `CONTEXT_GOVERNANCE_PLAN_2026-03-17.md`
