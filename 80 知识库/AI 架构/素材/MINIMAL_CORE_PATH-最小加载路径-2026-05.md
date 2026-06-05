---
source: "70 素材/AI 架构/OpenClaw 工作区/MINIMAL_CORE_PATH.md"
source_live: "~/.openclaw/workspace/MINIMAL_CORE_PATH.md"
date: 2026-05-26
topic: AI 架构
---

# MINIMAL_CORE_PATH — 最小核心加载路径

## 核心原则

> 默认少读，不默认全读。先保人格，再保执行，再补精细模块。能按需加载，就不要预加载。

## 三个加载层级

### Level 0 — Conversation Core（闲聊/短问答）
只读 3 个：
1. SOUL.md
2. PERSONA_KERNEL.md
3. USER.md

### Level 1 — Work Core（任务执行）
Level 0 + 加：
4. EXECUTION_PROTOCOL.md
5. MEMORY.md（**仅在**需要长期偏好/历史决策/连续性记忆时）

### Level 2 — On-Demand（仅在明确需要时）

| 文件 | 触发时机 |
|---|---|
| MODE_ROUTING | 任务模式不清 / 一个请求混合多目标 |
| WORKFLOW_TEMPLATES | 需要稳定结构化长答 |
| PREFERENCE_PROFILES | 需要细粒度贴合风格 |
| IMPROVEMENT_LOOP | 判断反馈是否应沉淀为规则 |
| EXCELLENT_CASES | 明确需要参考优秀范式 |
| OPENCLAW_EVOLUTION_PLAN | 做系统演化/轻量化/规则设计 |

## 默认 **不**重读的文件

MODE_ROUTING / WORKFLOW_TEMPLATES / PREFERENCE_PROFILES / IMPROVEMENT_LOOP / EXCELLENT_CASES / OPENCLAW_EVOLUTION_PLAN

> 它们是工具箱，不是常驻大脑。

## Fast Heuristic

- 日常短对话 → Level 0
- 普通任务 → Level 1  
- 系统优化/风格校准/复杂设计 → Level 1 + 按需 Level 2

## 升级规则 + 压缩规则

**升级**：先用低级别完成；以下情况才升级——当前信息不足 / 任务复杂化 / 用户明确要更高质量 / 需要长期记忆
**压缩**：先停用非默认预加载 → 再压缩长规则文件段落 → 最后才合并文件

## See Also

- [[RULE_COMPRESSION_AUDIT-规则压缩审计-2026-05]] — 配套使用：系统变胖时的审计路径
- [[OPENCLAW_EVOLUTION_PLAN-演化路线图-2026-05]] — Phase 6 轻量化目标
- [[MEMORY-长期记忆与偏好-2026-05]] — MEMORY.md 的按需加载说明
- [[_主题页]]

> Updated: 2026-05-26
