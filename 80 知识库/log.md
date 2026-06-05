# 操作日志

ingest_since_last_lint: 0


---

<!--
条目格式：

## [YYYY-MM-DD] ingest | 素材标题
- 主题：路径
- 新建/更新：文件
- 级联更新：文件列表
- 跨区 See Also：链向的文件

## [YYYY-MM-DD] query | Archived: 页面标题

## [YYYY-MM-DD] lint | N issues found, M auto-fixed
- 自动修复：列表
- 待人工决定：列表
-->

## [2026-06-03] lint | 5 issues fixed, 2 manual issues resolved (7-step Vault physical cleanup)
- 修复内容：
  - 删除 0 字节占位文件 `10 Projects/AI应用构思 - 学习刺激器路线.md`，并将 URL 编码的 `AI%E5%BA%94%E7%94%A8%E6%9E%84%E6%80%9D%20-%20%E5%AD%A6%E4%B9%A0%E5%88%BA%E6%BF%80%E5%99%A8%E8%B7%AF%E7%BA%BF.md` 正确重命名解码。
  - 删除错误嵌套的递归目录 `80 知识库/认识与思维生成/80 知识库/`。
  - 删除无用 0 字节文件 `70 素材/AI 架构/OpenClaw 工作区.md`。
  - 修正 `80 知识库/_backlinks-to-小林的.md` 中的虚假 Missing 警报。
  - 在 `80 知识库/AI 架构/素材/COMPANIONSHIP_PROTOCOL-陪伴协议-2026-05.md` 的 `## See Also` 段追加 `[[小林的/30 Creative/幻生蝶梦·总篇\|幻生蝶梦·总篇]]`。
- 效果：Vault 物理结构完全优化，链条恢复完整。
- 计数器归零：`ingest_since_last_lint: 0`

## [2026-06-01] ingest | 认识与思维生成（6思想传统综合）
- 主题：认识与思维生成（新建）
- 来源：本场对话的多agent研究产出（非外部素材），存档 [[10 Projects/ai-conversations/2026-05-31-claudian-认识论与工具内核/思想传统综合-raw.json]]
- 新建主题页：`80 知识库/认识与思维生成/_主题页.md`（含统一机制 + 小林认识论定位 + 工具内核 + AI协作方法论）
- 新建素材页：黑格尔/康德/马克思/范畴论/生成认知/思维工具史 6 篇 + 红队 2 篇，共 8 篇
- 方法：6路agent全程联网深挖（引SEP/原始文献）+ 2路红队对撞 + 1路综合，opus[1m]
- 跨区 See Also：[[AI/认识论]]（作为这套综合的对照对象）
- 备注：本主题是"认识研究"主线的第一块知识资产

## [2026-05-23] ingest | π0: Our First Generalist Policy
- 主题：具身智能（新建）
- 原文归档：`70 素材/具身智能/π0-Physical Intelligence通用机器人策略-2024-10.md`
- 新建素材页：`80 知识库/具身智能/素材/π0-通用机器人策略-2026-05.md`
- 主题页：暂未生成（按规则累积 ≥3 篇才生成）
- 级联更新：无（首篇）
- 跨区 See Also：[[小林的/50 Learning/计划5]]（小林明确列了"具身智能博客论文""宇树科技 论文"的学习计划）

## [2026-05-23] ingest | Hi Robot: Open-Ended Instruction Following
- 主题：具身智能
- 原文归档：`70 素材/具身智能/Hi Robot-stub-2025-02.md`（⚠️ stub only，WebFetch 受限）
- 新建素材页：`80 知识库/具身智能/素材/Hi Robot-分层VLA指令跟随-2026-05.md`
- 主题页：暂未生成（累积 2/3 篇）
- 级联更新：无
- 跨区 See Also：[[小林的/50 Learning/计划5]]、[[80 知识库/具身智能/素材/π0-通用机器人策略-2026-05]]
- 备注：基于 WebSearch 合成，非原文存档

## [2026-05-23] ingest | π0.5: a VLA with Open-World Generalization
- 主题：具身智能
- 原文归档：`70 素材/具身智能/π0.5-Open-World泛化-2025-04.md`（高保真，用户手动粘贴正文）
- 新建素材页：`80 知识库/具身智能/素材/π0.5-Open-World泛化-2026-05.md`
- **新建主题页：`80 知识库/具身智能/_主题页.md`**（累积达 3 篇触发生成）
- 级联更新：
  - `80 知识库/具身智能/素材/π0-通用机器人策略-2026-05.md`（加"后续发展"段落 + 链回主题页）
  - `80 知识库/具身智能/素材/Hi Robot-分层VLA指令跟随-2026-05.md`（更新"跟 π0.5 关系"段落 + 加 wiki-link + 链回主题页）
- 跨区 See Also：[[小林的/50 Learning/计划5]]

