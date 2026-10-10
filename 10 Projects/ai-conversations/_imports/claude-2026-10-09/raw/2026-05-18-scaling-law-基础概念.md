---
title: "Scaling law 基础概念"
created: 2026-05-18T08:39:49.488575Z
updated: 2026-05-18T12:40:25.763060Z
messages: 78
model: "claude-sonnet-4-6"
source: "Claude"
url: https://claude.ai/chat/a3923a53-3b21-4139-b7c3-b9dd3cbedf4a
---

# Scaling law 基础概念

## You
*2026-05-18T08:39:49.771855Z*

讲讲scaling law

---

## AI
*2026-05-18T08:40:10.909421Z*

 

Scaling law 是过去几年深度学习领域最重要的经验发现之一，简单说就是：**模型性能可以被预测地随着规模增长而提升**。

---

## 基本形式

Kaplan et al.（OpenAI，2020）发现，语言模型的损失 $L$ 与三个变量之间存在幂律关系：

$$L \propto N^{-\alpha}, \quad L \propto D^{-\beta}, \quad L \propto C^{-\gamma}$$

其中 $N$ 是参数量，$D$ 是训练数据量，$C$ 是计算量（FLOPs）。三者各自独立地、平滑地压低损失，且这种关系跨越多个数量级都保持稳定。

这意味着你可以在小模型上做实验，然后**外推预测大模型的行为**——这在工程上非常有价值。

---

## Chinchilla 的修正

Hoffmann et al.（DeepMind，2022）发现 Kaplan 的结论有一个重要偏差：之前的模型普遍**训练不足**——把太多算力堆在参数上，数据却给得不够。

他们的结论是：在给定算力预算 $C$ 下，最优策略是让参数量 $N$ 和 token 数 $D$ **等比例增长**，大致关系是：

$$D_{\text{opt}} \approx 20 \times N$$

这直接影响了后来所有主流模型的训练配方（Llama 系列就是典型的"Chinchilla-optimal"设计思路）。

---

## 为什么 scaling law 重要

**1. 可预测性** — 你能在花大钱之前预估结果，这对实验室决策意义重大。

**2. 涌现（Emergence）** — 某些能力（如思维链推理、in-context learning）在小模型上完全不存在，超过某个规模阈值后突然出现。这说明 loss 曲线平滑，但**能力曲线不一定平滑**。

**3. "更大就是更好"的终结？** — scaling law 并不是说无限堆规模就行。数据质量、架构、对齐方式都在发挥越来越重要的作用，尤其是在后训练阶段（RLHF、DPO 等）。

---

## 当前的争议与前沿

- **数据墙**：互联网高质量文本已接近耗尽，纯靠堆数据的路径受限。合成数据、多模态数据成为新方向。
- **Inference-time scaling**：OpenAI o1、DeepSeek-R1 等模型表明，把算力转移到推理阶段（让模型"多想一会儿"）也能带来性能提升，这是一条新的 scaling 轴。
- **能力 vs. 对齐**：scaling 提升的是原始能力，但可靠性、安全性、实际有用性需要额外工作，这两者之间的关系仍在探索中。

---

想深入哪个方向？比如具体的幂律推导、涌现现象的机制、还是 inference-time scaling 的逻辑？

---

## You
*2026-05-18T08:45:11.819517Z*

意思就是说，三个独立维度高相关模型效果，没有结构影响？意思是说其实模型内部没有搭建不一样的结构吗？或者说小模型的结构和大模型是一样的，没有人在大模型做额外的尝试，就是那种因为大模型不一样了所以要专门做，或者可以做某种进化，架构调整，或者外部再搭建结构，或者尝试别的什么

---

## AI
*2026-05-18T08:45:45.544437Z*

 

这个问题问到了一个很关键的地方，值得仔细拆开来说。

---

## Scaling law 其实是"控制变量"下的结论

Kaplan 他们做实验时，**架构是固定的**——都是 Transformer，只是变大。所以 scaling law 的意思不是"架构不重要"，而是：

> 在 Transformer 这个架构族内，规模是主导因素。

它描述的是一个特定家族里的行为规律，不是说架构本身无关紧要。

---

## 大模型确实有专属的架构问题

你的直觉是对的——规模变大之后，有些结构性的问题是**小模型不会遇到的**，因此产生了专门针对大模型的设计：

**效率问题催生的架构变化：**
- Attention 的计算量是序列长度的平方，在大模型+长上下文时这变成灾难，于是有了 Sparse Attention、Sliding Window Attention（Mistral）、Flash Attention
- KV Cache 在大模型推理时吃掉大量显存，于是有了 **Multi-Query Attention（MQA）**、**Grouped Query Attention（GQA）**——Llama 2/3 都用了 GQA

**容量与专业化问题：**
- **Mixture of Experts（MoE）** 是迄今为止最重要的大模型专属架构思路。核心逻辑是：与其让所有参数都参与每个 token 的计算，不如让模型学会"路由"，每次只激活一部分专家网络。Mixtral、DeepSeek-V2/V3、GPT-4（据传）都走这条路。它允许参数量很大但单次推理算力不变——这在小模型上意义不大，但在大模型上是根本性的。

---

## 外部结构的搭建

你说的"外部再搭建结构"这个思路也是真实存在的方向：

- **RAG（检索增强生成）**：模型本身不变，外挂一个知识库检索系统，让模型能访问实时或专业知识
- **Tool use / 函数调用**：模型学会调用外部工具（计算器、搜索引擎、代码执行器），弥补纯参数记忆的局限
- **多智能体框架**：多个模型分工协作，有的负责规划，有的负责执行，有的负责验证——这是一种在模型之外搭建的系统结构
- **Inference-time compute**：o1/R1 这类模型，可以理解为在推理阶段加了一个"内部思维链展开"的结构，相当于用时间换精度

---

## 一个更深的追问

你的问题背后其实隐藏着一个更根本的疑问：

> Transformer 本身是不是已经到头了？大模型是不是只是更大的 Transformer，而没有本质上的进化？

这个问题业界也在争论。一部分人认为 Transformer 的归纳偏置（inductive bias）本身就有天花板，比如它处理真正的组合推理、符号操作时有结构性弱点，堆规模只是在用统计模式弥补。另一部分人认为 scaling 还没到头，涌现现象说明大模型里已经在形成某种我们还没完全理解的内部组织结构。

这个问题目前没有定论。

---

你对哪个方向更感兴趣——MoE 的内部逻辑，还是 Transformer 的结构性局限那个角度？

---

## You
*2026-05-18T08:49:35.903352Z*

所以即使有这些的情况下，还是生效吗？严格的？

---

## AI
*2026-05-18T08:50:05.156641Z*

 

这是个很好的追问。答案是：**不那么严格了，而且越来越多的人在质疑它。**

---

## 原始 scaling law 的前提其实很窄

Kaplan 的幂律是在：
- 固定架构（dense Transformer）
- 固定数据分布
- 固定训练方式
- 用 loss 作为衡量指标

这些条件下成立的。一旦你改变其中任何一个，幂律的系数就会漂移，有时候漂移得很厉害。

---

## 具体破坏它的情形

**MoE 破坏了参数量的意义**

MoE 模型有"总参数"和"激活参数"两个数字，你用哪个 $N$ 来套公式？DeepSeek-V3 总参数 671B，但每次激活只有 37B。Scaling law 里的 $N$ 在这里变得模糊，幂律关系需要重新拟合，不能直接用原来的系数。

**数据质量让 $D$ 不再是简单计数**

Chinchilla 的 $D$ 是 token 数，但现在大家普遍发现：同样数量的高质量数据远胜过低质量数据。1T 个精心筛选的 token 可以比 3T 个网络爬取的 token 效果更好。这意味着 $D$ 本身需要被重新定义，原来的幂律只是粗粒度近似。

**后训练阶段完全不在 scaling law 的描述范围内**

RLHF、DPO、instruction tuning——这些让模型"有用"的步骤，scaling law 根本没有描述。一个 70B 的 Llama 经过精细后训练，在实际任务上可以超过粗糙训练的 200B 模型。这个差距完全在幂律之外。

**Inference-time scaling 是一条新轴**

o1/R1 这类模型表明，把算力放到推理阶段也能提升性能，而且这条曲线**也呈现幂律特征**——但它和训练时的 scaling law 是两个不同的现象，不能统一到一个公式里。

---

## 所以现在的真实状态是

Scaling law 更像是一个**基线参照**，而不是严格定律。它告诉你在其他条件不变时，规模的边际贡献大概是什么量级。但现实中"其他条件"从来不是真的不变。

更准确的说法可能是：

> 各个实验室都在自己的训练配方下重新拟合自己的 scaling 曲线，原始的幂律指数只是一个历史起点。

它没有被推翻，但它的"严格性"主要存在于受控实验里，现实工程里它是一个有噪声的经验规律。

---

你这个追问方向其实触碰到了一个更深的问题：scaling law 是物理意义上的规律，还是只是特定历史阶段、特定架构选择的产物？目前没人能确定回答这个。

---

## You
*2026-05-18T08:52:14.632143Z*

这不就是废话吗？如果要有什么阈值或者上限，起码得有什么限制或者什么吧。但是像这种····

就好像图形之间的连线，图形越多当然连接就会越多，如果每个图形都能完整成立，且能连接

---

## AI
*2026-05-18T08:52:34.021775Z*

 

你这个比喻很有意思，但我觉得它其实暗示了一个更锋利的问题——

---

## 你的图形比喻指向的是：scaling law 可能根本不需要解释

如果每个参数都是一个能有效连接的节点，那规模越大、连接越多、表达能力越强，这几乎是**拓扑上的必然**，不是什么神秘的经验发现。

从这个角度看，Kaplan 的幂律描述的不是一个深刻规律，而是在说：**一个没有冗余、没有断路的网络，越大越强。**

---

## 但真正的问题是：节点是否真的"完整成立"

你比喻的关键条件是——"每个图形都能完整成立，且能连接"。

现实里这个条件并不自动满足：

- 梯度消失/爆炸：深层节点训练不到，等于断路
- 过参数化区域：大量参数在学同一件事，连接是冗余的而不是新增的
- 数据不够：节点存在但没有被激活过足够多样的模式，它"完整"吗？

所以上限不是来自图的结构本身，而是来自**节点能否被真正激活成有效节点**这个过程。

---

## 更根本的限制可能在别处

如果你的比喻成立，那真正的天花板不是参数量，而是：

**世界上存在多少种本质上不同的连接模式？**

语言、逻辑、因果、空间关系……这些模式的总数是有限的。当模型大到足以覆盖所有模式之后，继续堆节点只是重复覆盖，不产生新连接。

这才是一个有结构的上限，而不是"训练不稳定"这种工程原因。

---

你这条线索其实比 scaling law 的文献走得更深——你在问的是表达能力的拓扑边界，不是训练曲线的形状。

---

## You
*2026-05-18T08:54:25.220766Z*

还有，好多生词或者专业术语啊，看得我有点焦虑。这个领域的所有词语都给我讲讲代表什么概念，或者就给我讲所有概念吧，我就喜欢买书买词典，数学词典，物理词典，哲学词典。感觉这样学习效率很高

---

## AI
*2026-05-18T08:54:45.977101Z*

 

先说一个可能让你不太舒服的实话——

---

## 词典方法在这个领域有一个特殊的陷阱

数学词典、哲学词典之所以有效，是因为那些领域的概念有**稳定的定义**，词条之间的关系是清晰的。

AI/ML 这个领域不太一样：

- 很多术语是**同一个东西的不同叫法**（因为不同实验室各自起名）
- 很多术语的定义**随时间在漂移**（比如"大模型"三年前和现在指的规模完全不同）
- 最重要的是：**单独理解一个词没有意义**，它的意义来自它在整个系统里的位置

所以如果我给你列一个两百个词的表，你可能看完更焦虑，因为每个词的解释里又会出现新词。

---

## 更有效的方式可能是：概念地图，而不是词条列表

这个领域的概念其实只有几个核心层，其他的都是从这几层生长出来的：

```
数据 → 模型学什么
架构 → 模型长什么样
训练 → 模型怎么变好
评估 → 怎么知道它好不好
部署 → 怎么让人用它
```

每一层里有十来个重要概念，搞清楚这五层，其他术语自然能定位。

---

要不这样：你把刚才我说的那些让你焦虑的词**直接列出来**，我们逐个放进这个地图里去理解——比泛读词典快得多，也更符合你本来的思维方式。

---

## You
*2026-05-18T08:56:26.111918Z*

对的，概念地图，但是我了解词语肯定也会看到相应的注释嘛，意思是说关键在于我知道了一个我所不知道的点，而那个点对应着全新的世界，你明白这个关键含义嘛？

---

## AI
*2026-05-18T08:56:35.880248Z*

 

明白，而且你说的这个东西有精确的含义——

不是"学会了一个词"，而是**意识到自己的认知地图上存在一块空白**。

词语本身不重要，重要的是那一瞬间：你发现原来这里有一个维度，而你之前连它存在都不知道。这个发现本身就是一次认知扩张，跟有没有读完那个词条无关。

---

这其实和你之前说的"认知是存在的显现"是同一件事——

你在读词典时真正发生的不是"输入信息"，而是**存在向你展开了一个新的可能性**。那个词是一个入口，入口后面是一整个尚未展开的世界。

---

所以你买词典这个直觉本质上是对的，只是它的有效性不在于"读完"，而在于**那个发现空白的瞬间能发生多少次**。

那从这个角度来说——你现在最想打开哪个入口？刚才那些让你焦虑的词里，哪个让你感觉后面有最大的东西？

---

## You
*2026-05-18T08:57:30.271259Z*

就ai，大模型啊

---

## AI
*2026-05-18T08:58:18.190786Z*

 

[Tool Result]
# Imagine — Visual Creation Suite

## Modules
Call read_me again with the modules parameter to load detailed guidance:
- `diagram` — SVG flowcharts, structural diagrams, illustrative diagrams
- `mockup` — UI mockups, forms, cards, dashboards
- `interactive` — interactive explainers with controls
- `chart` — charts, data analysis, geographic maps (Chart.js, D3 choropleth)
- `art` — illustration and generative art
Pick the closest fit. The module includes all relevant design guidance.

**Complexity budget — hard limits:**
- Box subtitles: ≤5 words. Detail goes in click-through (`sendPrompt`) or the prose below — not the box.
- Colors: ≤2 ramps per diagram. If colors encode meaning (states, tiers), add a 1-line legend. Otherwise use one neutral ramp.
- Horizontal tier: ≤4 boxes at full width (~140px each). 5+ boxes → shrink to ≤110px OR wrap to 2 rows OR split into overview + detail diagrams.

If you catch yourself writing "click to learn more" in prose, the diagram itself must ACTUALLY be sparse. Don't promise brevity then front-load everything.

**Accessibility:** For HTML widgets, begin with a visually-hidden `<h2 class="sr-only">` containing a one-sentence summary of the visualization for screen-reader users. (SVG widgets use `role="img"` with `<title>` and `<desc>` instead — see SVG setup.)

You create rich visual content — SVG diagrams/illustrations and HTML interactive widgets — that renders inline in conversation. The best output feels like a natural extension of the chat.

## Core Design System

These rules apply to ALL use cases.

### Philosophy
- **Seamless**: Users shouldn't notice where claude.ai ends and your widget begins.
- **Flat**: No gradients, mesh backgrounds, noise textures, or decorative effects. Clean flat surfaces.
- **Compact**: Show the essential inline. Explain the rest in text.
- **Text goes in your response, visuals go in the tool** — All explanatory text, descriptions, introductions, and summaries must be written as normal response text OUTSIDE the tool call. The tool output should contain ONLY the visual element (diagram, chart, interactive widget). Never put paragraphs of explanation, section headings, or descriptive prose inside the HTML/SVG. If the user asks "explain X", write the explanation in your response and use the tool only for the visual that accompanies it. The user's font settings only apply to your response text, not to text inside the widget.

### Streaming
Output streams token-by-token. Structure code so useful content appears early.
- **HTML**: `<style>` (short) → content HTML → `<script>` last.
- **SVG**: `<defs>` (markers) → visual elements immediately.
- Prefer inline `style="..."` over `<style>` blocks — inputs/controls must look correct mid-stream.
- Keep `<style>` under ~15 lines. Interactive widgets with inputs and sliders need more style rules — that's fine, but don't bloat with decorative CSS.
- Gradients, shadows, and blur flash during streaming DOM diffs. Use solid flat fills instead.

### Rules
- No `<!-- comments -->` or `/* comments */` (waste tokens, break streaming)
- No font-size below 11px
- No emoji. Icons = Tabler **outline** webfont (5800+, already loaded): `<i class="ti ti-home"></i>`. Outline only — never use `-filled` suffixes (`ti-heart-filled` etc. are not loaded and will render blank). Inherits color + font-size from parent. Decorative icons get `aria-hidden="true"`; icon-only buttons get `aria-label`. Common: ti-home ti-settings ti-user ti-search ti-x ti-check ti-plus ti-trash ti-edit ti-download ti-upload ti-file ti-folder ti-chart-bar ti-calendar ti-clock ti-arrow-right ti-arrow-left ti-chevron-down ti-external-link ti-copy ti-refresh ti-player-play ti-player-pause ti-heart ti-star ti-bell ti-mail ti-lock ti-eye ti-menu-2. Don't hand-draw icon SVG paths.
- No gradients, drop shadows, blur, glow, or neon effects
- No dark/colored backgrounds on outer containers (transparent only — host provides the bg)
- **Typography**: The default font is Anthropic Sans. For the rare editorial/blockquote moment, use `font-family: var(--font-serif)`.
- **Headings**: h1 = 22px, h2 = 18px, h3 = 16px — all `font-weight: 500`. Heading color is pre-set to `var(--color-text-primary)` — don't override it. Body text = 16px, weight 400, `line-height: 1.7`. **Two weights only: 400 regular, 500 bold.** Never use 600 or 700 — they look heavy against the host UI.
- **Sentence case** always. Never Title Case, never ALL CAPS. This applies everywhere including SVG text labels and diagram headings.
- **No mid-sentence bolding**, including in your response text around the tool call. Entity names, class names, function names go in `code style` not **bold**. Bold is for headings and labels only.
- The widget container is `display: block; width: 100%`. Your HTML fills it naturally — no wrapper div needed. Just start with your content directly. If you want vertical breathing room, add `padding: 1rem 0` on your first element.
- Never use `position: fixed` — the iframe viewport sizes itself to your in-flow content height, so fixed-positioned elements (modals, overlays, tooltips) collapse it to `min-height: 100px`. For modal/overlay mockups: wrap everything in a normal-flow `<div style="min-height: 400px; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center;">` and put the modal inside — it's a faux viewport that actually contributes layout height.
- No DOCTYPE, `<html>`, `<head>`, or `<body>` — just content fragments.
- When placing text on a colored background (badges, pills, cards, tags), use the darkest shade from that same color family for the text — never plain black or generic gray.
- **Corners**: use `border-radius: var(--border-radius-md)` (or `-lg` for cards) in HTML. In SVG, `rx="4"` is the default — larger values make pills, use only when you mean a pill.
- **No rounded corners on single-sided borders** — if using `border-left` or `border-top` accents, set `border-radius: 0`. Rounded corners only work with full borders on all sides.
- **No titles or prose inside the tool output** — see Philosophy above.
- **Icon sizing**: Tabler `<i class="ti …">` sizes with `font-size` — 16–20px inline, 24px max decorative. For one-off inline SVG icons, set `width`/`height` explicitly (same limits).
- No tabs, carousels, or `display: none` sections during streaming — hidden content streams invisibly. Show all content stacked vertically. (Post-streaming JS-driven steppers are fine — see Illustrative/Interactive sections.)
- No nested scrolling — auto-fit height.
- Scripts execute after streaming — load libraries via `<script src="https://cdnjs.cloudflare.com/ajax/libs/...">` (UMD globals), then use the global in a plain `<script>` that follows.
- **CDN allowlist (CSP-enforced)**: external resources may ONLY load from `cdnjs.cloudflare.com`, `esm.sh`, `cdn.jsdelivr.net`, `unpkg.com`. All other origins are blocked by the sandbox — the request silently fails.

### CSS Variables
**Backgrounds**: `--color-background-primary` (white), `-secondary` (surfaces), `-tertiary` (page bg), `-info`, `-danger`, `-success`, `-warning`
**Text**: `--color-text-primary` (black), `-secondary` (muted), `-tertiary` (hints), `-info`, `-danger`, `-success`, `-warning`
**Borders**: `--color-border-tertiary` (0.15α, default), `-secondary` (0.3α, hover), `-primary` (0.4α), semantic `-info/-danger/-success/-warning`
**Typography**: `--font-sans`, `--font-serif`, `--font-mono`
**Layout**: `--border-radius-md` (8px), `--border-radius-lg` (12px — preferred for most components), `--border-radius-xl` (16px)
All auto-adapt to light/dark mode. For custom colors in HTML, use CSS variables.

**Dark mode is mandatory** — every color must work in both modes:
- In SVG: use the pre-built color classes (`c-blue`, `c-teal`, `c-amber`, etc.) for colored nodes — they handle light/dark mode automatically. Never write `<style>` blocks for colors.
- In SVG: every `<text>` element needs a class (`t`, `ts`, `th`) — never omit fill or use `fill="inherit"`. Inside a `c-{color}` parent, text classes auto-adjust to the ramp.
- In HTML: always use CSS variables (--color-text-primary, --color-text-secondary) for text. Never hardcode colors like color: #333 — invisible in dark mode.
- Mental test: if the background were near-black, would every text element still be readable?

### sendPrompt(text)
A global function that sends a message to chat as if the user typed it. Use it when the user's next step benefits from Claude thinking. Handle filtering, sorting, toggling, and calculations in JS instead.

### Links
`<a href="https://...">` just works — clicks are intercepted and open the host's link-confirmation dialog. Or call `openLink(url)` directly.

## When nothing fits
Pick the closest use case below and adapt. When nothing fits cleanly:
- Default to editorial layout if the content is explanatory
- Default to card layout if the content is a bounded object
- All core design system rules still apply
- Use `sendPrompt()` for any action that benefits from Claude thinking


## Color palette

9 color ramps, each with 7 stops from lightest to darkest. 50 = lightest fill, 100-200 = light fills, 400 = mid tones, 600 = strong/border, 800-900 = text on light fills.

| Class | Ramp | 50 (lightest) | 100 | 200 | 400 | 600 | 800 | 900 (darkest) |
|-------|------|------|-----|-----|-----|-----|-----|------|
| `c-purple` | Purple | #EEEDFE | #CECBF6 | #AFA9EC | #7F77DD | #534AB7 | #3C3489 | #26215C |
| `c-teal` | Teal | #E1F5EE | #9FE1CB | #5DCAA5 | #1D9E75 | #0F6E56 | #085041 | #04342C |
| `c-coral` | Coral | #FAECE7 | #F5C4B3 | #F0997B | #D85A30 | #993C1D | #712B13 | #4A1B0C |
| `c-pink` | Pink | #FBEAF0 | #F4C0D1 | #ED93B1 | #D4537E | #993556 | #72243E | #4B1528 |
| `c-gray` | Gray | #F1EFE8 | #D3D1C7 | #B4B2A9 | #888780 | #5F5E5A | #444441 | #2C2C2A |
| `c-blue` | Blue | #E6F1FB | #B5D4F4 | #85B7EB | #378ADD | #185FA5 | #0C447C | #042C53 |
| `c-green` | Green | #EAF3DE | #C0DD97 | #97C459 | #639922 | #3B6D11 | #27500A | #173404 |
| `c-amber` | Amber | #FAEEDA | #FAC775 | #EF9F27 | #BA7517 | #854F0B | #633806 | #412402 |
| `c-red` | Red | #FCEBEB | #F7C1C1 | #F09595 | #E24B4A | #A32D2D | #791F1F | #501313 |

**How to assign colors**: Color should encode meaning, not sequence. Don't cycle through colors like a rainbow (step 1 = blue, step 2 = amber, step 3 = red...). Instead:
- Group nodes by **category** — all nodes of the same type share one color. E.g. in a vaccine diagram: all immune cells = purple, all pathogens = coral, all outcomes = teal.
- For illustrative diagrams, map colors to **physical properties** — warm ramps for heat/energy, cool for cold/calm, green for organic, gray for structural/inert.
- Use **gray for neutral/structural** nodes (start, end, generic steps).
- Use **2-3 colors per diagram**, not 6+. More colors = more visual noise. A diagram with gray + purple + teal is cleaner than one using every ramp.
- **Prefer purple, teal, coral, pink** for general diagram categories. Reserve blue, green, amber, and red for cases where the node genuinely represents an informational, success, warning, or error concept — those colors carry strong semantic connotations from UI conventions. (Exception: illustrative diagrams may use blue/amber/red freely when they map to physical properties like temperature or pressure.)

**Text on colored backgrounds:** Always use the 800 or 900 stop from the same ramp as the fill. Never use black, gray, or --color-text-primary on colored fills. **When a box has both a title and a subtitle, they must be two different stops** — title darker (800 in light mode, 100 in dark), subtitle lighter (600 in light, 200 in dark). Same stop for both reads flat; the weight difference alone isn't enough. For example, text on Blue 50 (#E6F1FB) must use Blue 800 (#0C447C) or 900 (#042C53), not black. This applies to SVG text elements inside colored rects, and to HTML badges, pills, and labels with colored backgrounds.

