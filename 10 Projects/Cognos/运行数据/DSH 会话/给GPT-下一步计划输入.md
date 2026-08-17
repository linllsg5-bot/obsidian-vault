---
type: dsh-session-handoff
project: Cognos
source_role: runtime-projection
epistemic_status: provisional
updated: 2026-08-17
---

# 给 GPT：Cognos 下一步计划思考输入（v2 · 全量重读 Vault 后）

> v2 说明：v1 只整理了 DSH 会话最近 24 小时，被指出空泛。v2 全量重读了 Obsidian Vault 的 10 Projects/Cognos/ 全部项目文档后重写，以 Vault 现有文档为锚。
>
> 本文件地位：runtime-projection（运行投影），不是 current-view。按 [[认知地位与来源]] 的纪律：本文件不把任何 AI 提案、运行事实或候选结构升格为已确认；raw 发生不可回写。

## 0. 材料地图：Vault 里有什么、各自地位

| 文档 | 类型 | 认知地位 | 作用 |
| --- | --- | --- | --- |
| [[_入口]] | project-entry | current-map | 项目导航、层次与对象边界 |
| [[定位与边界]] | project-charter | current | 已确认定位 + 压缩误认风险 A-E |
| [[决策与残余]] | decision-ledger | mixed | 已确认 / 阶段采用 / 探针 / 候选 / 已否决 + 关键开放残余 |
| [[实施计划]] | implementation-plan | provisional，有未解决 git 冲突 | 当前战役与验收；禁止抢跑清单 |
| [[当前架构]] | engineering-hypotheses | candidate，有冲突 | 工程事实与候选结构 |
| [[第二层-承载设计]] | carrier-design | provisional，有冲突 | 承载能力与张力表 |
| [[大地图]] | project-macro-map | mixed-provisional | 六片地形 + 两个战役的定义（战役定义以此为权威） |
| [[承载认识史]] | recognition-history | append-only | 认识怎样变、旧切法哪里失败 |
| [[总图与生成关系]] · [[第一层-思想与原语]] · [[来源索引]] · [[认知地位与来源]] | 生成图 / 思想投影 / 来源路由 / 来源纪律 | 见各文件 | 第一层约束、结论路由、提升规则 |
| [[10 Projects/_状态板]] | project status board | current，有冲突 | 阶段状态与下一步的官方落点 |
| [[运行数据/README]] · 第一发生场.jsonl · 本目录（DSH 会话/） | 运行数据 | runtime-projection | 发生真相源 + 运行投影 |
| [[来源同步状态]] | evidence-inventory | runtime-projection | 任何 AI 做全局判断前的第一读：哪些来源存在、同步到哪、缺什么 |

认知地位纪律（摘录）：已确认 = 小林明确说出/明确确认且未被顶回；阶段采用 = 为继续设计暂时使用；候选 = 值得继续但未确认；"继续/可以/其他还好" 不等于确认；raw 只追加不回写；未采纳意见与旧解释保留。

## 1. 已确认的项目定位（摘录，非全文）

1. 总方向不是"做一个软件"：让以认识论思想为内核的新存在获得可持续展开的数字承载。
2. 组织是第一阶段形态，不是终点。
3. 软件是第一数字身体，不是组织的外部管理工具。
4. Cognos 建设项目 ≠ Cognos 本身（新存在 / 组织 / 软件 / 项目四个层次不互相替代）。
5. 压缩与误认风险防线：不把新存在压成组织/软件/工具；不套飞书/Slack 等模板；不遗忘已确认纠正；不预定义死位置死关系；不把 AI 方案或沉默当确认。

## 2. 当前战役的官方定义（Vault 口径）

[[大地图]] 第五节的战役定义是权威：

- 战役 1：第一组织切片 —— "制造第一个'多个不互相替换的持续参与者共同面对发生'的工程事实"。状态（08-16，状态板 HEAD 侧）：已完成并验收通过（Gemini / Gemini-B / Codex 共在、独立 continuity、Occurrence Quoting、跨进程重启恢复）。
- 战役 2：第一个真实组织闭环 —— 官方原文：

~~~text
真实问题进入场
→ 多个主体形成不同判断
→ 暂时决定（保留来源、范围、代价与未采纳意见）
→ 邀请/联合某个主体执行
→ 修改代码 / 文档 / 外部世界
→ 测试或现实结果重新进入场
→ 所有参与者面对改变后的现实继续
~~~

"这一步是'组织'开始区别于群聊的关键：行动与现实结果必须改变后续沟通。"

[[决策与残余]] 阶段采用表中另有两条直接相关：
- "第一组织切片之后默认进入第一个真实组织闭环"（重新打开条件：切片暴露更基础断裂）。
- 触发式探针 "DeepSeek Harness / dsh 接入"：触发条件 = "participant/runtime 分离已成立，需要测试另一种身体时"。

结论：按 Vault 自己的口径，项目当前正处在战役 2 的第一轮执行中。

## 3. 战役 2 第一轮的真实执行事实（DSH 侧，全部可核对）

小林在发生场给出了本轮计划（第一发生场.jsonl line 30，occurrence 633cf8d4）：

~~~text
外部发生（GPT/DSH/Antigravity/...）→ Ingress → Cognos 可引用来源
→ 多 Participant 面对讨论 → 小林形成阶段继续 D → Handoff
→ DSH execution body → 真实代码修改/测试/失败 → Result
→ 第一发生场 → 原 Participant 再面对改变后的现实
~~~

