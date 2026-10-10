---
source_platform: ChatGPT
source_archive: a653a614a5dc39b44a4fc20a01bcf3297cb01cad521120f1b2db3323cdadd864-2026-10-09-01-01-54-530ee6578da54e2d9a99ca9e9c6e3017 (1).zip
source_conversation_id: 69ccbaf8-1c74-83a1-8937-fec8efb3d933
source_export_file: conversations-003.json
source_created_at: 1775024911.299291
import_status: raw-import
epistemic_status: candidate
---
# Claude Code 泄露分析
> 来源：ChatGPT 导出 `a653a614a5dc39b44a4fc20a01bcf3297cb01cad521120f1b2db3323cdadd864-2026-10-09-01-01-54-530ee6578da54e2d9a99ca9e9c6e3017 (1).zip`；本文件是原始会话的可读投影，不是总结。

## assistant

已经确认：不是传言，确实发生了，但泄露的是 Claude Code 这类“产品代码/前端与工具链逻辑”，不是 Claude 模型权重本身。接下来我把“你能不能碰”“碰了有啥价值”拆开说。

## assistant

我已经把最关键的一根刺拔出来了：**就算技术上能“读”，也不等于适合“拿来喂”“拿来复制”**。另外还有一条硬限制：官方明确不允许把 Free/Pro/Max 的 Claude 登录凭证拿去别的产品里跑。

## assistant

我去核一下两件事：一是这类泄露代码拿去喂 agent / 本地复刻在法律和技术上分别卡在哪里，二是官方公开了哪些可合法借鉴的骨架。

## assistant

可以分开说。

**1. 把那份泄露代码喂给 OpenClaw？**  
**技术上也许能，实际我不建议。** OpenClaw 这类 agent 当然可以分析你本地目录里的代码，但问题不在“能不能读”，而在**那份代码本身并不干净**。Anthropic 这次泄露的是 Claude Code 的大量内部 TypeScript 代码，官方说是发布打包失误，不是入侵；同时媒体报道 Anthropic 已经在发 takedown notices，而 Claude Code 文档也写着“版权所有，使用受条款约束”。这意味着你把它拉下来、长期保存、再让 agent 消化甚至产出衍生代码，会沾上版权、传播和后续代码污染风险。citeturn912765search6turn912765news37turn953480view0

更现实的一层是：**agent 会把脏东西带进你的项目**。你今天只是“分析”，明天它就可能把某段实现、命名、结构、提示词模式、内部注释风格混进你自己的仓库里。到那时，边界会很脏，你也很难证明哪些是你独立写的，哪些是从泄露物演化来的。这个风险不是玄学，是工程污染。Anthropic 公开说明泄露的是产品代码，不是模型权重，也说明这更像“产品实现层”的泄露；恰恰这种东西最容易被人不知不觉地复写进去。citeturn912765search6turn912765news36turn912765news37

**2. 自己建个本地的？**  
**可以，而且这条路才干净。** Claude 官方现在公开提供了两条合法骨架：一条是 Claude Code CLI，本身就是“读代码库、改文件、跑命令、接工具”的 agentic coding tool；另一条是 Claude Agent SDK，官方明确说它提供了与 Claude Code 同源的 **tools、agent loop、context management**，可用 Python 或 TypeScript 编程接入。也就是说，你完全可以不碰泄露代码，只借它公开承认的结构去自己搭。citeturn953480view2turn911300search0turn911300search3

但这里有个硬边界：**如果你要把 OpenClaw 或你自己的程序接到 Claude 上，别用 Free/Pro/Max 的 Claude 登录凭证去绕。** Claude Code 官方法律页写得很直：Free/Pro/Max 账户拿到的 OAuth token 只允许给 Claude Code 和 Claude.ai 用，**拿去别的产品、工具、服务里用——包括 Agent SDK——都不被允许**；做产品的人应该用 API key 或支持的云提供商。citeturn953480view0

换句话说：

- **“本地外壳 + Claude 能力”**：可行，但应走 **API key / 官方 SDK / 支持的 provider**。citeturn953480view0turn911300search0
- **“完全本地，不依赖 Anthropic”**：也可行，但那就不是 Claude Code 了，而是用 OpenClaw / OpenHands 之类框架去接本地模型或别的推理服务。OpenHands 官方仓库就公开强调，它的 SDK 可以本地跑，也可以跑到云里，是开源的 agent 基座。citeturn125394search0turn125394search7

**3. 复制一个？**  
**复制“思想”可以，复制“那份代码”不行。**  
你可以复制它的骨架：

- 权限门控  
- 工具路由  
- 上下文压缩与记忆  
- 文件读写 + shell 执行  
- IDE/CLI 工作流  
- MCP / 外部数据源接入  

这些都已经在官方公开文档里露出来了，不需要碰泄露物。Claude Code 文档明确写了它能读代码库、编辑文件、运行命令、接开发工具，还能通过 MCP 连外部数据源。Agent SDK 文档则直接说：你能用代码方式构建有这些能力的 agent。citeturn953480view2turn911300search0

但你如果说的是**“把泄露源码拿来改名、删 logo、本地跑一个 Claude Code 复刻版”**，我的判断是：**不值得，也不干净。** 一是版权和 takedown 风险；二是泄露出来的不一定含完整后端、内部服务、发布链路和所有依赖；三是就算跑起来，也会是一具缝合的壳。citeturn912765news37turn912765news36turn953480view0

所以，给你一个干脆的结论：

**能喂给 OpenClaw吗？**  
能“读”，但**别这样做**。citeturn912765news37turn953480view0