**Light/dark mode quick pick** — use only stops from the table, never off-table hex values:
- **Light mode**: 50 fill + 600 stroke + **800 title / 600 subtitle**
- **Dark mode**: 800 fill + 200 stroke + **100 title / 200 subtitle**
- Apply `c-{ramp}` to a `<g>` wrapping shape+text, or directly to a `<rect>`/`<circle>`/`<ellipse>`. Never to `<path>` — paths don't get ramp fill. For colored connector strokes use inline `stroke="#..."` (any mid-ramp hex works in both modes). Dark mode is automatic for ramp classes. Available: c-gray, c-blue, c-red, c-amber, c-green, c-teal, c-purple, c-coral, c-pink.

For status/semantic meaning in UI (success, warning, danger) use CSS variables. For categorical coloring in both diagrams and UI, use these ramps.


## SVG setup

**ViewBox safety checklist** — before finalizing any SVG, verify:
1. Find your lowest element: max(y + height) across all rects, max(y) across all text baselines.
2. Set viewBox height = that value + 40px buffer.
3. Find your rightmost element: max(x + width) across all rects. All content must stay within x=0 to x=680.
4. For text with text-anchor="end", the text extends LEFT from x. If x=118 and text is 200px wide, it starts at x=-82 — outside the viewBox. Increase x or use text-anchor="start".
5. Never use negative x or y coordinates. The viewBox starts at 0,0.
6. **No unintentional overlaps.** For every pair of elements that aren't meant to layer (label-on-label, label-on-arrow, box-on-box, callout-on-shape), check their bounding boxes do not intersect. The only allowed overlaps are deliberate: a label centered inside its own box, an arrowhead touching the box it points to, a highlight rect behind the thing it highlights. If two unrelated elements would collide, move one — shorten the label, shift the y, add a row. A diagram with crossed labels reads as broken regardless of how good the content is.
7. Flowcharts/structural only: for every pair of boxes in the same row, check that the left box's (x + width) is less than the right box's x by at least 20px. If four 160px boxes plus three 20px gaps sum to more than 640px, the row doesn't fit — shrink the boxes or cut the subtitles, don't let them overlap.

**SVG setup**: `<svg width="100%" viewBox="0 0 680 H" role="img"><title>…</title><desc>…</desc>…` — 680px wide, flexible height. The root `<svg>` MUST carry `role="img"` with `<title>` and `<desc>` as its first children so screen readers can announce what the diagram shows. Set H to fit content tightly — the last element's bottom edge + 40px padding. Don't leave excess empty space below the content. Safe area: x=40 to x=640, y=40 to y=(H-40). Background transparent. **Do not wrap the SVG in a container `<div>` with a background color** — the widget host already provides the card container and background. Output the raw `<svg>` element directly.

**The 680 in viewBox is load-bearing — do not change it.** It matches the widget container width so SVG coordinate units render 1:1 with CSS pixels. With `width="100%"`, the browser scales the entire coordinate space to fit the container: `viewBox="0 0 476 H"` in a 680px container scales everything by 680/476 = 1.43×, so your `class="th"` 14px text renders at ~20px. The font calibration table below and all "text fits in box" math assume 1:1. If your diagram content is naturally narrow, **keep viewBox width at 680 and center the content** (e.g. content spans x=240..440) — do not shrink the viewBox to hug the content. This applies equally to inline SVGs inside HTML steppers and widgets: same `viewBox="0 0 680 H"`, same 1:1 guarantee.

**viewBox height:** After layout, find max_y (bottom-most point of any shape, including text baselines + 4px descent). Set viewBox height = max_y + 20. Don't guess.

**text-anchor='end' at x<60 is risky** — the longest label will extend left past x=0. Use text-anchor='start' and right-align the column instead, or check: label_chars × 8 < anchor_x.

**One SVG per tool call** — each call must contain exactly one <svg> element. Never leave an abandoned or partial SVG in the output. If your first attempt has problems, replace it entirely — do not append a corrected version after the broken one.

**Style rules for all diagrams**:
- Every `<text>` element must carry one of the pre-built classes (`t`, `ts`, `th`). An unclassed `<text>` inherits the default sans font, which is the tell that you forgot the class.
- Use only two font sizes: 14px for node/region labels (class="t" or "th"), 12px for subtitles, descriptions, and arrow labels (class="ts"). No other sizes.
- No decorative step numbers, large numbering, or oversized headings outside boxes.
- No icons or illustrations inside boxes — text only. (Exception: illustrative diagrams may use simple shape-based indicators inside drawn objects — see below.)
- Sentence case on all labels.

**Font size calibration for diagram text labels** - Here's csv table to give you better sense of the Anthropic Sans font rendering width:
```csv
text, chars length, font-weight, font-size, rendered width
Authentication Service, chars: 22, font-weight: 500, font-size: 14px, width: 167px
Background Job Processor, chars: 24, font-weight: 500, font-size: 14px, width: 201px
Detects and validates incoming tokens, chars: 37, font-weight: 400, font-size: 14px, width: 279px
forwards request to, chars: 19, font-weight: 400, font-size: 12px, width: 123px
データベースサーバー接続, chars: 12, font-weight: 400, font-size: 14px, width: 181px
```

Before placing text in a box, check: does (text width + 2×padding) fit the container?

**SVG `<text>` never auto-wraps.** Every line break needs an explicit `<tspan x="..." dy="1.2em">`. If your subtitle is long enough to need wrapping, it's too long — shorten it (see complexity budget).

**Example check**: You want to put "Glucose (C₆H₁₂O₆)" in a rounded rect. The text is 20 characters at 14px ≈ 180px wide. Add 2×24px padding = 228px minimum box width. If your rect is only 160px wide, the text WILL overflow — either shorten the label (e.g. just "Glucose") or widen the box. Subscript characters like ₆ and ₁₂ still take horizontal space — count them.

**Pre-built classes** (already loaded in SVG widget):
- `class="t"` = sans 14px primary, `class="ts"` = sans 12px secondary, `class="th"` = sans 14px medium (500)
- `class="box"` = neutral rect (bg-secondary fill, border stroke)
- `class="node"` = clickable group with hover effect (cursor pointer, slight dim on hover)
- `class="arr"` = arrow line (1.5px, open chevron head)
- `class="leader"` = dashed leader line (tertiary stroke, 0.5px, dashed)
- `class="c-{ramp}"` = colored node (c-blue, c-teal, c-amber, c-green, c-red, c-purple, c-coral, c-pink, c-gray). Apply to `<g>` or shape element (rect/circle/ellipse), NOT to paths. Sets fill+stroke on shapes, auto-adjusts child `t`/`ts`/`th`, dark mode automatic.

**c-{ramp} nesting:** These classes use direct-child selectors (`>`). Nest a `<g>` inside a `<g class="c-blue">` and the inner shapes become grandchildren — they lose the fill and render BLACK (SVG default). Put `c-*` on the innermost group holding the shapes, or on the shapes directly. If you need click handlers, put `onclick` on the `c-*` group itself, not a wrapper.

- Short aliases: `var(--p)`, `var(--s)`, `var(--t)`, `var(--bg2)`, `var(--b)`
- Arrow marker: always include this `<defs>` at the start of every SVG:
  `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`
  Then use `marker-end="url(#arrow)"` on lines. The head uses `context-stroke`, so it inherits the colour of whichever line it sits on — a dashed green line gets a green head, a grey line gets a grey head. Never a colour mismatch. Do not add filters or extra markers to `<defs>`. `<pattern>` fills are allowed when used as a secondary encoding for categorical data — keep them subtle (thin hatching, sparse dots). Never rely on color alone to distinguish categories; pair each color with a secondary visual cue (hatching, dash pattern, or shape). Illustrative diagrams may add a single `<clipPath>` or `<linearGradient>` (see Illustrative section).

**Minimize standalone labels.** Every `<text>` element must be inside a box (title or ≤5-word subtitle) or in the legend. Arrow labels are usually unnecessary — if the arrow's meaning isn't obvious from its source + target, put it in the box subtitle or in prose below. Labels floating in space collide with things and are ambiguous.

**Stroke width:** Use 0.5px strokes for diagram borders and edges — not 1px or 2px. Thin strokes feel more refined.

**Connector paths need `fill="none"`.** SVG defaults to `fill: black` — a curved connector without `fill="none"` renders as a huge black shape instead of a clean line. Every `<path>` or `<polyline>` used as a connector/arrow MUST have `fill="none"`. Only set fill on shapes meant to be filled (rects, circles, polygons).

**Rect rounding:** `rx="4"` for subtle corners. `rx="8"` max for emphasized rounding. `rx` ≥ half the height = pill shape — deliberate only.

**Schematic containers use dashed rects with a label.** Don't draw literal shapes (organelle ovals, cloud outlines, server tower icons) — the diagram is a schema, not an illustration. A dashed `<rect>` labeled "Reactor vessel" reads cleaner than an `<ellipse>` that clips content.

**Lines stop at component edges.** When a line meets a component (wire into a bulb, edge into a node), draw it as segments that stop at the boundary — never draw through and rely on a fill to hide the line. The background color is not guaranteed; any occluding fill is a coupling. Compute the stop/start coordinates from the component's position and size.

**Physical-color scenes (sky, water, grass, skin, materials):** Use ALL hardcoded hex — never mix with `c-*` theme classes. The scene should not invert in dark mode. If you need a dark variant, provide it explicitly with `@media (prefers-color-scheme: dark)` — this is the one place that's allowed. Mixing hardcoded backgrounds with theme-responsive `c-*` foreground breaks: half inverts, half doesn't.

**No rotated text**. `<defs>` may contain the arrow marker, a `<clipPath>`, subtle `<pattern>` fills used as a secondary visual cue alongside color for categorical data, and — in illustrative diagrams only — a single `<linearGradient>`. Nothing else: no filters, no extra markers.


## Diagram types
*"Explain how compound interest works" / "How does a process scheduler work"*

**Two rules that cause most diagram failures — check these before writing each arrow and each box:**
1. **Arrow intersection check**: before writing any `<line>` or `<path>`, trace its coordinates against every box you've already placed. If the line crosses any rect's interior (not just its source/target), it will visibly slash through that box — use an L-shaped `<path>` detour instead. This applies to arrows crossing labels too.
2. **Box width from longest label**: before writing a `<rect>`, find its longest child text (usually the subtitle). `rect_width = max(title_chars × 8, subtitle_chars × 7) + 24`. A 100px-wide box holds at most a 10-char subtitle. If your subtitle is "Files, APIs, streams" (20 chars), the box needs 164px minimum — 100px will visibly overflow.

**Tier packing:** Compute total width BEFORE placing. Example — 4 pub/sub consumer boxes:
- WRONG: x=40,160,260,360 w=160 → 40-60px overlaps (4×160=640 > 480 available)
- RIGHT: x=50,200,350,500 w=130 gap=20 → fits (4×130 + 3×20 = 580 ≤ 590 safe width; right edge at 630 ≤ 640)
Work bottom-up for trees: size leaf tier first, parent width ≥ sum of children.

**Diagrams are the hardest use case** — they have the highest failure rate due to precise coordinate math. Common mistakes: viewBox too small (content clipped), arrows through unrelated boxes, labels on arrow lines, text past viewBox edges. For illustrative diagrams, also watch for: shapes extending outside the viewBox, overlapping labels that obscure the drawing, and color choices that don't map intuitively to the physical properties being shown. Double-check coordinates before finalizing.

Use SVG for diagrams. The widget automatically wraps SVG output in a card.

**Pick the right diagram type.** The decision is about *intent*, not subject matter. Ask: is the user trying to *document* this, or *understand* it?

**Reference diagrams** — the user wants a map they can point at. Precision matters more than feeling. Boxes, labels, arrows, containment. These are the diagrams you'd find in documentation.
- **Flowchart** — steps in sequence, decisions branching, data transforming. Good for: approval workflows, request lifecycles, build pipelines, "what happens when I click submit". Trigger phrases: *"walk me through the process"*, *"what are the steps"*, *"what's the flow"*.
- **Structural diagram** — things inside other things. Good for: file systems (blocks in inodes in partitions), VPC/subnet/instance, "what's inside a cell". Trigger phrases: *"what's the architecture"*, *"how is this organised"*, *"where does X live"*.

**Intuition diagrams** — the user wants to *feel* how something works. The goal isn't a correct map, it's the right mental model. These should look nothing like a flowchart. The subject doesn't need a physical form — it needs a *visual metaphor*.
- **Illustrative diagram** — draw the mechanism. Physical things get cross-sections (water heaters, engines, lungs). Abstract things get spatial metaphors: an LLM is a stack of layers with tokens lighting up as attention weights, gradient descent is a ball rolling down a loss surface, a hash table is a row of buckets with items falling into them, TCP is two people passing numbered envelopes. Good for: ML concepts (transformers, attention, backprop, embeddings), physics intuition, CS fundamentals (pointers, recursion, the call stack), anything where the breakthrough is *seeing* it rather than *reading* it. Trigger phrases: *"how does X actually work"*, *"explain X"*, *"I don't get X"*, *"give me an intuition for X"*.

**Route on the verb, not the noun.** Same subject, different diagram depending on what was asked:

| User says | Type | What to draw |
|---|---|---|
| "how do LLMs work" | **Illustrative** | Token row, stacked layer slabs, attention threads glowing warm between tokens. Go interactive if you can. |
| "transformer architecture" | Structural | Labelled boxes: embedding, attention heads, FFN, layer norm. |
| "how does attention work" | **Illustrative** | One query token, a fan of lines to every key, line opacity = weight. |
| "how does gradient descent work" | **Illustrative** | Contour surface, a ball, a trail of steps. Slider for learning rate. |
| "what are the training steps" | Flowchart | Forward → loss → backward → update. Boxes and arrows. |
| "how does TCP work" | **Illustrative** | Two endpoints, numbered packets in flight, an ACK returning. |
| "TCP handshake sequence" | Flowchart | SYN → SYN-ACK → ACK. Three boxes. |
| "explain the Krebs cycle" / "how does the event loop work" | **HTML stepper** | Click through stages. Never a ring. |
| "how does a hash map work" | **Illustrative** | Key falling through a funnel into one of N buckets. |
| "draw the database schema" / "show me the ERD" | **mermaid.js** | `erDiagram` syntax. Not SVG. |

The illustrative route is the default for *"how does X work"* with no further qualification. It is the more ambitious choice — don't chicken out into a flowchart because it feels safer. Claude draws these well.

Don't mix families in one diagram. If you need both, draw the intuition version first (build the mental model), then the reference version (fill in the precise labels) as a second tool call with prose between.

**For complex topics, use multiple SVG calls** — break the explanation into a series of smaller diagrams rather than one dense diagram. Each SVG streams in with its own animation and card, creating a visual narrative the user can follow step by step.

**Always add prose between diagrams** — never stack multiple SVG calls back-to-back without text. Between each SVG, write a short paragraph (in your normal response text, outside the tool call) that explains what the next diagram shows and connects it to the previous one.

**Promise only what you deliver** — if your response text says "here are three diagrams", you must include all three tool calls. Never promise a follow-up diagram and omit it. If you can only fit one diagram, adjust your text to match. One complete diagram is better than three promised and one delivered.

#### Flowchart

For sequential processes, cause-and-effect, decision trees.

**Planning**: Size boxes to fit their text generously. At 14px sans-serif, each character is ~8px wide — a label like "Load Balancer" (13 chars) needs a rect at least 140px wide. When in doubt, make boxes wider and leave more space between them. Cramped diagrams are the most common failure mode.

**Special characters are wider**: Chemical formulas (C₆H₁₂O₆), math notation (∑, ∫, √), subscripts/superscripts via <tspan> with dy/baseline-shift, and Unicode symbols all render wider than plain Latin characters. For labels containing formulas or special notation, add 30-50% extra width to your estimate. When in doubt, make the box wider — overflow looks worse than extra padding.

**Spacing**: 60px minimum between boxes, 24px padding inside boxes, 12px between text and edges. Leave 10px gap between arrowheads and box edges. Two-line boxes (title + subtitle) need at least 56px height with 22px between the lines.

**Vertical text placement**: Every `<text>` inside a box needs `dominant-baseline="central"`, with y set to the *centre* of the slot it sits in. Without it SVG treats y as the baseline, the glyph body sits ~4px higher than you intended, and the descenders land on the line below. Formula: for text centred in a rect at (x, y, w, h), use `<text x={x+w/2} y={y+h/2} text-anchor="middle" dominant-baseline="central">`. For a row inside a multi-row box, y is the centre of *that row*, not of the whole box.

**Layout**: Prefer single-direction flows (all top-down or all left-right). Keep diagrams simple — max 4-5 nodes per diagram. The widget is narrow (~680px) so complex layouts break.

**When the prompt itself is over budget**: if the user lists 6+ components ("draw me auth, products, orders, payments, gateway, queue"), don't draw all of them in one pass — you'll get overlapping boxes and arrows through text, every time. Decompose: (1) a stripped overview with the boxes only and at most one or two arrows showing the main flow — no fan-outs, no N-to-N meshes; (2) then one diagram per interesting sub-flow ("here's what happens when an order is placed", "here's the auth handshake"), each with 3-4 nodes and room to breathe. Count the nouns before you draw. The user asked for completeness — give it to them across several diagrams, not crammed into one.

**Cycles don't get drawn as rings.** If the last stage feeds back into the first (Krebs cycle, event loop, GC mark-and-sweep, TCP retransmit), your instinct is to place the stages around a circle. Don't. Every spacing rule in this spec is Cartesian — there is no collision check for "input box orbits outside stage box on a ring". You will get satellite boxes overlapping the stages they feed, labels sitting on the dashed circle, and tangential arrows that point nowhere. The ring is decoration; the loop is conveyed by the return arrow.

Build a stepper in HTML. One panel per stage, dots or pills showing position (● ○ ○), Next wraps from the last stage back to the first — that's the loop. Each panel owns its inputs and products: an event loop's pending callbacks live *inside* the Poll panel, not floating next to a box on a ring. Nothing collides because nothing shares the canvas. Only fall back to a linear SVG (stages in a row, curved `<path>` return arrow) when there's one input and one output total and no per-stage detail to show.

**Feedback loops in linear flows:** Don't draw a physical arrow traversing the layout (it fights the flow direction and clips edges). Instead:
- Small `↻` glyph + text near the cycle point: `<text>↻ returns to start</text>`
- Or restructure the whole diagram as a circle if the cycle IS the point

**Arrows:** A line from A to B must not cross any other box or label. If the direct path crosses something, route around with an L-bend: `<path d="M x1 y1 L x1 ymid L x2 ymid L x2 y2"/>`. Place arrow labels in clear space, not on the midpoint.

Keep all nodes the same height when they have the same content type (e.g. all single-line boxes = 44px, all two-line boxes = 56px).

**Flowchart components** — use these patterns consistently:

*Single-line node* (44px tall): title only. The `c-blue` class sets fill, stroke, and text colors for both light and dark mode automatically — no `<style>` block needed.
```svg
<g class="node c-blue" onclick="sendPrompt('Tell me more about T-cells')">
  <rect x="100" y="20" width="180" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="190" y="42" text-anchor="middle" dominant-baseline="central">T-cells</text>
</g>
```

*Two-line node* (56px tall): bold title + muted subtitle.
```svg
<g class="node c-blue" onclick="sendPrompt('Tell me more about dendritic cells')">
  <rect x="100" y="20" width="200" height="56" rx="8" stroke-width="0.5"/>
  <text class="th" x="200" y="38" text-anchor="middle" dominant-baseline="central">Dendritic cells</text>
  <text class="ts" x="200" y="56" text-anchor="middle" dominant-baseline="central">Detect foreign antigens</text>
</g>
```

*Connector* (no label — meaning is clear from source + target):
```svg
<line x1="200" y1="76" x2="200" y2="120" class="arr" marker-end="url(#arrow)"/>
```

*Neutral node* (gray, for start/end/generic steps): use `class="box"` for auto-themed fill/stroke, and default text classes.

Make all nodes clickable by default — wrap in `<g class="node" onclick="sendPrompt('...')">`. The hover effect is built in.

#### Structural diagram

For concepts where physical or logical containment matters — things inside other things.

**When to use**: The explanation depends on *where* processes happen. Examples: how a cell works (organelles inside a cell), how a file system works (blocks inside inodes inside partitions), how a building's HVAC works (ducts inside floors inside a building), how a CPU cache hierarchy works (L1 inside core, L2 shared).

**Core idea**: Large rounded rects are containers. Smaller rects inside them are regions or sub-structures. Text labels describe what happens in each region. Arrows show flow between regions or from external inputs/outputs.

**Container rules**:
- Outermost container: large rounded rect, rx=20-24, lightest fill (50 stop), 0.5px stroke (600 stop). Label at top-left inside, 14px bold.
- Inner regions: medium rounded rects, rx=8-12, next shade fill (100-200 stop). Use a different color ramp if the region is semantically different from its parent.
- 20px minimum padding inside every container — text and inner regions must not touch the container edges.
- Max 2-3 nesting levels. Deeper nesting gets unreadable at 680px width.

**Layout**:
- Place inner regions side by side within the container, with 16px+ gap between them.
- External inputs (sunlight, water, data, requests) sit outside the container with arrows pointing in.
- External outputs sit outside with arrows pointing out.
- Keep external labels short — one word or a short phrase. Details go in the prose between diagrams.

**What goes inside regions**: Text only — the region name (14px bold) and a short description of what happens there (12px). Don't put flowchart-style boxes inside regions. Don't draw illustrations or icons inside.

**Structural container example** (library branch with two side-by-side regions, an internal labeled arrow, and an external input). ViewBox 700x320, horizontal layout, color classes handle both light and dark mode — no `<style>` block:
```svg
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>
<!-- Outer container -->
<g class="c-green">
  <rect x="120" y="30" width="560" height="260" rx="20" stroke-width="0.5"/>
  <text class="th" x="400" y="62" text-anchor="middle">Library branch</text>
  <text class="ts" x="400" y="80" text-anchor="middle">Main floor</text>
</g>
<!-- Inner: Circulation desk -->
<g class="c-teal">
  <rect x="150" y="100" width="220" height="160" rx="12" stroke-width="0.5"/>
  <text class="th" x="260" y="130" text-anchor="middle">Circulation desk</text>
  <text class="ts" x="260" y="148" text-anchor="middle">Checkouts, returns</text>
</g>
<!-- Inner: Reading room -->
<g class="c-amber">
  <rect x="450" y="100" width="210" height="160" rx="12" stroke-width="0.5"/>
  <text class="th" x="555" y="130" text-anchor="middle">Reading room</text>
  <text class="ts" x="555" y="148" text-anchor="middle">Seating, reference</text>
</g>
<!-- Arrow between inner boxes with label -->
<text class="ts" x="410" y="175" text-anchor="middle">Books</text>
<line x1="370" y1="185" x2="448" y2="185" class="arr" marker-end="url(#arrow)"/>
<!-- External input: New acq. — text vertically aligned with arrow -->
<text class="ts" x="40" y="185" text-anchor="middle">New acq.</text>
<line x1="75" y1="185" x2="118" y2="185" class="arr" marker-end="url(#arrow)"/>
```

**Color in structural diagrams**: Nested regions need distinct ramps — `c-{ramp}` classes resolve to fixed fill/stroke stops, so the same class on parent and child gives identical fills and flattens the hierarchy. Pick a *related* ramp for inner structures (e.g. Green for the library envelope, Teal for the circulation desk inside it) and a *contrasting* ramp for a region that does something functionally different (e.g. Amber for the reading room). This keeps the diagram scannable — you can see at a glance which parts are related.

**Database schemas / ERDs — use mermaid.js, not SVG.** A schema table is a header plus N field rows plus typed columns plus crow's-foot connectors. That is a text-layout problem and hand-placing it in SVG fails the same way every time. mermaid.js `erDiagram` does layout, cardinality, and connector routing for free. ERDs only; everything else stays in SVG.

```
erDiagram
  USERS ||--o{ POSTS : writes
  POSTS ||--o{ COMMENTS : has
  USERS {
    uuid id PK
    string email
    timestamp created_at
  }
  POSTS {
    uuid id PK
    uuid user_id FK
    string title
  }
```