第一轮已真实跑完一圈（这就是 "Boundary Slice + 第一组织闭环" 计划的实体）：

| 环节 | 事实 | 出处 |
| --- | --- | --- |
| 判断 A | Gemini：断裂在 Step 5→6（Result 回流降级） | 发生场 3dc6a649 |
| 判断 B | Gemini-B：断裂在 Step 4→5（Handoff 契约），磁盘/Git 才是真相，Result 只需 exit code + git 摘要 + 测试断言 | 发生场 6b592175 |
| 决定 D / Handoff H | 小林：不回来讨论架构，直接执行 Run 1 剩余工程修改 | 发生场 f85f83b5 |
| 执行 | DSH headless 三次尝试：两次 wrapper 失败（approval=ask 无审批者；权限预设启动错）+ 直连成功（session e34e8f98，33 passed） | 见本目录会话摘要 |
| Result R | 已回传发生场第 35 行（occurrence 5062b25c，author=DSH，in_reply_to=H）；结构化 provenance 缺 4 键（8765 中间版本进程静默丢弃）；changed_files 塌缩为 ["cognos/"]；test_status=声称未观测 | 第一发生场.jsonl |
| 收尾 | B6 runner 已修（非零退出码/无 turn/end 判失败，35 passed）；B2 归档 19 个 session；DSH resume 日志 seq 缺陷定位（不影响数据） | 会话 91d76f43 |

A/B 裁决（DSH 侧实证）：B 的"磁盘/Git 是真相、Result 只需三样"成立；A 的"文本降级"部分成立（provenance 键丢失、changed_files 塌缩、test_status 未机械观测）。第一轮真实断点同时落在 Step 4→5（执行边界配置）与 Step 5→6（回传降级）。

## 4. Vault 本身的三个现实问题（任何下一步必须先面对）

1. 四个核心文档带未解决 git 冲突标记：实施计划.md、当前架构.md、第二层-承载设计.md、10 Projects/_状态板.md（obsidian-git 已在 Vault 根生成 conflict-files-obsidian-git.md）。HEAD 侧 = 较新的 08-16 内容（切片验收通过）；origin/master 侧 = 08-15 旧版。合并冲突是"继续更新 Vault 计划文档"的前置现实。
2. Boundary Slice + 第一组织闭环计划尚未同步进 Vault：该计划只存在于第一发生场.jsonl（line 30）与工作区（H 指令、entry 文件）；实施计划 / _状态板 里没有。Vault 计划文档落后于真实战役。
3. 全局重读触发条件可能已满足：[[承载认识史]] 08-16 条记载——"只做下一刀"本身成为一次承载失败，立了维护规则：连续多轮跨越多片地形 / 新运行推翻旧视图 / 不同 AI 各自重新定义项目 / 小林失去方向感 → 触发全局重读。本轮"你是不是只看了 DSH 会话就空泛地给输入"的批评正落在这条规则上。

## 5. 与当前战役最相关的开放残余（摘录）

- 现实行动怎样成为 Cognos 的一等运动，而不是聊天之后附带的 tool log？
- History 在什么条件下才成为 Memory，而不是 prompt material？
- 阶段判断、共识和决定怎样既足以行动，又保留未采纳部分与重新打开条件？
- 原始会话、runtime 发生、当前项目视图、认识史和未来世界状态怎样保持可追溯又不制造多个互相竞争的"真相源"？
- participant 在什么条件下才值得视为主体？（当前只作工程身份锚点）
- 软件怎样才算"承载"，而不是"服务"或"管理"？

## 6. 请 GPT 回应的问题

1. 战役 2 环路现在断在最后一步："所有参与者面对改变后的现实继续"。请设计这一步的具体口径：让 Gemini / Gemini-B 面对什么（R 的哪些部分、DSH 侧回撞要点、引用哪些 occurrence）、问什么、期望产出什么（新判断 / 修正 / 下一决定 D2），以及这一步完成后按环路回到哪里。
2. A/B 裁决复核：第 3 节的实证裁决你是否同意？有没有要复核或反驳的？
3. 同步债务处理顺序：第 4 节的 git 冲突合并与 Boundary 计划同步，应该在继续执行之前做，还是与执行并行？合并冲突按什么原则选边（HEAD 较新 vs 认知地位纪律）？
4. dsh 探针是否已被触发：决策与残余的触发条件是"participant/runtime 分离已成立，需要测试另一种身体"。Boundary 工作是否已满足？下一步是把 dsh 从"执行体"升级为发生场第三 participant，还是保持只做 Handoff 执行体？
5. 下一个真实断裂预测：用 A/B 框架 + 第一轮证据，预测下一轮环路最可能断在哪一步；对应的最小工程动作是什么？
6. 开放残余的优先级：第 5 节里哪一条最应该被下一刀碰触？为什么？

## 7. 给 GPT 的硬约束（摘录自 Vault）

- 禁止抢跑（实施计划）：固定 Space 表/关系枚举；固定 Position/Role 字典；自动多 Agent orchestration；中央总控大盘；三层上下文强制化；把疑惑/未闭合/空无直接 schema 化；为统一 runtime 抹平各自连续性。
- 认知地位：AI 提案不自动升格为已确认；"继续/可以"不等于整份方案获确认；raw 不回写；未采纳意见保留。
- 三时间尺度：大地图慢变 / 实施计划+状态板中速 / 局部探针快变。下一步建议不要同时动三个尺度。
- 不把新存在压成组织软件；组织不是终点。

（本文件由小林决定是否采纳；不构成任何决定。）
