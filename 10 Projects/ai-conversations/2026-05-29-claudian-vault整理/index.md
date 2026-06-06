---
session: 2026-05-26 ~ 2026-05-29
participants: 小林, Claudian (Claude Code, Sonnet 4.6 / Opus，中途换账号切模型)
type: session-index
project: vault 整理 / Claudian 知识库体系
原版: [[raw]]
---

# 索引：Vault 大整理 + 知识库体系成形（2026-05）

> 这不是摘要。这是一份尾迹：保留了这次会话做了哪些结构决策、小林在哪些点上校正了方向、确立了哪些 vault 规则和它们的由来。
> 下次 AI 进入 vault 操作前**先读这个**。规则的最终落地形态见 [[AI.md]]（本会话里它还叫 `CLAUDE.md`），决策**为什么**这么定在这里。需要逐字细节去读 [[10 Projects/ai-conversations/2026-05-29-claudian-vault整理/raw]]。

> ⚠️ 命名漂移提醒：本次会话从头到尾操作的是 `CLAUDE.md`。后来它被重构成了 vault 根的 [[AI.md]] + `AI/` 协议目录（[[AI/加载路径]]、[[AI/身份基底]]、[[AI/对话姿态]] 等）。本 index 里凡说"写进 CLAUDE.md"，对照现在的形态就是 `AI.md` 那套。

---

## 一、这次对话产出了什么

这是一个跨度很长、分五段推进的操作型会话。从"整理 88 个堆积文件"开始，滚到"评估买来的 Claudian 指南"，再到"审整个 vault 架构 + 建 OpenClaw 桥 + ingest 一整套 AI 架构文档"，最后落到"克隆第二个工具 + 撞上额度/流程的现实墙"。

### 段一：把"未命名"分流（vault 整理本体）
- **关键发现**：计划书里写的 `未命名/` 实际上是 `小林的/`，`20 Long Threads/` 在它内部——执行前先读文件纠正了计划的错误前提。
- 新建四个分区：`30 Creative/`、`40 Journal/`、`50 Learning/`、`60 People/`，各带 INDEX.md。
- 88 个文件按内容逐一读 → 分流：30 Creative 26 篇、40 Journal 33 篇、50 Learning 23 篇。
- 重命名两个 `未命名 N.md`：→ `幻生蝶梦·总篇.md`、`水与大地（诗）.md`。
- 重复文件处置：`问题识别与问题结构 1.md`（有关联笔记）留作主版本，旧版进 Trash；LILY 三件（正文/笔记/总纲）**全留**，互补不是重复；空文件 `《六姐妹》.md`、`泠泠冷冷.md` 进 Trash。
- 移动时全库扫 `[[wikilink]]` 更新引用。发现 5 个 `[MISSING]` 断链是**整理前就存在**的占位符，非本次造成。
- 建 `HOME.md` 作全库导航入口。

### 段二：评估买来的 Claudian 指南（一次否决）
- 小林贴进一份网上买的 "Claudian 知识库搭建指南"（Karpathy 方法论 + raw/wiki/assets 结构），问"你看完什么想法"。
- **Claude 的判断（被小林接受）**：这份指南是给**外部内容消化型**知识库设计的（吸文章/PDF → 提炼百科）；小林的 vault 是**个人内部生成型**（自己的创作/日记/思考）。两者结构需求不同。
- **否决 `raw/wiki/assets` 目录结构**——不要推倒刚建好的 30/40/50 体系重建。
- 保留指南里真正有用的三样：`raw/` 只读原则、`lint` 维护操作、`ingest/query/lint` 三动作心智模型、`CLAUDE.md` 作持久规则的理念。这些后来长成了 70 素材 / 80 知识库 体系。
- 一个被点破的讽刺：小林"付钱买了一份使用说明，但已经在用这个工具了"（正在用 Claudian 对话）。

