---
type: conversation-staging-readme
audience: 小林 + AI + scripts
status: active
updated: 2026-08-14
---

# inbox — 会话暂存区

`inbox/` 只表示：**发生已经被捕获，但它在会话空间中的稳定位置还没有确定。**

它不是正式归档层，也不是低质量文件垃圾桶。

## 什么情况下可以进入 inbox

- source session / conversation 身份还不清楚；
- 不确定它是旧会话继续、新会话、分支、汇合还是跨平台转述；
- 当前只有 projection / extract，正式 raw 或耐久 source 尚未落地；
- 正在等待重复来源去重、共同前缀核验或来源完整性检查；
- 当前结构确实装不下，但发生本身需要先保存。

## 什么情况下应该离开 inbox

当以下事实已经足够明确时，应 promotion 到正式会话位置：

- 物理来源已确认；
- 与已有发生的重复/分支关系已确认到足够程度；
- 已有一个不会制造虚假独立性的落点。

Promotion **不要求**已经有 `标注.md`、`index.md` 或项目结论。只有 raw/source 已经获得稳定位置，也可以视为 capture 完成。

## 不允许的用法

- 不把 `projection-<hash>.md` 长期当作会话身份；
- 不因为一个平台产生了新 session id 就自动建立一场新的认知会话；
- 不把两个包含共同历史的 share 各自当成完整独立的一手发生；
- 不为了清空 inbox 而强行命名、总结、分类或删除来源；
- 不在未检查引用和唯一信息前删除旧 projection / placeholder。

## 当前目录

本目录中 2026-08-13 ~ 08-14 遗留的 GPT / Codex projection 与 provenance 文件是在旧流程下形成的。它们暂时保留，等待按 [[10 Projects/ai-conversations/_ingestion]] 与 [[10 Projects/ai-conversations/_lineage]] 重新核验。

`inbox` 为空不是目标；**没有已明身份的发生被永久困在这里**才是目标。