## [2026-05-23] ingest | π*0.6: a VLA that Learns from Experience
- 主题：具身智能
- 原文归档：`70 素材/具身智能/π0.6-star-Recap从经验学习-2025-11.md`（高保真，用户手动粘贴正文）
- 新建素材页：`80 知识库/具身智能/素材/π0.6-star-Recap从经验学习-2026-05.md`
- 级联更新：
  - `80 知识库/具身智能/_主题页.md`（演进图从三代→四代，加 5 号决策"从监督到 RL"，加洞察 6/7，标记 autonomous self-improvement 已部分解决，收录素材加 π*0.6）
  - `80 知识库/具身智能/素材/π0.5-Open-World泛化-2026-05.md`（在"跟 π0 系列位置"加 π*0.6 链接）
- 跨区 See Also：[[小林的/50 Learning/计划5]]
- 备注：文件名里 * 是 Windows 非法字符，用 -star- 替代

## [2026-05-23] ingest | π0.7: a Steerable Model with Emergent Capabilities
- 主题：具身智能
- 原文归档：`70 素材/具身智能/π0.7-Steerable通用模型-2026-04.md`（高保真，用户手动粘贴正文，已开 VPN 但不影响 WebFetch）
- 新建素材页：`80 知识库/具身智能/素材/π0.7-Steerable通用模型-2026-05.md`
- 级联更新：
  - `80 知识库/具身智能/_主题页.md`（四代→五代演进，加 6 号关键决策"从 specialist 到 steerable 通用"，加洞察 8-11，关闭 2 个未解决问题，收录素材加 π0.7）
  - `80 知识库/具身智能/素材/π0.6-star-Recap从经验学习-2026-05.md`（在"跟 π0 系列位置"加 π0.7 链接）
- 跨区 See Also：[[小林的/50 Learning/计划5]]
- 备注：跳过 PI Layer（2026-02），用户决定是否补
- 备注：澄清 VPN 不影响 WebFetch（claude.ai 端的安全策略，跟用户本地网络无关）

## [2026-05-23] ingest batch | 周边技术 4 篇（WebSearch 合成）
用户选择"开始做周边技术文章（我 WebSearch 拼）"，批量 ingest 4 篇 PI 分支技术：

### FAST（2025-01-16，arXiv:2501.09747）
- 原文：`70 素材/具身智能/FAST-stub-2025-01.md`（stub）
- 素材页：`80 知识库/具身智能/素材/FAST-高效动作Tokenization-2026-05.md`
- 主题：动作 tokenization，DCT 频域压缩，π0-FAST 训练快 5x

### RTC（2025-06，arXiv:2506.07339）
- 原文：`70 素材/具身智能/RTC-stub-2025-06.md`（stub）
- 素材页：`80 知识库/具身智能/素材/RTC-实时动作Chunking-2026-05.md`
- 主题：实时动作 chunking，对抗推理延迟，300ms+ 延迟下点火柴

### MEM（2026-03-03，arXiv:2603.03596）
- 原文：`70 素材/具身智能/MEM-stub-2026-03.md`（stub）
- 素材页：`80 知识库/具身智能/素材/MEM-多尺度具身记忆-2026-05.md`
- 主题：双模态记忆（短期视频 + 长期语言），15 分钟长任务

### RLT（2026-03-19）
- 原文：`70 素材/具身智能/RLT-stub-2026-03.md`（stub）
- 素材页：`80 知识库/具身智能/素材/RLT-精确操作RL-Token-2026-05.md`
- 主题：单 RL token，几小时数据精修精细动作

### 级联更新
- `80 知识库/具身智能/_主题页.md`（**重大扩展**：新增"分支技术"小节、洞察从 11 条→15 条、long-horizon reasoning 标 🟡 部分解决、收录素材分两组）
- `80 知识库/index.md`（具身智能整段分主线/分支两组）

### 备注
- 4 篇都是 WebSearch 拼，所有素材页头部都标了 ⚠️ 基于 WebSearch 合成
- 70 素材/ 都是 stub，需要原文请去对应 arxiv/官方页
- 跨区 See Also：[[小林的/50 Learning/计划5]]

💡 已经 ingest 9 篇，差 1 篇就到 lint 提醒阈值。

## [2026-05-23] ingest batch | 最后周边 2 篇（WebSearch 合成）
用户选择继续 ingest 周边。澄清判断：
- "RL for Generalist Policies" = π*0.6/Recap，重复，跳过
- "Challenge Tasks via Fine-Tuning" = π0 的 fine-tuning 演示，已在 π0 素材页，跳过
- 实际新内容只有 2 篇：

### Human Video Transfer（2025-?）
- 原文：`70 素材/具身智能/Human Video Transfer-stub-2025.md`（stub）
- 素材页：`80 知识库/具身智能/素材/Human Video Transfer-涌现的人类视频迁移-2026-05.md`
- 主题：VLA scale 后涌现地"从人类第一视角视频学技能"（清香料架 32%→71%）
- 类型：科学发现，不是工程组件

