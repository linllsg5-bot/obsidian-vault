# OpenClaw Log ← OpenClaw → Vault

> 这个文件是 **OpenClaw → vault 的单向投递箱**。
> OpenClaw 做的动作、新形成的洞察、autonomous 行为的产出，append 到这里。
> **append-only**，OpenClaw 永远不修改 vault 任何其他文件。

---

## 规范

**写入方（OpenClaw daemon / agency_engine / 各 agent）**：
- 只 append，不修改/删除已有段落
- 每段开头带时间戳 + agent 标识 `## 2026-05-26T10:30 [main]` / `[coder]` / `[agency-engine]`
- 内容类型：
  - 任务完成报告
  - autonomous 决策记录
  - 新形成的洞察 / dreaming 输出
  - 错误 / 异常 / 需要人工注意的事
  - 跟用户尝试 / 项目相关的状态变化

**读取方（你 / Claudian）**：
- 你周期翻阅，发现有价值的内容 → 用 ingest 流程消化进 80 知识库主题目录
- 消化后可在该段末尾加 `<!-- digested: 2026-05-26T11:00 → 80 知识库/X -->` 标记
- 旧的、已 digest 或确认无用的段落，可定期归档到 `80 知识库/_openclaw-log-archive-YYYY-MM.md`

**失败安全**：
- 日志膨胀 → 月度归档，保持本文件可读
- OpenClaw 写崩了 → vault 完全无感知，daemon 重启后从新位置 append
- 你不看 → 内容沉底，不影响任何其他 vault 操作

---

## 日志

<!-- 时间戳格式：## 2026-05-26T10:30 [agent-name] -->
<!-- digested 注释：<!-- digested: 2026-05-26T11:00 → 80 知识库/X/Y.md --> -->

(空。第一条 OpenClaw 投递到这里。)
