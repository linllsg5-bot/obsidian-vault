---
session: 2026-06-06–06-17
participants: 小林, Claudian
type: session-index
原版: "[[raw]]"
---

# 索引：studying-spark — 从 Phase 0 迭代到 Phase 1 leakage judge，全程反复崩溃中推进

> 这不是摘要。这是一份尾迹。

## 一、这次对话产出了什么

- **MATERIAL_PROMPT 修复**：survey dump（摊开地图综述）→ 几扇门（名字+一句吸引力）
- **v4 文档重写**：叠写纸 → 干净 Part A-E 架构
- **四本能引擎**：本能零·照亮（v2 双重照亮平反） + 本能二·开展 + 风格分层（粒度上调）
- **笔记双栏 UI**：左对话 | 右笔记，草稿区 AI 实时读
- **opencode UA 修复**：Gemini key 被 Google 标记泄露后，search.py 加浏览器 UA 绕过 Cloudflare 1010
- **contact-finder A/B 分流**：单概念→抛谜 / 要地图→照亮
- **Phase 1 leakage judge + 反 funneling 代码写入**：`LEAKAGE_JUDGE_PROMPT` + `_judge_reply()` + 反 funneling 铁律 — 已写入但**从未通过编译测试**
- **cache-fix 机理确认**：Anthropic 2026-03-06 静默将 TTL 从 1h 改为 5min；cache-fix normalize microcompact sentinel；proxy.py 注入 cache_control

## 二、关键校正点

- 「6.5 index 没写好」—— 小林点名
- 「创造来自阻力不跨域进 studying-spark」—— 小林明确切分
- 「你自己又搞砸了」—— 缓存链路 BASE_URL 改来改去反复无常
- 「你会顺着我些 / 节奏亦步亦趋 / 展开太简短」—— 三记精确定位，驱动后续所有 prompt 重写
- 「语言不也是被塑造的吗？在尝试里」—— 顶回拉康符号秩序封死框架
- 「共时性是一种觉察、注意」—— 收回荣格形而上主张，回到现象学
- 「不可能全是他者吧，自己也可以化作他者」—— 顶回 Bion α 功能的外部垄断
- 「Gemini key 泄露，opencode key 换过了」
- 「缓存一直写入，没有缓存命中」—— 从体验角度驱动整个 cache 调查
- 「别走代理」—— 区分 CCR 被封 vs cache-fix 透传不被封

## 三、给下次 AI 的操作指引

1. **Phase 1 代码验证**：`LEAKAGE_JUDGE_PROMPT` + `_judge_reply()` 已在 `prompts.py` 和 `search.py` 中，编译从未通过，端到端拦截从未实测。优先编译验证 → 构造翻底牌测试 → 确认 judge 判定和修正输出
2. **cache-fix 代理验证**：确认代理启动后确实产生缓存命中（TLDR: 1h TTL 是否生效）
3. **密钥状态确认**：opencode key 是否已被轮换；Gemini key 已死
4. **Claudian 插件是否需要更新**：上次小林问过，claudian 说"从外面看不到版本"
5. **Phase 1.5 多模型全双角色编排**：诘问者+陪伴者+仲裁 — 需要多模型路由，推迟到此阶段

## See Also

- [[v4 文档]]
- [[四本能 prompt]]
- [[链接引擎]]
- [[.claude/skills/对话标注/SKILL]]
- [[2026-06-18-claudian-Phase1-leakage-judge续场/index]]