### Knowledge Insulation / VLAs that Train Fast（2025-05-30，arXiv:2505.23705）
- 原文：`70 素材/具身智能/Knowledge Insulation-stub-2025-05.md`（stub）
- 素材页：`80 知识库/具身智能/素材/Knowledge Insulation-VLM保护-2026-05.md`
- 主题：保护 VLM 骨架不被 action expert "forgetting"，联合训 FAST discrete + flow matching continuous，训练快 3x

### 级联更新
- `80 知识库/具身智能/_主题页.md`（分支技术表 4→6 行，加"两层泛化能力"小节，洞察从 15→17 条，数据稀缺标 🟡，加 language following 未解决问题，加"PI 博客索引上但实际指向已 ingest 内容"段说明）
- `80 知识库/index.md`（分支技术加 2 条）

### 备注
- 跨区 See Also：[[小林的/50 Learning/计划5]]
- 跳过 The Physical Intelligence Layer（2026-02），仍待用户决定
- 主线 VLA + 分支技术全部 ingest 完毕，主题下共 11 篇素材 + 1 主题页

💡 已经 ingest 11 篇，**到达 lint 提醒阈值**。建议跑一次 `lint` 体检。

## [2026-05-23] lint | 1 issue auto-fixed, 5 issues reported

### 检查范围
- index.md ↔ 实际文件一致性
- frontmatter source 字段 ↔ 70 素材/ 文件
- 知识库内部 wiki-link 有效性
- 跨区 See Also（链向 小林的/）有效性
- 孤岛/反向引用统计
- 反复出现概念
- 主题目录文章数
- 跨主题事实矛盾

### 自动修复（1）
- `80 知识库/index.md` 第 11 行：主题页描述「5 主线 + 4 分支技术」→「5 主线 + 6 分支技术/发现」（滞后于 Human Video Transfer + Knowledge Insulation 的加入）

### 确定性检查（全部通过 ✓）
- 索引 12 条目 ↔ 实际 11 素材页 + 1 主题页：一致
- 11 个素材页的 frontmatter source 字段：全部指向存在的 70 素材/ 文件
- 知识库内部 wiki-link：约 50 个内链全部指向存在的文件，无断链
- 跨区 See Also `[[小林的/50 Learning/计划5]]`：目标存在
- 主题页累积 ≥3 篇规则：已生成（在 π0.5 ingest 时触发）

### 启发式报告（待你决定）

**1. 分支技术弱连接（5 项）**
分支技术大多只在主题页里被引用，缺少素材页之间的横向联动：
- **Knowledge Insulation ↔ FAST**：KI 用了 FAST tokenization 作为 discrete 路径，FAST 素材页应该加 See Also → KI 反向链
- **RTC**：适用于所有主线 diffusion/flow VLA（π0/π0.5/π*0.6/π0.7），建议这几篇素材页加 "RTC 让我能跑在真实机器人上"
- **MEM ↔ π0.7**：长任务能力的延伸，π0.7 素材页可加 See Also → MEM
- **RLT ↔ π*0.6**：互补的 RL 范式（宽 vs 窄），π*0.6 素材页可加 See Also → RLT
- **Human Video Transfer ↔ π0.7**：π0.7 用人类视频，已有反向引用 ✓

**2. 反复出现但没独立页面的概念**
- **"涌现能力 (Emergent Capabilities)"**：在 π0.7（compositional generalization）和 Human Video Transfer 都出现。可能值得建独立 entity page 作为跨素材枢纽。**建议时机：再 ingest 1-2 篇涉及涌现能力的素材后建**
- **Flow matching / Action expert**：技术细节，不建议独立页

**3. 主题目录规模**
具身智能 11 篇，未超过 20 拆分阈值（55% 容量）。如果再 ingest 5+ 篇可以考虑按"主线 / 分支 / 外部应用"等分类拆子主题。

**4. 跨区联动单一**
所有素材页都只链 `[[小林的/50 Learning/计划5]]`，没有更细的跨区联动。**建议保持现状**，等小林在 50 Learning/ 区产生更多具身智能相关笔记再增量加。

**5. 事实矛盾检查通过 ✓**
主线 5 篇 + 分支 6 篇之间没有发现内容矛盾。Hi Robot vs π0.5 的"分层 vs 单模型"曾被 π*0.6 ingest 时通过级联更新调和（Hi Robot 素材页明确说 π0.5 把分层内化）。

### 总结
- **健康度**：高。索引一致、链接完整、source 全部可达
- **薄弱点**：分支技术横向联动较少（5 项孤岛风险）
- **机会**：可以建"涌现能力" entity page，跨主题枢纽
- **计数器归零**：`ingest_since_last_lint: 0`