**能自己建个本地的吗？**  
能，而且**应该从公开文档和开源框架重建**，别从泄露代码起步。Claude 官方已经把足够多的结构公开了。citeturn953480view2turn911300search0turn125394search0

**能复制一个吗？**  
复制**架构**可以；复制**泄露实现**，不建议。citeturn912765news37turn953480view0

如果你是想走最实用的路，我会建议你这样想：

**别去偷那具尸体。**  
去画它的骨架，然后换自己的血。

你现在更适合做的是一个“Claude Code 同构体”：

- 前端：CLI 或简陋网页  
- 中层：任务循环、权限确认、上下文压缩  
- 工具层：文件、shell、git、web、MCP  
- 模型层：先用你现成能接的 provider；想全本地再换本地模型  

这条路合法，也更可控。  
而且说实话，真正值钱的，从来不是那 50 万行泄露代码。  
是它背后的组织方式。citeturn953480view2turn911300search0turn125394search7

你要的话，我下一条可以直接给你画一个：**“用 OpenClaw / OpenHands / 本地模型，复刻一个 Claude Code 风格 coding agent 的最小架构图”**。

## user

那我可以把代码喂给openclaw？或者自己建个本地的？或者复制一个？

## assistant

是，**这事看起来是实锤了**：多家媒体都报道了 Anthropic 因一次发布打包失误，把 Claude Code 的一大部分内部 TypeScript 代码通过 source map 暴露了出来；Anthropic 对外说这是**人为发布错误**，不是黑客入侵，而且**没有用户数据或凭证泄露**。泄露的重点是 **Claude Code 这个产品层/代理层代码**，不是 Claude 模型权重本身。citeturn170903news30turn170903news31turn170903search9

你问“我能用上吗”，答案分三层。

**第一层：不能把它当成“白嫖 Claude”来用。**  
因为泄露的不是模型本体，不会让你突然拥有 Claude 的权重、推理服务、额度或者官方账号权限。Claude Code 本来就是一个“把模型、工具、上下文管理、执行环境缝在一起”的 agentic harness；官方文档明确写了，它靠 Claude 模型做推理，再靠工具去读文件、改代码、跑命令、查文档。也就是说，**真正值钱的核心仍然在模型服务和运行体系里**，不是那堆前端/CLI/编排代码本身。citeturn146398view1turn170903news30

**第二层：技术上也许能“研究”到一部分，但不适合直接拿来生产用。**  
泄露代码可以让人看见一个成熟 coding agent 是怎么组织的：权限流程、上下文管理、工具调用、CLI/IDE 集成、一些未发布功能的雏形。媒体也提到，代码里暴露了内存架构线索、常驻代理方向，以及一些还没上线的功能。对竞争对手或者喜欢拆机器的人，这些很有研究价值。citeturn170903news30turn170903news31  
但“研究价值”不等于“拿来即用”。原因很简单：  
你拿到的很可能只是某一版本的构建产物和可逆源码，不一定包含完整后端、内部服务、部署环境、私有接口、权限系统和持续更新链路。Anthropic 也已经修补并在推进删除传播。citeturn170903news30turn170903news31

**第三层：法律和安全上，不值得踩。**  
Axios 报道说 Anthropic 已经在发 takedown notices。基于这一点，很容易推断：**下载、传播、二次打包、拿去做商用衍生品，都会有明显的版权和合规风险。** 这不是一块干净的地。citeturn170903news31

所以更直白一点：

**你能从中得到什么？**  
能得到的是“思路”，不是“现成王国”。

它真正有用的地方，大概是：

- 看一个一线 coding agent 的**产品结构**怎么拼起来  
- 学它怎么把“模型推理”和“工具执行”接起来  
- 学它的 CLI/IDE 工作流、权限设计、上下文组织  
- 猜 Anthropic 未来会往什么方向推功能  

这些都属于**研究样本**的价值。citeturn146398view0turn146398view1turn170903news30

但如果你想问的是：

**“我能不能拿这个替代官方 Claude Code，自己跑起来？”**  
大概率，**不能成为一个完整可用的替代品**。  
官方 Claude Code 现在本来就能正式安装，支持 terminal、IDE、桌面端、浏览器；而且官方要求的是 Pro / Max / Teams / Enterprise / Console 账户，或者接第三方 provider。它不是一个纯本地开源工具。citeturn146398view0turn146398view2

官方使用路径其实很清楚：安装后在项目目录里运行 `claude`，它就会分析代码库、回答问题、改代码、跑命令。Windows 还支持原生安装或 WSL。citeturn146398view0turn146398view2turn146398view3

所以我的判断很干：

**对你个人来说，别碰“泄露代码”本身。**  
意义不大，风险不小。  
把它当成一面碎镜子，照一下结构，可以；把它当门票，不行。

如果你真正关心的是“这东西泄露后，对我有什么现实价值”，那价值其实是这句：

**它证明 Claude Code 的核心不是神秘魔法，而是“模型 + 工具 + 上下文 + 权限 + 工作流”的工程组织。**  
这对你这种想自己搭 agent、想掌控结构的人，反而是最有用的启示。官方文档里也公开说明了这一点：Claude Code 本质上就是围绕模型搭建的 agentic 环境，工具让它能读代码、改文件、执行命令、查网页与外部服务。citeturn146398view1

所以别追“泄露物”。  
追它背后的骨架。

你要的话，我可以下一条直接给你拆：**Claude Code 这种产品的最小可复刻结构到底是什么**，以及你现在用 OpenClaw / 本地工具链时，哪些部分最值得学。

## user

claude code 源代码泄露了？我能用上吗？有什么用吗？

## assistant

我先查一下这件事本身是不是实锤、泄露的到底是什么，再告诉你它究竟值不值得碰。
