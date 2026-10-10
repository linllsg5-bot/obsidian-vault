---
title: "Claude Pro 的使用额度和限制"
created: 2026-07-26T09:09:14.225782Z
updated: 2026-07-26T09:09:36.859835Z
messages: 2
model: "claude-sonnet-5"
source: "Claude"
url: https://claude.ai/chat/d13a9f9c-63ac-4b3e-a654-236021102078
---

# Claude Pro 的使用额度和限制

## You
*2026-07-26T09:09:15.285388Z*

claudepro每五小时有20美元额度是吗？

---

## AI
*2026-07-26T09:09:36.859835Z*

让我查一下最新的信息。

[Tool Result]








[Tool Result]











不是的，Claude Pro 官方并没有"每5小时20美元额度"这种说法——那是把月费($20/月)和用量周期(5小时)混在一起的误解。

实际机制是这样的：

**官方说法（Anthropic支持文档）**：在高峰时段，Claude Pro 提供的使用量至少是免费服务的5倍。可发送的消息数量会根据消息长度（包括附加文件长度）、当前对话长度以及使用的模型或功能而变化。如果对话相对较短且使用计算量较小的模型，你可以预期每5小时至少发送45条消息，消息限额是基于会话的，每5小时重置一次。

也就是说：
- 限额不是按"美元"算的，而是按**消息数/token量**算的
- 5小时是一个滚动窗口（session），不是固定时钟重置
- 长对话、大文件、用Opus这种更贵的模型，都会更快消耗额度
- 具体数字会随Anthropic当前服务器容量浮动，官方也说这只是估算值

**2026年5月的调整**：2026年5月6日这次调整把订阅档的5小时额度翻了一倍，彻底取消了3月才加上的高峰时段缩水，所以现在实际可用额度比年初宽松不少。

如果你想知道自己账户当前的真实用量和限制，最准确的是看 Claude.ai 或 Claude Code 里的 Settings > Usage（或者 `/usage` 命令），那里显示的是你账户实时的数据，比网上任何估算都准。

### Artifact: web_search
```
{
  "query": "Claude Pro 使用限制 5小时 额度 2026"
}
```

### Artifact: web_search
```
{
  "query": "Claude Pro plan usage limits official Anthropic support \"5 hours\""
}
```

---
