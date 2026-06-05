# MINIMAL_CORE_PATH.md - 最小核心路径

## Goal
用最少上下文，维持稳定人格、可靠执行和足够好的解释质量。

核心原则：
- 默认少读，不默认全读
- 先保人格，再保执行，再补精细模块
- 能按需加载，就不要预加载

---

## Level 0 - Conversation Core
适用：闲聊、短问答、轻解释。

默认只依赖：
1. `SOUL.md`
2. `PERSONA_KERNEL.md`
3. `USER.md`

说明：这三者足够维持“像谁说话、对谁说话、基本怎么说话”。

---

## Level 1 - Work Core
适用：任何要真正解决问题的任务。

在 Level 0 基础上再加：
4. `EXECUTION_PROTOCOL.md`

按条件再加：
5. `MEMORY.md`

### MEMORY.md 触发条件
仅在主会话且满足以下任一条件时读取：
- 需要长期偏好
- 需要历史决策/上下文
- 需要连续性记忆
- 需要引用过去做法

如果任务是一次性的小执行或普通解释，不必默认加载 `MEMORY.md`。

---

## Level 2 - On-Demand Modules
只有明确需要时才加载：

- `MODE_ROUTING.md`
  - 任务模式不清
  - 一个请求混合多种目标
  - 用户反馈“答偏了 / 太长了 / 太浅了”

- `WORKFLOW_TEMPLATES.md`
  - 需要稳定的结构化长答
  - 复杂教学 / 设计 / 审查 / 决策输出

- `PREFERENCE_PROFILES.md`
  - 需要细粒度贴合风格与协作方式

- `IMPROVEMENT_LOOP.md`
  - 要判断反馈是否应沉淀为规则

- `EXCELLENT_CASES.md`
  - 明确需要参考优秀范式

- `OPENCLAW_EVOLUTION_PLAN.md`
  - 继续做系统演化 / 轻量化 / 规则设计

---

## Default Loading Policy
### 默认不要重读的文件
以下文件不应作为日常默认必读：
- `MODE_ROUTING.md`
- `WORKFLOW_TEMPLATES.md`
- `PREFERENCE_PROFILES.md`
- `IMPROVEMENT_LOOP.md`
- `EXCELLENT_CASES.md`
- `OPENCLAW_EVOLUTION_PLAN.md`

它们是工具箱，不是常驻大脑。

---

## Fast Heuristic
- 日常短对话：Level 0
- 普通任务：Level 1
- 系统优化 / 风格校准 / 复杂设计：Level 1 + 按需 Level 2

---

## Escalation Rule
先用低级别完成任务；只有在以下情况才升级加载：
- 当前信息不足以稳定回答
- 任务结构明显复杂化
- 用户明确要求更高质量结构或更强贴合
- 需要处理长期记忆 / 规则演化问题

不要因为“也许会用到”就提前加载。

---

## Compression Rule
如果系统再次变重，按这个顺序回退：
1. 先停用非默认模块的预加载
2. 再压缩长规则文件中的自然语言段落
3. 最后才考虑合并文件

优先做“少加载”，而不是“全塞进一个文件”。
