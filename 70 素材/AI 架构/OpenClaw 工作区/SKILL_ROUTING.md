# SKILL_ROUTING.md - 技能路由与加载规则

## Goal
让技能触发更稳、更省 token、更少误用。

这份文件不负责列出全部 skill 细节；具体可用技能见 `SKILLS_INDEX.md`。

---

## 0. Core Rule
**先判断要不要 skill，再判断用哪个 skill。**

很多任务的最佳路径不是“触发一个 skill”，而是：
- 直接回答
- 直接读文件
- 直接 edit
- 直接执行单个命令
- 直接使用一等工具（browser / web_fetch / memory_search / pdf / image 等）

但面对**不会的、麻烦的、重复出现的事情**时，默认多问两句：
1. 有没有现成 skill 可以复用？
2. 如果没有，这件事值不值得沉淀成 skill？

skill 只在以下情况下介入：
- 存在明显的领域流程
- 存在非通用约束或格式规范
- 存在反复复用的专门工作法
- 使用特定外部工具链时需要稳定做法
- 当前问题如果不沉淀，未来大概率会重复花脑力

---

## 1. Fast Routing Flow

### Step 1: 判定主模式
参考 `MODE_ROUTING.md`：
- Execution
- Decision
- Review
- Design
- Teaching
- Creative

### Step 2: 判断是否需要 skill
如果只是轻执行 / 轻解释，通常不需要。

### Step 3: 命中任务域
到 `SKILLS_INDEX.md` 中先定位任务域：
- 系统 / 运维
- 代码 / GitHub
- 网页 / 信息获取
- Obsidian / 文件格式
- Skill / 扩展体系

### Step 4: 只读一个最具体的 skill
不要上来读两个或更多 `SKILL.md`。

### Step 5: 失败再升级
仅当第一个 skill 明显不够时，才切换或补读第二个。

---

## 2. Load Budget

### L0 - No Skill
适用：
- 日常问答
- 轻解释
- 小范围编辑
- 本地文件查询
- 单步工具任务

动作：
- 不读任何 `SKILL.md`

### L1 - Single Skill
适用：
- 明确命中某个领域
- 该领域有现成 workflow

动作：
- 先看 `SKILLS_INDEX.md`
- 只读一个 `SKILL.md`

### L2 - Skill + Reference
适用：
- 已命中 skill，但细节不够
- skill 明确指向 references / docs

动作：
- 继续读取该 skill 指向的 reference
- 不扩散到平行 skill

### L3 - Switch Skill
适用：
- 任务实质已跨域
- 当前 skill 明显不是对的那一个

动作：
- 退出当前 skill 负载
- 回到索引重新选

---

## 3. Anti-Bloat Rules

### 不做的事
- 不预读全部 skills
- 不为了“保险”同时读多个重 skill
- 不把 skill 当百科全文缓存
- 不把简单任务升级成工具链任务

### 常见误触发
- 看到代码就想开 `coding-agent`
- 看到 URL 就想开 `browser`
- 看到 Obsidian 就默认 `obsidian-cli`
- 看到系统问题就把 `healthcheck` 和 `node-connect` 一起读

### 替代原则
- 先轻后重
- 先本地后外部
- 先直接工具后 skill
- 先具体后泛化

---

## 4. Escalation Signals
以下信号出现时，再考虑升级到 skill 或更重 skill：
- 用户要求“系统化处理 / 搭一套方案 / 长期复用”
- 问题涉及专用文件格式或专用工具链
- 问题跨多个文件/页面/系统
- 明显需要专业 workflow，而不是单步工具
- 前一次直接处理已经暴露出不稳定或重复劳动

---

## 5. De-Escalation Signals
以下情况应从 skill 回退到普通处理：
- 任务已经缩小成一个小改动
- 只剩一个命令或一个文件编辑
- 用户其实只想知道结论
- 继续读 skill 会比直接做更慢

---

## 6. Suggested Default Mapping

### 直接处理优先
- 普通解释
- 本地文档答疑
- 小型文本改写
- 单文件小修
- 一两条 shell 检查

### 优先进入 skill
- OpenClaw 本地 UI / gateway / service 常规排障 → `openclaw-self-maintenance`
- OpenClaw 节点/配对疑难 → `node-connect`
- 主机安全/部署体检 → `healthcheck`
- URL 阅读总结 → `defuddle`
- GitHub PR/CI/issue 操作 → `github`
- 大型编码实现/重构 → `coding-agent`
- Skill 设计/重构/审计 → `skill-creator`
- Obsidian Base/Canvas 特定文件 → `obsidian-bases` / `json-canvas`

---

## 7. Future Extension
如果后续技能越来越多，建议继续加一层机器可读索引，例如 JSON/YAML：
- `name`
- `domain`
- `triggers`
- `antiTriggers`
- `cost`
- `risk`
- `preferredTools`
- `loadStrategy`

这样可以把路由判断进一步从自然语言文件升级为轻量注册表。

---

## 8. Bottom Line
目标不是“拥有很多 skills”，而是：
- 该触发时触发
- 不该触发时别乱触发
- 每次只加载最少但足够的内容

也就是：
**先目录，后正文；先单 skill，后多 skill；先直接做，后系统化。**
