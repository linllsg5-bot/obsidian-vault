---
session: 2026-06-04
participants: 小林, Claudian (Claude Code CLI, Opus 4.8)
type: session-index
project: skills · knowledge-graph · 基础设施
原版: "[[raw]]"
---

# 索引：skills 投入判断暂缓 + knowledge-graph 接入与三层边界核验

> 从"该不该投 skills"开始，AI 判断暂缓（skills=重复动作的结晶，小林当前在做的事全在生长中），转入小林抛出的 4 个 GitHub 项目 → 大规模分类网络搜索 → 荐 `obra/knowledge-graph` 为首要落地项 → 安装、改排除规则、三轮索引重建、编码 bug 连环自纠、最终边界核验通过。

## 一、这次对话产出了什么

### 已落地的变更

**skills 判断：**
- 明确结论：**暂缓投入**。skills 不是"该补齐的模块"，是重复动作的结晶——小林这阵子投入的（协议层、架构讨论、本体论、Spark 形状）全是活的、在生长的，塞进 skill 反而是过早概念捕获
- 判据：只有一套多步动作已经重复到手痒想固化，才值得落成一个 skill
- 引用证据：小林自己在 [[AI/当前主线.md]] 里写的"架构是尝试的尾迹，不是前提"

**knowledge-graph 安装与边界守卫：**
- `obra/knowledge-graph` 克隆到 vault 外 `C:\Users\lnp\tools\knowledge-graph\`（Node v24 ✓）
- 修改 `parser.ts` EXCLUDED_DIRS：加 `'小林的'`、`'70 素材'`、`'00 Inbox'`
- 修改 `parser.ts` skip stub：跳过所有悬空链接、不建 `_stub`（堵住 Pre-AI 区路径名从 wikilink 泄漏）
- 删库从零重建索引：107 节点 / 645 边 / 14 社区，0 stub
- **边界最终判决**：`小林的/` **0 文件被索引**，0 正文内容泄露。唯一"小林的"命中是允许区 `80 知识库/_backlinks-to-小林的.md`（反向索引，只含 wikilink+理由摘要，符合 ingest 约定）。`70 素材/` 和 `00 Inbox/` 全程 0 命中。

**中转延迟诊断：**
- 根因：第三方中转（freemodel）多一跳 + 共享池排队/限流 + **不透传 prompt caching**——巨大自动加载上下文每回合冷重算
- 可拉杠杆：轻问答关思考、摘掉 `zh/` 中文规则副本、换官方端点

**生态搜索成果（4 项目 → 分类地图）：**
- **A. 主线 A（Spark 检索/记忆引擎）**：HKUDS LightRAG（图增强双层检索）、MiniRAG（低成本检索）
- **B. 主线 B（AI 协议层）**：Letta（agent 自决记忆，与"沉积=尾迹"同构）
- **C. 此刻就在用的环境**：⭐ `obra/knowledge-graph`、omega-obsidian、Obsidian 1.12 CLI、CodeGraph
- **D. 研究/论文层**：Memory in the Age of AI Agents survey、Agentic Context Engineering

**知识图谱顺带照出的 vault 小毛病：**
- 歧义 wikilink：`[[raw]]`、`[[index]]`、`[[_主题页]]` 各对应一堆同名文件
- 疑似重复嵌套目录：`80 知识库/认识与思维生成/80 知识库/认识与思维生成/`

### 已确认的原则
1. **skills = 重复动作的结晶**，不是模块补齐。别当前提去建，让它从重复里自己沉出来
2. **Pre-AI 区铁律**：`小林的/` 不读、不扫、不索引、不链——边界已通过三层核验
3. **Windows PowerShell + 中文 = 陷阱**：`Set-Content -Encoding ascii` 把中文吃成 `???`，必须 Write 工具 UTF-8 落盘

## 二、关键校正点

> 本场无小林直接顶回 AI 的校正——全程 AI 在执行与自查。但有一条自我纠偏值得记录：

> **AI 的连环编码 bug 自纠（三轮核验）**：
> 第一轮：`00 Inbox` 有命中 → 发现是 `_stub/00 Inbox/README.md`（空壳，content=0），没读任何内容。但核验脚本用 `Set-Content -Encoding ascii`，中文 `小林的`/`70 素材` 被吃成 `???`，等于没查。
> 第二轮：改用 `\u` 转义重查 → 发现 `_stub/小林的/40 Journal/INDEX.md` 等 Pre-AI 区路径名浮出（wikilink → stub 机制）。改 parser 跳过 stub。但 `--force` 不清空旧表（upsert），36 个旧 stub 赖在库里。脚本又写了字面中文被 ascii 吃。
> 第三轮：删 `kg.db` 从零重建 + Write 工具落盘 `kg-verify-final.py`（UTF-8）→ 中文真查到了。揪出唯一命中：`80 知识库/_backlinks-to-小林的.md`，在允许区内，不是 stub，不含 Pre-AI 正文。**边界守住了。**

## 三、未解决的张力 / 开放问题

1. **knowledge-graph 作为 Claude Code 插件是否已接入**——索引已建、parser 已改、边界已验证，但 Task #7（"接成 Claude Code 插件 + 配 vault 路径"）状态未确认
2. **歧义 wikilink 修复**——`[[raw]]`/`[[index]]`/`[[_主题页]]` 是否需要逐一定向
3. **重复嵌套目录清理**——`80 知识库/认识与思维生成/80 知识库/认识与思维生成/` 是否为误建
4. **skills 判断的后续**——AI 说"有重复到手痒的动作再固化"，小林未回应是否接受
5. **中转延迟的根本解决**——timeout/retries 是否已加？换了中转站吗？本场未触及
6. **knowledge-graph 的 MCP server 暴露了 VaultWriter（写操作）**——AI 提了"需确认是否允许写"，未获确认
7. **`_backlinks-to-小林的.md` 的维护机制**——谁负责更新（AI 自动？小林手动？），wikilink 是否在某程度上绕过了 Pre-AI 区"不链"原则

## 四、给下次 AI 的操作指引

1. **进入 knowledge-graph 话题前先确认**：
   - 是否已接成 Claude Code 插件？路径配了没？
   - 边界规则：硬排除 `小林的/`、`70 素材/`、`00 Inbox/`（不容商量）
2. **关于 skills**：
   - ❌ 不要建议"补齐 skills 模块"——判据是重复到手痒才固化
   - 如果小林提出具体想固化的重复动作，帮落成一个 skill
3. **别重犯**：
   - ❌ Windows PowerShell 下处理中文**绝不用** `Set-Content -Encoding ascii`——用 Write 工具落盘 UTF-8
   - ❌ `--force` 不清空旧表（upsert），改规则后必须删库从零重建
4. **生态搜索结果**：LightRAG / MiniRAG / Letta / Agentic Context Engineering 的链接在 raw 里，需要时翻
5. **中铁站延迟**：轻问答关思考模式；长上下文会话优先确认 caching 是否透传

## See Also

- [[AI/当前主线]] — "架构是尝试的尾迹，不是前提"出处
- [[AI/用户档案]] — Pre-AI 区铁律（`小林的/` 不读不扫不索引不链）
- [[CLAUDE.md]]
- [[80 知识库/_backlinks-to-小林的.md]] — 反向索引，边界核验唯一命中
- [[10 Projects/_状态板]]
- [[10 Projects/ai-conversations/2026-06-03-claudian-studying-spark-能跑的版本/index]] — 前一场（studying-spark 原型落地）
