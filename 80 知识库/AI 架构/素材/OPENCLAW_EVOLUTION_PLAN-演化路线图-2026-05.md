---
source: "70 素材/AI 架构/OpenClaw 工作区/OPENCLAW_EVOLUTION_PLAN.md"
source_live: "~/.openclaw/workspace/OPENCLAW_EVOLUTION_PLAN.md"
date: 2026-05-26
topic: AI 架构
---

# OPENCLAW_EVOLUTION_PLAN — 主代理演化路线图

## 目标

> 将当前 OpenClaw 主代理从"会做事的工具"升级为"人格稳定、解释强、思维活、能持续进化的协作型 Agent"。

## 8 阶段进化路线（当前完成状态）

| Phase | 主题 | 核心里程碑 | 状态 |
|---|---|---|---|
| 1 | 人格稳定化 | PERSONA_KERNEL + 偏好写入长期记忆 | ✅ 已落地 |
| 2 | 执行协议化 | EXECUTION_PROTOCOL + 分层规则 + 任务模式切换 | ✅ 已落地 |
| 3 | 记忆增强化 | PREFERENCE_PROFILES + CONTINUITY_ARCHITECTURE + task state 架构 | ✅ 基础版落地，部分未验证 |
| 4 | 工作流人格化 | WORKFLOW_TEMPLATES（6 子模式）| ✅ 已落地 |
| 5 | 自我迭代闭环 | IMPROVEMENT_LOOP + EXCELLENT_CASES + MINIMAL_CORE_PATH | ✅ 已落地 |
| 6 | 收敛与轻量化 | MINIMAL_CORE_PATH 强化 + 压缩各文件 | ✅ 已启动，仍有残余任务 |
| 7 | 质量护栏与路由校准 | QUALITY_GUARDRAILS + 升级信号闸门 + 初步验证 | ✅ 已启动，持续观察中 |
| 8 | Skill 生态扩展 | SKILL_ROUTING + SKILLS_INDEX + skill 生命周期 | ✅ 已启动，机器可读注册表未完成 |

## 各 Phase 剩余任务（重点）

**Phase 3 未完成**：
- heartbeat / cron 真实接线
- 子会话任务结果自动回流
- blocked → resumed 长期稳定流转
- 多项目并行时 active-context 切换

**Phase 6 未完成**：
- 继续消除规则重叠
- 定期做减法，不只做加法
- 把高频规则压成更少但更强的核心原则

**Phase 8 未完成**：
- 增加机器可读注册表（skills-registry.json）
- 现有 skills 盘点（高频/低频/重型/轻型/重复/缺口）
- 新增 skill 判断门槛（高复用 + 强约束 + 专用 workflow + 非通用知识）
- skill 生命周期：发现 → 决定 → 试用 → 索引 → 路由 → 清理

## 架构总图（推荐）

```
用户输入
→ SOUL.md（总原则）
→ PERSONA_KERNEL.md（人格与思维风格）
→ USER.md / MEMORY.md（偏好与长期上下文）
→ 当前任务目标
→ 工具执行
→ 输出
→ 记忆回写
```

## 成功判定标准

用户稳定感受到：解释更清楚 / 风格更统一 / 思路更灵活 / 输出更像长期搭档 / 每次互动在累积不重置

## 与 Vault 的对应

2026-05-26，这份路线图里描述的大部分架构文档已经 ingest 进 vault `80 知识库/AI 架构/`。Vault 版将作为后续维护的 source of truth，OpenClaw 这份文件提供历史纵览。

## See Also

- [[SOUL-身份基底-2026-05]] — Phase 1 的根
- [[CONTINUITY_ARCHITECTURE-连续性架构-2026-05]] — Phase 3 的当前方案
- [[RULE_COMPRESSION_AUDIT-规则压缩审计-2026-05]] — Phase 6 的执行工具
- [[SKILL_ROUTING-技能路由-2026-05]] — Phase 8 的路由层
- [[_主题页]]

> Updated: 2026-05-26