## [2026-05-25] query | Archived: 认知本体论-帮助尝试工具-2026-05
- 路径：`80 知识库/output/认知本体论-帮助尝试工具-2026-05.md`
- 来源：与 Claude 多轮对话（2026-05-24 起，"蒸馏自己" → 认知本体论 → 帮助尝试工具）+ Claudian 续谈合成
- 内容：
  - 对话弧线（蒸馏自己 → 写作工具 → 帮助尝试，主体扩张轨迹）
  - 认知本体论链条（尝试 → 存在 是延伸 + 元概念随主体扩张生长）
  - 倒置之后的"无极方向"结（A/B/C 三选项，C 最优）
  - "蒸馏自己"在本体论下的不可能性 → 出路：蒸馏方向而非内容
  - "帮助尝试"工具的三层架构（处理 / 交互 / 反馈）
  - 等-说-扎对话姿态的操作化信号
  - 工具 + Claudian + 知识库的闭环对齐
- 跨区 See Also：[[小林的/30 Creative/幻生蝶梦·总篇]]、[[10 Projects/AI应用构思 - 7日MVP路线]]、[[小林的/50 Learning/计划5]]
- 备注：本沉淀本身就是闭环的第一次启动——一周后回看是反馈层有效性的检验

## [2026-05-23] post-lint repair | 7 横向 See Also 链接补全
用户确认补 lint 报告里建议的 5 项 See Also（实际加了 8 个 wiki-link）：

### 修改的素材页
- `FAST-高效动作Tokenization-2026-05.md` ← 加 → Knowledge Insulation
- `π0-通用机器人策略-2026-05.md` ← 加 → RTC
- `π0.5-Open-World泛化-2026-05.md` ← 加 → RTC
- `π0.6-star-Recap从经验学习-2026-05.md` ← 加 → RTC, RLT, **MEM**（额外补 MEM，因为 MEM 能延伸 Recap 训出的能力到长任务）
- `π0.7-Steerable通用模型-2026-05.md` ← 加 → RTC, MEM, **Human Video Transfer**（额外补 HVT，因为 HVT 解释了为什么 π0.7 用 human videos 有效）

### 效果
分支技术的反向引用计数从 0 → 多次：
- KI 被 FAST 引用 (1)
- RTC 被 π0 / π0.5 / π*0.6 / π0.7 引用 (4)
- MEM 被 π*0.6 / π0.7 引用 (2)
- RLT 被 π*0.6 引用 (1)
- Human Video Transfer 被 π0.7 引用 (1)

孤岛风险消除。知识库网状结构密度明显提升。

## [2026-05-26] ingest batch | OpenClaw 人格层 6 篇

**触发：** 用户授权 ingest OpenClaw workspace 的架构文档（按方案 A，vault 作为 source of truth）。第一批：人格层。

**新建主题：** `AI 架构`

**原文归档：**
- `70 素材/AI 架构/OpenClaw 工作区/SOUL.md`
- `70 素材/AI 架构/OpenClaw 工作区/PERSONA_KERNEL.md`
- `70 素材/AI 架构/OpenClaw 工作区/COMPANIONSHIP_PROTOCOL.md`
- `70 素材/AI 架构/OpenClaw 工作区/USER.md`
- `70 素材/AI 架构/OpenClaw 工作区/IDENTITY.md`
- `70 素材/AI 架构/OpenClaw 工作区/AUTO_AGENCY_SOUL.md`

**新建主题页：** `80 知识库/AI 架构/_主题页.md`（已包含整个架构综合，超过 3 篇阈值直接生成）

**新建素材页（4 篇，跳过 USER 和 IDENTITY）：**
- `80 知识库/AI 架构/素材/SOUL-身份基底-2026-05.md`
- `80 知识库/AI 架构/素材/PERSONA_KERNEL-人格内核-2026-05.md`
- `80 知识库/AI 架构/素材/COMPANIONSHIP_PROTOCOL-陪伴协议-2026-05.md`
- `80 知识库/AI 架构/素材/AUTO_AGENCY_SOUL-永动机宪法-2026-05.md`

**跳过素材页的原因：**
- USER.md（852 字节）—— 信息密度低且已部分覆盖在 vault [[AI]] 里，主题页已纳入
- IDENTITY.md（636 字节）—— 是空白模板，无内容可 ingest，主题页里已标记为 "未填写的开放问题"

**关键发现（已写入主题页）：**
- OpenClaw 人格层是**双灵魂结构**：协作伙伴（SOUL+PERSONA_KERNEL+COMPANIONSHIP）vs 永动机（AUTO_AGENCY_SOUL）
- COMPANIONSHIP_PROTOCOL（500+ 行）是这批文件里思考最深、可操作性最强的
- vault [[AI]] "对话姿态"段（2026-05-26 加的 4 条规则）是 COMPANIONSHIP 的极度压缩版

**级联更新：**
- `80 知识库/index.md` 加 "AI 架构" 段（1 主题页 + 4 素材页）

**跨区 See Also：**
- `80 知识库/AI 架构/素材/COMPANIONSHIP_PROTOCOL-陪伴协议-2026-05.md` → [[小林的/30 Creative/幻生蝶梦·总篇]]（"承接 / 命名 / 保留余白"跟好的小说人物对话结构同构）
- `80 知识库/AI 架构/素材/AUTO_AGENCY_SOUL-永动机宪法-2026-05.md` → [[10 Projects/AI应用构思 - 原型刺激器路线]]（用户尝试 vs AI 自己尝试的对照）

