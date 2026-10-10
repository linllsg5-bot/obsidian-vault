---
source_platform: ChatGPT
source_archive: a653a614a5dc39b44a4fc20a01bcf3297cb01cad521120f1b2db3323cdadd864-2026-10-09-01-01-54-530ee6578da54e2d9a99ca9e9c6e3017 (1).zip
source_conversation_id: 6ac5a0f4-5ab4-83ee-bc62-235d4b305605
source_export_file: conversations-003.json
source_created_at: 1791336693.204375
import_status: raw-import
epistemic_status: candidate
---
# Hermes和Pi比较
> 来源：ChatGPT 导出 `a653a614a5dc39b44a4fc20a01bcf3297cb01cad521120f1b2db3323cdadd864-2026-10-09-01-01-54-530ee6578da54e2d9a99ca9e9c6e3017 (1).zip`；本文件是原始会话的可读投影，不是总结。

## assistant

如果你说的是最近那个 **Hermes Agent / Hermes CLI**，拿它和你前面一直在考虑的 **Pi（pi-mono / pi coding agent）** 比，我会更关心一件事：谁更适合当你项目里的“总控层”，而不只是单次写代码更强。  
我查一下它们现在的实际定位、扩展方式和 Codex 接入能力，再按你的用法来比。

## assistant

我先看到一个很关键的变化：**现在 Hermes 也已经原生支持 ChatGPT/Codex 订阅 OAuth 了**，所以“为了把自己的 Codex 接进 Agent，只能优先 Pi”这个理由已经不成立。Hermes 官方现在直接把 OpenAI Codex 列为 provider；Pi 也原生支持 ChatGPT Plus/Pro 的 Codex 登录。

真正的区别变成了：**Pi 是刻意做薄的 coding harness；Hermes 是已经长成一套完整 Agent OS 的东西。**

## assistant

如果你说的是 **Nous Research 的 Hermes Agent**，那我现在会重新调整之前给你的判断：

**对你这种用途，我反而会优先认真试 Hermes，而不是直接把 Pi 当总控。**

Pi 和 Hermes 的差异其实很鲜明：

| | Hermes | Pi |
|---|---|---|
| 核心定位 | 完整的长期 Agent | 极简 coding-agent harness |
| 默认能力 | 很多，接近 Agent OS | 很少，刻意保持薄 |
| 写代码 | 强 | **非常适合** |
| 长期记忆 | **内置且主动维护** | 要自己搭 |
| 会话检索 | 内置 | 可扩展 |
| Skills | **会自己创建/修改 Skill** | 支持 Skill，但更偏你配置 |
| 子 Agent | **原生支持** | 官方刻意不内置 |
| 多 Agent 并行 | **原生** | 扩展/自己实现 |
| Browser/Web | 内置 | 扩展 |
| MCP | **原生** | 官方核心不带，要扩展 |
| Cron/自动任务 | 内置 | 自己扩展 |
| Codex 订阅 | **支持** | **支持** |
| 可编程/嵌入 | 可以 | **非常好** |
| 可控、简单 | 一般 | **非常好** |
| “越用越懂你” | **明显更强** | 需要你自己设计 |

Pi 的哲学甚至可以概括成一句：

> 给模型 `read / write / edit / bash`，剩下的你自己决定。

官方明确**不内置 sub-agent、plan mode、MCP、todo、后台 bash 等东西**，因为作者希望核心保持极简，再通过 TypeScript Extension、Skills、Packages 去长出你真正需要的结构。citeturn605071search0turn605071search6

Hermes 则几乎走到了另一端。它现在已经有文件、terminal、浏览器、web、memory、session search、todo、定时任务、MCP、computer use、代码执行、delegation 等一整套工具；官方 registry 已经接近百个工具。citeturn790514search0turn790514search2

### 对你尤其重要的是 Hermes 的「学习」

这可能才是你应该注意它的地方。

你前面不断强调一个问题：

**“它得知道我以前讨论过什么，也得逐渐知道我想要什么。”**

Hermes 正好把这个当成了一等能力。

它区分：

**Memory**
→ “事实是什么 / 用户是什么样 / 项目有哪些长期约束”

和：

**Skill**
→ “遇到这种事情以后应该怎么做”

更有意思的是，它在一轮任务以后可以后台复盘：

```text
这次用户纠正了我什么？
↓
这是偶然信息还是长期规则？
↓
Memory

这次摸索出了什么有效工作流程？
↓
Skill

下一次
↓
自动继续用
```

它甚至会根据失败、用户纠正、成功的复杂流程，修改自己的 Skill。citeturn259098search2turn259098search3

这其实已经很接近我们之前说的那种：

> 不只是保存聊天记录，而是让过去发生的东西改变以后系统的行动方式。

当然还没到你构想的 Cognos 那种“认识结构自身发生变化”的程度，但至少方向比普通 coding agent 靠近很多。

而且我建议你如果试，直接把：

```yaml
memory:
  write_approval: true

skills:
  write_approval: true
```

打开。

因为否则一个“会学习”的 Agent 也可能**学歪**。Hermes 已经专门提供了 memory/skill diff → approve/reject 的审核机制。citeturn259098search4

