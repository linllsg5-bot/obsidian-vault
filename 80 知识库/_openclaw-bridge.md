# OpenClaw Bridge ← Vault → OpenClaw

> 这个文件是 **vault → OpenClaw 的单向投递箱**。
> 想喂给 OpenClaw memory 的内容 append 到下面。OpenClaw daemon 定期扫这里。

---

## 规范

**写入方（vault 这边 / Claudian / 你自己）**：
- 只 **append**，不修改/删除已有段落
- 每段开头带时间戳 `## 2026-05-26T10:30`（ISO 8601，本地时间）
- 内容可以是：决策、洞察、协议变更、新规则、想让 OpenClaw"记住"的事
- 不要写 vault 本来就有的内容（重复无意义）；只写"OpenClaw 应该知道的新事"

**读取方（OpenClaw daemon）**：
- 周期扫这个文件（建议 10 分钟）
- 跳过已带 `<!-- consumed: ... -->` 注释的段落
- 读完后**只在文件末尾追加 consumed 注释**，不修改任何文段
- 把内容 ingest 进 memory-core 后，按 OpenClaw 自己的 dreaming/embedding 流程处理

**失败安全**：
- daemon 挂了：文件就是普通 markdown，你随时能看
- 读重了：consumed 注释让它跳过
- 读错了：vault 这边内容不被改，你能回看原文

---

## 投递日志

<!-- 时间戳格式：## 2026-05-26T10:30 -->
<!-- consumed 注释：<!-- consumed: 2026-05-26T10:45 --> -->

(空。第一条决策/洞察 append 到这里。)
