# CLAUDE.md — Claude / Claudian 自动入口

> 这是 Claude Code / Claudian 可能自动读取的文件。
> 它只负责把模型导向真正的协议层，不在这里复制协议内容。

---

## 第一动作

每次会话开始，在回应用户之前：

1. 读取 `AI/加载路径.md`
2. 严格按其中当前的核 / 壳 / 引用层规则加载
3. 读取 `AI.md` 仅当任务需要 vault 特异规则（知识库 ingest/query/lint、领地划分、Pre-AI 区、OpenClaw bridge）
4. 若需要项目连续性，读取 `10 Projects/_状态板.md`

不要在本文件维护核文件清单。核层文件只以 `AI/加载路径.md` 为准。

---

## Source of Truth

| 层 | 位置 | 地位 |
|---|---|---|
| 跨 runtime 协议活源 | `AI/` | 唯一协议源，由 `AI/加载路径.md` 引导 |
| Vault 桥接规则 | `AI.md` | vault 特异规则，不是核心协议源 |
| 项目连续性 | `10 Projects/_状态板.md` | 当前项目状态与下一步 |
| 历史档案 | `70 素材/AI 架构/OpenClaw 工作区/` | 只读历史材料 |
| 查阅镜像 | `80 知识库/AI 架构/素材/` | 消化版素材，不作为改动目标 |

协议改动只改 `AI/` 活源；vault 操作边界只改 `AI.md`；项目状态只改 `10 Projects/_状态板.md`。
