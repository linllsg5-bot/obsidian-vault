---
type: projection-policy
project: Cognos
date: 2026-08-14
status: active
---

# Codex 会话可读投影规则 (Projection Policy)

> 本文件说明原始 `.jsonl` 会话日志转换为 Vault 可读投影（`session-*-readable.md`）时的具体过滤与保留规则，供后续主体（Human / AI）复核可读性与来源完整性。

## 1. 为什么 8.66 MB 会变成 ~140 KB？

原始 Codex 日志（JSONL 格式）是完整的运行时事件流，其中绝大多数体积由以下**非语义/协议通信开销**构成：
- **JSON-RPC 信封与 ID 映射**：每个数据包的包装头、序列号、通信状态位。
- **高频内部状态树 (State Snapshots)**：编辑器光标位置、文件树增量变化、上下文缓存命中率等中间心跳。
- **重复的 System/Developer Context**：每次模型调用重复携带的完整系统提示词快照。
- **Token 计费与 Telemetry 数据**：每轮的精确输入输出 token 统计、延迟指标。

可读投影的目标是：**保留所有真实发生的交互、行动与环境反馈，剥离机器级通信信封。**

## 2. 明确保留的事件类型 (Retained)

| 事件类型 | 投影呈现格式 | 为什么保留 |
| :--- | :--- | :--- |
| **`USER` 消息** | `### [USER]\n...` | 用户的一手指令、提问与架构现场纠正 |
| **`ASSISTANT` 可见回复** | `### [ASSISTANT]\n...` | 模型向用户输出的正式回复、设计分析与解释 |
| **`DEVELOPER` / System 指令** | `### [DEVELOPER]\n...` | 影响模型行为的关键环境上下文定义 |
| **`TOOL_CALL` (工具调用)** | `### [TOOL CALL: function_name]\n...` | 实际发生的代码修改、终端命令、文件读取行为及入参 |
| **`TOOL_RESULT` (工具执行结果)** | `### [TOOL RESULT]\n...` | 命令 stdout/stderr、测试通过/失败、文件写入结果 |
| **`ERROR` / 异常中断** | `### [ERROR]\n...` | 运行时崩溃、超时、断连或异常退出记录 |

> **可复核性声明 (Reproducibility Statement)**：
> 1. 本投影由特定规则的解析脚本自动化生成，未对保留事件的正文做任何二次模型总结、缩略或改写。
> 2. 但由于解析规则对事件类型进行了显式过滤，投影**代表的是特定规则下的视图，不能等同于物理原始源**。
> 3. 产生本投影的完整 Python 解析脚本已归档至 `10 Projects/ai-conversations/scripts/`，任何后续主体均可随时依据本地物理 JSONL 重新运行脚本进行双向复核。

## 3. 明确过滤的事件类型 (Filtered)

- 纯通信心跳（ping/pong, progress events without output）
- 重复的客户端内部状态持久化 dumps
- 纯 UI 渲染相关的元数据标记
- 未产生任何文本、调用或状态改变的空事件

## 4. 提取脚本归档 (Archived Extraction Scripts)

| 脚本路径 | 用途 | 输入源 |
| :--- | :--- | :--- |
| `10 Projects/ai-conversations/scripts/extract_codex_projection.py` | Codex JSONL 投影解析器 | 本地 `~/.codex/sessions/*.jsonl` |
| `10 Projects/ai-conversations/scripts/extract_gpt_share.py` | ChatGPT 分享页 Turbo-Stream 解析器 | ChatGPT 公开分享页 URL / HTML |

## 5. 原始 JSONL 的耐久私有保存原则 (Durable Source Layer)

- **物理位置**：本地原始会话日志持久存储于 `C:\Users\lnp\.codex\sessions\`。
- **隐私与安全边界**：原始 `.jsonl` 包含本地环境绝对路径、临时环境变量、Git 配置等敏感数据，**严禁直接提交至公开 GitHub 仓库**。
- **归档层级关系**：
  $$\text{Durable Private JSONL (物理真实源)} \xrightarrow[\text{归档脚本}]{\text{Projection Policy}} \text{Vault Readable Markdown (共享可读投影)} \xrightarrow{\text{Epistemic Tagging}} \text{认识史 / 当前架构}$$