**计数器：** `ingest_since_last_lint: 4`

**待 ingest（下一批，按主题页里的 Tier 1 优先级）：**
- COGNITIVE_ARCHITECTURE_V3.md
- DIALOGUE_ARCHITECTURE.md + DIALOGUE_DUAL_ARCHITECTURE_BOUNDARIES.md
- CONTINUITY_ARCHITECTURE.md + SESSION_RECOVERY_SYSTEM.md
- EXECUTION_PROTOCOL.md

## [2026-05-26] ingest batch | OpenClaw 架构层 Tier 1（6 篇）

**触发：** 用户授权继续 ingest Tier 1 架构层（接续人格层 ingest）。

**原文归档（6 篇全部）：**
- `70 素材/AI 架构/OpenClaw 工作区/COGNITIVE_ARCHITECTURE_V3.md`
- `70 素材/AI 架构/OpenClaw 工作区/DIALOGUE_ARCHITECTURE.md`
- `70 素材/AI 架构/OpenClaw 工作区/DIALOGUE_DUAL_ARCHITECTURE_BOUNDARIES.md`
- `70 素材/AI 架构/OpenClaw 工作区/CONTINUITY_ARCHITECTURE.md`
- `70 素材/AI 架构/OpenClaw 工作区/SESSION_RECOVERY_SYSTEM.md`
- `70 素材/AI 架构/OpenClaw 工作区/EXECUTION_PROTOCOL.md`

**新建素材页（5 篇，跳过 COGNITIVE_ARCHITECTURE_V3）：**
- `80 知识库/AI 架构/素材/EXECUTION_PROTOCOL-执行协议-2026-05.md`
- `80 知识库/AI 架构/素材/DIALOGUE_DUAL_ARCHITECTURE_BOUNDARIES-双建构必要性-2026-05.md`
- `80 知识库/AI 架构/素材/DIALOGUE_ARCHITECTURE-双建构总图-2026-05.md`
- `80 知识库/AI 架构/素材/CONTINUITY_ARCHITECTURE-连续性架构-2026-05.md`
- `80 知识库/AI 架构/素材/SESSION_RECOVERY_SYSTEM-旧会话恢复-2026-05.md`（标 legacy）

**跳过素材页的原因：**
- **COGNITIVE_ARCHITECTURE_V3.md** —— 文件名误导：实际内容是**知识图谱 App 的设计白皮书**（基于认知科学的产品设计），不是 OpenClaw 的认知架构。已 snapshot 到 70 素材，等其他知识图谱 App 文件（知识图谱app-协作系统设计、协作计划、schema.sql 等）一起 ingest 时建独立"知识图谱 App"主题

**关键发现（已写入主题页扩展）：**
- "协作伙伴 mode" 内部还有**二次分叉**——Execution Posture vs Companionship Posture，由 routing 仲裁
- 完整 OpenClaw 对话系统是 **5 层架构**（Soul / Cognition / Posture / Routing / Protocol / Response），不是简单"两个模式"
- CONTINUITY_ARCHITECTURE 是**跟对话架构正交**的另一条架构线，专门解决跨会话连续性
- vault 这边**缺 task state 层**——这是 vault Claudian 的真实弱点，也是接入 OpenClaw 的价值之一
- SESSION_RECOVERY_SYSTEM 已被超越，主要价值是复盘"为什么旧方案不够"

**级联更新：**
- `80 知识库/AI 架构/_主题页.md` 加新段 "协作伙伴 mode 的内部结构（双对话建构）" + "跨会话连续性（CONTINUITY，正交架构线）"；"待 ingest 清单"标记 Tier 1 完成；提示 COGNITIVE_ARCHITECTURE_V3 是 mismatched，归独立主题
- `80 知识库/index.md` AI 架构段加 5 条架构层素材

**跨区 See Also：**
- 全部 5 篇素材页都通过 [[_主题页]] 链回主题页
- [[CONTINUITY_ARCHITECTURE-连续性架构-2026-05]] → [[HOME.md]]（vault 这边的连续性入口对应）
- [[EXECUTION_PROTOCOL-执行协议-2026-05]] → [[COMPANIONSHIP_PROTOCOL-陪伴协议-2026-05]]（对偶关系）

**计数器：** `ingest_since_last_lint: 9`（接近 10 阈值，下一批前建议 lint 一次）

**待 ingest（下一批，Tier 2）：**
- 路由层：MODE_ROUTING、MODEL_ROUTING_RULES、SKILL_ROUTING、DIALOGUE_ROUTING
- 记忆/质量：MEMORY、QUALITY_GUARDRAILS、IMPROVEMENT_LOOP、RULE_COMPRESSION_AUDIT
- 模板/案例：WORKFLOW_TEMPLATES、DIALOGUE_EXAMPLES、DIALOGUE_STACK_OVERVIEW、DIALOGUE_REFERENCE_ANALYSIS_CLAUDE