### 段三：vault 架构审计 + OpenClaw 桥（确立核心规则，见第二节）
- 小林授权："可以，甚至你可以重新看看整个 obsidian 的架构"。
- 建两个 bridge 文件：[[80 知识库/_openclaw-bridge]]（vault → OpenClaw，append-only + consumed 标记）、[[80 知识库/_openclaw-log]]（OpenClaw → vault，append-only + digested 标记）。
- CLAUDE.md 三处更新：项目段重写（去 huansheng-tracker、加 prototype-spark、加 OpenClaw+Claudian 协作架构）、加 **Pre-AI 区规则**、加 **对话姿态 4 条**、加 **OpenClaw ↔ Vault Bridge 段**。
- 清理（小林点头 "ab 都听你的，123 可以"）：删空文件 `未命名.md`、删整个 `外部材料库/`（功能与 70 素材重复，里面只有 0 字节占位）、删 `70 素材/_关于.md`（规则已在 CLAUDE.md，single source of truth 不分散）。

### 段四：ingest 一整套 OpenClaw 架构文档
- 把 WSL 里 OpenClaw 的 `.md` 协议文档分 Tier 批量 ingest 进 `70 素材/AI 架构/`（原文 snapshot）+ `80 知识库/AI 架构/`（素材页 + 主题页）。
- 累计 19 篇 ingest：人格层 4（SOUL / PERSONA_KERNEL / COMPANIONSHIP_PROTOCOL / AUTO_AGENCY_SOUL）+ 架构层 5 + 路由/元认知/偏好层 8 + Tier 3 若干 + 知识图谱 App 独立主题。
- 中途按规则跑了一次 **lint**（自动修 2 处断链，计数归零）。
- 修两个 drift：`MEMORY.md`（愿景更新，见下方小林校正）、`MODEL_ROUTING_RULES.md`（Codex → Claude Opus，加"COMPANIONSHIP 姿态永远用 Opus"）。vault + WSL 双向 sync。
- 关键认知产物：vault 现有的"对话姿态 4 条" ≈ OpenClaw `COMPANIONSHIP_PROTOCOL`（500+ 行）的极度压缩版——证明小林"别两边重复造轮子"的直觉对了。

### 段五：克隆第二个工具，然后撞墙
- clone `prototype-spark` → `studying-spark`，改 prompts + 52 处 UI 文案（原型→卡点，枝桠→推演，跨媒介→跨领域）。
- **小林立刻校正**（见下方）：这不是改名能解决的，studying 和 writing 根本不同。
- 撞上额度现实：一次对话扣 ~2 美元，连 Sonnet 也贵。引出"设计在这里 / 执行去 OpenClaw"的分工流程讨论（未落地）。

---

## 二、确立了哪些 vault 规则，以及为什么

这些是这次会话沉下来的硬规则，现在都在 [[AI.md]] 里。这里记的是**它们的由来**。

### 1. Pre-AI 区（最重要的规则）
- **是什么**：`小林的/40 Journal/` 整区，对所有 AI（Claudian、OpenClaw daemon、ingest 扫描）默认不可见——不读、不扫、不索引、不链。只有小林主动喂入才进 AI 视野。
- **为什么**：源头是聊到"thought template homogenization"（Maggie Appleton）——AI 工具会把人逼向"AI 容易回答的问题"，远离"难回答但更重要的问题"。
- **由来的关键链条**：
  - Claude 说"vault 应该有一个区域是'先于 AI'的——你单独想、你自己写、AI 默认不读、不学。这个顺序对。反过来如果你先在 AI 里聊出想法再写进 vault，那个想法已经被 AI 的语言形状污染过了。"
  - **靠规则不靠注意力**："这给独立思考留一块真正干净的领地。比'我自己注意保持思考'更稳——因为靠注意力会累，靠规则不会。"
  - **30 Creative 不进 Pre-AI**：会话中 Claude 一度提议把 30 Creative 也设为 Pre-AI，但最终定调——创作是**产出物**，See Also 链过去有用；日记才是 raw thinking 的所在。只有 40 Journal 是 Pre-AI。

### 2. 领地划分（AI 权限分区）
| 区域 | 权限 | 由来 |
|------|------|------|
| `小林的/40 Journal/` | Pre-AI（默认不读） | 上面 Pre-AI 规则 |
| `小林的/` 其他（20/30/50/60） | **只读** | 小林的创作/长线/学习/人物，AI 可查关联，绝不改 |
| `70 素材/` | **只读** | 外部素材原文档案，发现错误在 80 里标注不动原文 |
| `80 知识库/` | **自由读写** | AI 维护的消化层 |
| `00 Inbox/`、`10 Projects/`、`HOME.md` | 只读（默认） | 小林自己管 |

