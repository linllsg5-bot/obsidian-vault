---
session: 2026-05-24
participants: 小林, AI (opencode / Claude)
type: session-index
原版: "[[10 Projects/ai-conversations/2026-05-24-cli-量化项目-codex-antigravity/raw]]"
---

# 索引：从 crypto-quant 规则驱动到幻方式 ML stat arb——差距评估与路径规划

> 这不是摘要。这是一份尾迹：保留了关键校正、未解决张力、给下次 AI 的操作指引。
> 需要逐字细节去读 [[10 Projects/ai-conversations/2026-05-24-cli-量化项目-codex-antigravity/raw]] 或 [[标注]]。

## 一、这次对话产出了什么
- crypto-quant 项目的 ground truth 评估：研究型回测脚手架，非生产级平台
- 结构性差距清单：致命级 4 项（无 LiveExecutor、无实时行情、滑点未实现、资金费率未扣）+ 结构级 5 项（单策略、单标、缺风险指标、bar-close 撮合、无参数搜索）
- 真实量化世界的四层分工（HFT/中频系统化/投行定价/Crypto-native）和五项共性
- 幻方式 ML stat arb 的 7 层路径：数据→因子（WorldQuant 101）→标签（triple-barrier）→建模（先 LightGBM）→验证（purged k-fold）→组合（mean-variance/risk parity）→执行（滑点=f(参与率)）
- 框架选择决策树：学策略→vectorbt；学 paper→live→freqtrade；学生产级→NautilusTrader；自己写薄包装调 ccxt

## 二、关键校正点
> **校正 1**："README 自己标为 'functionally complete'"
> — AI 先读了 README 的自述，深入源码后发现致命缺口，结论：「functionally complete」有误导。真正的 gap 不在代码量，在真实交易成本模型、walk-forward 过拟合诊断、PnL 归因——框架不会替你做，必须自己建模。

## 三、给下次 AI 的操作指引
1. 先确认小林对「A 股还是 crypto？」的答案——这是全场唯一阻塞性开口，决定了后续所有动作的方向。如果选了 crypto，做好心理预期：中频 stat arb 在 crypto 被 HFT 和 retail 两头挤压。
2. 如果小林说「开始做」，不要从 crypto-quant 改——起新 repo，按 7 层路径从数据层起步。先别碰模型层，先让 WorldQuant 101 因子跑通。
3. 必读材料的指向性要在对话中保持：López de Prado 第 1–8 章、Stefan Jansen、WorldQuant Alpha 101 paper——这三本是执行 ML stat arb 路径的前提。
4. `final_bt.py` 的 `sent = np.random.uniform` 是一个教学反例——下次如果小林又问「看看这个策略行不行」，直接检查他有没有类似随机噪声当因子的情况。

## See Also
- [[标注]]
- [[10 Projects/ai-conversations/2026-05-24-cli-量化项目-codex-antigravity/raw]]