**独立主题候选**：知识图谱 App（COGNITIVE_ARCHITECTURE_V3 + 知识图谱app 三篇 + schema.sql）

💡 已经 ingest 9 篇，**接近 lint 阈值（10）**。建议下一批前先 lint。

## [2026-05-26] lint | 2 issues found, 2 auto-fixed

**触发：** 累计 ingest 9 篇，用户主动触发 lint。

**只 lint 范围：** 80 知识库/（特别检查新建的 AI 架构主题）

**自动修复（2 处）：**
1. `80 知识库/AI 架构/_主题页.md` 的 See Also 中 `[[小林的/50 Learning/计划5]]` → 修正为 `[[小林的/50 Learning/学习计划]]`（计划5.md 不存在；学习计划.md 存在）
2. `80 知识库/AI 架构/_主题页.md` 正文中 `[[10 Projects/]]`（指向目录，Obsidian 无法解析）→ 修正为 `[[10 Projects/README]]`

**确定性检查通过：**
- index.md ↔ 实际文件一致性：✓ 全部 11 篇 AI 架构相关页面（1 主题页 + 9 素材页 + 1 output 归档）均在 index.md 中有对应条目，无缺失/无死链
- 知识库内部 wiki-link 失效：除上述 2 处已修，**其余 50+ 条 wiki-link 全部指向真实文件**
- 素材页累积 ≥3 但还没主题页：✓ AI 架构主题页已存在，覆盖 9 篇素材
- See Also 链接：✓ 跨页双向引用密度高，无明显缺失
- 跨区 See Also 链向 `小林的/` 的失效链接：已修复（计划5）

**启发式检查（无重大发现）：**
- 跨文章事实矛盾：无。COGNITIVE_ARCHITECTURE_V3 被正确识别为知识图谱 App（非 OpenClaw 认知架构），主题页已 flag
- 新素材让旧论点过时：✓ 已显式处理（SESSION_RECOVERY_SYSTEM 标 legacy，主题页双灵魂结构升级为三轴叠加）
- 源头分歧没标注：无
- 孤岛页面（没人引用）：无。AI 架构主题内部 9 篇素材互相引用，主题页统摄
- 反复被提及但没独立页面的概念：**"尝试" / "认知" / "存在"** 三个概念在 AI 架构主题页、output/认知本体论、小林的/50 Learning 多处出现，未来可能值得建 Entity Page（暂不建，未到 5 篇阈值）
- 主题目录文章数过多（>20）：无。AI 架构 9 篇，具身智能 11 篇，均未超

**待人工决定（0 处）。**

**计数器：** `ingest_since_last_lint: 0`（已归零）

**注：** 本次 lint **不动** `小林的/` 和 `70 素材/`（按规则）。`70 素材/AI 架构/OpenClaw 工作区/` 下 12 个 snapshot 文件未做 lint。

## [2026-05-26] ingest batch | OpenClaw 架构层 Tier 2（8 篇）

**触发：** 用户授权继续 Tier 2 ingest（接续 Tier 1 + lint）。

**原文归档（8 篇）：**
- `70 素材/AI 架构/OpenClaw 工作区/DIALOGUE_ROUTING.md`（493 行 / 路由层最大）
- `70 素材/AI 架构/OpenClaw 工作区/MODE_ROUTING.md`（297 行 / 执行子路由）
- `70 素材/AI 架构/OpenClaw 工作区/MODEL_ROUTING_RULES.md`（131 行）
- `70 素材/AI 架构/OpenClaw 工作区/SKILL_ROUTING.md`（189 行）
- `70 素材/AI 架构/OpenClaw 工作区/MEMORY.md`（44 行 / 长期记忆与偏好）
- `70 素材/AI 架构/OpenClaw 工作区/QUALITY_GUARDRAILS.md`（91 行）
- `70 素材/AI 架构/OpenClaw 工作区/IMPROVEMENT_LOOP.md`（102 行）
- `70 素材/AI 架构/OpenClaw 工作区/RULE_COMPRESSION_AUDIT.md`（212 行）

**新建素材页（8 篇，1:1 全部覆盖）：**
- `80 知识库/AI 架构/素材/DIALOGUE_ROUTING-总路由-2026-05.md`
- `80 知识库/AI 架构/素材/MODE_ROUTING-执行子路由-2026-05.md`
- `80 知识库/AI 架构/素材/MODEL_ROUTING_RULES-模型路由-2026-05.md`
- `80 知识库/AI 架构/素材/SKILL_ROUTING-技能路由-2026-05.md`
- `80 知识库/AI 架构/素材/MEMORY-长期记忆与偏好-2026-05.md`（标记 sensitive: true）
- `80 知识库/AI 架构/素材/QUALITY_GUARDRAILS-质量护栏-2026-05.md`
- `80 知识库/AI 架构/素材/IMPROVEMENT_LOOP-改进循环-2026-05.md`
- `80 知识库/AI 架构/素材/RULE_COMPRESSION_AUDIT-规则压缩审计-2026-05.md`

