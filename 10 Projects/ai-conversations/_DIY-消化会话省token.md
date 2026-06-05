---
type: how-to / token-saving
audience: 小林
updated: 2026-05-29
---

# DIY:在网页版 AI 消化会话(省 token)

> 消化长对话 = 读海量文本 + 出结构化输出 = 纯体力活,烧 token 最凶。
> 这种活**不该用 Claudian(付费 API)做**,拿去免费网页版 AI(GPT / Claude / Gemini)做,再粘回 obsidian。

---

## 什么活该 DIY,什么留给 Claudian

判断三连:**要碰文件系统吗? 要跨多个 vault 文件互查吗? 错了代价高吗?**
三个都"否" → 自己在网页版做。任一"是" → 留给 Claudian。

| 拿去网页版 DIY | 留给 Claudian |
|---|---|
| 消化会话写 index | 移文件 + 全库更新 wikilink |
| 把一篇文章浓缩成素材卡片 | 跨 80 知识库找关联建 See Also |
| 翻译 / 批量改写 / 格式化 | 架构决策、协议改动 |
| 长文总结提炼 | 删文件、动只读区 |

---

## 操作流程(消化会话)

1. 把对话原文存进 `10 Projects/ai-conversations/<日期>-<来源>-<主题>/raw.md`
2. 打开任意免费网页版 AI,**把下面的模板 + raw 全文一起粘进去**
3. 拿到 index → 存成同目录的 `index.md`
4. 更新 `10 Projects/ai-conversations/README.md` 的"已归档"表格加一行

> raw 太长粘不下 → 分 2-3 段粘,最后一段再附模板。或用支持长上下文的网页版(Gemini / Claude)。

---

## 消化模板(复制这段 + 对话原文给网页版 AI)

```
你是一个帮我消化 AI 对话的助手。我会给你一段我和 AI 的对话原文。
请产出一份"会话 index"——注意,这不是摘要。

核心标准(必须遵守):
- 沉积 = 尾迹,不是总结。不要逐段复述"我们聊了什么"。
- 只保留:① 我的关键校正点(我用什么原话纠正了 AI 的方向——这是最高价值)
  ② 未解决的张力/卡点 ③ 已确认的设计决策及其理由 ④ 给下次 AI 的操作指引
- 如实记录,不美化、不拔高、不替我升华。
- 我的原话校正要直接引用,不要改写。

输出格式(markdown):
---
session: <日期>
participants: 小林, <AI名>
type: session-index
原版: [[raw]]
---

# 索引:<一句话主题>

## 一、这次对话产出了什么
（已落地的变更 / 已确认的原则 / 未解决的张力 三段）

## 二、关键校正点(我的原话,不美化)
（逐条,带引用）

## 三、给下次 AI 的操作指引
（进入相关话题时先知道什么 / 别重犯的错）

## See Also
（留空,我自己补 wiki-link）

---
下面是对话原文:
<把 raw.md 全文粘这里>
```

---

## 样板参考

产出长这样(已有的好样板):
- [[10 Projects/ai-conversations/2026-05-29-claudian-蒸馏自己/index]] — 思想型
- [[10 Projects/ai-conversations/2026-05-29-claudian-vault整理/index]] — 操作型
- [[10 Projects/spark-sessions/2026-05-28-antigravity-架构讨论/index]] — 最完整

---

## 注意

- 网页版 AI 不懂你的 wiki-link 体系,See Also 段让它留空,你自己补或叫 Claudian 补。
- index 回来后**通读一遍**——网页版 AI 可能漏掉你觉得重要的校正,手动补。
- 不想让 AI 读的对话,别进归档区,放 `小林的/40 Journal/`(Pre-AI 区)。
