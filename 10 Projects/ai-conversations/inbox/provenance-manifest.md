---
type: provenance-manifest
project: Cognos
date: 2026-08-14
status: active
---

# Provenance Manifest: 2026-08-13 ~ 08-14 会话全量来源与拓扑

> 本清单用于理清各会话的**物理真实源（Durable Source）、可读投影（Projection）、跨平台转述关系与认知地位**，避免将同一发生的多次转述当作独立证据。

---

## 1. 核心会话全量元数据清单 (Session Registry)

| 编号 / 标识 | 物理来源路径 (Source File) | 大小 / 完整哈希 (MD5 & SHA-256) | 发生时间 | 可读投影文件 (Projection) | 来源角色与性质 | 归档地位 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`GPT-Share-A`** | `https://chatgpt.com/share/6a7d64e2-7d8c-83e8-9b10-5d6cb3416f5a` | 186 消息 / 569,149 字节<br>`MD5: 7973b3dac4debba02157f2fea5a48771`<br>`SHA256: 9bd170868f39c7f87c28f75e62c247e241793b41e81d0d1099ed6f59b05607eb` | 2026-08-13 ~ 14 | `10 Projects/ai-conversations/2026-08-13-gpt-Cognos贯穿性主体扩张与空无架构/raw-分享页.md` | **认识论主轴 Primary Source**<br>（主体扩张、空无、视角自指、前语言通道映射、判断/透支终局） | **正式归档 (ex.4)** |
| **`0fa98780e31d`** | `C:\Users\lnp\.codex\sessions\2026\08\13\rollout-2026-08-13T03-02-56-019ff75b-3128-7ed3-8058-0fa98780e31d.jsonl` | 9,076,067 字节<br>`MD5: ee0e73f648c1818459e434f8dab6ada2`<br>`SHA256: e886b0571f087e9d98082b49ff05ef4bf9b2e3dc5ee46bd109f170cc989187e2` | 2026-08-13 03:02 | `10 Projects/ai-conversations/2026-08-13-codex-Cognos巨量工程日志/session-019ff75b-readable.md` | **工程主轴 Primary Source**<br>（Phase 0B 运行时开发、小林现场实现纠正、外部评价 Agent 1~2 波） | **正式归档 (ex.5)** |
| **`a613b3c145bf`** | `C:\Users\lnp\.codex\sessions\2026\08\14\rollout-2026-08-14T01-13-21-019ffc1d-38bf-7152-866c-a613b3c145bf.jsonl` | 2,862,288 字节<br>`MD5: 8115db9a9e228f269a0dba54ed423dcc`<br>`SHA256: 486d6cd4ad1799625e516fe3120a1b7320ad39486627882913d50d937fdc88fc` | 2026-08-14 01:13 | `10 Projects/ai-conversations/2026-08-13-codex-Cognos巨量工程日志/session-019ffc1d-readable.md` | **工程主轴 Primary Source**<br>（Phase 2 最小沟通发生场 Web 竖切落地、单 turn 并发与 JSONL 存储） | **正式归档 (ex.5)** |
| **`d40c1a5a963b`** | `C:\Users\lnp\.codex\sessions\2026\08\13\rollout-2026-08-13T20-37-47-019ffb20-f0b0-7d31-b5ac-d40c1a5a963b.jsonl` | 969,934 字节<br>`MD5: 8c3664255c64680133888fd2e1452cfc`<br>`SHA256: 1b06bd6e17721e67f2032c0e0d87a9ef8ae7330fcfbb0df2c7733bc991ed3656` | 2026-08-13 20:37 | `10 Projects/ai-conversations/inbox/codex-projection-d40c1a5a963b.md` | **转述/同步节点 (Secondary Bridge)**<br>（小林手工搬运 GPT 讨论至 Codex 的跨平台同步桥） | **Inbox 暂存** |
| **`2f6b1959e6e7`** | `C:\Users\lnp\.codex\sessions\2026\08\14\rollout-2026-08-14T03-01-49-019ffc80-891c-7021-bf2b-2f6b1959e6e7.jsonl` | 1,203,442 字节<br>`MD5: 13431913874b38c03c1221d3b6c401c9`<br>`SHA256: 3a05e01bd63a3756f989618eb4f5b7cb30e5544ea097a948df687e0300fb89d1` | 2026-08-14 03:01 | `10 Projects/ai-conversations/inbox/codex-projection-2f6b1959e6e7.md` | **工程协作与状态同步 (Secondary Bridge)**<br>（关于 Vault 文件状态、断点恢复与清理的讨论） | **Inbox 暂存** |
| **`56f99d2fbe5d`** | `C:\Users\lnp\.codex\sessions\2026\08\13\rollout-2026-08-13T14-28-52-019ff9cf-2f0e-7531-887a-56f99d2fbe5d.jsonl` | 780,045 字节<br>`MD5: 15d90a03f73be3a9eb721cfef55e2a4c`<br>`SHA256: 2ad21effb8dd2d07ab0af83b6e9bc7c0815d3db68663f41edee672b648fbf414` | 2026-08-13 14:28 | `10 Projects/ai-conversations/inbox/codex-projection-56f99d2fbe5d.md` | **任务接续与继承 (Secondary Bridge)**<br>（承接前序 Session `019ff752...` 的断点工程讨论） | **Inbox 暂存** |

---

## 2. 来源拓扑与转述关系 (Provenance Topology)

```text
[GPT Web 会话 (ex.4)] ──(小林手工作为 Context Builder 搬运)──> [Codex 会话 d40c1a5a963b / 0fa98780e31d]
                                                                        │
                                                      (工程实现现场纠正与架构追问)
                                                                        ↓
                                                         [Codex 工程发生 (ex.5)]
                                                                        │
                                                         (断点恢复与多轮继承)
                                                                        ↓
                                                   [Codex 后续会话 a613b3c1 / 2f6b1959]
```

### 关键证据边界判定：
1. **GPT → Codex 的概念搬运**：Codex 中关于“主体突破、空间持续”等认知论讨论，确认为对 GPT (ex.4) 的转述与工程映射，**不作为独立一手哲学证据重复计入**。
2. **Codex 现场纠正的一手性**：小林在 Codex 会话中针对代码实现、架构设计、界面呈现的直接追问与纠正（如“这是要做什么？模拟沟通吗？”），**属于该工程会话的一手真实发生**。

---

## 3. 投影可复核声明 (Projection Reproducibility Statement)

- **定位**：可读投影（Projection）是在解析规则过滤下的衍生文本，旨在提供结构清晰的人类与 AI 共同可达视图，**不是原始真相源的替代品**。
- **可复核性**：提取解析脚本已归档于 `10 Projects/ai-conversations/scripts/`。任何人可随时依据物理源 JSONL 重新运行脚本进行双向哈希与内容复核。
- **过滤与保留规则**：详见 [[10 Projects/ai-conversations/2026-08-13-codex-Cognos巨量工程日志/projection-policy]]。

---

## 4. 耐久独立私有冷备 (Durable Private Cold Backup)

- **安全边界**：本地 `~/.codex/sessions/*.jsonl` 包含真实绝对路径与潜在环境敏感信息，**严禁提交至公开代码仓库**。
- **冷备机制**：已建立独立的本地私有冷备脚本 `scripts/backup_codex_sessions.py`，将会话全量备份至独立归档目录（如 `~/.codex-archive/`）并生成校验哈希清单，与 Git 工作区物理隔离。