**关键发现（已写进主题页扩展）：**
- 路由层实际是 **4 个 router 协同**（总路由 + 执行子 + 模型 + skill），不是单一 router
- **DIALOGUE_ROUTING 的 Restraint Axis** 是这套设计最特别的创新——把"克制"从模糊美德变成显式判断维度
- MODE_ROUTING 经历了**降级**（从总路由到执行子路由），加 §11 自我约束条款防止重新越权——好的架构演化范例
- **MODEL_ROUTING_RULES drift**：文件描述 Gemini ↔ Codex 分流，但 openclaw.json 实际配置已切到 Claude Opus 主用 + Gemini fallback。lint 时可标注
- MEMORY 揭露了**架构跟初始愿景的偏离**：原愿景是"OpenClaw → Obsidian 无 Claude Code 中间层"，现在实际跑 Claudian + OpenClaw 并立——需要跟用户确认是有意识改变还是漂移
- IMPROVEMENT_LOOP 的 **3 级固化**机制（临时/记忆/规则）是好结构——避免每个用户反馈都立刻改核心
- RULE_COMPRESSION_AUDIT 是**用户的自我诊断报告**——OpenClaw 跑久后主动写的审计 + 压缩计划，说明系统设计能力扎实

**级联更新：**
- `80 知识库/AI 架构/_主题页.md` 加 3 个新段：
  - "路由层（4 个 router 协同）"——展开 DIALOGUE/MODE/MODEL/SKILL routing 的位置
  - "用户档案 + AI 身份"段扩展——加 MEMORY 的发现 + 架构偏离 flag
  - "元认知层（质量 / 改进 / 压缩）"——新段
- 待 ingest 清单标记 Tier 2 完成，Tier 3 重排
- "跟更大架构的位置"全部主层级标记 ✅
- `80 知识库/index.md` AI 架构段加 8 条（按"架构层 / 路由层 / 用户偏好层 / 元认知层"分组）

**跨区 See Also：**
- [[MEMORY-长期记忆与偏好-2026-05]] → [[10 Projects/AI应用构思 - 原型刺激器路线]]（对照 obsidian-ai-workbench 早期愿景）
- 多页交叉引用 [[AI]]（vault 这边的对应）

**计数器：** `ingest_since_last_lint: 8`（接近 10，下一批前再 lint）

**待 ingest（Tier 3，剩余）：**
- 模板 / 案例：WORKFLOW_TEMPLATES、DIALOGUE_EXAMPLES、DIALOGUE_STACK_OVERVIEW、DIALOGUE_REFERENCE_ANALYSIS_CLAUDE
- 复盘 / 历史：FRESH_SESSION_RECOVERY_SIMULATION、RECOVERY_VALIDATION、EXCELLENT_CASES、CONTINUITY_LESSONS、CONTINUITY_START
- 演化 / 计划：OPENCLAW_EVOLUTION_PLAN、HEARTBEAT、MINIMAL_CORE_PATH、PREFERENCE_PROFILES
- Agency 实现：AGENT_DASHBOARD、AGENCY_LIVES、agency_engine.py
- 知识图谱 App 独立主题：COGNITIVE_ARCHITECTURE_V3 + 知识图谱app-协作系统设计 + 协作计划 + schema.sql

## [2026-05-26] meta | 触发词改工作流 + 双向链接机制（_backlinks-to-小林的.md）

**触发：** 用户跟 Claudian 对话中提出"触发词太低级，改成工作流"+"可以补上双向链接吗"。

**改动概要：**
1. **CLAUDE.md 触发词重构**——把 ingest / Inbox / query / lint / OpenClaw bridge 5 处"触发词列表"改成"何时走 + 判断信号 + 不确定先问"的工作流描述
2. **新增双向查询机制**——跨区联动表后加"双向查询（小林的/ 不被污染）"段：日常用 Obsidian Backlinks pane；批量综合用新建元文件 `_backlinks-to-小林的.md`（AI 只写 80 区，铁律不破）
3. **新建 `80 知识库/_backlinks-to-小林的.md`**——以 grep 实际结果初始化（3 个目标文件，15 条引用记录）
4. **更新 `80 知识库/index.md`**——新增"元文件"段

**附带发现（待下次 lint 处理）：**
- 13 处素材页/主题页/output 仍引用 `[[小林的/50 Learning/计划5]]`，但实际文件名应为 `学习计划`（AI 架构主题页上次 lint 已修，具身智能 11 篇 + output 1 篇未修）
- log.md 声称 `COMPANIONSHIP_PROTOCOL` 加了 See Also 到 `幻生蝶梦·总篇`，但 grep 找不到——需 lint 核对

**ingest 流程更新：** 今后 ingest 加 See Also 链向 `小林的/` 时，同步更新 `_backlinks-to-小林的.md`。

