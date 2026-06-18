---
type: archive-index
audience: 小林 + AI
updated: 2026-06-19
---

# AI 对话归档区

> 散在各处的 AI 对话（Claudian / GPT / antigravity / 其他）统一收进这里。
> **三层归档：raw 是第一手档案，标注是给 AI 读的无误会版，index 是给下次 AI 的尾迹。**

---

## 三层模型

| 文件 | 内容 | 谁读 |
|------|------|------|
| `raw.md` | 原文，一字不改。第一手档案，神圣不动 | 逐字核查时翻 |
| `标注.md` | 清洗导出噪声 + 说话人 + 认知标记（实/幻/校正/开口/割裂） | **AI 进相关话题先读这个** |
| `index.md` | 结构化尾迹：产出什么、未解决张力、给下次 AI 的操作指引 | 快速定位时读 |

> 三个都要，不是二选一。  
> **标注/raw 的完整规范（清洗规则、认知标记词表、模板、范例）→ [[.claude/skills/对话标注/SKILL]]**  
> **网页版 DIY 流程 → [[10 Projects/ai-conversations/_DIY-消化会话省token]]**

---

## 目录结构

```
10 Projects/ai-conversations/
  <日期>-<来源>-<主题>/
    raw.md      ← 原文倾倒，一字不改
    标注.md     ← 清洗 + 说话人 + 认知标记（技能产物）
    index.md    ← 尾迹（结构化摘要）
```

命名：`YYYY-MM-DD-<来源>-<主题>`  
来源：`claudian` / `gpt` / `antigravity` / `gemini` / `sonnet` …

---

## 工作流

### 你要做的
1. 把任意 AI 对话原文丢进一个新建的 `<日期>-<来源>-<主题>/raw.md`。
2. 告诉我「整理这个会话」或「给这个会话做标注」。

### AI 要做的
1. 调用 [[.claude/skills/对话标注/SKILL]]，读 raw → 产出 `标注.md`。
2. 产出 `index.md`（尾迹标准见 index 约定）。
3. 末尾 See Also 用 wiki-link 链回相关协议 / 主线 / 沉淀文件。

---

## 已归档

| 日期 | 来源 | 主题 | 类型 | 标注 |
|------|------|------|------|------|
| 2026-05-28 | antigravity | [[10 Projects/spark-sessions/2026-05-28-antigravity-架构讨论/index\|prototype-spark v2 架构讨论]] | 思想/架构 | ✓ |
| 2026-05-29 | claudian | [[10 Projects/ai-conversations/2026-05-29-claudian-蒸馏自己/index\|蒸馏自己 → AI 内核]] | 思想 | ✓ |
| 2026-05-29 | claudian | [[10 Projects/ai-conversations/2026-05-29-claudian-vault整理/index\|Vault 大整理]] | 操作 | ✓ |
| 2026-05-29 | claude | [[10 Projects/ai-conversations/2026-05-29-claude-engineering-learning/index\|Claude Code 配置、工程认知与 Spark 哲学张力]] | 思想/技术 | ✓ |
| 2026-05-30 | claudian | [[10 Projects/ai-conversations/2026-05-30-claudian-工程化与会话归集/index\|OpenClaw、哲学与 ECC 框架的融合探索与工程落地]] | 思想/技术/操作 | ✓ |
| 2026-05-31 | claudian | [[10 Projects/ai-conversations/2026-05-31-claudian-认识论与工具内核/index\|认识论与工具内核 — 哲学与思维工具史综合]] | 思想/技术 | ✓ |
| 2026-06-03 | claudian | [[10 Projects/ai-conversations/2026-06-03-claudian-认识论验证与数学隐喻/index\|认识论实验 make 与数学作为认知螺旋实验室]] | 思想/技术 | ✓ |
| 2026-06-04~05 | claudian+antigravity | [[10 Projects/ai-conversations/2026-06-04-claudian-antigravity-引擎验证与基础设施/index\|studying-spark Phase 0 引擎验证 + 基础设施搭建与崩塌]] | 思想/技术/基建 | ✓ |
| 2026-06-05 | claudian | [[10 Projects/ai-conversations/2026-06-05-claudian-学习的结构-主体中间世界/index\|学习的结构：主体/中间/世界 — 本体在中间层]] | 思想/架构 | ✓ |
| 2026-06-06 | sonnet | [[10 Projects/ai-conversations/2026-06-06-sonnet-幻觉与认知操作系统/index\|幻觉是存在扩张的机制·个人认知操作系统浮出]] | 思想/认识论 | ✓ |
| 2026-06-06 | claudian | [[10 Projects/ai-conversations/2026-06-06-claudian-链接引擎与翻框/index\|studying-spark 链接引擎确立 · v4 翻框]] | 思想/架构 | ⚠ raw 缺失 |
| 2026-06-07 | claudian | [[10 Projects/ai-conversations/2026-06-07-claudian-昨天对话非常重要/index\|昨天对话非常重要 — 哲学深推 → 对话标注三层体系自反式建造]] | 思想/元层 | ✓ |
| 2026-06-07 | cli | [[10 Projects/ai-conversations/2026-06-07-cli-github-obsidian-vault/index\|GitHub + Obsidian Vault CLI 配置]] | 操作 | ✓ |
| 2026-06-09 | claudian | [[10 Projects/ai-conversations/2026-06-09-claudian-pi-agent还是obsidian/index\|pi agent 还是 Obsidian — 从工具选择到"墙得是真外部"]] | 思想/决策 | ✓ |
| 2026-06-16 | claudian | [[10 Projects/ai-conversations/2026-06-16-claudian-平面国/index\|平面国 — 维度、形式与知觉的哲学讨论]] | 思想 | ✓ |
| 2026-06-17 | claudian | [[10 Projects/ai-conversations/2026-06-17-claudian-Phase1全程/index\|studying-spark Phase 1 全程 — leakage judge + 反 funneling 代码落地]] | 技术/工程 | ✓ |
| 2026-06-18 | claude | [[10 Projects/ai-conversations/2026-06-18-claude-code-基础设施修复与架构主线/index\|基础设施修复 + 主体延伸架构主线]] | 思想/工程 | ✓ |
| 2026-06-18 | claudian | [[10 Projects/ai-conversations/2026-06-18-claudian-Phase1-leakage-judge续场/index\|Phase 1 leakage judge 闭环验证 + 归档系统全量对账]] | 技术/归档 | ✓ |
| 2026-06-18 | cli-claudian | [[10 Projects/ai-conversations/2026-06-18-cli-claudian-恢复全程/index\|claudian 崩溃后 CLI 恢复全程（终端完整实录）]] | 工程/恢复 | ✓ |