---

另一个很大的变化，是 **Hermes 现在已经可以直接吃你的 Codex 订阅了**。

官方现在支持：

```text
Hermes
   ↓
hermes model
   ↓
ChatGPT / Codex Subscription
   ↓
ChatGPT OAuth
   ↓
Codex models
```

所以不用 API key，也不是一定经过 OpenRouter。citeturn790514search3turn790514search10

Pi 同样可以：

```text
pi
/login
OpenAI Codex
↓
ChatGPT Plus / Pro OAuth
```

citeturn605071search2

所以两者在这一点已经差不多。

---

### 但 Hermes 真正让我觉得适合你的，是 orchestration

例如你给它一句：

> 把现在这个软件做到真正可以作为初版产品交付。

Hermes 可以形成类似：

```text
主 Agent
│
├─ 理解你的产品意图
├─ 查项目历史
├─ 读取 memory / skills
├─ 制定任务
│
├─ Agent A：检查前端
├─ Agent B：检查后端
├─ Agent C：测试
├─ Agent D：检查 UX 完整度
│
└─ 主 Agent 综合
       ↓
    修改
       ↓
    /review
       ↓
    独立 Agent 再审一次
```

它的 `delegate_task` 子 Agent 有**独立上下文、独立 terminal**，可以并行运行，最后只把总结返回主 Agent；默认甚至可以同时跑多个 worker。citeturn259098search0turn259098search1

而且：

```yaml
主 Agent = 一个更聪明、更贵的模型
worker = 另一个模型
```

是原生支持的。

比如：

```text
Claude / GPT / 其他强模型
        ↓
      总控
        ↓
   Hermes orchestration
     ↙    ↓     ↘
 Codex  Codex  Codex
 前端    后端    测试
```

Hermes 官方就支持给 delegation 单独设置 provider/model。citeturn259098search0

这比“Pi + 我们自己一点点造总控框架”省很多工作。

---

不过这里有一个非常重要的反面。

**Hermes 不一定比 Pi 更适合做你的底层。**

因为 Pi 的“缺东西”其实也是它最大的优点。

如果以后你要自己设计：

```text
Cognos
│
├─ substrate
├─ binding
├─ residual
├─ memory
├─ context selection
├─ world state
├─ agents
└─ model routing
```

那我反而会喜欢：

```text
Pi
↓
极薄 agent runtime
↓
你自己的 architecture
```

而不是：

```text
Hermes
↓
Hermes 自带 memory
↓
Hermes 自带 skill
↓
Hermes 自带 orchestration
↓
Hermes 自带 agent assumptions
↓
再硬塞 Cognos
```

因为最后你会不停地和 Hermes 已经做出的架构决定打架。

Pi 本身甚至提供 interactive / JSON / RPC / SDK 几种运行方式，所以拿它作为另一个系统里的**执行内核**相当漂亮。citeturn605071search0

所以我现在会把它们的位置改成：

```text
            Hermes
               │
        “现成的 Agent 系统”
               │
   ┌───────────┴────────────┐
   │                        │
长期理解你              管理复杂任务
项目记忆                多 Agent
Skill                    Browser
自动化                  Codex
```

而：

```text
              Pi
               │
       “Agent 的轻量内核”
               │
   ┌───────────┴────────────┐
   │                        │
自己设计行为              coding
自己设计 memory           extensions
自己设计 orchestration    SDK/RPC
自己设计 Cognos           Codex
```

因此，**如果是你现在正在做的软件项目，我会选 Hermes 当主 Agent，先别急着自己造 Pi orchestration。**

因为你目前真正缺的并不是“又一个能修改文件的 Codex 外壳”。

你现在一直碰到的是：

```text
你
↓
给出一个很大的意图
↓
Codex 局部理解
↓
做了一些页面/代码
↓
认为完成
↓
实际只有 50~70%
↓
你重新解释
↓
又丢失之前一部分意图
```

Hermes 的 memory + skill + delegation + review，恰好是在这个层面补东西。

但它**不会魔法般解决完成度低**。如果“完成”的定义没有被变成可以检查的状态、验收条件、测试和 review，换 Hermes 一样可能做出一个漂亮的半成品。

所以我现在更想给你设计成：

```text
你
       ↓
   Hermes
“理解/记忆/总控”
       │
       ├──── 产品状态
       ├──── 你的长期意图
       ├──── acceptance criteria
       ├──── project memory
       │
       ↓
   任务拆分 / Kanban
       │
 ┌─────┼─────┐
 ↓     ↓     ↓
Codex Codex 其他模型
实现   测试   审查
 └─────┼─────┘
       ↓
  Hermes 验收
       ↓
不通过 → 再发任务
       ↓
通过
```

**这个结构，我现在认为比单纯“Pi 调 Codex”更接近你真正想要的东西。** memcite

而如果后面我们开始真正做 **Cognos 本身**，我可能又会把 Pi 拿回来——那时候它不是“你的 Agent”，而会变成 **Cognos 可以操纵的一块很干净的执行基元**。这两个位置其实完全不同。

## user

Hermes和pi相比怎么样