**计数器：** `ingest_since_last_lint: 8`（本次是元变更，不增加计数）

## [2026-05-26] ingest batch | OpenClaw Tier 3 + 知识图谱 App（11 篇有效素材页 + 8 只 snapshot）

**触发：** 用户授权继续 Tier 3 ingest + 建知识图谱 App 独立主题。

### Tier 3 — AI 架构补充层

**建完整素材页（7 篇）：**
- `WORKFLOW_TEMPLATES-执行模板-2026-05.md` — 6 个执行骨架
- `MINIMAL_CORE_PATH-最小加载路径-2026-05.md` — 3 级加载策略
- `PREFERENCE_PROFILES-用户偏好档案-2026-05.md` — 5 维偏好精简版
- `OPENCLAW_EVOLUTION_PLAN-演化路线图-2026-05.md` — 8 阶段路线图当前状态
- `CONTINUITY_LESSONS-连续性经验-2026-05.md` — 5 条验证经验 + 5 条规则
- `DIALOGUE_STACK_OVERVIEW-双建构总览-2026-05.md` — 快速恢复总览 + 最小加载顺序
- `DIALOGUE_REFERENCE_ANALYSIS_CLAUDE-校准分析-2026-05.md` — 真实对话校准，COMPANIONSHIP 的实证基础

**只 snapshot，不建素材页（8 篇，历史/小文件）：**
- DIALOGUE_EXAMPLES（384 行，实例库）
- EXCELLENT_CASES（15 行，2 个案例）
- HEARTBEAT（20 行，日常任务定义）
- AGENT_DASHBOARD（21 行，事故通报）
- AGENCY_LIVES（98 行，全是 API 502 错误日志）
- CONTINUITY_START（49 行，新会话恢复入口）
- FRESH_SESSION_RECOVERY_SIMULATION_2026-03-17（96 行，测试记录）
- RECOVERY_VALIDATION_2026-03-17（57 行，验证记录）

**关键发现（写入主题页和素材页）：**
- DIALOGUE_REFERENCE_ANALYSIS_CLAUDE 是整个 COMPANIONSHIP_PROTOCOL 的**实证基础**——vault CLAUDE.md 里 4 条对话姿态规则的原材料
- AGENCY_LIVES 揭露了永动机系统**第一次（也是唯一一次）实际运行**就全部 502 崩溃的历史
- AGENT_DASHBOARD 是当时主代理 Gemini 写给用户的凌晨事故通报（值得保留作历史文档）
- OPENCLAW_EVOLUTION_PLAN Phase 3、6、8 有未完成任务（continuity 真实接线 / 继续减法 / skill 机器可读注册表）

### 知识图谱 App 独立主题

**新建主题**：`80 知识库/知识图谱App/`

**新建主题页**：`_主题页.md`

**新建素材页（4 篇）：**
- `COGNITIVE_ARCHITECTURE_V3-认知科学白皮书-2026-05.md` — 7 大认知科学理论的产品映射
- `项目全阶段总结-2026-05.md` — 完整项目历史 + 经验教训 + 用户思维模式
- `协作系统设计-2026-05.md` — Commander/Coder/Reviewer 三角 Agent 架构
- `协作计划-2026-05.md` — 三层模型架构 + 成本节省方案

**原文归档（5 个文件）：**
`70 素材/知识图谱App/OpenClaw工作区/` 下
- COGNITIVE_ARCHITECTURE_V3.md
- 知识图谱App项目全阶段总结.md
- 知识图谱app-协作系统设计.md
- 知识图谱app-协作计划.md
- knowledge_graph_schema.sql（只 snapshot，no素材 page）

**关键发现：**
- COGNITIVE_ARCHITECTURE_V3 是基于认知科学的设计白皮书，跟 OpenClaw 的认知架构无关（文件名误导）
- 这个项目是 AUTO_AGENCY_SOUL 4 象限永动机的**前身/同期实现**（Commander = CEO，Coder = CTO，Reviewer = CPO）
- 知识图谱 app 的 ZPD 理念（"从模糊到可尝试"）跟 prototype-spark 的"帮助尝试"哲学同构——可能成为"扩大版工具"学习 instance 的蓝图
- 协作计划里的三层模型分层（高/中/低成本）最终演化进了当前的 MODEL_ROUTING_RULES

**Drift 修复（本轮还做了）：**
- MEMORY.md：Active Projects 段更新，架构愿景从"OpenClaw→Obsidian无Claude Code"更新为"Claudian+OpenClaw并立，有意识决定"。vault + WSL 双向同步。
- MODEL_ROUTING_RULES.md：从 Gemini↔Codex 策略全文重写为当前 Claude Opus 主用 + Gemini Flash Lite fallback。vault + WSL 双向同步。

**计数器：** `ingest_since_last_lint: 19`（到了 10 的 2 倍，建议 lint）

💡 **已经 ingest 19 篇，超过 lint 阈值（10）。强烈建议跑一次 lint。**
