---
type: conversation-ingestion-protocol
audience: 小林 + AI + scripts
status: draft
updated: 2026-08-14
---

# Conversation Ingestion

## 目的

把“发生进入 Vault”和“AI 对发生作出认识”拆开。

采集成功不等于已经理解，也不要求立刻生成 `标注.md`、`index.md` 或项目结论。

```text
source occurrence
      ↓
capture / ingestion
      ↓
durable raw + source identity
      ↓
(optional, later)
recognition / annotation / index / interpretation history
```

## 第一层：Capture / Ingestion

这一层只负责尽量可靠地保存实际发生及其物理来源。

可以自动完成：

- 保存 user / assistant 可见消息与必要的真实工具发生；
- 保存来源平台、source session / conversation id、source message id（若能取得）；
- 保存时间、顺序、明确的 parent / branch 信息（若来源本身提供）；
- 去重同一发生的重复副本；
- 在来源不完整、身份不明或连续性未决时先进入 `inbox/`；
- 在身份已足够稳定时把材料移入正式会话位置。

这一层**不负责**：

- 判断哪些话是 Cognos 的正式主张；
- 自动生成 `〔实〕/〔幻〕/〔校正〕`；
- 自动把物理 session 判成新的认知会话；
- 自动总结主题并据此切割历史；
- 因为当前结构装不下就丢弃、改写或强制分类。

> Capture 完成的最低标准：发生已经有耐久来源，可以以后重新进入和重新认识。

## 第二层：Recognition

`标注.md`、`index.md`、`认识史.md` 属于后续认识，不是 ingestion 的完成条件。

它们可以晚于发生出现，也可以暂时不存在。

当需要重读时：

- raw / source occurrence 不改；
- 新认识写入标注、index 或认识史；
- 对连续性、分叉、转述关系拿不准时允许悬置，不强制得出结论。

## Physical Session 与 Conversation Continuity

平台边界必须保留，但不能自动成为认知边界。

```text
ChatGPT conversation id
Codex thread/session id
Antigravity task/session id
```

这些首先都是 `Source Session`。

一个持续展开可能跨多个 Source Session；一个 Source Session 也可能出现分叉。因此：

```text
Source Session ≠ Conversation Continuity
```

相关规则见 [[10 Projects/ai-conversations/_lineage]].

## 分叉与重复来源

同一段共同历史出现在多个 share / projection 中时，不应因为有多个文件就制造多份独立发生。

已知共同前缀时，应保留：

```text
shared history
   ├─ branch A continuation
   └─ branch B continuation
```

而不是：

```text
A = shared history + A
B = shared history + B
```

然后把 A、B 当成两个互相独立的一手来源。

原始来源文件可以都保存，但索引/谱系必须明确重复区间与来源关系。

## inbox 的地位

`inbox/` 是暂存区，不是长期归档层。

进入 inbox 的合理原因：

- source session 身份还不清楚；
- 不知道是旧会话继续、新会话、分支还是转述桥；
- 只有衍生 projection，正式 raw/source 尚未落地；
- 正在等待去重或来源核验。

身份已经清楚却长期停在 inbox，视为未完成的 ingestion。

具体约定见 [[10 Projects/ai-conversations/inbox/README]].

## 自动化边界

未来的 Conversation Bridge / watcher / browser adapter 应优先做到：

1. 发生不丢；
2. source identity 不丢；
3. 重复发生不被制造成多个独立证据；
4. 明确分支信息不丢；
5. 无法判断的连续性可以保持未决。

第一版不要把自动标注、自动项目提升、自动本体分类作为采集管道的一部分。
