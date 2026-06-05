---
source: "70 素材/AI 架构/OpenClaw 工作区/SKILL_ROUTING.md"
source_live: "~/.openclaw/workspace/SKILL_ROUTING.md"
date: 2026-05-26
topic: AI 架构
---

# SKILL_ROUTING — Skill 路由与加载规则

## 在架构里的位置

**横切路由器**——跟 model routing 同层，判**是否加载 skill 以及加载哪个**。

> 目标：让技能触发更稳、更省 token、更少误用。

## §0 Core Rule

> **先判断要不要 skill，再判断用哪个 skill。**

很多任务的最佳路径不是触发一个 skill，而是直接回答 / 直接读文件 / 直接 edit / 一等工具（web_fetch、memory_search、pdf、image 等）。

但面对**不会的、麻烦的、重复出现**的事情时，默认多问两句：
1. 有没有现成 skill 可以复用？
2. 如果没有，这件事值不值得沉淀成 skill？

## §1 Fast Routing Flow

```
Step 1: 判定主模式（参考 MODE_ROUTING）
Step 2: 判断是否需要 skill（轻任务通常不需要）
Step 3: 命中任务域（看 SKILLS_INDEX）
Step 4: 只读一个最具体的 skill（不读 2 个以上）
Step 5: 失败再升级（明显不够才切/补读）
```

## §2 Load Budget（4 级）

| 级别 | 适用 | 动作 |
|---|---|---|
| **L0 - No Skill** | 日常问答、轻解释、小编辑、单步工具 | 不读任何 SKILL.md |
| **L1 - Single Skill** | 明确命中某领域、有现成 workflow | 只读一个 SKILL.md |
| **L2 - Skill + Reference** | 已命中但细节不够 | 继续读该 skill 指向的 reference |
| **L3 - Switch Skill** | 任务跨域、当前 skill 不对 | 退出当前负载，重新选 |

## §3 Anti-Bloat Rules

**不做的事**：
- 预读全部 skills
- 为了"保险"同时读多个重 skill
- 把 skill 当百科全文缓存
- 把简单任务升级成工具链任务

**常见误触发**：
- 看到代码就想开 coding-agent
- 看到 URL 就想开 browser
- 看到 Obsidian 就默认 obsidian-cli
- 看到系统问题就把 healthcheck + node-connect 一起读

**替代原则**：
- 先轻后重 / 先本地后外部 / 先直接工具后 skill / 先具体后泛化

## §4-5 Escalation / De-Escalation Signals

**升级信号**：
- 用户要"系统化处理 / 搭一套方案 / 长期复用"
- 涉及专用文件格式或工具链
- 跨多个文件/页面/系统
- 上一次直接处理已暴露不稳定 / 重复劳动

**降级信号**：
- 任务缩小到一个小改动
- 只剩一个命令或一个文件编辑
- 用户其实只想要结论
- 继续读 skill 比直接做更慢

## §6 默认 Mapping（按当前 OpenClaw 配置）

**直接处理优先**：
- 普通解释 / 本地文档答疑 / 小型文本改写 / 单文件小修 / 一两条 shell

**优先进入 skill**：
- OpenClaw UI/gateway 排障 → `openclaw-self-maintenance`
- OpenClaw 节点疑难 → `node-connect`
- 主机部署体检 → `healthcheck`
- URL 阅读总结 → `defuddle`
- GitHub PR/CI/issue → `github`
- 大型编码 → `coding-agent`
- Skill 设计/审计 → `skill-creator`
- Obsidian Base/Canvas → `obsidian-bases` / `json-canvas`

## §8 Bottom Line

> 目标不是"拥有很多 skills"，而是：
> - 该触发时触发
> - 不该触发时别乱触发
> - 每次只加载最少但足够的内容

> **先目录，后正文；先单 skill，后多 skill；先直接做，后系统化。**

## 对 vault Claudian 的实际启示

vault 这边目前没有正式的 "skill" 概念——我有的是 [[AI]] 的"触发词"（ingest / inbox / query / lint）。

但本质是一样的：**该触发才触发，不该乱触发**。

我之前几轮跟你的交互里，符合这个原则的有：
- 用户说"清理 inbox" → 才扫 inbox（而不是每次新会话主动检查）
- 用户说"ingest 这个" → 才走 ingest 流程

不符合的有：
- 主动审查整个 vault 结构、主动建议优化——其实你没要求，我就开始动了

→ 这是 vault CLAUDE.md 可以加的规则：**Claudian 不主动触发主动维护行为，除非用户明确要求**。

## See Also

- [[MODE_ROUTING-执行子路由-2026-05]] — 上游模式判定
- [[DIALOGUE_ROUTING-总路由-2026-05]] — 总路由
- [[RULE_COMPRESSION_AUDIT-规则压缩审计-2026-05]] — 类似哲学
- [[_主题页]]

> Updated: 2026-05-26