### 3. 只读边界的由来
- `70 素材/` 只读原则直接借鉴自被否决的 Claudian 指南里**唯一值得留的设计**——"原始素材绝不被 AI 改动，保护第一手资料"。
- single source of truth 原则：删 `70 素材/_关于.md` 时确立——规则集中写在 CLAUDE.md，不要散落在各处冗余文件里。

### 4. OpenClaw ↔ Vault Bridge 架构
- **方向**（小林校正后定的，见下方原话）：vault 是 source of truth（慢层、沉淀、curated）；OpenClaw 是 runtime（快层、执行、记忆）。OpenClaw 的动作写进 vault，小林定期审 vault 决定什么回馈给 OpenClaw。
- **最小破坏面**：两个 bridge 文件 append-only，OpenClaw 只读 bridge 文件、不扫 vault 其他地方、读完只追加注释行。失败安全——daemon 挂了 vault 完全无感知，随时能停。
- **不互改**：双向都只 append / 追加注释，永不动对方既有内容。

### 5. 对话姿态 4 条（写进 CLAUDE.md，现 [[AI/对话姿态]]）
歧义 ≥2 先问、不靠生成显得有用、不漂亮地承认"不知道"、跟着用户的曲率走、想 vs 做要区分。来源是 OpenClaw `COMPANIONSHIP_PROTOCOL` + `DIALOGUE_REFERENCE_ANALYSIS_CLAUDE` 的蒸馏。

## 三、小林的关键校正（原话，不美化）

1. **纠正 bridge 方向**（Claude 一开始理解反了）：
   > "2 说错了，是 openclaw 的动作记录到 obsidian，obsidian 是库。然后我随着尝试，所有记录都在 obsidian，但是有些有价值的想法可以运用到 openclaw 上，也就是更改 openclaw，更新。"
   → 这句话直接定了 bridge 的双向语义和"vault 是 source of truth"。

2. **关于独立思考**（触发 Pre-AI 区）：
   > "确实，所以我很多时候也会自己思考。"
   → Claude 据此确认小林已经在抵抗思维同质化，并把它升级成规则而非自律。

3. **架构愿景是有意识改变，不是漂移**（修 MEMORY.md drift 时）：
   > "情况不一样了，改主意了。"
   → 从"OpenClaw → Obsidian，无 Claude Code 中间层"正式改为"Claudian + OpenClaw 并立"。这是有意决定，写进了 MEMORY.md。

4. **studying-spark 不是克隆能解决的**（段五，最重要的一次校正）：
   > "现在有很多问题，这个项目和原本的写作软件完全不一样。以及这个项目到底该怎么切入和展开。你都没想直接做了。"
   → Claude 承认把"苏格拉底追问"当默认模式是错的，它只是四种卡点之一（概念模糊 / 缺前置 / 直觉与定义打架 / 见过没懂）。studying-spark 需要先有**诊断卡点**这一步，不能直接克隆 prototype-spark 的骨架。

5. **额度与流程的现实墙**：
   > "额度不够，我现在一次对话就要扣 2 美元左右……我在想我可能需要一个新的流程。比如在这里设计架构，写入文件和 obsidian 里。然后网页端或者其他地方执行？"
   → 引出"设计/思考留在 Claude Code、执行/改代码交给 OpenClaw（freemodel/claude-opus 那条免费线）"的分工方向。

---

## 四、未完成 / 待定