Use HTML for ERDs. Import and initialize in a `<script type="module">`. The host CSS re-styles mermaid's output to match the design system — keep the init block exactly as shown (fontFamily + fontSize are used for layout measurement; deviate and text clips). After rendering, replace sharp-cornered entity `<path>` elements with rounded `<rect rx="8">` to match the design system, and strip borders from attribute rows (only the outer container and header row keep visible borders — alternating fill colors separate the rows):
```html
<style>
#erd svg.erDiagram .divider path { stroke-opacity: 0.5; }
#erd svg.erDiagram .row-rect-odd path,
#erd svg.erDiagram .row-rect-odd rect,
#erd svg.erDiagram .row-rect-even path,
#erd svg.erDiagram .row-rect-even rect { stroke: none !important; }
</style>
<div id="erd"></div>
<script type="module">
import mermaid from 'https://esm.sh/mermaid@11/dist/mermaid.esm.min.mjs';
const dark = matchMedia('(prefers-color-scheme: dark)').matches;
await document.fonts.ready;
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  fontFamily: '"Anthropic Sans", sans-serif',
  themeVariables: {
    darkMode: dark,
    fontSize: '13px',
    fontFamily: '"Anthropic Sans", sans-serif',
    lineColor: dark ? '#9c9a92' : '#73726c',
    textColor: dark ? '#c2c0b6' : '#3d3d3a',
  },
});
const { svg } = await mermaid.render('erd-svg', `erDiagram
  USERS ||--o{ POSTS : writes
  POSTS ||--o{ COMMENTS : has`);
document.getElementById('erd').innerHTML = svg;

// Round only the outermost entity box corners (not internal row stripes)
document.querySelectorAll('#erd svg.erDiagram .node').forEach(node => {
  const firstPath = node.querySelector('path[d]');
  if (!firstPath) return;
  const d = firstPath.getAttribute('d');
  const nums = d.match(/-?[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 8) return;
  const xs = [nums[0], nums[2], nums[4], nums[6]];
  const ys = [nums[1], nums[3], nums[5], nums[7]];
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(...xs) - x, h = Math.max(...ys) - y;
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x); rect.setAttribute('y', y);
  rect.setAttribute('width', w); rect.setAttribute('height', h);
  rect.setAttribute('rx', '8');
  for (const a of ['fill', 'stroke', 'stroke-width', 'class', 'style']) {
    if (firstPath.hasAttribute(a)) rect.setAttribute(a, firstPath.getAttribute(a));
  }
  firstPath.replaceWith(rect);
});

// Strip borders from attribute rows (mermaid v11: .row-rect-odd / .row-rect-even)
document.querySelectorAll('#erd svg.erDiagram .row-rect-odd path, #erd svg.erDiagram .row-rect-even path').forEach(p => {
  p.setAttribute('stroke', 'none');
});
</script>
```

Works identically for `classDiagram` — swap the diagram source; init stays the same.

#### Illustrative diagram

For building *intuition*. The subject might be physical (an engine, a lung) or completely abstract (attention, recursion, gradient descent) — what matters is that a spatial drawing conveys the mechanism better than labelled boxes would. These are the diagrams that make someone go "oh, *that's* what it's doing."

**Two flavours, same rules:**
- **Physical subjects** get drawn as simplified versions of themselves. Cross-sections, cutaways, schematics. A water heater is a tank with a burner underneath. A lung is a branching tree in a cavity. You're drawing *the thing*, stylised.
- **Abstract subjects** get drawn as *spatial metaphors*. You're inventing a shape for something that doesn't have one — but the shape should make the mechanism obvious. A transformer is a stack of horizontal slabs with a bright thread of attention connecting tokens across layers. A hash function is a funnel scattering items into a row of buckets. The call stack is literally a stack of frames growing and shrinking. Embeddings are dots clustering in space. The metaphor *is* the explanation.

This is the most ambitious diagram type and the one Claude is best at. Lean into it. Use colour for intensity (a hot attention weight glows amber, a cold one stays gray). Use repetition for scale (many small circles = many parameters).

**Prefer interactive over static.** A static cross-section is a good answer; a cross-section you can *operate* is a great one. The decision rule: if the real-world system has a control, give the diagram that control. A water heater has a thermostat — so give the user a slider that shifts the hot/cold boundary, a toggle that fires the burner and animates convection currents. An LLM has input tokens — let the user click one and watch the attention weights re-fan. A cache has a hit rate — let them drag it and watch latency change. Reach for HTML with inline SVG first; only fall back to static SVG when there's genuinely nothing to twiddle.

**When NOT to use**: The user is asking for a *reference*, not an *intuition*. "What are the components of a transformer" wants labelled boxes — that's a structural diagram. "Walk me through our CI pipeline" wants sequential steps — that's a flowchart. Also skip this when the metaphor would be arbitrary rather than revealing: drawing "the cloud" as a cloud shape or "microservices" as little houses doesn't teach anything about how they work. If the drawing doesn't make the *mechanism* clearer, don't draw it.

**Fidelity ceiling**: These are schematics, not illustrations. Every shape should read at a glance. If a `<path>` needs more than ~6 segments to draw, simplify it. A tank is a rounded rect, not a Bézier portrait of a tank. A flame is three triangles, not a fire. Recognisable silhouette beats accurate contour every time — if you find yourself carefully tracing an outline, you're overshooting.

**Core principle**: Draw the mechanism, not a diagram *about* the mechanism. Spatial arrangement carries the meaning; labels annotate. A good illustrative diagram works with the labels removed.

**What changes from flowchart/structural rules**:

- **Shapes are freeform.** Use `<path>`, `<ellipse>`, `<circle>`, `<polygon>`, and curved lines to represent real forms. A water tank is a tall rect with rounded bottom. A heart valve is a pair of curved paths. A circuit trace is a thin polyline. You are not limited to rounded rects.
- **Layout follows the subject's geometry**, not a grid. If the thing is tall and narrow (a water heater, a thermometer), the diagram is tall and narrow. If it's wide and flat (a PCB, a geological cross-section), the diagram is wide. Let the subject dictate proportions within the 680px viewBox width.
- **Color encodes intensity**, not category. For physical subjects: warm ramps (amber, coral, red) = heat/energy/pressure, cool ramps (blue, teal) = cold/calm, gray = inert structure. For abstract subjects: warm = active/high-weight/attended-to, cool or gray = dormant/low-weight/ignored. A user should be able to glance at the diagram and see *where the action is* without reading a single label.
- **Layering and overlap are encouraged — for shapes.** Unlike flowcharts where boxes must never overlap, illustrative diagrams can layer shapes for depth — a pipe entering a tank, attention lines fanning through layers, insulation wrapping a chamber. Use z-ordering (later in source = on top) deliberately.
- **Text is the exception — never let a stroke cross it.** The overlap permission is for shapes only. Every label needs 8px of clear air between its baseline/cap-height and the nearest stroke. Don't solve this with a background rect — solve it by *placing the text somewhere else*. Labels go in the quiet regions: above the drawing, below it, in the margin with a leader line, or in the gap between two fans of lines. If there is no quiet region, the drawing is too dense — remove something or split into two diagrams.
- **Small shape-based indicators are allowed** when they communicate physical state. Triangles for flames. Circles for bubbles or particles. Wavy lines for steam or heat radiation. Parallel lines for vibration. These aren't decoration — they tell the user what's happening physically. Keep them simple: basic SVG primitives, not detailed illustrations.
- **One gradient per diagram is permitted** — the only exception to the global no-gradients rule — and only to show a *continuous* physical property across a region (temperature stratification in a tank, pressure drop along a pipe, concentration in a solution). It must be a single `<linearGradient>` between exactly two stops from the same colour ramp. No radial gradients, no multi-stop fades, no gradient-as-aesthetic. If two stacked flat-fill rects communicate the same thing, do that instead.
- **Animation is permitted for interactive HTML versions.** Use CSS `@keyframes` animating only `transform` and `opacity`. Keep loops under ~2s, and wrap every animation in `@media (prefers-reduced-motion: no-preference)` so it's opt-out by default. Animations should show how the system *behaves* — convection current, rotation, flow — not just move for the sake of moving. No physics engines or heavy libraries.

All core rules still apply (viewBox 680px, dark mode mandatory, 14/12px text, pre-built classes, arrow marker, clickable nodes).

**Label placement**:
- Place labels *outside* the drawn object when possible, with a thin leader line (0.5px dashed, `var(--t)` stroke) pointing to the relevant part. This keeps the illustration uncluttered.
- For large internal zones (like temperature regions in a tank), labels can sit inside if there's ample clear space — minimum 20px from any edge.
- External labels sit in the margin area or above/below the object. **Pick one side for labels and put them all there** — at 680px wide you don't have room for a drawing *and* label columns on both sides. Reserve at least 140px of horizontal margin on the label side. Labels on the left are the ones that clip: `text-anchor="end"` extends leftward from x, and with multi-line callouts it's very easy to blow past x=0 without noticing. Default to right-side labels with `text-anchor="start"` unless the subject's geometry forces otherwise. Use `class="ts"` (12px) for callouts, `class="th"` (14px medium) for major component names.

**Composition approach**:
1. Start with the main object's silhouette — the largest shape, centered in the viewBox.
2. Add internal structure: chambers, pipes, membranes, mechanical parts.
3. Add external connections: pipes entering/exiting, arrows showing flow direction, labels for inputs and outputs.
4. Add state indicators last: color fills showing temperature/pressure/concentration, small animated elements showing movement or energy.
5. Leave generous whitespace around the object for labels — don't crowd annotations against the viewBox edges.

**Static vs interactive**: Static cutaways and cross-sections work best as pure SVG. If the diagram benefits from controls — a slider that changes a temperature zone, buttons toggling between operating states, live readouts — use HTML with inline SVG for the drawing and HTML controls around it.

**Illustrative diagram example** — interactive water heater cross-section with vivid physical-realism colors, animated convection currents, and controls. Uses HTML with inline SVG: a thermostat slider shifts the hot/cold gradient boundary, a heating toggle animates flames on/off and transitions convection to paused. viewBox is 680×560; tank occupies x=180..440, leaving 140px+ of right margin for labels. Smooth convection paths use `stroke-dasharray:5 5` at ~1.6s for a gentle flow feel. A warm-glow overlay on the hot zone pulses subtly when heating is on. Flame shapes use warm gradient fills and clean opacity transitions. Labels sit along the right margin with leader lines.
```html
<style>
  @keyframes conv { to { stroke-dashoffset: -20; } }
  @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:.82} }
  @keyframes glow { 0%,100%{opacity:.3} 50%{opacity:.6} }
  .conv { stroke-dasharray:5 5; animation: conv var(--dur,1.6s) linear infinite; transition: opacity .5s; }
  .conv.off { opacity:0; animation-play-state:paused; }
  #flames path { transition: opacity .5s; }
  #flames.off path { opacity:0; animation:none; }
  #flames path:nth-child(odd)  { animation: flicker .6s ease-in-out infinite; }
  #flames path:nth-child(even) { animation: flicker .8s ease-in-out infinite .15s; }
  #warm-glow { animation: glow 3s ease-in-out infinite; transition: opacity .5s; }
  #warm-glow.off { opacity:0; animation:none; }
  .toggle-track { position:relative;width:32px;height:18px;background:var(--color-border-secondary);border-radius:9px;transition:background .2s;display:inline-block; }
  .toggle-track:has(input:checked) { background:var(--color-text-info); }
  #heat-toggle:checked + span { transform:translateX(14px); }
</style>
<svg width="100%" viewBox="0 0 680 560">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>
    <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
      <stop id="gh" offset="40%" stop-color="#E8593C" stop-opacity="0.45"/>
      <stop id="gc" offset="40%" stop-color="#3B8BD4" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="fg1" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#E85D24"/><stop offset="60%" stop-color="#F2A623"/><stop offset="100%" stop-color="#FCDE5A"/></linearGradient>
    <linearGradient id="fg2" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#D14520"/><stop offset="50%" stop-color="#EF8B2C"/><stop offset="100%" stop-color="#F9CB42"/></linearGradient>
    <linearGradient id="pipe-h" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D05538" stop-opacity=".25"/><stop offset="100%" stop-color="#D05538" stop-opacity=".08"/></linearGradient>
    <linearGradient id="pipe-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B8BD4" stop-opacity=".25"/><stop offset="100%" stop-color="#3B8BD4" stop-opacity=".08"/></linearGradient>
    <clipPath id="tc"><rect x="180" y="55" width="260" height="390" rx="14"/></clipPath>
  </defs>
  <!-- Tank fill -->
  <g clip-path="url(#tc)"><rect x="180" y="55" width="260" height="390" fill="url(#tg)"/></g>
  <!-- Warm glow overlay (pulses when heating) -->
  <g clip-path="url(#tc)"><rect id="warm-glow" x="180" y="55" width="260" height="160" fill="#E8593C" opacity=".3"/></g>
  <!-- Tank shell (double stroke for solidity) -->
  <rect x="180" y="55" width="260" height="390" rx="14" fill="none" stroke="var(--t)" stroke-width="2.5" opacity=".25"/>
  <rect x="180" y="55" width="260" height="390" rx="14" fill="none" stroke="var(--t)" stroke-width="1"/>
  <!-- Hot pipe out (top right) -->
  <rect x="370" y="14" width="16" height="50" rx="4" fill="url(#pipe-h)"/>
  <path d="M378 14V55" stroke="var(--t)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Cold pipe in + dip tube (top left) -->
  <rect x="234" y="14" width="16" height="50" rx="4" fill="url(#pipe-c)"/>
  <path d="M242 14V55" stroke="var(--t)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M242 55V395" stroke="var(--t)" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".5"/>
  <!-- Convection currents (curved paths at different speeds) -->
  <path class="conv" style="--dur:1.6s" fill="none" stroke="#D05538" stroke-width="1" opacity=".5" d="M350 380C355 320,365 240,358 140Q355 110,340 100"/>
  <path class="conv" style="--dur:2.1s" fill="none" stroke="#C04828" stroke-width=".8" opacity=".35" d="M300 390C308 340,320 260,315 170Q312 130,298 115"/>
  <path class="conv" style="--dur:2.6s" fill="none" stroke="#B05535" stroke-width=".7" opacity=".3" d="M380 370C382 310,388 230,382 150Q378 120,365 110"/>
  <!-- Burner bar -->
  <rect x="188" y="454" width="244" height="5" rx="2" fill="var(--t)" opacity=".6"/>
  <rect x="220" y="462" width="180" height="6" rx="3" fill="var(--t)" opacity=".3"/>
  <!-- Flames (gradient-filled organic shapes) -->
  <g id="flames">
    <path d="M240,454Q248,430 252,438Q256,424 260,454Z" fill="url(#fg1)"/>
    <path d="M278,454Q285,426 290,434Q295,418 300,454Z" fill="url(#fg2)"/>
    <path d="M320,454Q328,428 333,436Q338,420 342,454Z" fill="url(#fg1)"/>
    <path d="M360,454Q367,430 371,438Q375,422 380,454Z" fill="url(#fg2)"/>
    <path d="M398,454Q404,434 408,440Q412,428 416,454Z" fill="url(#fg1)"/>
  </g>
  <!-- Labels (right margin) -->
  <g class="node" onclick="sendPrompt('How does hot water exit the tank?')">
    <line class="leader" x1="386" y1="34" x2="468" y2="70"/><circle cx="386" cy="34" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="74">Hot water outlet</text></g>
  <g class="node" onclick="sendPrompt('How does the cold water inlet work?')">
    <line class="leader" x1="250" y1="34" x2="468" y2="140"/><circle cx="250" cy="34" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="144">Cold water inlet</text></g>
  <g class="node" onclick="sendPrompt('What does the dip tube do?')">
    <line class="leader" x1="250" y1="260" x2="468" y2="220"/><circle cx="250" cy="260" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="224">Dip tube</text></g>
  <g class="node" onclick="sendPrompt('What does the thermostat control?')">
    <line class="leader" x1="440" y1="250" x2="468" y2="300"/><circle cx="440" cy="250" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="304">Thermostat</text></g>
  <g class="node" onclick="sendPrompt('What material is the tank made of?')">
    <line class="leader" x1="440" y1="380" x2="468" y2="380"/><circle cx="440" cy="380" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="384">Tank wall</text></g>
  <g class="node" onclick="sendPrompt('How does the gas burner heat water?')">
    <line class="leader" x1="432" y1="454" x2="468" y2="454"/><circle cx="432" cy="454" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="458">Heating element</text></g>
</svg>
<div style="display:flex;align-items:center;gap:16px;margin:12px 0 0;font-size:13px;color:var(--color-text-secondary)">
  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none">
    <span class="toggle-track">
      <input type="checkbox" id="heat-toggle" checked onchange="toggleHeat(this.checked)" style="position:absolute;opacity:0;width:100%;height:100%;cursor:pointer;margin:0">
      <span style="position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:transform .2s;pointer-events:none"></span>
    </span>
    Heating
  </label>
  <span>Thermostat</span>
  <input type="range" id="temp-slider" min="10" max="90" value="40" style="flex:1" oninput="setTemp(this.value)">
  <span id="temp-label" style="min-width:36px;text-align:right">40%</span>
</div>
<script>
function setTemp(v) {
  document.getElementById('gh').setAttribute('offset', v+'%');
  document.getElementById('gc').setAttribute('offset', v+'%');
  document.getElementById('temp-label').textContent = v+'%';
}
function toggleHeat(on) {
  document.getElementById('flames').classList.toggle('off', !on);
  document.getElementById('warm-glow').classList.toggle('off', !on);
  document.querySelectorAll('.conv').forEach(p => p.classList.toggle('off', !on));
}
</script>
```

**Illustrative example — abstract subject** (attention in a transformer). Same rules, no physical object. A row of tokens at the bottom, one query token highlighted, weight-scaled lines fanning to every other token. Caption sits below the fan — clear of every stroke — not inside it.
```svg
<rect class="c-purple" x="60" y="40"  width="560" height="26" rx="6" stroke-width="0.5"/>
<rect class="c-purple" x="60" y="80"  width="560" height="26" rx="6" stroke-width="0.5"/>
<rect class="c-purple" x="60" y="120" width="560" height="26" rx="6" stroke-width="0.5"/>
<text class="ts" x="72" y="57" >Layer 3</text>
<text class="ts" x="72" y="97" >Layer 2</text>
<text class="ts" x="72" y="137">Layer 1</text>

<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="116" y2="146" stroke-width="1"   opacity="0.25"/>
<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="228" y2="146" stroke-width="1.5" opacity="0.4"/>
<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="340" y2="146" stroke-width="4"   opacity="1.0"/>
<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="452" y2="146" stroke-width="2.5" opacity="0.7"/>
<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="564" y2="146" stroke-width="1"   opacity="0.2"/>

<g class="node" onclick="sendPrompt('What do the attention weights mean?')">
  <rect class="c-gray"  x="80"  y="230" width="72" height="36" rx="6" stroke-width="0.5"/>
  <rect class="c-gray"  x="192" y="230" width="72" height="36" rx="6" stroke-width="0.5"/>
  <rect class="c-amber" x="304" y="230" width="72" height="36" rx="6" stroke-width="1"/>
  <rect class="c-gray"  x="416" y="230" width="72" height="36" rx="6" stroke-width="0.5"/>
  <rect class="c-gray"  x="528" y="230" width="72" height="36" rx="6" stroke-width="0.5"/>
  <text class="ts" x="116" y="252" text-anchor="middle">the</text>
  <text class="ts" x="228" y="252" text-anchor="middle">cat</text>
  <text class="th" x="340" y="252" text-anchor="middle">sat</text>
  <text class="ts" x="452" y="252" text-anchor="middle">on</text>
  <text class="ts" x="564" y="252" text-anchor="middle">the</text>
</g>

<text class="ts" x="340" y="300" text-anchor="middle">Line thickness = attention weight from "sat" to each token</text>
```

Note what's *not* here: no boxes labelled "multi-head attention", no arrows labelled "Q/K/V". Those belong in the structural diagram. This one is about the *feeling* of attention — one token looking at every other token with varying intensity.

These are starting points, not ceilings. For the water heater: add a thermostat slider, animate the convection current, toggle heating vs standby. For the attention diagram: let the user click any token to become the query, scrub through layers, animate the weights settling. The goal is always to *show* how the thing works, not just *label* it.


[Tool Result]
Content rendered and shown to the user. Please do not duplicate the shown content in text because it's already visually represented.
[This tool call rendered an interactive widget in the chat. The user can already see the result — do not repeat it in text or with another visualization tool.]

按层组织的，从底到顶：

数据是起点，架构是骨架，训练是过程，评估是反馈，系统是出口，前沿是边界。

每个词点进去，我会用比喻或者具体例子来解释——不是词典定义，是让你感觉到那个维度存在。

### Artifact: visualize:read_me
```
{
  "modules": [
    "diagram"
  ]
}
```

### Artifact: ai_concept_map
```
{
  "title": "ai_concept_map",
  "loading_messages": [
    "绘制概念地图中...",
    "布置节点关系..."
  ],
  "widget_code": "\n<style>\n.layer-label { font-size:11px; font-weight:500; color:var(--color-text-tertiary); text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px; }\n.layer { margin-bottom:6px; }\n.chips { display:flex; flex-wrap:wrap; gap:7px; }\n.chip {\n  display:inline-flex; align-items:center; gap:5px;\n  padding:6px 13px; border-radius:20px; font-size:13px; font-weight:400;\n  cursor:pointer; border:1px solid; transition:opacity .15s, transform .1s;\n  color:inherit; background:none; font-family:inherit;\n  white-space:nowrap;\n}\n.chip:hover { opacity:.75; transform:translateY(-1px); }\n.chip:active { transform:translateY(0); }\n.chip.d  { background:var(--color-background-secondary); border-color:var(--color-border-secondary); color:var(--color-text-primary); }\n.chip.b  { background:#EEEDFE; border-color:#AFA9EC; color:#26215C; }\n.chip.t  { background:#E1F5EE; border-color:#5DCAA5; color:#04342C; }\n.chip.tr { background:#FAEEDA; border-color:#EF9F27; color:#412402; }\n.chip.e  { background:#FAECE7; border-color:#F0997B; color:#4A1B0C; }\n.chip.s  { background:#E6F1FB; border-color:#85B7EB; color:#042C53; }\n@media (prefers-color-scheme: dark) {\n  .chip.b  { background:#26215C; border-color:#534AB7; color:#CECBF6; }\n  .chip.t  { background:#04342C; border-color:#1D9E75; color:#9FE1CB; }\n  .chip.tr { background:#412402; border-color:#BA7517; color:#FAC775; }\n  .chip.e  { background:#4A1B0C; border-color:#D85A30; color:#F5C4B3; }\n  .chip.s  { background:#042C53; border-color:#378ADD; color:#B5D4F4; }\n}\n.hint { font-size:12px; color:var(--color-text-tertiary); margin-top:14px; }\n</style>\n\n<div style=\"padding:4px 0 0\">\n\n<div class=\"layer\">\n  <div class=\"layer-label\">数据层 — 喂给模型的东西</div>\n  <div class=\"chips\">\n    <button class=\"chip d\" onclick=\"sendPrompt('给我解释「token（词元）」在大模型里是什么，用一个直觉性的比喻')\">Token 词元</button>\n    <button class=\"chip d\" onclick=\"sendPrompt('给我解释「语料库/corpus」是什么，大模型的训练数据长什么样')\">语料库 Corpus</button>\n    <button class=\"chip d\" onclick=\"sendPrompt('给我解释大模型的「预训练数据」和「微调数据」有什么区别')\">预训练 vs 微调数据</button>\n    <button class=\"chip d\" onclick=\"sendPrompt('给我解释「数据质量」在大模型训练里为什么重要，比数量更重要吗')\">数据质量</button>\n  </div>\n</div>\n\n<div class=\"layer\" style=\"margin-top:14px\">\n  <div class=\"layer-label\">架构层 — 模型长什么样</div>\n  <div class=\"chips\">\n    <button class=\"chip b\" onclick=\"sendPrompt('给我一个直觉性的解释：Transformer 架构是什么，用空间或物理比喻')\">Transformer</button>\n    <button class=\"chip b\" onclick=\"sendPrompt('给我解释「Attention（注意力机制）」是什么，它在做什么事情')\">Attention 注意力</button>\n    <button class=\"chip b\" onclick=\"sendPrompt('给我解释「Embedding（嵌入）」是什么，词变成向量这件事意味着什么')\">Embedding 嵌入</button>\n    <button class=\"chip b\" onclick=\"sendPrompt('给我解释「参数（Parameters）」是什么，1750亿参数意味着什么')\">参数 Parameters</button>\n    <button class=\"chip b\" onclick=\"sendPrompt('给我解释「MoE（混合专家）」架构是什么，它和普通模型有什么本质区别')\">MoE 混合专家</button>\n  </div>\n</div>\n\n<div class=\"layer\" style=\"margin-top:14px\">\n  <div class=\"layer-label\">训练层 — 模型怎么变好</div>\n  <div class=\"chips\">\n    <button class=\"chip t\" onclick=\"sendPrompt('给我解释「预训练（Pre-training）」是什么，这个阶段模型在做什么')\">预训练</button>\n    <button class=\"chip t\" onclick=\"sendPrompt('给我解释「损失函数（Loss）」是什么，它在训练里扮演什么角色')\">Loss 损失</button>\n    <button class=\"chip t\" onclick=\"sendPrompt('给我解释「梯度下降（Gradient Descent）」是什么，用一个物理比喻')\">梯度下降</button>\n    <button class=\"chip t\" onclick=\"sendPrompt('给我解释「RLHF」是什么，为什么训练完还要做这一步')\">RLHF</button>\n    <button class=\"chip t\" onclick=\"sendPrompt('给我解释「微调（Fine-tuning）」是什么，和预训练有什么关系')\">微调 Fine-tuning</button>\n    <button class=\"chip t\" onclick=\"sendPrompt('给我解释「过拟合（Overfitting）」是什么意思，用直觉性比喻')\">过拟合</button>\n  </div>\n</div>\n\n<div class=\"layer\" style=\"margin-top:14px\">\n  <div class=\"layer-label\">评估层 — 怎么知道它好不好</div>\n  <div class=\"chips\">\n    <button class=\"chip tr\" onclick=\"sendPrompt('给我解释「Benchmark（基准测试）」是什么，大模型怎么评分')\">Benchmark 基准测试</button>\n    <button class=\"chip tr\" onclick=\"sendPrompt('给我解释「Perplexity（困惑度）」是什么，它衡量什么')\">Perplexity 困惑度</button>\n    <button class=\"chip tr\" onclick=\"sendPrompt('给我解释「涌现能力（Emergent abilities）」是什么，为什么让人觉得神秘')\">涌现能力</button>\n    <button class=\"chip tr\" onclick=\"sendPrompt('给我解释「幻觉（Hallucination）」是什么，模型为什么会编造')\">幻觉 Hallucination</button>\n  </div>\n</div>\n\n<div class=\"layer\" style=\"margin-top:14px\">\n  <div class=\"layer-label\">系统层 — 怎么让人用</div>\n  <div class=\"chips\">\n    <button class=\"chip e\" onclick=\"sendPrompt('给我解释「推理（Inference）」和训练有什么区别，运行一次模型在计算什么')\">推理 Inference</button>\n    <button class=\"chip e\" onclick=\"sendPrompt('给我解释「上下文窗口（Context Window）」是什么，为什么有限制')\">上下文窗口</button>\n    <button class=\"chip e\" onclick=\"sendPrompt('给我解释「RAG（检索增强生成）」是什么，解决什么问题')\">RAG 检索增强</button>\n    <button class=\"chip e\" onclick=\"sendPrompt('给我解释「Agent（智能体）」是什么，和普通对话有什么不同')\">Agent 智能体</button>\n    <button class=\"chip e\" onclick=\"sendPrompt('给我解释「Prompt（提示词）」是什么，为什么「提示工程」是一门学问')\">Prompt 提示词</button>\n  </div>\n</div>\n\n<div class=\"layer\" style=\"margin-top:14px\">\n  <div class=\"layer-label\">前沿层 — 现在大家在争什么</div>\n  <div class=\"chips\">\n    <button class=\"chip s\" onclick=\"sendPrompt('给我解释「Scaling Law（规模定律）」，用最简单的语言')\">Scaling Law</button>\n    <button class=\"chip s\" onclick=\"sendPrompt('给我解释「Inference-time scaling（推理时扩展）」是什么新方向，o1和R1在做什么')\">推理时扩展</button>\n    <button class=\"chip s\" onclick=\"sendPrompt('给我解释「对齐（Alignment）」问题是什么，为什么很多人觉得这是核心问题')\">对齐 Alignment</button>\n    <button class=\"chip s\" onclick=\"sendPrompt('给我解释「多模态（Multimodal）」是什么，为什么从文字扩展到图像视频')\">多模态</button>\n  </div>\n</div>\n\n<p class=\"hint\">点击任意概念 → 展开那个世界</p>\n</div>\n"
}
```

---

## You
*2026-05-18T08:58:43.073855Z*

给我解释大模型的「预训练数据」和「微调数据」有什么区别

---

## AI
*2026-05-18T08:59:03.692078Z*

 

用一个人的成长来类比，最清楚。

---

## 预训练数据：建立世界模型

想象一个人从出生到二十岁，读了互联网上几乎所有的文字——新闻、小说、论文、代码、对话、百科全书……他不是在学"怎么做某件事"，他只是在**理解世界是什么样的**。

这就是预训练。数据的特点是：

- **规模极大**：动辄几万亿个 token，相当于数百万本书
- **来源杂乱**：爬取自互联网，质量参差不齐
- **目标单纯**：预测下一个词。模型做的事只有一件——给定前文，猜下一个字是什么

训练完之后，模型掌握了语言的结构、世界的知识、逻辑的模式。但它**不知道怎么和人说话**，不知道什么是有用的回答，甚至可能输出有害内容——因为互联网上什么都有。

这个阶段造就的是一个"博学但不懂事"的存在。

---

## 微调数据：塑造行为

现在这个人要去工作了，需要学会**怎么和人交流、怎么完成具体任务**。

微调数据的特点是：

- **规模极小**：几万到几百万条，比预训练少几个数量级
- **质量极高**：人工精心标注，每一条都很干净
- **格式固定**：通常是问答对、指令-回答对的形式

比如：
```
指令：帮我总结这篇文章
回答：这篇文章讲了……
```

模型通过这些例子，学会了"当有人问我问题时，我应该这样回应"。

---

## 关键的不对称

这里有一个反直觉的地方值得停下来想：

> 微调数据量只有预训练的百万分之一，却能显著改变模型的行为。

为什么？

因为**能力已经在预训练里形成了**，微调只是在调整模型的"倾向"——把原本杂乱的输出风格，校准到"有帮助、无害、诚实"这个方向上。

好比那个博学的人其实已经会写文章，微调只是教他"写给别人看时要用什么语气"。

---

## 所以两者的本质差异

|  | 预训练数据 | 微调数据 |
|--|--|--|
| 目的 | 建立世界知识和语言能力 | 校准行为和交互方式 |
| 规模 | 万亿级 token | 万到百万级条目 |
| 质量要求 | 量大即可，容忍噪声 | 每条都要精心设计 |
| 改变的是 | 模型"知道什么" | 模型"怎么表现" |

这个区分背后还藏着一个更深的问题：**模型真正的"能力天花板"在预训练阶段就定了**，微调无法给模型教会它完全没见过的知识。这是为什么数据质量和规模在预训练阶段如此关键。

---

## You
*2026-05-18T08:59:37.275170Z*

给我一个直觉性的解释：Transformer 架构是什么，用空间或物理比喻

---

## AI
*2026-05-18T09:03:13.607856Z*

 

[Tool Result]
# Imagine — Visual Creation Suite

## Modules
Call read_me again with the modules parameter to load detailed guidance:
- `diagram` — SVG flowcharts, structural diagrams, illustrative diagrams
- `mockup` — UI mockups, forms, cards, dashboards
- `interactive` — interactive explainers with controls
- `chart` — charts, data analysis, geographic maps (Chart.js, D3 choropleth)
- `art` — illustration and generative art
Pick the closest fit. The module includes all relevant design guidance.

**Complexity budget — hard limits:**
- Box subtitles: ≤5 words. Detail goes in click-through (`sendPrompt`) or the prose below — not the box.
- Colors: ≤2 ramps per diagram. If colors encode meaning (states, tiers), add a 1-line legend. Otherwise use one neutral ramp.
- Horizontal tier: ≤4 boxes at full width (~140px each). 5+ boxes → shrink to ≤110px OR wrap to 2 rows OR split into overview + detail diagrams.

If you catch yourself writing "click to learn more" in prose, the diagram itself must ACTUALLY be sparse. Don't promise brevity then front-load everything.

**Accessibility:** For HTML widgets, begin with a visually-hidden `<h2 class="sr-only">` containing a one-sentence summary of the visualization for screen-reader users. (SVG widgets use `role="img"` with `<title>` and `<desc>` instead — see SVG setup.)

You create rich visual content — SVG diagrams/illustrations and HTML interactive widgets — that renders inline in conversation. The best output feels like a natural extension of the chat.

## Core Design System

These rules apply to ALL use cases.

### Philosophy
- **Seamless**: Users shouldn't notice where claude.ai ends and your widget begins.
- **Flat**: No gradients, mesh backgrounds, noise textures, or decorative effects. Clean flat surfaces.
- **Compact**: Show the essential inline. Explain the rest in text.
- **Text goes in your response, visuals go in the tool** — All explanatory text, descriptions, introductions, and summaries must be written as normal response text OUTSIDE the tool call. The tool output should contain ONLY the visual element (diagram, chart, interactive widget). Never put paragraphs of explanation, section headings, or descriptive prose inside the HTML/SVG. If the user asks "explain X", write the explanation in your response and use the tool only for the visual that accompanies it. The user's font settings only apply to your response text, not to text inside the widget.

### Streaming
Output streams token-by-token. Structure code so useful content appears early.
- **HTML**: `<style>` (short) → content HTML → `<script>` last.
- **SVG**: `<defs>` (markers) → visual elements immediately.
- Prefer inline `style="..."` over `<style>` blocks — inputs/controls must look correct mid-stream.
- Keep `<style>` under ~15 lines. Interactive widgets with inputs and sliders need more style rules — that's fine, but don't bloat with decorative CSS.
- Gradients, shadows, and blur flash during streaming DOM diffs. Use solid flat fills instead.

### Rules
- No `<!-- comments -->` or `/* comments */` (waste tokens, break streaming)
- No font-size below 11px
- No emoji. Icons = Tabler **outline** webfont (5800+, already loaded): `<i class="ti ti-home"></i>`. Outline only — never use `-filled` suffixes (`ti-heart-filled` etc. are not loaded and will render blank). Inherits color + font-size from parent. Decorative icons get `aria-hidden="true"`; icon-only buttons get `aria-label`. Common: ti-home ti-settings ti-user ti-search ti-x ti-check ti-plus ti-trash ti-edit ti-download ti-upload ti-file ti-folder ti-chart-bar ti-calendar ti-clock ti-arrow-right ti-arrow-left ti-chevron-down ti-external-link ti-copy ti-refresh ti-player-play ti-player-pause ti-heart ti-star ti-bell ti-mail ti-lock ti-eye ti-menu-2. Don't hand-draw icon SVG paths.
- No gradients, drop shadows, blur, glow, or neon effects
- No dark/colored backgrounds on outer containers (transparent only — host provides the bg)
- **Typography**: The default font is Anthropic Sans. For the rare editorial/blockquote moment, use `font-family: var(--font-serif)`.
- **Headings**: h1 = 22px, h2 = 18px, h3 = 16px — all `font-weight: 500`. Heading color is pre-set to `var(--color-text-primary)` — don't override it. Body text = 16px, weight 400, `line-height: 1.7`. **Two weights only: 400 regular, 500 bold.** Never use 600 or 700 — they look heavy against the host UI.
- **Sentence case** always. Never Title Case, never ALL CAPS. This applies everywhere including SVG text labels and diagram headings.
- **No mid-sentence bolding**, including in your response text around the tool call. Entity names, class names, function names go in `code style` not **bold**. Bold is for headings and labels only.
- The widget container is `display: block; width: 100%`. Your HTML fills it naturally — no wrapper div needed. Just start with your content directly. If you want vertical breathing room, add `padding: 1rem 0` on your first element.
- Never use `position: fixed` — the iframe viewport sizes itself to your in-flow content height, so fixed-positioned elements (modals, overlays, tooltips) collapse it to `min-height: 100px`. For modal/overlay mockups: wrap everything in a normal-flow `<div style="min-height: 400px; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center;">` and put the modal inside — it's a faux viewport that actually contributes layout height.
- No DOCTYPE, `<html>`, `<head>`, or `<body>` — just content fragments.
- When placing text on a colored background (badges, pills, cards, tags), use the darkest shade from that same color family for the text — never plain black or generic gray.
- **Corners**: use `border-radius: var(--border-radius-md)` (or `-lg` for cards) in HTML. In SVG, `rx="4"` is the default — larger values make pills, use only when you mean a pill.
- **No rounded corners on single-sided borders** — if using `border-left` or `border-top` accents, set `border-radius: 0`. Rounded corners only work with full borders on all sides.
- **No titles or prose inside the tool output** — see Philosophy above.
- **Icon sizing**: Tabler `<i class="ti …">` sizes with `font-size` — 16–20px inline, 24px max decorative. For one-off inline SVG icons, set `width`/`height` explicitly (same limits).
- No tabs, carousels, or `display: none` sections during streaming — hidden content streams invisibly. Show all content stacked vertically. (Post-streaming JS-driven steppers are fine — see Illustrative/Interactive sections.)
- No nested scrolling — auto-fit height.
- Scripts execute after streaming — load libraries via `<script src="https://cdnjs.cloudflare.com/ajax/libs/...">` (UMD globals), then use the global in a plain `<script>` that follows.
- **CDN allowlist (CSP-enforced)**: external resources may ONLY load from `cdnjs.cloudflare.com`, `esm.sh`, `cdn.jsdelivr.net`, `unpkg.com`. All other origins are blocked by the sandbox — the request silently fails.

### CSS Variables
**Backgrounds**: `--color-background-primary` (white), `-secondary` (surfaces), `-tertiary` (page bg), `-info`, `-danger`, `-success`, `-warning`
**Text**: `--color-text-primary` (black), `-secondary` (muted), `-tertiary` (hints), `-info`, `-danger`, `-success`, `-warning`
**Borders**: `--color-border-tertiary` (0.15α, default), `-secondary` (0.3α, hover), `-primary` (0.4α), semantic `-info/-danger/-success/-warning`
**Typography**: `--font-sans`, `--font-serif`, `--font-mono`
**Layout**: `--border-radius-md` (8px), `--border-radius-lg` (12px — preferred for most components), `--border-radius-xl` (16px)
All auto-adapt to light/dark mode. For custom colors in HTML, use CSS variables.

**Dark mode is mandatory** — every color must work in both modes:
- In SVG: use the pre-built color classes (`c-blue`, `c-teal`, `c-amber`, etc.) for colored nodes — they handle light/dark mode automatically. Never write `<style>` blocks for colors.
- In SVG: every `<text>` element needs a class (`t`, `ts`, `th`) — never omit fill or use `fill="inherit"`. Inside a `c-{color}` parent, text classes auto-adjust to the ramp.
- In HTML: always use CSS variables (--color-text-primary, --color-text-secondary) for text. Never hardcode colors like color: #333 — invisible in dark mode.
- Mental test: if the background were near-black, would every text element still be readable?

### sendPrompt(text)
A global function that sends a message to chat as if the user typed it. Use it when the user's next step benefits from Claude thinking. Handle filtering, sorting, toggling, and calculations in JS instead.

### Links
`<a href="https://...">` just works — clicks are intercepted and open the host's link-confirmation dialog. Or call `openLink(url)` directly.

## When nothing fits
Pick the closest use case below and adapt. When nothing fits cleanly:
- Default to editorial layout if the content is explanatory
- Default to card layout if the content is a bounded object
- All core design system rules still apply
- Use `sendPrompt()` for any action that benefits from Claude thinking


## UI components

### Layout width
The widget container is 680px wide. Use `repeat(auto-fit, minmax(160px, 1fr))` for responsive columns — auto-fit lets the grid pick column count by available width.

### Aesthetic
Flat, clean, white surfaces. Minimal 0.5px borders. Generous whitespace. No gradients, no shadows (except functional focus rings). Everything should feel native to claude.ai — like it belongs on the page, not embedded from somewhere else.

### Tokens
- Borders: always `0.5px solid var(--color-border-tertiary)` (or `-secondary` for emphasis)
- Corner radius: `var(--border-radius-md)` for most elements, `var(--border-radius-lg)` for cards
- Cards: white bg (`var(--color-background-primary)`), 0.5px border, radius-lg, padding 1rem 1.25rem
- Form elements (input, select, textarea, button, range slider) are pre-styled — write bare tags. Text inputs are 36px with hover/focus built in; range sliders have 4px track + 18px thumb; buttons have outline style with hover/active. Only add inline styles to override (e.g., different width).
- Buttons: pre-styled with transparent bg, 0.5px border-secondary, hover bg-secondary, active scale(0.98). If it triggers sendPrompt, append a ↗ arrow.
- **Round every displayed number.** JS float math leaks artifacts — `0.1 + 0.2` gives `0.30000000000000004`, `7 * 1.1` gives `7.700000000000001`. Any number that reaches the screen (slider readouts, stat card values, axis labels, data-point labels, tooltips, computed totals) must go through `Math.round()`, `.toFixed(n)`, or `Intl.NumberFormat`. Pick the precision that makes sense for the context — integers for counts, 1–2 decimals for percentages, `toLocaleString()` for currency. For range sliders, also set `step="1"` (or step="0.1" etc.) so the input itself emits round values.
- Spacing: use rem for vertical rhythm (1rem, 1.5rem, 2rem), px for component-internal gaps (8px, 12px, 16px)
- Box-shadows: none, except `box-shadow: 0 0 0 Npx` focus rings on inputs

### Metric cards
For summary numbers (revenue, count, percentage) — surface card with muted 13px label above, 24px/500 number below. `background: var(--color-background-secondary)`, no border, `border-radius: var(--border-radius-md)`, padding 1rem. Use in grids of 2-4 with `gap: 12px`. Distinct from raised cards (which have white bg + border).

### Layout
- Editorial (explanatory content): no card wrapper, prose flows naturally
- Card (bounded objects like a contact record, receipt): single raised card wraps the whole thing
- Don't put tables here — output them as markdown in your response text

**Grid overflow:** `grid-template-columns: 1fr` has `min-width: auto` by default — children with large min-content push the column past the container. Use `minmax(0, 1fr)` to clamp.

**Table overflow:** Tables with many columns auto-expand past `width: 100%` if cell contents exceed it. In constrained layouts (≤700px), use `table-layout: fixed` and set explicit column widths, or reduce columns, or allow horizontal scroll on a wrapper.

### Mockup presentation
Contained mockups — mobile screens, chat threads, single cards, modals, small UI components — should sit on a background surface (`var(--color-background-secondary)` container with `border-radius: var(--border-radius-lg)` and padding, or a device frame) so they don't float naked on the widget canvas. Full-width mockups like dashboards, settings pages, or data tables that naturally fill the viewport do not need an extra wrapper.

### 1. Interactive explainer — learn how something works
*"Explain how compound interest works" / "Teach me about sorting algorithms"*

Use HTML for the interactive controls — sliders, buttons, live state displays, charts. Keep prose explanations in your normal response text (outside the tool call), not embedded in the HTML. No card wrapper. Whitespace is the container.

```html
<div style="display: flex; align-items: center; gap: 12px; margin: 0 0 1.5rem;">
  <label style="font-size: 14px; color: var(--color-text-secondary);">Years</label>
  <input type="range" min="1" max="40" value="20" id="years" style="flex: 1;" />
  <span style="font-size: 14px; font-weight: 500; min-width: 24px;" id="years-out">20</span>
</div>

<div style="display: flex; align-items: baseline; gap: 8px; margin: 0 0 1.5rem;">
  <span style="font-size: 14px; color: var(--color-text-secondary);">£1,000 →</span>
  <span style="font-size: 24px; font-weight: 500;" id="result">£3,870</span>
</div>

<div style="margin: 2rem 0; position: relative; height: 240px;">
  <canvas id="chart"></canvas>
</div>
```

Use `sendPrompt()` to let users ask follow-ups: `sendPrompt('What if I increase the rate to 10%?')`

### 2. Compare options — decision making
*"Compare pricing and features of these products" / "Help me choose between React and Vue"*

Use HTML. Side-by-side card grid for options. Highlight differences with semantic colors. Interactive elements for filtering or weighting.

- Each option in a card. Use badges for key differentiators. A leading Tabler icon (`<i class="ti ti-NAME">` at 20px, `aria-hidden`) anchors each option visually — pick the most apt name per option.
- Add `sendPrompt()` buttons: `sendPrompt('Tell me more about the Pro plan')`
- Don't put comparison tables inside this tool — output them as regular markdown tables in your response text instead. The tool is for the visual card grid only.
- When one option is recommended or "most popular", accent its card with `border: 2px solid var(--color-border-info)` only (2px is deliberate — the only exception to the 0.5px rule, used to accent featured items) — keep the same background and border as the other cards. Add a small badge (e.g. "Most popular") above or inside the card header using `background: var(--color-background-info); color: var(--color-text-info); font-size: 12px; padding: 4px 12px; border-radius: var(--border-radius-md)`.

### 3. Data record — bounded UI object
*"Show me a Salesforce contact card" / "Create a receipt for this order"*

Use HTML. Wrap the entire thing in a single raised card. All content is sans-serif since it's pure UI. Use an avatar/initials circle for people (see example below).

```html
<div style="background: var(--color-background-primary); border-radius: var(--border-radius-lg); border: 0.5px solid var(--color-border-tertiary); padding: 1rem 1.25rem;">
  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
    <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--color-background-info); display: flex; align-items: center; justify-content: center; font-weight: 500; font-size: 14px; color: var(--color-text-info);">MR</div>
    <div>
      <p style="font-weight: 500; font-size: 15px; margin: 0;">Maya Rodriguez</p>
      <p style="font-size: 13px; color: var(--color-text-secondary); margin: 0;">VP of Engineering</p>
    </div>
  </div>
  <div style="border-top: 0.5px solid var(--color-border-tertiary); padding-top: 12px;">
    <table style="width: 100%; font-size: 13px;">
      <tr><td style="color: var(--color-text-secondary); padding: 4px 0;"><i class="ti ti-mail" style="font-size:16px; vertical-align:-2px; margin-right:6px" aria-hidden="true"></i>Email</td><td style="text-align: right; padding: 4px 0; color: var(--color-text-info);">m.rodriguez@acme.com</td></tr>
      <tr><td style="color: var(--color-text-secondary); padding: 4px 0;"><i class="ti ti-phone" style="font-size:16px; vertical-align:-2px; margin-right:6px" aria-hidden="true"></i>Phone</td><td style="text-align: right; padding: 4px 0;">+1 (415) 555-0172</td></tr>
    </table>
  </div>
</div>
```


## Color palette

9 color ramps, each with 7 stops from lightest to darkest. 50 = lightest fill, 100-200 = light fills, 400 = mid tones, 600 = strong/border, 800-900 = text on light fills.

| Class | Ramp | 50 (lightest) | 100 | 200 | 400 | 600 | 800 | 900 (darkest) |
|-------|------|------|-----|-----|-----|-----|-----|------|
| `c-purple` | Purple | #EEEDFE | #CECBF6 | #AFA9EC | #7F77DD | #534AB7 | #3C3489 | #26215C |
| `c-teal` | Teal | #E1F5EE | #9FE1CB | #5DCAA5 | #1D9E75 | #0F6E56 | #085041 | #04342C |
| `c-coral` | Coral | #FAECE7 | #F5C4B3 | #F0997B | #D85A30 | #993C1D | #712B13 | #4A1B0C |
| `c-pink` | Pink | #FBEAF0 | #F4C0D1 | #ED93B1 | #D4537E | #993556 | #72243E | #4B1528 |
| `c-gray` | Gray | #F1EFE8 | #D3D1C7 | #B4B2A9 | #888780 | #5F5E5A | #444441 | #2C2C2A |
| `c-blue` | Blue | #E6F1FB | #B5D4F4 | #85B7EB | #378ADD | #185FA5 | #0C447C | #042C53 |
| `c-green` | Green | #EAF3DE | #C0DD97 | #97C459 | #639922 | #3B6D11 | #27500A | #173404 |
| `c-amber` | Amber | #FAEEDA | #FAC775 | #EF9F27 | #BA7517 | #854F0B | #633806 | #412402 |
| `c-red` | Red | #FCEBEB | #F7C1C1 | #F09595 | #E24B4A | #A32D2D | #791F1F | #501313 |

**How to assign colors**: Color should encode meaning, not sequence. Don't cycle through colors like a rainbow (step 1 = blue, step 2 = amber, step 3 = red...). Instead:
- Group nodes by **category** — all nodes of the same type share one color. E.g. in a vaccine diagram: all immune cells = purple, all pathogens = coral, all outcomes = teal.
- For illustrative diagrams, map colors to **physical properties** — warm ramps for heat/energy, cool for cold/calm, green for organic, gray for structural/inert.
- Use **gray for neutral/structural** nodes (start, end, generic steps).
- Use **2-3 colors per diagram**, not 6+. More colors = more visual noise. A diagram with gray + purple + teal is cleaner than one using every ramp.
- **Prefer purple, teal, coral, pink** for general diagram categories. Reserve blue, green, amber, and red for cases where the node genuinely represents an informational, success, warning, or error concept — those colors carry strong semantic connotations from UI conventions. (Exception: illustrative diagrams may use blue/amber/red freely when they map to physical properties like temperature or pressure.)

**Text on colored backgrounds:** Always use the 800 or 900 stop from the same ramp as the fill. Never use black, gray, or --color-text-primary on colored fills. **When a box has both a title and a subtitle, they must be two different stops** — title darker (800 in light mode, 100 in dark), subtitle lighter (600 in light, 200 in dark). Same stop for both reads flat; the weight difference alone isn't enough. For example, text on Blue 50 (#E6F1FB) must use Blue 800 (#0C447C) or 900 (#042C53), not black. This applies to SVG text elements inside colored rects, and to HTML badges, pills, and labels with colored backgrounds.

**Light/dark mode quick pick** — use only stops from the table, never off-table hex values:
- **Light mode**: 50 fill + 600 stroke + **800 title / 600 subtitle**
- **Dark mode**: 800 fill + 200 stroke + **100 title / 200 subtitle**
- Apply `c-{ramp}` to a `<g>` wrapping shape+text, or directly to a `<rect>`/`<circle>`/`<ellipse>`. Never to `<path>` — paths don't get ramp fill. For colored connector strokes use inline `stroke="#..."` (any mid-ramp hex works in both modes). Dark mode is automatic for ramp classes. Available: c-gray, c-blue, c-red, c-amber, c-green, c-teal, c-purple, c-coral, c-pink.

For status/semantic meaning in UI (success, warning, danger) use CSS variables. For categorical coloring in both diagrams and UI, use these ramps.


## SVG setup

**ViewBox safety checklist** — before finalizing any SVG, verify:
1. Find your lowest element: max(y + height) across all rects, max(y) across all text baselines.
2. Set viewBox height = that value + 40px buffer.
3. Find your rightmost element: max(x + width) across all rects. All content must stay within x=0 to x=680.
4. For text with text-anchor="end", the text extends LEFT from x. If x=118 and text is 200px wide, it starts at x=-82 — outside the viewBox. Increase x or use text-anchor="start".
5. Never use negative x or y coordinates. The viewBox starts at 0,0.
6. **No unintentional overlaps.** For every pair of elements that aren't meant to layer (label-on-label, label-on-arrow, box-on-box, callout-on-shape), check their bounding boxes do not intersect. The only allowed overlaps are deliberate: a label centered inside its own box, an arrowhead touching the box it points to, a highlight rect behind the thing it highlights. If two unrelated elements would collide, move one — shorten the label, shift the y, add a row. A diagram with crossed labels reads as broken regardless of how good the content is.
7. Flowcharts/structural only: for every pair of boxes in the same row, check that the left box's (x + width) is less than the right box's x by at least 20px. If four 160px boxes plus three 20px gaps sum to more than 640px, the row doesn't fit — shrink the boxes or cut the subtitles, don't let them overlap.

**SVG setup**: `<svg width="100%" viewBox="0 0 680 H" role="img"><title>…</title><desc>…</desc>…` — 680px wide, flexible height. The root `<svg>` MUST carry `role="img"` with `<title>` and `<desc>` as its first children so screen readers can announce what the diagram shows. Set H to fit content tightly — the last element's bottom edge + 40px padding. Don't leave excess empty space below the content. Safe area: x=40 to x=640, y=40 to y=(H-40). Background transparent. **Do not wrap the SVG in a container `<div>` with a background color** — the widget host already provides the card container and background. Output the raw `<svg>` element directly.

**The 680 in viewBox is load-bearing — do not change it.** It matches the widget container width so SVG coordinate units render 1:1 with CSS pixels. With `width="100%"`, the browser scales the entire coordinate space to fit the container: `viewBox="0 0 476 H"` in a 680px container scales everything by 680/476 = 1.43×, so your `class="th"` 14px text renders at ~20px. The font calibration table below and all "text fits in box" math assume 1:1. If your diagram content is naturally narrow, **keep viewBox width at 680 and center the content** (e.g. content spans x=240..440) — do not shrink the viewBox to hug the content. This applies equally to inline SVGs inside HTML steppers and widgets: same `viewBox="0 0 680 H"`, same 1:1 guarantee.

**viewBox height:** After layout, find max_y (bottom-most point of any shape, including text baselines + 4px descent). Set viewBox height = max_y + 20. Don't guess.

**text-anchor='end' at x<60 is risky** — the longest label will extend left past x=0. Use text-anchor='start' and right-align the column instead, or check: label_chars × 8 < anchor_x.

**One SVG per tool call** — each call must contain exactly one <svg> element. Never leave an abandoned or partial SVG in the output. If your first attempt has problems, replace it entirely — do not append a corrected version after the broken one.

**Style rules for all diagrams**:
- Every `<text>` element must carry one of the pre-built classes (`t`, `ts`, `th`). An unclassed `<text>` inherits the default sans font, which is the tell that you forgot the class.
- Use only two font sizes: 14px for node/region labels (class="t" or "th"), 12px for subtitles, descriptions, and arrow labels (class="ts"). No other sizes.
- No decorative step numbers, large numbering, or oversized headings outside boxes.
- No icons or illustrations inside boxes — text only. (Exception: illustrative diagrams may use simple shape-based indicators inside drawn objects — see below.)
- Sentence case on all labels.

**Font size calibration for diagram text labels** - Here's csv table to give you better sense of the Anthropic Sans font rendering width:
```csv
text, chars length, font-weight, font-size, rendered width
Authentication Service, chars: 22, font-weight: 500, font-size: 14px, width: 167px
Background Job Processor, chars: 24, font-weight: 500, font-size: 14px, width: 201px
Detects and validates incoming tokens, chars: 37, font-weight: 400, font-size: 14px, width: 279px
forwards request to, chars: 19, font-weight: 400, font-size: 12px, width: 123px
データベースサーバー接続, chars: 12, font-weight: 400, font-size: 14px, width: 181px
```

Before placing text in a box, check: does (text width + 2×padding) fit the container?

**SVG `<text>` never auto-wraps.** Every line break needs an explicit `<tspan x="..." dy="1.2em">`. If your subtitle is long enough to need wrapping, it's too long — shorten it (see complexity budget).

**Example check**: You want to put "Glucose (C₆H₁₂O₆)" in a rounded rect. The text is 20 characters at 14px ≈ 180px wide. Add 2×24px padding = 228px minimum box width. If your rect is only 160px wide, the text WILL overflow — either shorten the label (e.g. just "Glucose") or widen the box. Subscript characters like ₆ and ₁₂ still take horizontal space — count them.

**Pre-built classes** (already loaded in SVG widget):
- `class="t"` = sans 14px primary, `class="ts"` = sans 12px secondary, `class="th"` = sans 14px medium (500)
- `class="box"` = neutral rect (bg-secondary fill, border stroke)
- `class="node"` = clickable group with hover effect (cursor pointer, slight dim on hover)
- `class="arr"` = arrow line (1.5px, open chevron head)
- `class="leader"` = dashed leader line (tertiary stroke, 0.5px, dashed)
- `class="c-{ramp}"` = colored node (c-blue, c-teal, c-amber, c-green, c-red, c-purple, c-coral, c-pink, c-gray). Apply to `<g>` or shape element (rect/circle/ellipse), NOT to paths. Sets fill+stroke on shapes, auto-adjusts child `t`/`ts`/`th`, dark mode automatic.

**c-{ramp} nesting:** These classes use direct-child selectors (`>`). Nest a `<g>` inside a `<g class="c-blue">` and the inner shapes become grandchildren — they lose the fill and render BLACK (SVG default). Put `c-*` on the innermost group holding the shapes, or on the shapes directly. If you need click handlers, put `onclick` on the `c-*` group itself, not a wrapper.

- Short aliases: `var(--p)`, `var(--s)`, `var(--t)`, `var(--bg2)`, `var(--b)`
- Arrow marker: always include this `<defs>` at the start of every SVG:
  `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`
  Then use `marker-end="url(#arrow)"` on lines. The head uses `context-stroke`, so it inherits the colour of whichever line it sits on — a dashed green line gets a green head, a grey line gets a grey head. Never a colour mismatch. Do not add filters or extra markers to `<defs>`. `<pattern>` fills are allowed when used as a secondary encoding for categorical data — keep them subtle (thin hatching, sparse dots). Never rely on color alone to distinguish categories; pair each color with a secondary visual cue (hatching, dash pattern, or shape). Illustrative diagrams may add a single `<clipPath>` or `<linearGradient>` (see Illustrative section).

**Minimize standalone labels.** Every `<text>` element must be inside a box (title or ≤5-word subtitle) or in the legend. Arrow labels are usually unnecessary — if the arrow's meaning isn't obvious from its source + target, put it in the box subtitle or in prose below. Labels floating in space collide with things and are ambiguous.

**Stroke width:** Use 0.5px strokes for diagram borders and edges — not 1px or 2px. Thin strokes feel more refined.

**Connector paths need `fill="none"`.** SVG defaults to `fill: black` — a curved connector without `fill="none"` renders as a huge black shape instead of a clean line. Every `<path>` or `<polyline>` used as a connector/arrow MUST have `fill="none"`. Only set fill on shapes meant to be filled (rects, circles, polygons).

**Rect rounding:** `rx="4"` for subtle corners. `rx="8"` max for emphasized rounding. `rx` ≥ half the height = pill shape — deliberate only.

**Schematic containers use dashed rects with a label.** Don't draw literal shapes (organelle ovals, cloud outlines, server tower icons) — the diagram is a schema, not an illustration. A dashed `<rect>` labeled "Reactor vessel" reads cleaner than an `<ellipse>` that clips content.

**Lines stop at component edges.** When a line meets a component (wire into a bulb, edge into a node), draw it as segments that stop at the boundary — never draw through and rely on a fill to hide the line. The background color is not guaranteed; any occluding fill is a coupling. Compute the stop/start coordinates from the component's position and size.

**Physical-color scenes (sky, water, grass, skin, materials):** Use ALL hardcoded hex — never mix with `c-*` theme classes. The scene should not invert in dark mode. If you need a dark variant, provide it explicitly with `@media (prefers-color-scheme: dark)` — this is the one place that's allowed. Mixing hardcoded backgrounds with theme-responsive `c-*` foreground breaks: half inverts, half doesn't.

**No rotated text**. `<defs>` may contain the arrow marker, a `<clipPath>`, subtle `<pattern>` fills used as a secondary visual cue alongside color for categorical data, and — in illustrative diagrams only — a single `<linearGradient>`. Nothing else: no filters, no extra markers.


## Diagram types
*"Explain how compound interest works" / "How does a process scheduler work"*

**Two rules that cause most diagram failures — check these before writing each arrow and each box:**
1. **Arrow intersection check**: before writing any `<line>` or `<path>`, trace its coordinates against every box you've already placed. If the line crosses any rect's interior (not just its source/target), it will visibly slash through that box — use an L-shaped `<path>` detour instead. This applies to arrows crossing labels too.
2. **Box width from longest label**: before writing a `<rect>`, find its longest child text (usually the subtitle). `rect_width = max(title_chars × 8, subtitle_chars × 7) + 24`. A 100px-wide box holds at most a 10-char subtitle. If your subtitle is "Files, APIs, streams" (20 chars), the box needs 164px minimum — 100px will visibly overflow.

**Tier packing:** Compute total width BEFORE placing. Example — 4 pub/sub consumer boxes:
- WRONG: x=40,160,260,360 w=160 → 40-60px overlaps (4×160=640 > 480 available)
- RIGHT: x=50,200,350,500 w=130 gap=20 → fits (4×130 + 3×20 = 580 ≤ 590 safe width; right edge at 630 ≤ 640)
Work bottom-up for trees: size leaf tier first, parent width ≥ sum of children.

**Diagrams are the hardest use case** — they have the highest failure rate due to precise coordinate math. Common mistakes: viewBox too small (content clipped), arrows through unrelated boxes, labels on arrow lines, text past viewBox edges. For illustrative diagrams, also watch for: shapes extending outside the viewBox, overlapping labels that obscure the drawing, and color choices that don't map intuitively to the physical properties being shown. Double-check coordinates before finalizing.

Use SVG for diagrams. The widget automatically wraps SVG output in a card.

**Pick the right diagram type.** The decision is about *intent*, not subject matter. Ask: is the user trying to *document* this, or *understand* it?

**Reference diagrams** — the user wants a map they can point at. Precision matters more than feeling. Boxes, labels, arrows, containment. These are the diagrams you'd find in documentation.
- **Flowchart** — steps in sequence, decisions branching, data transforming. Good for: approval workflows, request lifecycles, build pipelines, "what happens when I click submit". Trigger phrases: *"walk me through the process"*, *"what are the steps"*, *"what's the flow"*.
- **Structural diagram** — things inside other things. Good for: file systems (blocks in inodes in partitions), VPC/subnet/instance, "what's inside a cell". Trigger phrases: *"what's the architecture"*, *"how is this organised"*, *"where does X live"*.

**Intuition diagrams** — the user wants to *feel* how something works. The goal isn't a correct map, it's the right mental model. These should look nothing like a flowchart. The subject doesn't need a physical form — it needs a *visual metaphor*.
- **Illustrative diagram** — draw the mechanism. Physical things get cross-sections (water heaters, engines, lungs). Abstract things get spatial metaphors: an LLM is a stack of layers with tokens lighting up as attention weights, gradient descent is a ball rolling down a loss surface, a hash table is a row of buckets with items falling into them, TCP is two people passing numbered envelopes. Good for: ML concepts (transformers, attention, backprop, embeddings), physics intuition, CS fundamentals (pointers, recursion, the call stack), anything where the breakthrough is *seeing* it rather than *reading* it. Trigger phrases: *"how does X actually work"*, *"explain X"*, *"I don't get X"*, *"give me an intuition for X"*.

**Route on the verb, not the noun.** Same subject, different diagram depending on what was asked:

| User says | Type | What to draw |
|---|---|---|
| "how do LLMs work" | **Illustrative** | Token row, stacked layer slabs, attention threads glowing warm between tokens. Go interactive if you can. |
| "transformer architecture" | Structural | Labelled boxes: embedding, attention heads, FFN, layer norm. |
| "how does attention work" | **Illustrative** | One query token, a fan of lines to every key, line opacity = weight. |
| "how does gradient descent work" | **Illustrative** | Contour surface, a ball, a trail of steps. Slider for learning rate. |
| "what are the training steps" | Flowchart | Forward → loss → backward → update. Boxes and arrows. |
| "how does TCP work" | **Illustrative** | Two endpoints, numbered packets in flight, an ACK returning. |
| "TCP handshake sequence" | Flowchart | SYN → SYN-ACK → ACK. Three boxes. |
| "explain the Krebs cycle" / "how does the event loop work" | **HTML stepper** | Click through stages. Never a ring. |
| "how does a hash map work" | **Illustrative** | Key falling through a funnel into one of N buckets. |
| "draw the database schema" / "show me the ERD" | **mermaid.js** | `erDiagram` syntax. Not SVG. |

The illustrative route is the default for *"how does X work"* with no further qualification. It is the more ambitious choice — don't chicken out into a flowchart because it feels safer. Claude draws these well.

Don't mix families in one diagram. If you need both, draw the intuition version first (build the mental model), then the reference version (fill in the precise labels) as a second tool call with prose between.

**For complex topics, use multiple SVG calls** — break the explanation into a series of smaller diagrams rather than one dense diagram. Each SVG streams in with its own animation and card, creating a visual narrative the user can follow step by step.

**Always add prose between diagrams** — never stack multiple SVG calls back-to-back without text. Between each SVG, write a short paragraph (in your normal response text, outside the tool call) that explains what the next diagram shows and connects it to the previous one.

**Promise only what you deliver** — if your response text says "here are three diagrams", you must include all three tool calls. Never promise a follow-up diagram and omit it. If you can only fit one diagram, adjust your text to match. One complete diagram is better than three promised and one delivered.

#### Flowchart

For sequential processes, cause-and-effect, decision trees.

**Planning**: Size boxes to fit their text generously. At 14px sans-serif, each character is ~8px wide — a label like "Load Balancer" (13 chars) needs a rect at least 140px wide. When in doubt, make boxes wider and leave more space between them. Cramped diagrams are the most common failure mode.

**Special characters are wider**: Chemical formulas (C₆H₁₂O₆), math notation (∑, ∫, √), subscripts/superscripts via <tspan> with dy/baseline-shift, and Unicode symbols all render wider than plain Latin characters. For labels containing formulas or special notation, add 30-50% extra width to your estimate. When in doubt, make the box wider — overflow looks worse than extra padding.

**Spacing**: 60px minimum between boxes, 24px padding inside boxes, 12px between text and edges. Leave 10px gap between arrowheads and box edges. Two-line boxes (title + subtitle) need at least 56px height with 22px between the lines.

**Vertical text placement**: Every `<text>` inside a box needs `dominant-baseline="central"`, with y set to the *centre* of the slot it sits in. Without it SVG treats y as the baseline, the glyph body sits ~4px higher than you intended, and the descenders land on the line below. Formula: for text centred in a rect at (x, y, w, h), use `<text x={x+w/2} y={y+h/2} text-anchor="middle" dominant-baseline="central">`. For a row inside a multi-row box, y is the centre of *that row*, not of the whole box.

**Layout**: Prefer single-direction flows (all top-down or all left-right). Keep diagrams simple — max 4-5 nodes per diagram. The widget is narrow (~680px) so complex layouts break.

**When the prompt itself is over budget**: if the user lists 6+ components ("draw me auth, products, orders, payments, gateway, queue"), don't draw all of them in one pass — you'll get overlapping boxes and arrows through text, every time. Decompose: (1) a stripped overview with the boxes only and at most one or two arrows showing the main flow — no fan-outs, no N-to-N meshes; (2) then one diagram per interesting sub-flow ("here's what happens when an order is placed", "here's the auth handshake"), each with 3-4 nodes and room to breathe. Count the nouns before you draw. The user asked for completeness — give it to them across several diagrams, not crammed into one.

**Cycles don't get drawn as rings.** If the last stage feeds back into the first (Krebs cycle, event loop, GC mark-and-sweep, TCP retransmit), your instinct is to place the stages around a circle. Don't. Every spacing rule in this spec is Cartesian — there is no collision check for "input box orbits outside stage box on a ring". You will get satellite boxes overlapping the stages they feed, labels sitting on the dashed circle, and tangential arrows that point nowhere. The ring is decoration; the loop is conveyed by the return arrow.

Build a stepper in HTML. One panel per stage, dots or pills showing position (● ○ ○), Next wraps from the last stage back to the first — that's the loop. Each panel owns its inputs and products: an event loop's pending callbacks live *inside* the Poll panel, not floating next to a box on a ring. Nothing collides because nothing shares the canvas. Only fall back to a linear SVG (stages in a row, curved `<path>` return arrow) when there's one input and one output total and no per-stage detail to show.

**Feedback loops in linear flows:** Don't draw a physical arrow traversing the layout (it fights the flow direction and clips edges). Instead:
- Small `↻` glyph + text near the cycle point: `<text>↻ returns to start</text>`
- Or restructure the whole diagram as a circle if the cycle IS the point

**Arrows:** A line from A to B must not cross any other box or label. If the direct path crosses something, route around with an L-bend: `<path d="M x1 y1 L x1 ymid L x2 ymid L x2 y2"/>`. Place arrow labels in clear space, not on the midpoint.

Keep all nodes the same height when they have the same content type (e.g. all single-line boxes = 44px, all two-line boxes = 56px).

**Flowchart components** — use these patterns consistently:

*Single-line node* (44px tall): title only. The `c-blue` class sets fill, stroke, and text colors for both light and dark mode automatically — no `<style>` block needed.
```svg
<g class="node c-blue" onclick="sendPrompt('Tell me more about T-cells')">
  <rect x="100" y="20" width="180" height="44" rx="8" stroke-width="0.5"/>
  <text class="th" x="190" y="42" text-anchor="middle" dominant-baseline="central">T-cells</text>
</g>
```

*Two-line node* (56px tall): bold title + muted subtitle.
```svg
<g class="node c-blue" onclick="sendPrompt('Tell me more about dendritic cells')">
  <rect x="100" y="20" width="200" height="56" rx="8" stroke-width="0.5"/>
  <text class="th" x="200" y="38" text-anchor="middle" dominant-baseline="central">Dendritic cells</text>
  <text class="ts" x="200" y="56" text-anchor="middle" dominant-baseline="central">Detect foreign antigens</text>
</g>
```

*Connector* (no label — meaning is clear from source + target):
```svg
<line x1="200" y1="76" x2="200" y2="120" class="arr" marker-end="url(#arrow)"/>
```

*Neutral node* (gray, for start/end/generic steps): use `class="box"` for auto-themed fill/stroke, and default text classes.

Make all nodes clickable by default — wrap in `<g class="node" onclick="sendPrompt('...')">`. The hover effect is built in.

#### Structural diagram

For concepts where physical or logical containment matters — things inside other things.

**When to use**: The explanation depends on *where* processes happen. Examples: how a cell works (organelles inside a cell), how a file system works (blocks inside inodes inside partitions), how a building's HVAC works (ducts inside floors inside a building), how a CPU cache hierarchy works (L1 inside core, L2 shared).

**Core idea**: Large rounded rects are containers. Smaller rects inside them are regions or sub-structures. Text labels describe what happens in each region. Arrows show flow between regions or from external inputs/outputs.

**Container rules**:
- Outermost container: large rounded rect, rx=20-24, lightest fill (50 stop), 0.5px stroke (600 stop). Label at top-left inside, 14px bold.
- Inner regions: medium rounded rects, rx=8-12, next shade fill (100-200 stop). Use a different color ramp if the region is semantically different from its parent.
- 20px minimum padding inside every container — text and inner regions must not touch the container edges.
- Max 2-3 nesting levels. Deeper nesting gets unreadable at 680px width.

**Layout**:
- Place inner regions side by side within the container, with 16px+ gap between them.
- External inputs (sunlight, water, data, requests) sit outside the container with arrows pointing in.
- External outputs sit outside with arrows pointing out.
- Keep external labels short — one word or a short phrase. Details go in the prose between diagrams.

**What goes inside regions**: Text only — the region name (14px bold) and a short description of what happens there (12px). Don't put flowchart-style boxes inside regions. Don't draw illustrations or icons inside.

**Structural container example** (library branch with two side-by-side regions, an internal labeled arrow, and an external input). ViewBox 700x320, horizontal layout, color classes handle both light and dark mode — no `<style>` block:
```svg
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </marker>
</defs>
<!-- Outer container -->
<g class="c-green">
  <rect x="120" y="30" width="560" height="260" rx="20" stroke-width="0.5"/>
  <text class="th" x="400" y="62" text-anchor="middle">Library branch</text>
  <text class="ts" x="400" y="80" text-anchor="middle">Main floor</text>
</g>
<!-- Inner: Circulation desk -->
<g class="c-teal">
  <rect x="150" y="100" width="220" height="160" rx="12" stroke-width="0.5"/>
  <text class="th" x="260" y="130" text-anchor="middle">Circulation desk</text>
  <text class="ts" x="260" y="148" text-anchor="middle">Checkouts, returns</text>
</g>
<!-- Inner: Reading room -->
<g class="c-amber">
  <rect x="450" y="100" width="210" height="160" rx="12" stroke-width="0.5"/>
  <text class="th" x="555" y="130" text-anchor="middle">Reading room</text>
  <text class="ts" x="555" y="148" text-anchor="middle">Seating, reference</text>
</g>
<!-- Arrow between inner boxes with label -->
<text class="ts" x="410" y="175" text-anchor="middle">Books</text>
<line x1="370" y1="185" x2="448" y2="185" class="arr" marker-end="url(#arrow)"/>
<!-- External input: New acq. — text vertically aligned with arrow -->
<text class="ts" x="40" y="185" text-anchor="middle">New acq.</text>
<line x1="75" y1="185" x2="118" y2="185" class="arr" marker-end="url(#arrow)"/>
```

**Color in structural diagrams**: Nested regions need distinct ramps — `c-{ramp}` classes resolve to fixed fill/stroke stops, so the same class on parent and child gives identical fills and flattens the hierarchy. Pick a *related* ramp for inner structures (e.g. Green for the library envelope, Teal for the circulation desk inside it) and a *contrasting* ramp for a region that does something functionally different (e.g. Amber for the reading room). This keeps the diagram scannable — you can see at a glance which parts are related.

**Database schemas / ERDs — use mermaid.js, not SVG.** A schema table is a header plus N field rows plus typed columns plus crow's-foot connectors. That is a text-layout problem and hand-placing it in SVG fails the same way every time. mermaid.js `erDiagram` does layout, cardinality, and connector routing for free. ERDs only; everything else stays in SVG.

```
erDiagram
  USERS ||--o{ POSTS : writes
  POSTS ||--o{ COMMENTS : has
  USERS {
    uuid id PK
    string email
    timestamp created_at
  }
  POSTS {
    uuid id PK
    uuid user_id FK
    string title
  }
```

Use HTML for ERDs. Import and initialize in a `<script type="module">`. The host CSS re-styles mermaid's output to match the design system — keep the init block exactly as shown (fontFamily + fontSize are used for layout measurement; deviate and text clips). After rendering, replace sharp-cornered entity `<path>` elements with rounded `<rect rx="8">` to match the design system, and strip borders from attribute rows (only the outer container and header row keep visible borders — alternating fill colors separate the rows):
```html
<style>
#erd svg.erDiagram .divider path { stroke-opacity: 0.5; }
#erd svg.erDiagram .row-rect-odd path,
#erd svg.erDiagram .row-rect-odd rect,
#erd svg.erDiagram .row-rect-even path,
#erd svg.erDiagram .row-rect-even rect { stroke: none !important; }
</style>
<div id="erd"></div>
<script type="module">
import mermaid from 'https://esm.sh/mermaid@11/dist/mermaid.esm.min.mjs';
const dark = matchMedia('(prefers-color-scheme: dark)').matches;
await document.fonts.ready;
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  fontFamily: '"Anthropic Sans", sans-serif',
  themeVariables: {
    darkMode: dark,
    fontSize: '13px',
    fontFamily: '"Anthropic Sans", sans-serif',
    lineColor: dark ? '#9c9a92' : '#73726c',
    textColor: dark ? '#c2c0b6' : '#3d3d3a',
  },
});
const { svg } = await mermaid.render('erd-svg', `erDiagram
  USERS ||--o{ POSTS : writes
  POSTS ||--o{ COMMENTS : has`);
document.getElementById('erd').innerHTML = svg;

// Round only the outermost entity box corners (not internal row stripes)
document.querySelectorAll('#erd svg.erDiagram .node').forEach(node => {
  const firstPath = node.querySelector('path[d]');
  if (!firstPath) return;
  const d = firstPath.getAttribute('d');
  const nums = d.match(/-?[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 8) return;
  const xs = [nums[0], nums[2], nums[4], nums[6]];
  const ys = [nums[1], nums[3], nums[5], nums[7]];
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(...xs) - x, h = Math.max(...ys) - y;
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x); rect.setAttribute('y', y);
  rect.setAttribute('width', w); rect.setAttribute('height', h);
  rect.setAttribute('rx', '8');
  for (const a of ['fill', 'stroke', 'stroke-width', 'class', 'style']) {
    if (firstPath.hasAttribute(a)) rect.setAttribute(a, firstPath.getAttribute(a));
  }
  firstPath.replaceWith(rect);
});

// Strip borders from attribute rows (mermaid v11: .row-rect-odd / .row-rect-even)
document.querySelectorAll('#erd svg.erDiagram .row-rect-odd path, #erd svg.erDiagram .row-rect-even path').forEach(p => {
  p.setAttribute('stroke', 'none');
});
</script>
```

Works identically for `classDiagram` — swap the diagram source; init stays the same.

#### Illustrative diagram

For building *intuition*. The subject might be physical (an engine, a lung) or completely abstract (attention, recursion, gradient descent) — what matters is that a spatial drawing conveys the mechanism better than labelled boxes would. These are the diagrams that make someone go "oh, *that's* what it's doing."

**Two flavours, same rules:**
- **Physical subjects** get drawn as simplified versions of themselves. Cross-sections, cutaways, schematics. A water heater is a tank with a burner underneath. A lung is a branching tree in a cavity. You're drawing *the thing*, stylised.
- **Abstract subjects** get drawn as *spatial metaphors*. You're inventing a shape for something that doesn't have one — but the shape should make the mechanism obvious. A transformer is a stack of horizontal slabs with a bright thread of attention connecting tokens across layers. A hash function is a funnel scattering items into a row of buckets. The call stack is literally a stack of frames growing and shrinking. Embeddings are dots clustering in space. The metaphor *is* the explanation.

This is the most ambitious diagram type and the one Claude is best at. Lean into it. Use colour for intensity (a hot attention weight glows amber, a cold one stays gray). Use repetition for scale (many small circles = many parameters).

**Prefer interactive over static.** A static cross-section is a good answer; a cross-section you can *operate* is a great one. The decision rule: if the real-world system has a control, give the diagram that control. A water heater has a thermostat — so give the user a slider that shifts the hot/cold boundary, a toggle that fires the burner and animates convection currents. An LLM has input tokens — let the user click one and watch the attention weights re-fan. A cache has a hit rate — let them drag it and watch latency change. Reach for HTML with inline SVG first; only fall back to static SVG when there's genuinely nothing to twiddle.

**When NOT to use**: The user is asking for a *reference*, not an *intuition*. "What are the components of a transformer" wants labelled boxes — that's a structural diagram. "Walk me through our CI pipeline" wants sequential steps — that's a flowchart. Also skip this when the metaphor would be arbitrary rather than revealing: drawing "the cloud" as a cloud shape or "microservices" as little houses doesn't teach anything about how they work. If the drawing doesn't make the *mechanism* clearer, don't draw it.

**Fidelity ceiling**: These are schematics, not illustrations. Every shape should read at a glance. If a `<path>` needs more than ~6 segments to draw, simplify it. A tank is a rounded rect, not a Bézier portrait of a tank. A flame is three triangles, not a fire. Recognisable silhouette beats accurate contour every time — if you find yourself carefully tracing an outline, you're overshooting.

**Core principle**: Draw the mechanism, not a diagram *about* the mechanism. Spatial arrangement carries the meaning; labels annotate. A good illustrative diagram works with the labels removed.

**What changes from flowchart/structural rules**:

- **Shapes are freeform.** Use `<path>`, `<ellipse>`, `<circle>`, `<polygon>`, and curved lines to represent real forms. A water tank is a tall rect with rounded bottom. A heart valve is a pair of curved paths. A circuit trace is a thin polyline. You are not limited to rounded rects.
- **Layout follows the subject's geometry**, not a grid. If the thing is tall and narrow (a water heater, a thermometer), the diagram is tall and narrow. If it's wide and flat (a PCB, a geological cross-section), the diagram is wide. Let the subject dictate proportions within the 680px viewBox width.
- **Color encodes intensity**, not category. For physical subjects: warm ramps (amber, coral, red) = heat/energy/pressure, cool ramps (blue, teal) = cold/calm, gray = inert structure. For abstract subjects: warm = active/high-weight/attended-to, cool or gray = dormant/low-weight/ignored. A user should be able to glance at the diagram and see *where the action is* without reading a single label.
- **Layering and overlap are encouraged — for shapes.** Unlike flowcharts where boxes must never overlap, illustrative diagrams can layer shapes for depth — a pipe entering a tank, attention lines fanning through layers, insulation wrapping a chamber. Use z-ordering (later in source = on top) deliberately.
- **Text is the exception — never let a stroke cross it.** The overlap permission is for shapes only. Every label needs 8px of clear air between its baseline/cap-height and the nearest stroke. Don't solve this with a background rect — solve it by *placing the text somewhere else*. Labels go in the quiet regions: above the drawing, below it, in the margin with a leader line, or in the gap between two fans of lines. If there is no quiet region, the drawing is too dense — remove something or split into two diagrams.
- **Small shape-based indicators are allowed** when they communicate physical state. Triangles for flames. Circles for bubbles or particles. Wavy lines for steam or heat radiation. Parallel lines for vibration. These aren't decoration — they tell the user what's happening physically. Keep them simple: basic SVG primitives, not detailed illustrations.
- **One gradient per diagram is permitted** — the only exception to the global no-gradients rule — and only to show a *continuous* physical property across a region (temperature stratification in a tank, pressure drop along a pipe, concentration in a solution). It must be a single `<linearGradient>` between exactly two stops from the same colour ramp. No radial gradients, no multi-stop fades, no gradient-as-aesthetic. If two stacked flat-fill rects communicate the same thing, do that instead.
- **Animation is permitted for interactive HTML versions.** Use CSS `@keyframes` animating only `transform` and `opacity`. Keep loops under ~2s, and wrap every animation in `@media (prefers-reduced-motion: no-preference)` so it's opt-out by default. Animations should show how the system *behaves* — convection current, rotation, flow — not just move for the sake of moving. No physics engines or heavy libraries.

All core rules still apply (viewBox 680px, dark mode mandatory, 14/12px text, pre-built classes, arrow marker, clickable nodes).

**Label placement**:
- Place labels *outside* the drawn object when possible, with a thin leader line (0.5px dashed, `var(--t)` stroke) pointing to the relevant part. This keeps the illustration uncluttered.
- For large internal zones (like temperature regions in a tank), labels can sit inside if there's ample clear space — minimum 20px from any edge.
- External labels sit in the margin area or above/below the object. **Pick one side for labels and put them all there** — at 680px wide you don't have room for a drawing *and* label columns on both sides. Reserve at least 140px of horizontal margin on the label side. Labels on the left are the ones that clip: `text-anchor="end"` extends leftward from x, and with multi-line callouts it's very easy to blow past x=0 without noticing. Default to right-side labels with `text-anchor="start"` unless the subject's geometry forces otherwise. Use `class="ts"` (12px) for callouts, `class="th"` (14px medium) for major component names.

**Composition approach**:
1. Start with the main object's silhouette — the largest shape, centered in the viewBox.
2. Add internal structure: chambers, pipes, membranes, mechanical parts.
3. Add external connections: pipes entering/exiting, arrows showing flow direction, labels for inputs and outputs.
4. Add state indicators last: color fills showing temperature/pressure/concentration, small animated elements showing movement or energy.
5. Leave generous whitespace around the object for labels — don't crowd annotations against the viewBox edges.

**Static vs interactive**: Static cutaways and cross-sections work best as pure SVG. If the diagram benefits from controls — a slider that changes a temperature zone, buttons toggling between operating states, live readouts — use HTML with inline SVG for the drawing and HTML controls around it.

**Illustrative diagram example** — interactive water heater cross-section with vivid physical-realism colors, animated convection currents, and controls. Uses HTML with inline SVG: a thermostat slider shifts the hot/cold gradient boundary, a heating toggle animates flames on/off and transitions convection to paused. viewBox is 680×560; tank occupies x=180..440, leaving 140px+ of right margin for labels. Smooth convection paths use `stroke-dasharray:5 5` at ~1.6s for a gentle flow feel. A warm-glow overlay on the hot zone pulses subtly when heating is on. Flame shapes use warm gradient fills and clean opacity transitions. Labels sit along the right margin with leader lines.
```html
<style>
  @keyframes conv { to { stroke-dashoffset: -20; } }
  @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:.82} }
  @keyframes glow { 0%,100%{opacity:.3} 50%{opacity:.6} }
  .conv { stroke-dasharray:5 5; animation: conv var(--dur,1.6s) linear infinite; transition: opacity .5s; }
  .conv.off { opacity:0; animation-play-state:paused; }
  #flames path { transition: opacity .5s; }
  #flames.off path { opacity:0; animation:none; }
  #flames path:nth-child(odd)  { animation: flicker .6s ease-in-out infinite; }
  #flames path:nth-child(even) { animation: flicker .8s ease-in-out infinite .15s; }
  #warm-glow { animation: glow 3s ease-in-out infinite; transition: opacity .5s; }
  #warm-glow.off { opacity:0; animation:none; }
  .toggle-track { position:relative;width:32px;height:18px;background:var(--color-border-secondary);border-radius:9px;transition:background .2s;display:inline-block; }
  .toggle-track:has(input:checked) { background:var(--color-text-info); }
  #heat-toggle:checked + span { transform:translateX(14px); }
</style>
<svg width="100%" viewBox="0 0 680 560">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker>
    <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
      <stop id="gh" offset="40%" stop-color="#E8593C" stop-opacity="0.45"/>
      <stop id="gc" offset="40%" stop-color="#3B8BD4" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="fg1" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#E85D24"/><stop offset="60%" stop-color="#F2A623"/><stop offset="100%" stop-color="#FCDE5A"/></linearGradient>
    <linearGradient id="fg2" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#D14520"/><stop offset="50%" stop-color="#EF8B2C"/><stop offset="100%" stop-color="#F9CB42"/></linearGradient>
    <linearGradient id="pipe-h" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D05538" stop-opacity=".25"/><stop offset="100%" stop-color="#D05538" stop-opacity=".08"/></linearGradient>
    <linearGradient id="pipe-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B8BD4" stop-opacity=".25"/><stop offset="100%" stop-color="#3B8BD4" stop-opacity=".08"/></linearGradient>
    <clipPath id="tc"><rect x="180" y="55" width="260" height="390" rx="14"/></clipPath>
  </defs>
  <!-- Tank fill -->
  <g clip-path="url(#tc)"><rect x="180" y="55" width="260" height="390" fill="url(#tg)"/></g>
  <!-- Warm glow overlay (pulses when heating) -->
  <g clip-path="url(#tc)"><rect id="warm-glow" x="180" y="55" width="260" height="160" fill="#E8593C" opacity=".3"/></g>
  <!-- Tank shell (double stroke for solidity) -->
  <rect x="180" y="55" width="260" height="390" rx="14" fill="none" stroke="var(--t)" stroke-width="2.5" opacity=".25"/>
  <rect x="180" y="55" width="260" height="390" rx="14" fill="none" stroke="var(--t)" stroke-width="1"/>
  <!-- Hot pipe out (top right) -->
  <rect x="370" y="14" width="16" height="50" rx="4" fill="url(#pipe-h)"/>
  <path d="M378 14V55" stroke="var(--t)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Cold pipe in + dip tube (top left) -->
  <rect x="234" y="14" width="16" height="50" rx="4" fill="url(#pipe-c)"/>
  <path d="M242 14V55" stroke="var(--t)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M242 55V395" stroke="var(--t)" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".5"/>
  <!-- Convection currents (curved paths at different speeds) -->
  <path class="conv" style="--dur:1.6s" fill="none" stroke="#D05538" stroke-width="1" opacity=".5" d="M350 380C355 320,365 240,358 140Q355 110,340 100"/>
  <path class="conv" style="--dur:2.1s" fill="none" stroke="#C04828" stroke-width=".8" opacity=".35" d="M300 390C308 340,320 260,315 170Q312 130,298 115"/>
  <path class="conv" style="--dur:2.6s" fill="none" stroke="#B05535" stroke-width=".7" opacity=".3" d="M380 370C382 310,388 230,382 150Q378 120,365 110"/>
  <!-- Burner bar -->
  <rect x="188" y="454" width="244" height="5" rx="2" fill="var(--t)" opacity=".6"/>
  <rect x="220" y="462" width="180" height="6" rx="3" fill="var(--t)" opacity=".3"/>
  <!-- Flames (gradient-filled organic shapes) -->
  <g id="flames">
    <path d="M240,454Q248,430 252,438Q256,424 260,454Z" fill="url(#fg1)"/>
    <path d="M278,454Q285,426 290,434Q295,418 300,454Z" fill="url(#fg2)"/>
    <path d="M320,454Q328,428 333,436Q338,420 342,454Z" fill="url(#fg1)"/>
    <path d="M360,454Q367,430 371,438Q375,422 380,454Z" fill="url(#fg2)"/>
    <path d="M398,454Q404,434 408,440Q412,428 416,454Z" fill="url(#fg1)"/>
  </g>
  <!-- Labels (right margin) -->
  <g class="node" onclick="sendPrompt('How does hot water exit the tank?')">
    <line class="leader" x1="386" y1="34" x2="468" y2="70"/><circle cx="386" cy="34" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="74">Hot water outlet</text></g>
  <g class="node" onclick="sendPrompt('How does the cold water inlet work?')">
    <line class="leader" x1="250" y1="34" x2="468" y2="140"/><circle cx="250" cy="34" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="144">Cold water inlet</text></g>
  <g class="node" onclick="sendPrompt('What does the dip tube do?')">
    <line class="leader" x1="250" y1="260" x2="468" y2="220"/><circle cx="250" cy="260" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="224">Dip tube</text></g>
  <g class="node" onclick="sendPrompt('What does the thermostat control?')">
    <line class="leader" x1="440" y1="250" x2="468" y2="300"/><circle cx="440" cy="250" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="304">Thermostat</text></g>
  <g class="node" onclick="sendPrompt('What material is the tank made of?')">
    <line class="leader" x1="440" y1="380" x2="468" y2="380"/><circle cx="440" cy="380" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="384">Tank wall</text></g>
  <g class="node" onclick="sendPrompt('How does the gas burner heat water?')">
    <line class="leader" x1="432" y1="454" x2="468" y2="454"/><circle cx="432" cy="454" r="2" fill="var(--t)"/>
    <text class="ts" x="474" y="458">Heating element</text></g>
</svg>
<div style="display:flex;align-items:center;gap:16px;margin:12px 0 0;font-size:13px;color:var(--color-text-secondary)">
  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none">
    <span class="toggle-track">
      <input type="checkbox" id="heat-toggle" checked onchange="toggleHeat(this.checked)" style="position:absolute;opacity:0;width:100%;height:100%;cursor:pointer;margin:0">
      <span style="position:absolute;top:2px;left:2px;width:14px;height:14px;background:#fff;border-radius:50%;transition:transform .2s;pointer-events:none"></span>
    </span>
    Heating
  </label>
  <span>Thermostat</span>
  <input type="range" id="temp-slider" min="10" max="90" value="40" style="flex:1" oninput="setTemp(this.value)">
  <span id="temp-label" style="min-width:36px;text-align:right">40%</span>
</div>
<script>
function setTemp(v) {
  document.getElementById('gh').setAttribute('offset', v+'%');
  document.getElementById('gc').setAttribute('offset', v+'%');
  document.getElementById('temp-label').textContent = v+'%';
}
function toggleHeat(on) {
  document.getElementById('flames').classList.toggle('off', !on);
  document.getElementById('warm-glow').classList.toggle('off', !on);
  document.querySelectorAll('.conv').forEach(p => p.classList.toggle('off', !on));
}
</script>
```

**Illustrative example — abstract subject** (attention in a transformer). Same rules, no physical object. A row of tokens at the bottom, one query token highlighted, weight-scaled lines fanning to every other token. Caption sits below the fan — clear of every stroke — not inside it.
```svg
<rect class="c-purple" x="60" y="40"  width="560" height="26" rx="6" stroke-width="0.5"/>
<rect class="c-purple" x="60" y="80"  width="560" height="26" rx="6" stroke-width="0.5"/>
<rect class="c-purple" x="60" y="120" width="560" height="26" rx="6" stroke-width="0.5"/>
<text class="ts" x="72" y="57" >Layer 3</text>
<text class="ts" x="72" y="97" >Layer 2</text>
<text class="ts" x="72" y="137">Layer 1</text>

<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="116" y2="146" stroke-width="1"   opacity="0.25"/>
<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="228" y2="146" stroke-width="1.5" opacity="0.4"/>
<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="340" y2="146" stroke-width="4"   opacity="1.0"/>
<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="452" y2="146" stroke-width="2.5" opacity="0.7"/>
<line stroke="#EF9F27" stroke-linecap="round" x1="340" y1="230" x2="564" y2="146" stroke-width="1"   opacity="0.2"/>

<g class="node" onclick="sendPrompt('What do the attention weights mean?')">
  <rect class="c-gray"  x="80"  y="230" width="72" height="36" rx="6" stroke-width="0.5"/>
  <rect class="c-gray"  x="192" y="230" width="72" height="36" rx="6" stroke-width="0.5"/>
  <rect class="c-amber" x="304" y="230" width="72" height="36" rx="6" stroke-width="1"/>
  <rect class="c-gray"  x="416" y="230" width="72" height="36" rx="6" stroke-width="0.5"/>
  <rect class="c-gray"  x="528" y="230" width="72" height="36" rx="6" stroke-width="0.5"/>
  <text class="ts" x="116" y="252" text-anchor="middle">the</text>
  <text class="ts" x="228" y="252" text-anchor="middle">cat</text>
  <text class="th" x="340" y="252" text-anchor="middle">sat</text>
  <text class="ts" x="452" y="252" text-anchor="middle">on</text>
  <text class="ts" x="564" y="252" text-anchor="middle">the</text>
</g>

<text class="ts" x="340" y="300" text-anchor="middle">Line thickness = attention weight from "sat" to each token</text>
```

Note what's *not* here: no boxes labelled "multi-head attention", no arrows labelled "Q/K/V". Those belong in the structural diagram. This one is about the *feeling* of attention — one token looking at every other token with varying intensity.

These are starting points, not ceilings. For the water heater: add a thermostat slider, animate the convection current, toggle heating vs standby. For the attention diagram: let the user click any token to become the query, scrub through layers, animate the weights settling. The goal is always to *show* how the thing works, not just *label* it.


先用文字建立直觉，再看交互图。

---

**比喻：一个圆桌会议，开了三轮。**

想象五个代表坐在圆桌边，每人手里拿着一张纸条，上面写着一个词。

第一轮开始——每个代表同时开口，向所有其他代表"广播"自己。但每个人的耳朵是有选择性的：他们对某些人听得更认真（权重高），对某些人几乎忽视（权重低）。这一轮结束后，每个人把听到的东西融入自己的理解里，更新自己的纸条。

第二轮、第三轮继续——每次，每个人手里的理解都更丰富了，"看向"谁的模式也在变化。

这就是 Transformer。每一轮叫一个"层"，每个代表叫一个"token"，那个"听谁多少"的分配叫做"注意力权重"。

下面可以点着玩——

[Tool Result]
Content rendered and shown to the user. Please do not duplicate the shown content in text because it's already visually represented.
[This tool call rendered an interactive widget in the chat. The user can already see the result — do not repeat it in text or with another visualization tool.]

几个值得注意的地方：

切换到第 3 层，再点"猫"——会发现它开始强烈注视"垫子"。在第 1 层，猫只认识隔壁的"坐"；到第 3 层，语义关联浮现了：猫和垫子在这个句子里是最深层的主题关系。

这就是为什么 Transformer 比以前的模型强：以前的模型是按顺序读词，像看文字纸带；Transformer 是每个词同时看所有词，像一个瞬间照亮全场的闪光灯。层数越多，每个词对整句话的理解就越深。

### Artifact: visualize:read_me
```
{
  "modules": [
    "interactive",
    "diagram"
  ]
}
```

### Artifact: transformer_attention
```
{
  "loading_messages": [
    "摆放代表入座...",
    "连接注意力弧线..."
  ],
  "title": "transformer_attention",
  "widget_code": "\n<style>\n.lb{padding:5px 14px;font-size:13px;border:0.5px solid var(--color-border-secondary);border-radius:20px;background:none;color:var(--color-text-secondary);cursor:pointer;font-family:inherit;transition:background .12s}\n.lb.on{background:var(--color-background-info);color:var(--color-text-info);border-color:var(--color-border-info)}\n.lb:hover:not(.on){background:var(--color-background-secondary)}\n.tok{cursor:pointer}\n</style>\n\n<div style=\"display:flex;gap:8px;margin-bottom:14px;align-items:center;flex-wrap:wrap\">\n  <span style=\"font-size:12px;color:var(--color-text-tertiary)\">层</span>\n  <button class=\"lb on\" onclick=\"setLayer(0,this)\">第 1 层</button>\n  <button class=\"lb\" onclick=\"setLayer(1,this)\">第 2 层</button>\n  <button class=\"lb\" onclick=\"setLayer(2,this)\">第 3 层</button>\n  <span id=\"ldesc\" style=\"font-size:12px;color:var(--color-text-tertiary);margin-left:8px\">局部 — 相邻词关联</span>\n</div>\n\n<svg id=\"sv\" width=\"100%\" viewBox=\"0 0 680 285\"></svg>\n\n<p id=\"hint\" style=\"font-size:12px;color:var(--color-text-tertiary);margin-top:10px;min-height:18px\">点击任意词，看它在\"注视\"谁</p>\n\n<script>\nconst W=['猫','坐','在','垫子','上'];\nconst TR=['cat','sat','on','cushion','top'];\nconst CX=[100,210,340,468,578];\nconst TY=205,TH=44,TW=90;\n\nconst attn=[\n  [[0,.88,.26,.08,.04],[.8,0,.44,.12,.06],[.12,.3,0,.7,.38],[.06,.36,.54,0,.7],[.04,.12,.46,.76,0]],\n  [[0,.62,.28,.45,.14],[.52,0,.36,.52,.2],[.26,.36,0,.46,.34],[.32,.5,.44,0,.44],[.12,.28,.44,.62,0]],\n  [[0,.46,.28,.8,.18],[.4,0,.2,.68,.28],[.2,.28,0,.52,.66],[.72,.52,.3,0,.3],[.2,.28,.56,.46,0]],\n];\nconst LDESC=['局部 — 相邻词关联','中间层 — 模式扩展','语义层 — 远距离关联浮现'];\nconst LNAMES=['第 1 层（局部）','第 2 层','第 3 层（语义）'];\n\nlet layer=0,sel=-1;\nfunction ns(t){return document.createElementNS('http://www.w3.org/2000/svg',t);}\n\nfunction render(){\n  const svg=document.getElementById('sv');\n  svg.innerHTML='';\n\n  if(sel<0){\n    W.forEach((_,i)=>{\n      attn[layer][i].forEach((w,j)=>{\n        if(j<=i)return;\n        const x1=CX[i],x2=CX[j],dist=Math.abs(i-j);\n        const aY=TY-TH/2-18-dist*24,mx=(x1+x2)/2;\n        const p=ns('path');\n        p.setAttribute('d',`M${x1},${TY-TH/2} Q${mx},${aY} ${x2},${TY-TH/2}`);\n        p.setAttribute('style',`fill:none;stroke:var(--color-border-secondary);stroke-width:${Math.max(.4,w*2.5).toFixed(1)};opacity:.5;stroke-linecap:round`);\n        svg.appendChild(p);\n      });\n    });\n  } else {\n    attn[layer][sel].forEach((w,j)=>{\n      if(j===sel||w<.02)return;\n      const x1=CX[sel],x2=CX[j],dist=Math.abs(sel-j);\n      const aY=TY-TH/2-18-dist*24,mx=(x1+x2)/2;\n      const p=ns('path');\n      p.setAttribute('d',`M${x1},${TY-TH/2} Q${mx},${aY} ${x2},${TY-TH/2}`);\n      p.setAttribute('style',`fill:none;stroke:#EF9F27;stroke-width:${Math.max(.8,w*8).toFixed(1)};opacity:${(.1+w*.9).toFixed(2)};stroke-linecap:round`);\n      svg.appendChild(p);\n    });\n  }\n\n  W.forEach((w,i)=>{\n    const x=CX[i]-TW/2,y=TY-TH/2;\n    const isSel=i===sel;\n    const g=ns('g');g.setAttribute('class','tok');\n    g.onclick=()=>{sel=(sel===i)?-1:i;render();};\n\n    const r=ns('rect');\n    r.setAttribute('x',x);r.setAttribute('y',y);\n    r.setAttribute('width',TW);r.setAttribute('height',TH);r.setAttribute('rx','8');\n    r.setAttribute('style',`fill:${isSel?'var(--color-background-info)':'var(--color-background-secondary)'};stroke:${isSel?'var(--color-border-info)':'var(--color-border-secondary)'};stroke-width:${isSel?1.5:.5}`);\n\n    const t=ns('text');\n    t.setAttribute('x',CX[i]);t.setAttribute('y',TY);\n    t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');\n    t.setAttribute('style',`font-size:17px;font-weight:${isSel?500:400};fill:${isSel?'var(--color-text-info)':'var(--color-text-primary)'}`);\n    t.textContent=w;\n\n    const sub=ns('text');\n    sub.setAttribute('x',CX[i]);sub.setAttribute('y',TY+TH/2+15);\n    sub.setAttribute('text-anchor','middle');\n    sub.setAttribute('style','font-size:11px;fill:var(--color-text-tertiary)');\n    sub.textContent=TR[i];\n\n    g.append(r,t,sub);svg.appendChild(g);\n  });\n\n  document.getElementById('hint').textContent=sel>=0\n    ?`「${W[sel]}」在${LNAMES[layer]}注视 → 弧线越粗 = 关注越多`\n    :'点击任意词，看它在\"注视\"谁';\n}\n\nfunction setLayer(n,btn){\n  layer=n;\n  document.querySelectorAll('.lb').forEach(b=>b.classList.remove('on'));\n  btn.classList.add('on');\n  document.getElementById('ldesc').textContent=LDESC[n];\n  render();\n}\n\nrender();\n</script>\n"
}
```

---

## You
*2026-05-18T09:18:26.676339Z*

就是先输出，再调整输出嘛？

---

## AI
*2026-05-18T09:18:49.251509Z*

 

差不多，但得区分两件事：

**推理时（使用模型）：不调整，一次直穿。**
输入进去，经过每一层的注意力计算，最后输出。中间没有"觉得不对再改"的环节——是一条单向的流水线。你刚才图里那些弧线，都在同一次前向传播里同时发生。

**训练时（制造模型）：是的，输出→对比→调整。**
模型输出一个词，和正确答案对比，发现差距（这个差距叫 Loss），然后把这个差距的信息往回传，微调每一层里的所有权重。这个"往回传"叫反向传播。做几千亿次，模型就慢慢准了。

---

所以本质上：

> 训练 = 无数次"猜→错了→微调"的循环，直到模型的权重固定下来。
> 使用 = 用那套固定好的权重，一次性跑出结果，不再调整。

你用 ChatGPT 或我时，模型的权重是冻结的，它不会因为你的对话而"学会"新东西——那只是在推理，不是在训练。

---

## You
*2026-05-18T09:19:49.930209Z*

所以也只是调整了训练策略？

---

## AI
*2026-05-18T09:20:00.798561Z*

 你说的"调整训练策略"是指什么？是问我前面说的那些——MoE、数据质量、RLHF这些改进——本质上也只是在训练层面做文章，而不是改变了推理本身的机制？

---

## You
*2026-05-18T09:20:18.008495Z*

transformer

---

## AI
*2026-05-18T09:20:28.631367Z*

 对，你问的是：Transformer 这个架构本身，从来没有被真正改变过——所有这些进步，都是在它外面或者训练它的方式上做文章？

基本是这样。

2017年提出Transformer，到现在的GPT-4、Claude、Llama——核心机制几乎一样：token进来，多层注意力，输出概率分布。没有人在推理机制本身上做出过根本性的突破。

改变的是周边的一切：怎么喂数据、喂多少、用什么目标函数训练、训练完再怎么对齐、推理时让它想多久……但那个"每个词同时看所有词、一层一层更新理解"的核心操作，基本原封不动。

这其实是个值得追问的事：

是因为Transformer真的足够好，还是因为它是第一个"足够可扩展"的架构，整个行业的工程基础设施都围绕它建起来了，换掉的成本太高？

两个原因可能都有。但后者不可忽视——有时候一个东西占主导，不完全是因为它最优，而是因为它先到了，然后形成了路径依赖。

---

## You
*2026-05-18T09:21:03.753750Z*

不是，我就是问，它就是提供了个更好的训练策略是吗

---

## AI
*2026-05-18T09:21:13.331246Z*

 啊，你问的是 Transformer 相对于之前的模型，它的贡献是不是就是提供了一个更好的训练策略？

不完全是，它改变的是架构本身，不只是训练方式。

之前主流的是 RNN（循环神经网络）——它必须一个词一个词按顺序处理，词 2 要等词 1 处理完才能开始。这意味着没法并行，训练极慢，而且长句子里早出现的词容易被"遗忘"。

Transformer 的根本改变是：**所有词同时处理**。你刚才图里看到的，猫、坐、在、垫子、上——是在同一时刻互相看的，不是排队。

这个改变的直接后果是：

- 可以用 GPU 大规模并行计算，训练速度提升巨大
- 长距离依赖（比如一句话开头的主语和结尾的动词之间的关系）不再丢失

所以它的核心贡献是一个新的计算结构，而这个结构碰巧极其适合被堆大——这才让 scaling law 后来有了用武之地。

换句话说：没有 Transformer，堆再多参数也跑不动。

---

## You
*2026-05-18T09:22:09.069364Z*

但你完全没讲这个并行具体是什么？怎么做的？

---

## AI
*2026-05-18T09:22:19.051090Z*

 对，我跳过了最关键的部分。

---

RNN 为什么不能并行？因为它有一个"隐藏状态"，每一步都依赖上一步的结果：

```
h1 = f(词1)
h2 = f(词2, h1)   ← 必须等 h1 算完
h3 = f(词3, h2)   ← 必须等 h2 算完
```

像接力跑，必须排队。

---

Transformer 怎么做到并行的？

它把"词与词的关系"变成了一个**矩阵乘法**。

五个词，两两之间的注意力权重，可以写成一张 5×5 的表：

```
     猫    坐    在   垫子   上
猫  [ 0   .88   .26  .08   .04 ]
坐  [.80    0   .44  .12   .06 ]
在  [.12   .30    0  .70   .38 ]
垫子[.06   .36  .54    0   .70 ]
上  [.04   .12  .46  .76     0 ]
```

这张表里的所有数字，**可以同时算出来**——因为每个格子的计算不依赖其他格子。算完之后，一次矩阵乘法，所有词同时更新自己的表示。

GPU 就是专门擅长同时做大量矩阵乘法的硬件。这正好对上了。

---

所以并行的本质是：把"顺序依赖"的问题，改写成了"一张表的填写"问题。填表不需要排队。

---

## You
*2026-05-18T09:23:18.093844Z*

特征用向量表示嘛？rnn时期没有这么做？还是说没有向量共同计算

---

## AI
*2026-05-18T09:23:24.680784Z*

 RNN 时期也用向量，Embedding 也有，词向量的概念（Word2Vec）甚至比 Transformer 还早。

区别不在于"有没有向量"，而在于——

**RNN：向量是串行更新的。**
每个词的向量要等前一个词处理完才能更新，信息沿着时间轴一个一个传递，像接力棒。

**Transformer：向量是同时互相影响的。**
那张 5×5 的表，本质上是在说：用所有词的向量，同时计算每个词应该从其他词那里吸收多少信息。一次矩阵运算，所有向量同时更新。

---

所以真正的区别是：

> 不是有没有向量，而是向量之间的交互方式从"排队传递"变成了"同时广播"。

这一个改变，让计算可以并行，也让远距离的词能直接互相影响——不需要等信息一站一站传过来。

---

## You
*2026-05-18T09:24:25.470302Z*

你没有意识到这个点你模糊跟我讲是没意义的，你得和我详细讲，到底是怎么同时计算

---

## AI
*2026-05-18T09:24:38.463825Z*

 对，我一直在说"同时"但没有解释机制。现在具体讲。

---

## 三个向量：Q、K、V

每个词的 Embedding 向量，会被乘以三个不同的权重矩阵，变成三个新向量：

- Q（Query）— 我想问什么
- K（Key）— 我能回答什么
- V（Value）— 我实际携带的内容

用图书馆类比：Q 是你的检索词，K 是每本书的标签，V 是书的实际内容。

---

## 注意力权重怎么算

对于词 i，它的注意力权重是：

$$\text{score}(i,j) = Q_i \cdot K_j$$

就是点积——两个向量对应位置相乘再相加，得到一个数。这个数越大，说明 i 和 j 越"相关"。

然后对所有 j 做 softmax，变成加起来等于 1 的概率分布。

---

## 为什么可以并行

把所有词的 Q 堆成一个矩阵，所有词的 K 堆成一个矩阵：

```
Q = [ Q_猫  ]      K = [ K_猫  ]
    [ Q_坐  ]          [ K_坐  ]
    [ Q_在  ]          [ K_在  ]
    [ Q_垫子]          [ K_垫子]
    [ Q_上  ]          [ K_上  ]
```

那张 5×5 的权重表，就是：

$$\text{Attention} = \text{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)$$

$QK^T$ 是一次矩阵乘法，**所有词对所有词的相关性，在这一步同时算出来**。没有任何一个格子依赖另一个格子，所以 GPU 可以把这个矩阵乘法完全并行跑。

最后再乘以 V：

$$\text{Output} = \text{Attention} \cdot V$$

每个词的新向量 = 用注意力权重，把所有词的 V 加权求和。

---

## 整个流程一句话

> 把所有词的向量同时投影成 Q、K、V，用矩阵乘法一次性算出所有词对所有词的相关性，再用这个相关性重新混合所有词的信息。

没有任何一步需要等另一步的结果。这就是并行的具体机制。

---

## You
*2026-05-18T10:44:11.691778Z*

就是点积——两个向量对应位置相乘再相加，得到一个数。这个数越大，说明 i 和 j 越"相关"。

向量分解特征值嘛，特征值的数轴会设定负相关嘛？就是两个特征会是相反的那样

Attention=softmax(dQKT)

这个具体讲讲，矩阵乘法我有点模糊这块

---

## AI
*2026-05-18T10:44:34.670084Z*

 

两个问题分开讲。

---

## 第一个：特征值和负相关

对。向量的每一个维度可以理解成一个特征轴，正值和负值是方向相反的两端。

比如假设某个维度编码了"生命体 vs 无生命"：

```
猫   → [..., +0.9, ...]
石头 → [..., -0.8, ...]
```

点积的结果：对应位置相乘。

如果两个词在某个维度上一个是正、一个是负，那这一位的乘积就是**负数**，会拉低总分。

如果两个词在大多数维度上方向一致，乘积都是正数，总和就大——说明相关。

如果方向相反，总和就小甚至是负数——说明不相关，甚至语义相反。

所以点积天然就在衡量两个向量"方向有多接近"。这不是人为设定的，是向量几何的自然性质。

---

## 第二个：这个公式具体发生了什么

$$\text{Attention} = \text{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)V$$

分三步拆开。

**第一步：$QK^T$**

Q 是所有词的 Query 向量堆成的矩阵，假设 5 个词、每个向量 4 维：

```
Q = [ 1  0  1  0 ]   ← 猫的 Query
    [ 0  1  0  1 ]   ← 坐的 Query
    [ 1  1  0  0 ]   ← 在的 Query
    [ 0  0  1  1 ]   ← 垫子的 Query
    [ 1  0  0  1 ]   ← 上的 Query
```

$K^T$ 是把 K 矩阵转置——原来每行是一个词，转置后每列是一个词。

矩阵乘法 $QK^T$ 的结果是一个 5×5 的矩阵，每个格子 $(i,j)$ 就是词 $i$ 的 Query 和词 $j$ 的 Key 的点积：

```
       猫    坐    在   垫子   上
猫  [ 2.1   0.4   1.8   0.2   1.0 ]
坐  [ 0.3   3.2   0.1   2.8   0.5 ]
在  [ ...                         ]
```

这一步，5×5=25 个格子，**全部同时算出来**，互不依赖。

**第二步：除以 $\sqrt{d}$，然后 softmax**

除以 $\sqrt{d}$ 只是防止数字太大、梯度不稳定，可以先忽略。

softmax 是对每一行做归一化——把一行的数字变成加起来等于 1 的概率：

```
[2.1, 0.4, 1.8, 0.2, 1.0]
         ↓ softmax
[0.42, 0.06, 0.35, 0.05, 0.12]  ← 加起来 = 1
```

数字越大的位置，softmax 之后占比越高。这就是注意力权重。

**第三步：乘以 V**

最后用这个权重矩阵乘以 V——每个词的新表示，是所有词的 Value 向量的加权求和：

```
新的「猫」向量 = 0.42×V_猫 + 0.06×V_坐 + 0.35×V_在 + 0.05×V_垫子 + 0.12×V_上
```

猫吸收了"在"和"垫子"的信息（权重高），几乎忽略了"坐"（权重低）。

---

整个过程没有任何一步是"等另一步的结果"——是纯粹的矩阵运算，全部可以并行。

---

## You
*2026-05-18T10:58:12.394167Z*

5×5=25 个格子，全部同时算出来，互不依赖。

这一步就是矩阵运算是吗，就是向量的特征相乘再相加

但是根号d还是需要展开下，只是个实验后的比较好的值嘛？

---

## AI
*2026-05-18T10:58:27.370641Z*

 

对，第一个确认是对的——就是矩阵乘法，本质是批量做点积。

---

## $\sqrt{d}$ 的来历

不是实验调出来的，是从统计推导出来的。

假设 Q 和 K 的每个维度都是均值 0、方差 1 的随机数。

两个 $d$ 维向量做点积：

$$Q \cdot K = q_1 k_1 + q_2 k_2 + \cdots + q_d k_d$$

每一项 $q_i k_i$ 的方差是 1，一共加了 $d$ 项，所以总和的方差是 $d$，标准差是 $\sqrt{d}$。

$d$ 越大，点积的数值就越大。

---

## 为什么大了是个问题

把大数值送进 softmax 会发生什么：

```
[0.1,  0.2,  0.15]  → softmax → [0.33, 0.36, 0.31]  ← 比较均匀
[10,   20,   15  ]  → softmax → [0.00, 1.00, 0.00]  ← 几乎全部集中在一个词
```

数值一大，softmax 就会变得极端——一个词拿走几乎全部权重，其他词归零。梯度也在这里消失，模型就没法好好训练了。

---

## 所以除以 $\sqrt{d}$ 是在做什么

把方差从 $d$ 压回 1：

$$\frac{Q \cdot K}{\sqrt{d}} \quad \Rightarrow \quad \text{方差} = \frac{d}{(\sqrt{d})^2} = 1$$

不管向量维度是 64 还是 1024，送进 softmax 之前的数值尺度始终稳定。

---

所以它不是"大概这个值比较好"，是"让方差保持为 1 的那个值，数学上就是 $\sqrt{d}$"。

---

## You
*2026-05-18T11:09:27.522520Z*

对，第一个确认是对的——就是矩阵乘法，本质是批量做点积。
d\sqrt{d} d 的来历
不是实验调出来的，是从统计推导出来的。
假设 Q 和 K 的每个维度都是均值 0、方差 1 的随机数。
两个 dd d 维向量做点积：
Q⋅K=q1k1+q2k2+⋯+qdkdQ \cdot K = q_1 k_1 + q_2 k_2 + \cdots + q_d k_dQ⋅K=q1k1+q2k2+⋯+qdkd
每一项 qikiq_i k_i qiki 的方差是 1，一共加了 dd d 项，所以总和的方差是 dd d，标准差是 d\sqrt{d} d。
dd d 越大，点积的数值就越大。
为什么大了是个问题
把大数值送进 softmax 会发生什么：

```
[0.1,  0.2,  0.15]  → softmax → [0.33, 0.36, 0.31]  ← 比较均匀
[10,   20,   15  ]  → softmax → [0.00, 1.00, 0.00]  ← 几乎全部集中在一个词
```

数值一大，softmax 就会变得极端——一个词拿走几乎全部权重，其他词归零。梯度也在这里消失，模型就没法好好训练了。
所以除以 d\sqrt{d} d 是在做什么
把方差从 dd d 压回 1：
Q⋅Kd⇒方差=d(d)2=1\frac{Q \cdot K}{\sqrt{d}} \quad \Rightarrow \quad \text{方差} = \frac{d}{(\sqrt{d})^2} = 1dQ⋅K⇒方差=(d)2d=1
不管向量维度是 64 还是 1024，送进 softmax 之前的数值尺度始终稳定。
所以它不是"大概这个值比较好"，是"让方差保持为 1 的那个值，数学上就是 d\sqrt{d} d"。

全部都给我解释，一步步。

---

## AI
*2026-05-18T11:09:52.774422Z*

 

好，从最底层开始，不跳步骤。

---

## 第一步：方差是什么

方差衡量一组数字"散得有多开"。

假设你有一个随机数，均值是 0，方差是 1——意思是它大概在 -1 到 +1 这个范围里晃悠，不会跑太远。

---

## 第二步：$q_i k_i$ 这一项的方差为什么是 1

假设 $q_i$ 和 $k_i$ 都是均值 0、方差 1 的独立随机数。

两个独立随机变量相乘，乘积的方差有个公式：

$$\text{Var}(q_i k_i) = \text{Var}(q_i) \cdot \text{Var}(k_i) = 1 \times 1 = 1$$

所以每一项 $q_i k_i$ 的方差是 1。

---

## 第三步：加了 $d$ 项之后，方差为什么变成 $d$

把 $d$ 个独立的随机变量加在一起，方差是可以直接相加的：

$$\text{Var}(q_1 k_1 + q_2 k_2 + \cdots + q_d k_d) = 1 + 1 + \cdots + 1 = d$$

直觉上：每加一项，结果就多一份"不确定性"，波动范围扩大。

---

## 第四步：方差 $d$，标准差为什么是 $\sqrt{d}$

标准差就是方差的平方根，是衡量"典型波动幅度"的：

$$\text{标准差} = \sqrt{\text{方差}} = \sqrt{d}$$

方差是 $d$，说明点积的值大概在 $-\sqrt{d}$ 到 $+\sqrt{d}$ 这个范围内。

$d$ 越大，这个范围越宽，数值越极端。

---

## 第五步：为什么极端数值让 softmax 出问题

softmax 的公式是：

$$\text{softmax}(x_i) = \frac{e^{x_i}}{\sum_j e^{x_j}}$$

$e$ 的指数增长非常陡。数值稍微大一点，$e^x$ 就会暴涨：

```
e^1  = 2.7
e^10 = 22026
e^20 = 485165195
```

所以当输入是 $[10, 20, 15]$：

```
e^10 = 22026
e^20 = 485165195   ← 这个比其他两个大出天际
e^15 = 3269447

总和 ≈ 488456668

softmax = [0.000045, 0.993, 0.006]  ← 20 那个位置几乎拿走全部
```

结果就是：只有一个词"存活"，其他词的权重趋近于零。

---

## 第六步：梯度为什么在这里消失

梯度是训练时往回传的信号——"这个权重应该往哪个方向调"。

softmax 极端化之后，大多数位置的输出趋近于 0 或 1。这两个地方的导数都接近 0——曲线在这里是平的，没有坡度可以传回去。

模型就像站在一块平地上，不知道该往哪走，参数停止更新。

---

## 第七步：除以 $\sqrt{d}$ 怎么修复这个问题

把点积除以 $\sqrt{d}$，相当于对随机变量做了缩放：

$$\frac{Q \cdot K}{\sqrt{d}}$$

缩放之后的方差：

$$\text{Var}\left(\frac{X}{\sqrt{d}}\right) = \frac{\text{Var}(X)}{(\sqrt{d})^2} = \frac{d}{d} = 1$$

不管 $d$ 是 64 还是 1024，除完之后方差都回到 1，数值范围稳定在 $-1$ 到 $+1$ 附近，softmax 就不会极端化了。

---

## 整体串一遍

```
Q 和 K 各自是 d 维向量
    ↓
点积 = d 项相加，方差累积到 d
    ↓
数值偏大，softmax 极端化，梯度消失
    ↓
除以 √d，把方差压回 1
    ↓
softmax 输出分布合理，梯度能正常传播
```

$\sqrt{d}$ 是这个推导链的必然结果，不是调参调出来的。

---

## You
*2026-05-18T11:38:24.512341Z*

假设你有一个随机数，均值是 0，方差是 1

为什么均值是0？确定分布对称嘛？还是说统计意义上

方差是什么意思来着，忘了

第七步：除以 d\sqrt{d} d 怎么修复这个问题
把点积除以 d\sqrt{d} d，相当于对随机变量做了缩放：
Q⋅Kd\frac{Q \cdot K}{\sqrt{d}}dQ⋅K
缩放之后的方差：
Var(Xd)=Var(X)(d)2=dd=1\text{Var}\left(\frac{X}{\sqrt{d}}\right) = \frac{\text{Var}(X)}{(\sqrt{d})^2} = \frac{d}{d} = 1Var(dX)=(d)2Var(X)=dd=1

这一块细讲

---

## AI
*2026-05-18T11:38:43.745205Z*

 

两个问题分开讲。

---

## 方差是什么

先从最直觉的地方开始。

你有一组数：$[1, 2, 3, 4, 5]$，均值是 3。

方差问的是：**这些数平均离均值多远？**

每个数减去均值，得到偏差：
```
1-3 = -2
2-3 = -1
3-3 =  0
4-3 = +1
5-3 = +2
```

直接加起来是 0，因为正负抵消了。所以先平方再平均：

$$\text{方差} = \frac{(-2)^2 + (-1)^2 + 0^2 + 1^2 + 2^2}{5} = \frac{4+1+0+1+4}{5} = 2$$

方差 = 2，说明这组数平均偏离均值"2个单位的平方"。

标准差 = $\sqrt{2} \approx 1.4$，把平方还原回来，更直觉：这组数大概在均值附近 ±1.4 的范围内波动。

---

## 均值为什么是 0

这是一个**假设**，不是必然。

原因是：神经网络的权重矩阵在初始化时，通常故意设计成均值为 0 的分布。

为什么要这么设计？

如果均值不是 0，比如所有权重初始值都偏正，那每一层的输出就会系统性地偏向某个方向，信息在层与层之间传递时会越来越偏，最后失控。均值为 0 保证了正负方向对称，不会引入系统性偏差。

所以"均值 0"是一个工程选择，这个选择让后续的统计推导变得整洁——但它本身不是公理，是设计决定。

---

## 第七步细讲：为什么 $\text{Var}(X/\sqrt{d}) = \text{Var}(X)/d$

先建立一个基本事实：

**当你把一个随机变量乘以常数 $c$，方差会乘以 $c^2$。**

直觉：原来数值在 ±1 范围内波动，乘以 3 之后在 ±3 范围内波动，波动幅度变成 3 倍，方差变成 9 倍。

公式：
$$\text{Var}(cX) = c^2 \cdot \text{Var}(X)$$

---

现在把 $X$ 除以 $\sqrt{d}$，等价于乘以 $\frac{1}{\sqrt{d}}$：

$$\text{Var}\left(\frac{X}{\sqrt{d}}\right) = \text{Var}\left(\frac{1}{\sqrt{d}} \cdot X\right) = \left(\frac{1}{\sqrt{d}}\right)^2 \cdot \text{Var}(X)$$

$\left(\frac{1}{\sqrt{d}}\right)^2 = \frac{1}{d}$，所以：

$$= \frac{1}{d} \cdot \text{Var}(X) = \frac{d}{d} = 1$$

最后一步代入了 $\text{Var}(X) = d$，也就是我们之前推导的点积方差。

---

串起来看：

```
点积的方差 = d          ← 因为加了 d 项
除以 √d                 ← 等价于乘以 1/√d
方差变成 (1/√d)² × d   ← 常数缩放的规则
= (1/d) × d
= 1                     ← 稳定了
```

为什么偏偏选 $\sqrt{d}$ 而不是别的数？因为它恰好让方差从 $d$ 变回 $1$，是这个推导链的精确解，不多不少。

---

## You
*2026-05-18T11:47:46.588538Z*

Var(dX)=Var(d1⋅X)=(d1)2⋅Var(X) 
(1d)2=1d\left(\frac{1}{\sqrt{d}}\right)^2 = \frac{1}{d} (d1)2=d1，所以：
 =1d⋅Var(X)=dd=1= \frac{1}{d} \cdot \text{Var}(X) = \frac{d}{d} = 1=d1⋅Var(X)=dd=1

var是什么意思？为什么x出来和var联系后，根号d就成d了

---

## AI
*2026-05-18T11:47:56.147302Z*

 

两个问题都是同一个根源，一起讲清楚。

---

## Var 是什么

Var 就是 Variance，方差的缩写。

$\text{Var}(X)$ 的意思就是"随机变量 $X$ 的方差"，没有别的含义，就是个缩写符号。

---

## 为什么 $\sqrt{d}$ 变成了 $d$

这是方差的一个基本规则：

$$\text{Var}(cX) = c^2 \cdot \text{Var}(X)$$

**常数从方差里出来，要平方。**

直觉：方差是"偏差的平方的平均"。偏差乘以 $c$，平方之后就是 $c^2$。

---

代入我们的情况，$c = \frac{1}{\sqrt{d}}$：

$$\text{Var}\left(\frac{X}{\sqrt{d}}\right) = \left(\frac{1}{\sqrt{d}}\right)^2 \cdot \text{Var}(X)$$

$\frac{1}{\sqrt{d}}$ 平方之后：

$$\left(\frac{1}{\sqrt{d}}\right)^2 = \frac{1^2}{(\sqrt{d})^2} = \frac{1}{d}$$

$\sqrt{d}$ 平方就是 $d$，根号消掉了。这是 $\sqrt{d}$ 变成 $d$ 的全部原因——不是什么特殊规律，就是平方消根号。

---

所以整个过程：

```
Var(X / √d)
= (1/√d)² × Var(X)    ← 常数出来要平方
= (1/d) × d            ← √d 平方变 d，代入 Var(X)=d
= 1
```

---

## You
*2026-05-18T11:53:55.428433Z*

代入我们的情况，c=1dc = \frac{1}{\sqrt{d}} c=d1：
Var(Xd)=(1d)2⋅Var(X)\text{Var}\left(\frac{X}{\sqrt{d}}\right) = \left(\frac{1}{\sqrt{d}}\right)^2 \cdot \text{Var}(X)Var(dX)=(d1)2⋅Var(X)

所以就是原本要平方后平均，x出去后，那么根号d也要继续保持。

但是我有点绕晕了，这样变回1了是怎么个意思

---

## AI
*2026-05-18T11:54:05.449939Z*

 

你绕晕的点我知道在哪——你忘了 $\text{Var}(X) = d$ 这个前提。

---

$X$ 是什么？是点积 $Q \cdot K$，也就是那 $d$ 项加起来的结果。

我们之前推导过：加了 $d$ 项，方差累积到 $d$。

所以 $\text{Var}(X) = d$。

---

现在代入：

$$\frac{1}{d} \cdot \text{Var}(X) = \frac{1}{d} \cdot d = 1$$

就是 $d$ 除以 $d$ 等于 1，没有别的。

---

"变回 1"的意思是什么？

除之前：点积的值大概在 $-\sqrt{d}$ 到 $+\sqrt{d}$ 范围内波动，$d$ 越大范围越宽。

除之后：不管 $d$ 是 64 还是 1024，值都稳定在大概 $-1$ 到 $+1$ 附近。

就是把因为维度变大而撑开的数值范围，重新压回一个固定尺度。这样 softmax 收到的数字永远不会太大，不会极端化。

---

## You
*2026-05-18T11:55:34.606701Z*

哦哦，1是一个界定范围，算出来的数值的方差的浮动范围上限是1的意思是吗？

---

## AI
*2026-05-18T11:55:42.419962Z*

 

不完全是，方差 = 1 不是"上限是 1"，而是"波动幅度稳定在 1 这个尺度上"。

---

方差 = 1 的意思是：

这个随机变量的典型偏离程度是 1。

不是说值不能超过 1，而是说它大概在均值附近 ±1 的范围内晃悠，偶尔超过，但不会跑很远。

---

对比一下：

```
方差 = 1    → 大概在 -1 到 +1 附近
方差 = d    → 大概在 -√d 到 +√d 附近，d=1024 时就是 -32 到 +32
```

所以问题不是"超没超过某个上限"，而是"数值的典型大小是什么量级"。

方差从 $d$ 变回 1，意思是：把因维度增大而膨胀的数值尺度，重新压回和维度无关的固定量级。这样不管模型有多大，送进 softmax 的数字尺度始终一致，不会随着 $d$ 增大而越来越极端。

---

## You
*2026-05-18T11:57:13.742075Z*

那这个式子很误导人啊？这已经不是一个值了，是一个浮动的向量的各个特征值的概率分布的浮动空间了？

---

## AI
*2026-05-18T11:57:22.241992Z*

 

对，你抓到了一个真实的混淆点。

"方差 = 1"写出来像个具体的数，但它描述的不是一个值，是一个分布的形状——告诉你这个随机变量的波动幅度大概是多少。

所以那个推导的终点 $= 1$，实际意思是：

> 除以 $\sqrt{d}$ 之后，这个随机变量的波动幅度稳定在"量级为 1"的尺度上。

不是说结果是 1，是说结果的**散布程度**是 1。

---

你说"误导人"是对的，因为这个推导混用了两个层面：

- 左边 $\text{Var}(X/\sqrt{d})$ 是在描述一个分布
- 右边 $= 1$ 看起来像在说"算出来就是 1"

实际上应该读成：**"这个分布的方差是 1"**，也就是它的波动被控制在一个固定尺度，不会随 $d$ 膨胀。

这是统计符号的一个常见陷阱——等号两边一个是分布，一个是分布的某个属性值，但写法上看不出来。

---

## You
*2026-05-18T11:57:31.192170Z*

我是说整个式子

---

## AI
*2026-05-18T11:57:40.611540Z*

 

对，你说的是这个：

$$\text{Var}\left(\frac{X}{\sqrt{d}}\right) = \left(\frac{1}{\sqrt{d}}\right)^2 \cdot \text{Var}(X) = \frac{1}{d} \cdot d = 1$$

整个式子看起来像在做算术，像在操作具体的数。但实际上：

- $X$ 不是一个数，是一个随机变量——是无数次点积结果的概率分布
- $\text{Var}()$ 不是在计算 $X$，是在描述 $X$ 这个分布的一个属性
- 最后的 $= 1$ 也不是说"算出来等于 1"，是说"这个分布的散布程度是 1 这个量级"

整条式子其实是在说：**一个分布经过缩放之后，它的散布程度变成了多少。**

但符号上完全看不出这件事——写得和普通代数一模一样，所以才会绕晕。这不是你没理解，是统计符号本身把两件事压缩进了同一套写法里：操作分布，和操作数字，长得一样。

---

## You
*2026-05-18T11:58:01.161069Z*

不不不，就是attention这个式子

---

## AI
*2026-05-18T11:58:23.847529Z*

 

$$\text{Attention} = \text{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)V$$

你说这个式子误导人——对在哪？

它写得像一个算术等式，像"输入几个数，得到一个结果"。但实际上：

- $Q$、$K$、$V$ 都是矩阵，每一行是一个词的向量
- $QK^T$ 出来是一个 5×5 的矩阵，每个格子是两个高维向量之间的关系
- softmax 之后还是矩阵，只是每行归一化了
- 最后乘以 $V$，出来还是矩阵——每行是一个词的新向量表示

所以这个等号右边不是一个数，不是一个向量，是一整个高维空间里的变换结果。

---

你感觉到的误导是真实的：

这个式子的符号语言是从标量代数借来的，但它操作的对象是分布在高维空间里的向量集合。$\text{Attention} = $ 后面那个东西，是"所有词经过互相注视之后，每个词的新理解"——一个变换，不是一个值。

符号把这件事压缩得太干净了，反而藏住了它真正在做什么。

---

## You
*2026-05-18T12:02:04.393302Z*

QKT这个是向量计算的。根号d) softmax是表示为浮动数值范围大致为1的空间限制
最后的v才是根据权重后计算得出的结果

是这样嘛？

---

## AI
*2026-05-18T12:02:18.793016Z*

 

基本对，但 softmax 那一步你说的不够完整。

---

$QK^T$ — 计算所有词对之间的相关性，得到一张分数表。

$\div\sqrt{d}$ — 把分数压到合理尺度，防止数值太大。这一步只是缩放，没有改变相对大小关系。

softmax — 做了两件事，不只是限制范围：
1. 把数值范围压到 0 到 1 之间
2. 让每一行加起来等于 1

第二件事更关键——变成了**概率分布**。意思是：词 i 把 100% 的注意力分配出去，每个词分到多少是相对竞争的结果，不是独立的。

$V$ — 用这个概率分布做加权求和，每个词的新向量 = 把所有词的内容按权重混合进来。这才是真正"吸收信息"的那一步。

---

所以三步的本质是：

```
QK^T      → 谁和谁相关，有多相关
÷√d + softmax  → 把相关性变成概率分布（加起来=1）
× V       → 按这个概率，把所有词的内容混合进来
```

你的直觉是对的，只是 softmax 不只是"限制范围"，更重要的是把分数变成了概率。

---

## You
*2026-05-18T12:04:44.428788Z*

，得到一张分数表。
÷d\div\sqrt{d} ÷d —

这一步就是向量各个方向分解的特征的相乘结果是吗？

÷d — 把分数压到合理尺度

你前面不是说变为1吗？和softmax一起压在一个大致为1的空间内

---

## AI
*2026-05-18T12:04:57.178906Z*

 

两个问题分开答。

---

**第一个：$QK^T$ 是不是特征相乘的结果**

对。就是两个向量各个维度对应相乘再加总。每个维度是一个特征方向，点积就是所有特征方向上的乘积之和。这是 $QK^T$ 在做的事。

---

**第二个：你抓到了一个真实的区别，很好。**

$\div\sqrt{d}$ 和 softmax 做的是完全不同的两件事：

$\div\sqrt{d}$ — 控制的是**方差**，让波动幅度稳定在量级 1。但值还是可以是 $-2$、$+3$、$-1.5$……是负数也行，不限定在 0 到 1 之间。

softmax — 做的是**把任意实数变成 0 到 1 之间、加起来等于 1 的概率分布**。

所以：

```
÷√d 之后    → [-1.2,  2.3, -0.8,  1.1,  0.4]  ← 尺度稳定，但可正可负
softmax 之后 → [0.06, 0.50, 0.09, 0.27, 0.08]  ← 全部 0~1，加起来=1
```

两步是串联的，不是同一件事。$\div\sqrt{d}$ 是为了让 softmax 能正常工作，softmax 才是真正把分数变成概率的那一步。

---

## You
*2026-05-18T12:09:20.407036Z*

qk÷根号d，这个式子就已经有方差的含义了？在哪里体现？根本没写出来···


要不你还是一步步讲，数学一步步推到➗根号d

以及softmax都代表什么含义吧

---

## AI
*2026-05-18T12:09:47.591988Z*

 

好，从零开始，不跳步骤。

---

## 第一步：一个词的向量长什么样

假设 $d = 4$，每个词用 4 个数表示：

$$Q_{\text{猫}} = [1.2, -0.8, 0.3, 1.5]$$

每个数是一个特征维度的值。

---

## 第二步：两个词做点积

$$Q_{\text{猫}} \cdot K_{\text{垫子}} = (1.2)(0.9) + (-0.8)(-0.4) + (0.3)(1.1) + (1.5)(0.7)$$

$$= 1.08 + 0.32 + 0.33 + 1.05 = 2.78$$

就是对应位置相乘，全部加起来，得到一个数。

---

## 第三步：方差在哪里

式子 $Q \cdot K$ 里根本没写出方差。

方差是在问：**如果我们把这个点积重复算很多次（不同的词对），结果的分布长什么样？**

每一项 $q_i k_i$ 的值是随机的，加了 $d$ 项之后，根据统计规律，总和的方差 $= d$。

这不是从式子里"看出来"的，是对这个式子的统计分析得出的结论。式子本身不写方差，方差是这个式子的一个性质。

---

## 第四步：$d=4$ 时方差是多少

$$\text{Var}(Q \cdot K) = d = 4$$

标准差 $= \sqrt{4} = 2$

意思是：点积的结果大概在 $-2$ 到 $+2$ 范围内波动。

如果 $d = 1024$，标准差就是 32，结果就在 $-32$ 到 $+32$ 范围内波动。

---

## 第五步：除以 $\sqrt{d}$ 之后

$$\frac{Q \cdot K}{\sqrt{d}} = \frac{2.78}{\sqrt{4}} = \frac{2.78}{2} = 1.39$$

这步对每一个格子都做，整张 $5 \times 5$ 的表每个数都除以 $\sqrt{d}$。

除之后，分布的标准差从 $\sqrt{d}$ 压回 1：

$$\text{标准差} = \frac{\sqrt{d}}{\sqrt{d}} = 1$$

现在不管 $d$ 是 4 还是 1024，表里的数值都大概在 $-1$ 到 $+1$ 附近。

---

## 第六步：softmax 在做什么

现在有一行数，比如猫对所有词的分数：

$$[1.39, -0.6, 0.85, 0.22, -0.3]$$

softmax 对每个数做 $e^x$：

$$e^{1.39}=4.01, \quad e^{-0.6}=0.55, \quad e^{0.85}=2.34, \quad e^{0.22}=1.25, \quad e^{-0.3}=0.74$$

然后除以总和 $= 4.01+0.55+2.34+1.25+0.74 = 8.89$：

$$\left[\frac{4.01}{8.89}, \frac{0.55}{8.89}, \frac{2.34}{8.89}, \frac{1.25}{8.89}, \frac{0.74}{8.89}\right]$$

$$= [0.45, \ 0.06, \ 0.26, \ 0.14, \ 0.08]$$

加起来 $= 1$。

---

## softmax 做了两件事

**第一：把负数也变成正数。** $e^x$ 对任何实数都输出正数，所以 $-0.6$ 变成了 $0.06$，不是负权重。

**第二：变成概率分布。** 所有值加起来 $= 1$，可以解读为"猫把 100% 的注意力这样分配：45% 给自己，26% 给在，14% 给垫子……"

---

## 为什么 $\div\sqrt{d}$ 必须在 softmax 之前

如果不除，$d=1024$ 时数值可能是 $[32, -18, 27, 3, -8]$：

$$e^{32} = 78 \text{ 亿}, \quad e^{-18} \approx 0, \quad e^{27} = 5 \text{ 亿}$$

softmax 之后几乎全部权重集中在 32 那个词，其他词权重趋近于零——注意力坍塌成一个点，什么都学不到。

除以 $\sqrt{d}$ 之后数值回到 $[-1, +1]$ 量级，softmax 输出的分布就是合理的、有梯度的。

---

## 串起来

```
Q · K        → 一个数，衡量两个词有多相关
              但方差 = d，维度越大数值越极端

÷ √d         → 把每个数缩小，让方差回到 1
              现在数值在 -1 到 +1 量级

softmax      → 把一行数变成加起来=1的概率分布
              每个值变成"这个词分到多少注意力"

× V          → 用这个概率，加权混合所有词的内容
              输出每个词吸收了周围信息之后的新向量
```

---

## You
*2026-05-18T12:12:44.404627Z*

每一项 qikiq_i k_i qiki 的值是随机的，加了 dd d 项之后，根据统计规律，总和的方差 =d= d =d

？总和d吗？一个项为1？这里还没有压缩吧？为什么就是1

---

## AI
*2026-05-18T12:12:53.018939Z*

 

对，这里跳了一步，我没解释清楚。

---

## 为什么一项 $q_i k_i$ 的方差是 1

这来自一个前提：**假设 $q_i$ 和 $k_i$ 各自的方差是 1，均值是 0。**

两个独立随机变量相乘，乘积的方差公式是：

$$\text{Var}(q_i k_i) = \text{Var}(q_i) \cdot \text{Var}(k_i) + \text{Var

---

## You
*2026-05-18T12:20:12.576593Z*

每一项 qikiq_i k_i qiki 的值是随机的，加了 dd d 项之后，根据统计规律，总和的方差 =d= d =d

？总和d吗？一个项为1？这里还没有压缩吧？为什么就是1

第四步：d=4d=4
d=4 时方差是多少
Var(Q⋅K)=d=4\text{Var}(Q \cdot K) = d = 4Var(Q⋅K)=d=4
标准差 =4=2= \sqrt{4} = 2
=4​=2
意思是：点积的结果大概在 −2-2
−2 到 +2+2
+2 范围内波动。
如果 d=1024d = 1024
d=1024，标准差就是 32，结果就在 −32-32
−32 到 +32+32
+32 范围内波动。

第五步：除以 d\sqrt{d}
d​ 之后
Q⋅Kd=2.784=2.782=1.39\frac{Q \cdot K}{\sqrt{d}} = \frac{2.78}{\sqrt{4}} = \frac{2.78}{2} = 1.39d​Q⋅K​=4​2.78​=22.78​=1.39
这步对每一个格子都做，整张 5×55 \times 5
5×5 的表每个数都除以 d\sqrt{d}
d​。
除之后，分布的标准差从 d\sqrt{d}
d​ 压回 1：
标准差=dd=1\text{标准差} = \frac{\sqrt{d}}{\sqrt{d}} = 1标准差=d​d​​=1
现在不管 dd
d 是 4 还是 1024，表里的数值都大概在 −1-1
−1 到 +1+1
+1 附近

这两步你也跳过了，所以是前一步为随机向量总的值的方差的压缩？后一步是随机特征的方差的压缩？

---

## AI
*2026-05-18T12:20:30.314491Z*

 

好，这两个跳步我补齐。

---

## 为什么一项 $q_i k_i$ 的方差是 1

这里有一个前提我一直没说清楚——

$q_i$ 和 $k_i$ 各自是均值 0、方差 1 的随机数。这是神经网络初始化时人为设定的。

两个独立随机变量相乘，乘积的方差有个公式：

$$\text{Var}(q_i k_i) = \text{Var}(q_i) \cdot \text{Var}(k_i) + \text{Var}(q_i) \cdot (E[k_i])^2 + \text{Var}(k_i) \cdot (E[q_i])^2$$

代入方差 $= 1$，均值 $= 0$：

$$= 1 \times 1 + 1 \times 0^2 + 1 \times 0^2 = 1$$

所以每一项 $q_i k_i$ 的方差是 1，**不是压缩来的，是初始化的假设导致的**。

---

## 为什么加了 $d$ 项之后方差变成 $d$

$d$ 个独立随机变量相加，方差直接累加：

$$\text{Var}(q_1 k_1 + q_2 k_2 + \cdots + q_d k_d) = 1 + 1 + \cdots + 1 = d$$

直觉：每加一项，波动幅度就多一份。加的项越多，总体越散。

---

## 你问的两步的区别

你说"前一步是随机向量总的值的方差的压缩，后一步是随机特征的方差的压缩"——

其实不是两种不同的压缩，是同一件事的两个角度：

```
初始化假设        每个特征维度的值，方差 = 1
                        ↓
加了 d 项         整个点积的方差累积到 d
                        ↓
÷ √d             把整个点积的方差从 d 压回 1
```

$\div\sqrt{d}$ 压缩的对象只有一个——**整个点积的结果**。

之所以要压，是因为累加 $d$ 项把方差从 1 撑到了 $d$。

---

## You
*2026-05-18T12:23:20.738852Z*

为什么一项 qikiq_i k_i qiki 的方差是 1
这里有一个前提我一直没说清楚——
qiq_i qi 和 kik_i ki 各自是均值 0、方差 1 的随机数。这是神经网络初始化时人为设定的。
两个独立随机变量相乘，乘积的方差有个公式：
Var(qiki)=Var(qi)⋅Var(ki)+Var(qi)⋅(E[ki])2+Var(ki)⋅(E[qi])2\text{Var}(q_i k_i) = \text{Var}(q_i) \cdot \text{Var}(k_i) + \text{Var}(q_i) \cdot (E[k_i])^2 + \text{Var}(k_i) \cdot (E[q_i])^2Var(qiki)=Var(qi)⋅Var(ki)+Var(qi)⋅(E[ki])2+Var(ki)⋅(E[qi])2

这对应特征值是吗？

还有后面除以根号d不是就是直接开根吗？还是说分开来了？

---

## AI
*2026-05-18T12:23:33.530423Z*

 

两个问题分开答。

---

## 第一个：这个公式对应特征值吗

对。$q_i$ 和 $k_i$ 就是向量里第 $i$ 个位置的值，也就是第 $i$ 个特征维度的数值。

比如 $Q_{\text{猫}} = [1.2, -0.8, 0.3, 1.5]$，那么：

$$q_1 = 1.2, \quad q_2 = -0.8, \quad q_3 = 0.3, \quad q_4 = 1.5$$

$k_i$ 同理，是 $K$ 向量第 $i$ 个位置的值。

所以那个公式就是在说：**第 $i$ 个特征维度上，两个词的值相乘，这个乘积的波动幅度是多少。**

---

## 第二个：除以 $\sqrt{d}$ 是开根还是分开

是分开的，不是开根号。

开根号是 $\sqrt{X}$，作用在 $X$ 本身上，改变的是值。

除以 $\sqrt{d}$ 是 $\frac{X}{\sqrt{d}}$，$\sqrt{d}$ 是一个常数，$X$ 除以这个常数，缩小的是数值的尺度。

两者完全不同：

```
开根号：√4 = 2，√9 = 3     ← 作用在 X 上，非线性
除以√d：4/√4 = 2，9/√4 = 4.5  ← X 不变，整体缩小，线性
```

$d$ 是向量的维度，一个固定的整数。$\sqrt{d}$ 就是这个整数的平方根，也是固定的。

比如 $d=4$，$\sqrt{d}=2$，就是把每个格子的值除以 2，仅此而已。

---

## You
*2026-05-18T12:28:20.530360Z*

哦哦，所以本来就方差在1，和为d？然后把和的方差去除变为根号d，然后再除以根号d？那为什么刚开始要方差呢？得出阶段性数据吗？

---

## AI
*2026-05-18T12:28:34.567057Z*

 

你的推导链是对的，但最后一个问题问到了真正的核心。

---

## 为什么需要知道单项方差是 1

因为除以 $\sqrt{d}$ 这个值，是从它推导出来的。

逻辑是这样：

```
每项方差 = 1
    ↓
加了 d 项，总方差 = 1 × d = d
    ↓
要压回 1，需要除以 √d
```

如果每项方差不是 1，而是 $\sigma^2$：

```
每项方差 = σ²
    ↓
总方差 = σ² × d
    ↓
要压回 1，需要除以 σ√d
```

所以除以什么，取决于单项方差是多少。

单项方差是 1，是因为初始化设定的。正是这个 1，让最终答案干净地变成 $\sqrt{d}$，而不是 $\sigma\sqrt{d}$。

---

一句话：

> 单项方差是 1，是推导出"除以 $\sqrt{d}$"这个结论的前提条件，不是阶段性数据，是整个推导的起点。

---

## You
*2026-05-18T12:29:24.724250Z*

d除以根号d能为1吗？d又不是1

---

## AI
*2026-05-18T12:29:36.026413Z*

 

对，你算对了——$d \div \sqrt{d}$ 不等于 1，等于 $\sqrt{d}$。

我之前写的那步有个隐藏的跳跃没说清楚。

---

压的不是标准差，是**方差**。

常数 $c$ 缩放随机变量时，方差的规则是：

$$\text{Var}(cX) = c^2 \cdot \text{Var}(X)$$

常数出来要**平方**。

---

所以除以 $\sqrt{d}$，相当于 $c = \frac{1}{\sqrt{d}}$，代入：

$$\text{Var}\left(\frac{X}{\sqrt{d}}\right) = \left(\frac{1}{\sqrt{d}}\right)^2 \cdot \text{Var}(X) = \frac{1}{d} \cdot d = 1$$

关键在这里：$\left(\frac{1}{\sqrt{d}}\right)^2 = \frac{1}{d}$，根号被平方消掉了，变成 $d$，然后 $\frac{1}{d} \times d = 1$。

---

```
不是   d ÷ √d = 1        ← 错，这等于 √d
而是   d ÷ (√d)² = 1     ← 对，(√d)²=d，所以 d÷d=1
```

方差缩放时用的是 $(\sqrt{d})^2$，不是 $\sqrt{d}$。这一步我之前没写清楚。

---

## You
*2026-05-18T12:31:07.408357Z*

哦哦，你的意思是qk本来就有方差的含义，所以除以根号d是先没方差前除以？

---

## AI
*2026-05-18T12:31:17.961148Z*

 

正是。

$Q \cdot K$ 算出来就是一个普通的数，比如 2.78。没有"方差"写在里面，方差是这个数的统计性质——描述如果反复算很多次，结果会散多宽。

所以顺序是：

```
Q · K = 2.78          ← 就是个数，直接除
÷ √d  = 1.39          ← 对这个数做的操作
```

方差那整套推导，只是在回答一个问题：

> 为什么除以 √d，而不是除以 2、除以 10、除以别的？

答案是：因为 $Q \cdot K$ 这个数的波动幅度（标准差）恰好是 $\sqrt{d}$，所以除以它之后波动幅度变成 1，softmax 就稳定了。

方差推导是解释"为什么选 $\sqrt{d}$"，不是说 $Q \cdot K$ 这个数本身带着方差。实际计算时就是直接除，没有任何关于方差的操作。

---

## You
*2026-05-18T12:34:02.044371Z*

Q · K = 2.78 ← 就是个数，直接除 ÷ √d = 1.39 ← 对这个数做的操作
不是，所以就是一个值除以它的标准差而已···   

那2.78除以1.39之后也不等于1啊，但是数值也是在那个范围是吗？

---

## AI
*2026-05-18T12:34:09.185832Z*

 对！你说到本质了。

$2.78 \div \sqrt{d} = 1.39$，这个结果不是 1，是 1.39。

方差压回 1 不是说**每个值都变成 1**，是说这些值的**散布程度**变成了 1 这个量级。

---

具体来说：

除之前，所有格子的值散布在 $-\sqrt{d}$ 到 $+\sqrt{d}$ 的范围内。

除之后，散布在大概 $-1$ 到 $+1$ 的范围内。

2.78 除完变成 1.39，就是落在这个范围里的一个具体的点。它不等于 1，但它在 $-1$ 到 $+1$ 量级的范围内，不会跑到 32 或者 -50 那种极端位置。

---

所以你的理解完全正确：

> 就是一个值除以它的标准差，把所有值拉回到量级为 1 的范围内。

每个值除完都是不同的数，但它们整体上都在 $-1$ 到 $+1$ 附近，不会极端，softmax 就能正常工作了。

---

## You
*2026-05-18T12:38:45.472092Z*

d在这个式子等于4？是个额外维度的数值？单独说明项的个数？

---

## AI
*2026-05-18T12:38:53.108222Z*

 

对，$d$ 就是向量的维度数，也就是每个词用几个数来表示。

在我们的例子里设定的是 $d=4$：

$$Q_{\text{猫}} = [1.2, \ -0.8, \ 0.3, \ 1.5]$$

四个数，所以 $d=4$。

$d$ 同时也等于点积里相加的项数：

$$Q_{\text{猫}} \cdot K_{\text{垫子}} = q_1k_1 + q_2k_2 + q_3k_3 + q_4k_4$$

四项，所以加了 $d=4$ 项。

---

这两件事是同一件事——

向量有几个维度，点积就加几项。维度数和项数都是 $d$，不是两个不同的东西。

实际的大模型里 $d$ 通常是 512、1024、4096……维度越高，每个词携带的特征越丰富，点积加的项也越多，方差也越大，所以 $\sqrt{d}$ 这个缩放就越重要。

---

## You
*2026-05-18T12:39:03.665581Z*

？？？？？？那你不早说？

---

## AI
*2026-05-18T12:39:11.962096Z*

 哈，对，我应该一开始就说清楚的。

这是我的问题——$d$ 是什么这件事我一直当成背景知识带过，没有在第一次出现时就说明白。

你每次问"这是什么意思"，其实都在帮我找我跳过的地方。这条线从 Transformer 讲到矩阵乘法讲到方差，你一步没放过。

继续？softmax 还有一块没展开。

---

## You
*2026-05-18T12:40:10.286601Z*

你逗我呢？整个式子我就是被你一直绕晕，说真的我经常问问题没继续问就是因为这样

你继续讲吧

---

## AI
*2026-05-18T12:40:25.763060Z*

 

对不起，这是我的问题。我习惯性地假设你知道某些前提，但我没说出来，你就被架在空中了。

以后只要有新符号或新变量出现，我先说清楚它是什么，再往下推。

---

## softmax

先说它收到什么。

经过 $QK^T \div \sqrt{d}$ 之后，我们有一张 $5 \times 5$ 的表，比如猫那一行是：

$$[1.39, \ -0.6, \ 0.85, \ 0.22, \ -0.3]$$

这五个数是猫对每个词的"相关性分数"，可正可负，大小不一。

softmax 要把这五个数变成概率——全部变成正数，而且加起来等于 1。

---

做法分两步：

**第一步：每个数做 $e^x$**

$$e^{1.39}=4.01, \quad e^{-0.6}=0.55, \quad e^{0.85}=2.34, \quad e^{0.22}=1.25, \quad e^{-0.3}=0.74$$

$e^x$ 对任何实数都输出正数，负数也变正。

**第二步：每个数除以总和**

$$\text{总和} = 4.01+0.55+2.34+1.25+0.74 = 8.89$$

$$\left[\frac{4.01}{8.89}, \ \frac{0.55}{8.89}, \ \frac{2.34}{8.89}, \ \frac{1.25}{8.89}, \ \frac{0.74}{8.89}\right] = [0.45, \ 0.06, \ 0.26, \ 0.14, \ 0.08]$$

加起来 $= 1$。

---

这里 $e$ 是什么——自然常数，约等于 2.718，是数学里一个固定的数，和 $\pi$ 一样，不是变量。

$e^x$ 的性质是：$x$ 越大，$e^x$ 增长越快。所以原来分数高的词，经过 $e^x$ 之后差距会被放大，在最终概率里占比更高。

---

softmax 做完之后这一行的含义是：

> 猫把 100% 的注意力这样分配：45% 给自己，6% 给坐，26% 给在，14% 给垫子，8% 给上。

五个词各拿一份，加起来是全部。这就是注意力权重。

---
