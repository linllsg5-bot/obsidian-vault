---
session: 2026-06-26
participants: 小林, claude, codex, antigravity
type: session-index
原版: "[[raw]]"
source: agent
---

# 索引：系统断连排查与当前主线更新

> 接替 Claude Code CLI 因中转站连接中断而未完成的归档任务。

## 一、这次对话产出了什么

### 1. 基础设施与排查落地
- **断连根因定位**：排查并确证了 Claude Code CLI 反复触发 `Connection closed mid-response`、`403 This service is restricted...` 以及 `503 Service Unavailable` 的核心机制，均指向共享中转站 `cc.freemodel.dev` 高峰期连接超时及退回非流式模式被拦。
- **劫持链路解除**：查出本地 `cache-fix` 代理（v4.1.0）在 `:9801` 持续监听并劫持请求，造成额外的故障单点，已由 `(antigravity)` 主动停止该进程。

### 2. 接手对话归档作业
- 全面检索了 `.claude/projects/`、`opencode.db` 及 `.codex/sessions/` 的跨平台数据记录。
- 提取并沉积了 06-25~26 有关《AI/当前主线》与系统断连的最新会话原文（见 [[raw]]），弥补了本地缺失的记录真空。

---

## 二、给下次 AI 的操作指引

1. **重型分析下移**：Claude Code CLI 通过中转站 API 交互时对长时间扫描和长文本传输极易断流，凡涉及大跨度的文件分析、SQLite 读取与会话归档，转交 `antigravity` 执行。
2. **纯粹代理环境**：维持 `settings.json` 直连，避免启动附带额外包裹的本地转发（如 9801 端口代理）。

---

## See Also
- [[10 Projects/_状态板]]
- [[AI/当前主线]]
- [[AI/执行协议]]
