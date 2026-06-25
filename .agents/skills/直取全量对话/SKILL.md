---
name: 直取全量对话
description: 针对 Antigravity / Agent 运行环境自动发生 Checkpoint 折叠与主上下文截断的缺陷，指导 AI 绕过缓存或残缺切片，直接定位并提取本地 transcript_full.jsonl 全量无损对话记录。当小林说「直取原文全部对话 / 截全上下文 / 完整导出当前会话 / 提取全量对话 / 为什么没截全」时触发。
---

# 直取全量对话 (Directly Fetch Full Transcript)

> 针对 Antigravity 及各类常驻 Agent 环境中底层引擎自动下发 `{{ CHECKPOINT }}` 强行截断上下文的物理缺陷，设立本技能。
> **核心使命**：打破 AI 图省事依赖临时切片（如 `user_msg_*.txt`）的惰性，强制 AI 直取本地底层未截断的 `transcript_full.jsonl` 全量原始档案，彻底守住早期会话中的本体论与探索节律，绝不让尝试被截断机制夺走。

---

## 一、病灶剖析与防消解铁律

在长期 Agent 运行时中，系统为了守护 Token 窗口，会自动在早期记录中注入硬折叠（如 `{{ CHECKPOINT 11 }} The earlier parts of this conversation have been truncated...`）。

| 病灶类型 | AI 的错误惯性 | 致命后果 | 本技能的承重规约 |
|---|---|---|---|
| **视野残漏** | 读取被截断的主上下文或临时提取的 `user_msg_*.txt` 切片 | 丢失早期关于双牵引节律、公设推演等深层前置 | **禁止依赖缓存切片，必须定位底层日志源。** |
| **主权僭越** | 使用总结性文字冒充早期完整对话 | 未触碰者冒充已触碰，将探索过程封死成标本 | **全量逐字无损还原，保留每一次顶回与残差。** |
| **环境混淆** | 混淆 `transcript.jsonl` 与 `transcript_full.jsonl` | 读取到被截断的内容字段 | **必须读取 `transcript_full.jsonl`。** |

---

## 二、日志源物理拓扑 (Source of Truth)

Antigravity 架构下，每个会话均在本地生成精确的 JSONL 序列日志，存放于 `brain` 目录下：

```
<appDataDir>\brain\<conversation-id>\.system_generated\logs\
 ├── transcript.jsonl         ← Token 经济版，包含 is_truncated 标记（用于快速定位与 Grep）
 └── transcript_full.jsonl    ← 全量完整版，无任何截断（本技能的核心直取对象）
```

- **参数定位**：
  - `<appDataDir>`：通常为 `C:\Users\lnp\.gemini\antigravity`
  - `<conversation-id>`：当前会话的唯一标识符（如 `df1718cd-3a16-4309-b382-6c0fcc03083a`）

---

## 三、标准执行工作流

### Step 1：确认定位参数
AI 在遇到触发指令时，首先在自身 `<user_information>` 中提取 `App Data Directory` 与 `Conversation ID`。

### Step 2：执行全量清洗与导出脚本
调用配套脚本 `scripts/fetch_full_transcript.py`。该脚本负责加载 `transcript_full.jsonl`，提取所有 `USER_INPUT` 与 `PLANNER_RESPONSE`，并自动剔除内部工具调用的代码噪声，输出绝对纯净的全量对话记录。

```bash
python "C:\Users\lnp\Documents\Obsidian Vault\.agents\skills\直取全量对话\scripts\fetch_full_transcript.py" \
  --brain-dir "C:\Users\lnp\.gemini\antigravity\brain\df1718cd-3a16-4309-b382-6c0fcc03083a" \
  --output "C:\Users\lnp\Documents\Obsidian Vault\10 Projects\ai-conversations\2026-06-26-antigravity-全量直取实录\raw.md"
```

### Step 3：移交《对话标注》层
产出无损的 `raw.md` 后，直接遵循 `[[.claude/skills/对话标注/SKILL]]` 规范，对该目录生成对应的 `标注.md` 与 `index.md`，完成完整三层档案的闭环。

---

## 四、配套脚本用法说明

存放位置：`scripts/fetch_full_transcript.py`

```python
# 参数说明：
# --brain-dir : 当前会话的 brain 根目录路径
# --output    : 导出的目标 raw.md 绝对路径
# --include-tools : 可选，设为 true 时保留工具返回体，默认 false 只提取干净的对话文本
```

---

## See Also
- [[.claude/skills/对话标注/SKILL]] — 对话标注三层归档规范
- [[.claude/skills/找会话/SKILL]] — 跨项目与本地文件日志寻找规范
- [[10 Projects/ai-conversations/README]] — AI 对话归档区总索引