- **studying-spark 的 prompts 要重做**。当前 `C:\Users\lnp\Documents\studying-spark\` 是个可跑的骨架，但 prompts 把"苏格拉底追问"误当默认。真正该先想清楚：**卡点的第一步是诊断还是用户自述？** 暂时搁置，等小林专门想这块。
- **ingest 计数 = 19，远超 lint 阈值 10**。下次任何 ingest 动作前**先 lint**。
- **bridge 文件还没实跑验证**。需要小林那边配 cron（OpenClaw → `_openclaw-log.md` 的 heartbeat），或手动测 vault → OpenClaw 的语义触发。
- **vault 缺一个"连续性入口 / 项目状态板"**。CLAUDE.md 有项目列表，HOME.md 部分承担状态，但都不是结构化的 task/project state——项目一多就会和 CLAUDE.md 一样漂移。OpenClaw 有 CONTINUITY_START / WORKBOARD 解决这个，vault 还没对应物。
- **OpenClaw 协议的 symlink 接入未做**。下一步不是改架构，是"让 OpenClaw 真的读到 vault 里的 COMPANIONSHIP / SOUL / PERSONA_KERNEL"（symlink 或路径引用），避免两边漂移。
- **OpenClaw 永动机（AUTO_AGENCY_SOUL）从没正常跑过**——`AGENCY_LIVES` 是唯一一次运行记录，全是 502。那套 4 象限 agent 停留在宪法层面，下次激活需从头验证。
- **成本流程未落地**：Max 中转套餐（~$40/5 小时）划不划算取决于能否把执行任务移到 OpenClaw。建议先把 OpenClaw 执行路径配通再决定买不买。
- **`小林的/` 根目录的 canvas / .base 文件**未归位（思考路径、数学脉络等），按结构该进子目录，但顶层方便访问，小林未表态——不强制。

---

## 五、给下次 AI 的操作指引

### 进 vault 做操作前
1. 读 [[AI.md]]（启动还会让你先读 [[AI/加载路径]]）。本 index 记的是规则的由来，AI.md 是落地结论。
2. **铁律**：不改 `小林的/` 任何文件，不改 `70 素材/` 原文，不读/不扫 `小林的/40 Journal/`（Pre-AI 区）。
3. 文件移动 / 改名时，全库扫 `[[wikilink]]` 同步更新引用。不直接删——有疑问移 `小林的/Trash/`。
4. ingest / query / lint 三动作的完整流程在 [[AI.md]] 里，照着走；ingest 前先看 `80 知识库/log.md` 的 `ingest_since_last_lint` 计数。

### 别重犯的错
- **别把 studying-spark 当 prototype-spark 的换皮**——学习场景要先诊断卡点，writing 场景是直接撞墙。这点小林明确校正过。
- **别在 Claude Code 里做本该 OpenClaw 做的批量执行**（读 50 个文件、批量改代码）——那是这次会话最大的成本浪费。重活交给 OpenClaw 的 freemodel 线。
- **别两边重复造轮子**——vault 的对话姿态 = OpenClaw COMPANIONSHIP 的压缩版，协议以 vault 为源、OpenClaw 读副本。
- **别推倒 30/40/50/60 体系换 raw/wiki/assets**——那是给外部消化型知识库设计的，不适合小林这种内部生成型 vault。

### 心智锚点
- vault = source of truth（慢、有意、curated）；OpenClaw = runtime（快、操作、记忆）。改的不是架构，是让两层真正接上。
- 这两天做的事本身就是"帮助尝试工具"的实践：把 OpenClaw 当原型 → 贴进材料 → 讨论 → 沉积成知识库 → 长出新规则。设计不需要额外论证，小林已经在用了。

---

## See Also

- [[10 Projects/ai-conversations/2026-05-29-claudian-vault整理/raw]] — 本次对话原版（约 7700 行）
- [[AI.md]] — vault 规则与上下文（本会话里叫 CLAUDE.md 的那套规则的最终落地形态）
- [[AI/加载路径]] — 每次会话的 BIOS 入口
- [[AI/对话姿态]] — 对话姿态 4 条（本会话蒸馏出来的）
- [[HOME]] — 全库导航入口（本会话新建/更新）
- [[80 知识库/_openclaw-bridge]] — vault → OpenClaw 投递箱（本会话新建）
- [[80 知识库/_openclaw-log]] — OpenClaw → vault 日志（本会话新建）
- [[80 知识库/AI 架构/_主题页]] — OpenClaw 架构 ingest 的主题页（本会话从 0 建到 14 篇原文 + 13 素材页）
- [[80 知识库/output/认知本体论-帮助尝试工具-2026-05]] — "帮助尝试"本体论沉淀
- [[10 Projects/spark-sessions/2026-05-28-antigravity-架构讨论/index]] — 平行会话：prototype-spark v2 架构讨论