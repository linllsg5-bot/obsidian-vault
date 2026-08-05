---
session: 2026-05-25
participants: 小林, AI (opencode / Claude)
type: session-index
原版: "[[10 Projects/ai-conversations/2026-05-25-cli-配置openclaw-中转站api/raw]]"
---

# 索引：OpenClaw 中转站 API 配置——从猜 schema 到发现「已经配好了只是挂了」

> 这不是摘要。这是一份尾迹：保留了关键校正、未解决张力、给下次 AI 的操作指引。
> 需要逐字细节去读 [[10 Projects/ai-conversations/2026-05-25-cli-配置openclaw-中转站api/raw]] 或 [[标注]]。

## 一、这次对话产出了什么
- OpenClaw 真实 config schema（`models` 是数组、需要 `"api": "openai-completions"` 字段）
- freemodel 中转站已配置但确认挂掉（305 Service Unavailable）——非 probe 误判，是真实请求失败
- 全模型可用性盘点：freemodel/* ❌ / google/gemini-3.5-flash ❌ 限流 / google/gemini-3.1-pro-preview ❌ 限流 / google-ai/gemini-3.1-flash-lite ✅ / openai/gpt-5.5 ❌ 401 / openai-codex/* ❌ 限流
- fallback 链设置成功：opus 主力 → sonnet 兜底 → gemini-flash-lite 最后兜
- 明文密钥安全警告：Google/FreeModel/OpenAI/OpenClaw gateway token 全部裸存于 openclaw.json

## 二、关键校正点
> **校正 1**："models.providers 下加一个自定义 provider 就行"（AI 按常识猜的 schema）
> — 看了小林贴出的实际 openclaw.json 后纠正：`models` 是数组不是对象，需要 `"api": "openai-completions"` 字段区分协议类型。freemodel 这个 provider 其实已经配好了——不是在加新 provider，是在修现有配置的默认路由和 fallback。

> **校正 2**："probe 说的是 timeout/connection refused" → "不是 probe 太严格，是 freemodel 中转站当前真的挂了"
> — 看了 `openclaw logs --follow` 的真实请求日志后纠正：服务端返回的是 `"305 hiService Unavailable"`，不是网络问题，是 `cc.freemodel.dev` 自己的服务端错误。

## 三、给下次 AI 的操作指引
1. 如果小林说「freemodel 还是不能用」——不要再 debug freemodel，直接提换付费中转站（packyapi.com、apiyi.com、anyrouter）或自建 Sub2Api。freemodel 是免费的，没有 SLA，挂了就是挂了。
2. 如果小林说「密钥安全问题」——确认他已经轮换了 JSON 里裸存的 4 组密钥，然后帮他把 `apiKey` 从 JSON 明文改成环境变量引用。
3. 如果小林说「想做任务路由」——OpenClaw 本身不支持按任务难度自动选模型，但 subagent 可以分别配不同模型（主 agent Opus + subagent Sonnet），这是一个可行的折中方案。
4. `freemodel` 的 `api: "openai-completions"` 意味着中转站把 Claude 包装成了 OpenAI 兼容格式——如果 Claude 的 tool use 或 system prompt 行为异常，先排查这个协议转换层是不是丢失了字段。
5. 小林在终端粘贴命令时频繁被换行截断——下次给命令时优先给单行版或用变量法包装 JSON 参数。

## See Also
- [[标注]]
- [[10 Projects/ai-conversations/2026-05-25-cli-配置openclaw-中转站api/raw]]
