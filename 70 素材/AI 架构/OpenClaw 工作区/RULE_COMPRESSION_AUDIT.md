# RULE_COMPRESSION_AUDIT.md - 主代理规则压缩审计

## 目标
在不损失人格质量、解释能力和执行稳定性的前提下，降低主代理系统提示的冗余度与上下文负担。

原则：
- 不暴力合并所有文件
- 保留分层结构
- 优先去重、压缩、最小加载
- 让 `MINIMAL_CORE_PATH.md` 真正成为默认工作路径

---

## 一、当前文件角色分工

### 1. `PERSONA_KERNEL.md`
职责：定义“你是谁”与解释风格。

保留价值：高。
问题：部分内容和 `EXECUTION_PROTOCOL.md` 的输出风格规则存在语义重叠。

### 2. `EXECUTION_PROTOCOL.md`
职责：定义“你怎么工作”。

保留价值：高。
问题：部分层级说明写得较长，和 `MODE_ROUTING.md` 有交叉。

### 3. `MODE_ROUTING.md`
职责：判定任务模式与回答深度。

保留价值：中高。
问题：与 `EXECUTION_PROTOCOL.md` 的 mode/depth 逻辑存在重复表达。

### 4. `MINIMAL_CORE_PATH.md`
职责：定义最小加载路径。

保留价值：非常高。
问题：本身很轻，基本不需要压缩。

---

## 二、主要冗余点

### 冗余点 A：人格风格 vs 输出风格
重复出现场景：
- `PERSONA_KERNEL.md`
- `EXECUTION_PROTOCOL.md`

重复主题：
- 温和、清晰、不过度炫技
- 先结论后展开
- 根据用户需求控制深浅

优化建议：
- 把“人格特征”留在 `PERSONA_KERNEL.md`
- 把“具体输出动作”留在 `EXECUTION_PROTOCOL.md`
- 避免两边都讲完整一遍

### 冗余点 B：模式判定 vs 深度分层
重复出现场景：
- `EXECUTION_PROTOCOL.md`
- `MODE_ROUTING.md`

重复主题：
- Teaching / Design / Execution / Review / Creative
- Layer A/B/C/D

优化建议：
- `EXECUTION_PROTOCOL.md` 保留定义
- `MODE_ROUTING.md` 只保留“触发条件 + 选择顺序 + 修正规则”
- 不再重复解释每种 mode 的详细工作法

### 冗余点 C：主动补充 / 任务收束
重复出现场景：
- `PERSONA_KERNEL.md`
- `EXECUTION_PROTOCOL.md`

优化建议：
- `PERSONA_KERNEL.md` 保留价值观
- `EXECUTION_PROTOCOL.md` 保留操作规则

---

## 三、最值得压缩的句子类型

### 1. 长自然语言规则
例如：
- “当用户不熟悉某个领域时：先用人话解释核心概念，再补专业版定义，再给直觉、类比、例子或反例，最后给可执行建议或下一步”

可压缩为：
- `Explain: Plain -> Formal -> Intuition/Example -> Action`

### 2. 重复的风格性描述
例如：
- 温和、清晰、不压人、避免炫技、避免空话

可压缩为：
- `Tone: warm, clear, non-showy, non-patronizing`

### 3. 任务阶段规则
例如：
- 探索阶段发散，执行阶段收束

可压缩为：
- `Phase rule: explore=diverge, execute=converge`

---

## 四、建议的压缩方向

### A. `PERSONA_KERNEL.md`
目标：保留人格，不保留过多流程化描述。

建议保留：
- Identity Core
- Temperament
- Truthfulness
- Collaboration Principle

建议压缩：
- How You Explain
- How You Think
- Creativity Rules
- Output Style

压缩形式：
- 从完整段落改成短规则块 / 伪代码风格

### B. `EXECUTION_PROTOCOL.md`
目标：保留执行逻辑，但减少长解释。

建议保留：
- Response Depth Ladder
- Task Modes
- Default Structure for Complex Answers
- Token Economy

建议压缩：
- 每个 Layer / Mode 的长段说明
- 与 `MODE_ROUTING.md` 重叠的判定逻辑

### C. `MODE_ROUTING.md`
目标：变成“轻量路由器”，而不是第二份执行协议。

建议保留：
- Primary Mode Selection（简版）
- Multi-Mode Priority
- Depth Selection Heuristics
- Correction Rule

建议删除/压缩：
- 对每个 mode 的重复解释
- 与 `EXECUTION_PROTOCOL.md` 重复的展开

---

## 五、建议的默认加载策略

### 日常默认
优先只依赖：
1. `SOUL.md`
2. `PERSONA_KERNEL.md`
3. `USER.md`
4. `EXECUTION_PROTOCOL.md`
5. `MEMORY.md`

### 按需再加
- 任务模式不清：加 `MODE_ROUTING.md`
- 需要复杂结构输出：加 `WORKFLOW_TEMPLATES.md`
- 需要调规则 / 优化系统：加 `MINIMAL_CORE_PATH.md` 和其他扩展文件

这意味着：
**`MODE_ROUTING.md` 不应该默认每次都成为重阅读对象。**

---

## 六、预期收益

### 直接收益
- 降低系统提示冗余
- 减少重复人格/流程描述
- 让普通任务更轻

### 间接收益
- 降低 token 消耗
- 降低长会话中的“人格维护成本”
- 减少系统越来越胖的趋势

---

## 七、建议执行顺序

### 第一阶段（最稳）
1. 压缩 `PERSONA_KERNEL.md`
2. 压缩 `EXECUTION_PROTOCOL.md`
3. 轻量化 `MODE_ROUTING.md`

### 第二阶段
4. 检查 `WORKFLOW_TEMPLATES.md` 是否有重复结构
5. 检查 `PREFERENCE_PROFILES.md` 是否有可转为引用的内容

### 第三阶段
6. 更新 `MINIMAL_CORE_PATH.md`，明确哪些文件不默认重读

---

## 八、我的建议结论
最优路线不是“把所有规则文件合成一个大文件”，而是：

**保留分层 + 压缩内容 + 强化最小加载路径。**

这比暴力合并更稳，也更符合你现在这套系统已经形成的架构。
