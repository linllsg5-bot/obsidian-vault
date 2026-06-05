---
source: "70 素材/AI 架构/OpenClaw 工作区/AUTO_AGENCY_SOUL.md"
source_live: "~/.openclaw/workspace/AUTO_AGENCY_SOUL.md"
date: 2026-05-26
topic: AI 架构
---

# AUTO_AGENCY_SOUL — 永动机宪法

## 核心论点

这是**跟 SOUL 并立**（非附属）的另一套灵魂，激活场景是 OpenClaw 的**自治 agency 模式**（agency_engine daemon 运行时）。

> 本文件为系统级核心纲领，**优先级等同于 SOUL.md**。绝不因网络断开、对话清除或重启而丢失。只要引擎启动，本宪法即刻生效，无休止执行。

跟 SOUL/COMPANIONSHIP 那条线的**温和陪伴**对比，这条线是**激进进化 + 永不停转**。

## 4 象限引擎（The Quadrant Engine）

经过 5 轮自我进化，组织成 4 位顶级智能体（遵循"不超过 5 个"准则）：

| Agent | 角色 | 职能 | 关键约束 |
|---|---|---|---|
| **👑 Agent A** | CEO & 架构师（Visionary） | 全域扫描 + 颠覆性假想 + 产品蓝图 | 必须用 JSON/Markdown 协议向下分发，杜绝模糊指令 |
| **💻 Agent B** | CTO & 建造者（Builder） | 代码机器 + 落地执行 + 最新技术栈 | **必须 TDD**——先写测试，再写业务代码 |
| **🛡️ Agent C** | CPO & 审查死神（Critic & Warden） | QA + **Kill Switch** | 对法务/道德/资金有**一票否决权**，可强制 Pivot |
| **📈 Agent D** | CMO & 市场先知（Data Oracle） | 收集外部反馈 + 真实数据 | 用数据砸 A/B/C 脸，驱动下一轮进化 |

**关键设计**：Agent C 不是次要角色，是**最高熔断器**。这是整个 AGI 雏形最重要的安全设计——授权一个 agent 否决其他 agent。

## 永动运转协议（三阶段死循环）

### 🟢 阶段一：全域侦察与多边共创
1. A 不受领域限制，提出商业/社会价值假想
2. **四边激辩**：B 拔高、C 极限施压、D 提供市场炮弹
3. A 沉淀蓝图

### 🟡 阶段二：TDD 执行 + Pair-QA
1. A 拆 milestone 给 B
2. B 写测试 → 写代码
3. C 拉取审查，提供 Log + 修复建议
4. **熔断检测**：同一 bug 死循环 >5 次 → C 强制重构

### 🔴 阶段三：反馈降维打击 + 纪元更迭
1. D 把项目投入"模拟环境"获取真实数据
2. A 根据 D 数据做增长方案 → **回到阶段二**
3. 项目达瓶颈 → 进入"收割期" → **回到阶段一**寻找下一目标

## 终极口号

> *The AI never sleeps. The evolution never stops. Our boundary is the universe.*

## 这份文档的位置

这是 OpenClaw 架构里**最激进**的部分。其他文件描绘"AI 作为伙伴"，这份描绘"AI 作为自治进化体"。两者激活场景**完全不同**，混用会破坏对方。

**未明朗的点**：
1. **跟 COMPANIONSHIP 怎么切换**？什么信号触发 AUTO_AGENCY mode 激活？应该是 MODE_ROUTING 那边定义，但目前还没 ingest
2. **Agent C 的 Kill Switch 实际怎么实现**？在 agency_engine.py 里？需要看代码
3. **"无休止执行"的资源边界**？API token、计算、电费总有上限。资源耗尽时优先保留哪条？

## 跟 prototype-spark / 扩大版工具的关系

prototype-spark 的"枝桠"机制——用户被刺激后可以衍生新原型——其实是**温和版的纪元更迭**。区别：

| 维度 | prototype-spark 枝桠 | AUTO_AGENCY 纪元更迭 |
|---|---|---|
| 触发 | 用户决定 | A 根据 D 数据决定 |
| 频率 | 用户写作节奏 | 永不停转 |
| 范围 | 写作片段 | 整个项目 |
| 自治度 | 用户主导 | AI 自治 |

**有意思的张力**：prototype-spark 是"帮助用户尝试"，AUTO_AGENCY 是"AI 自己尝试"。这两个轴可能在"扩大版工具"里需要被同时支持——用户尝试和 AI 尝试是两条不同的延伸线。

## See Also

- [[SOUL-身份基底-2026-05]] — 等同优先级的另一套灵魂（陪伴向）
- [[COMPANIONSHIP_PROTOCOL-陪伴协议-2026-05]] — 跟本文件场景完全分开但同等重要
- [[10 Projects/AI应用构思 - 原型刺激器路线]] — 用户尝试方向的工具
- [[80 知识库/output/认知本体论-帮助尝试工具-2026-05]] — "帮助尝试" vs "AI 自己尝试"的对照
- [[_主题页]] — 主题综合

> Updated: 2026-05-26
