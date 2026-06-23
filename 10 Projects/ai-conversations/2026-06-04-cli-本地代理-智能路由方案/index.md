---
session: 2026-06-04
participants: 小林, Claude (Claude Code CLI, Sonnet 4.6)
type: session-index
原版: "[[raw]]"
---

# 索引：CLIProxyAPI 网关 + Gemini 智能路由 — 配置尝试与交棒

> 这不是摘要。这是一份尾迹：保留了关键校正、未解决张力、给下次 AI 的操作指引。
> 需要逐字细节去读 [[raw]] 或 [[标注]]。

## 一、这次对话产出了什么

### 已落地的变更 / 已确认的原则

1. **本地代理架构确认**：CLIProxyAPI v6.8.40 已装，是成熟的本地网关（:8317），做 LiteLLM 90% 的活——Anthropic 原生格式、模型路由/别名、多来源聚合、retry/failover、Claude 请求 cloak。
2. **Gemini 三条入口的封号风险完整论证**：

| 入口 | 封号风险 | Flash 免费额度 | 能否喂 agent |
|---|---|---|---|
| **AI Studio API Key** | 几乎没有 | ~1500次/天 | 完整 tool use |
| Gemini CLI OAuth | 有风险（官方点名） | ~1000次/天 | 残 |
| Antigravity OAuth | 有风险 | 预览期大但会变 | 残 |
| 网页反代（WebAI-to-API） | **拉满（赔主账号）** | Pro 不透明 | 完全不能跑 |

3. **方向敲定**：Gemini 走 AI Studio API Key（安全、额度够、免信用卡），中转站接 Sonnet/Opus。
4. **config.yaml 骨架写入成功**：型号已更新为最新（gemini-3.5-flash、gemini-3.1-pro-preview），占位符已填。
5. **中转站探测完成**：freemodel.dev 格式兼容（Anthropic 原生格式 ✅），开放模型 opus-4-8/4-7/4-6、sonnet-4-6、haiku-4-5。裸 curl 被反爬门禁顶回，真 CC 客户端自带 x-stainless header 能过。
6. **交棒文档**：`claudian-handoff-plan.md` 已产出——架构（CC/OpenClaw → 本地网关 :8317 → 按模型名分流）、配置位置、拦路问题、settings.json 修改方法及教训。

### 未解决的张力 / 卡点

1. **Gemini 地区封锁**：`FAILED_PRECONDITION: User location is not supported`，Gemini API 直连从本地走不通，必须挂代理出口。
2. **AI Studio key 非标准格式**：`AQ.Ab8RN...` 这个 token 性质不明，需重新生成标准格式 key。
3. **CLIProxyAPI 未被启动测试**：整个网关链路从未被实际跑起来验证。
4. **脏活层（Gemini Flash）因地区封锁完全未落地**。
5. **中转站密钥和 Google token 已在对话记录中暴露**，需轮换。

## 二、关键校正点（我的原话，不美化）

> **"不要2.5啊，你联网搜索下最新的。起码都到3了吧"**
> *(纠正 AI 使用过时的 Gemini 型号名，要求联网获取最新型号。)*

> **"别乱改了，下面是原本的配置文件，你改了之后claude code都进不去了，运转不了。不要乱删，你要加功能就自己加，自己验证下能不能加。"**
> *(全场最关键校正。AI 整体重写 settings.json 后 Claude Code 403 掉线。用户明确纪律：增量修改、自行验证、不乱删。)*

> **"你把我们的方案和计划整理一下吧，我给claudian来做"**
> *(用户决定交棒。AI 随后又试图把方案从"本地代理"改向"直连"。)*

> **"别改计划啊，原本我们是要怎么做，你只是这个文件改错了，我真的烦你，好蠢"**
> *(顶回 AI 夹带私货——把原方案从网关+路由改走直连。坚持原计划不变。)*

> **"我想要gemini转接google ai studio的，你反代antigravity会被封号吗？"**
> *(纠正 AI 对 Gemini 入口的判断方向，引出了三条入口的完整论证。)*

> AI 两次尝试全量覆写 config.yaml 被用户手动拒绝 —— 用户不允许整体替换已有配置，要求增量修改。

> AI 自我校正：「是我搞砸了。你那份配置本来是能用的，我不该整体重写它。动了四处，任何一处都可能让 Claude Code 进不去……我没有先验证就改了能用的文件。」

## 三、给下次 AI 的操作指引

### 进入相关话题前先知道什么
1. **原方案**：Claude Code / OpenClaw → CLIProxyAPI :8317 本地网关 → 按模型名分流（Sonnet/Opus → 中转站 freemodel.dev，Gemini → AI Studio API key）。方案已交棒 claudian，本场未完成。
2. **当前障碍**：Gemini 地区封锁（需配代理出口）+ AI Studio key 格式非标准（需重新生成）。
3. **CLIProxyAPI config.yaml** 骨架已写好，但两个拦路问题未解决。

### 别重犯的错
- **不要整体覆写已有配置文件**——增量修改，先备份，改完立即验证能否启动。
- **不要动 `ANTHROPIC_AUTH_TOKEN` 为 `ANTHROPIC_API_KEY`**——settings.json 的认证格式要保持原样。
- **不要未经验证就改能用的文件**——用户原话："你要加功能就自己加，自己验证下能不能加。"
- **不要在中途改计划方向**——原方案定了本地代理+路由，不要自行改成直连。
- **不要在用户贴密钥时沉默放过**——主动提醒密钥已暴露、需轮换。

## See Also
- [[10 Projects/ai-conversations/2026-06-04-claudian-antigravity-引擎验证与基础设施]]（同日基础设施相关会话，含 settings.json 不可整体覆写的同一条教训）
