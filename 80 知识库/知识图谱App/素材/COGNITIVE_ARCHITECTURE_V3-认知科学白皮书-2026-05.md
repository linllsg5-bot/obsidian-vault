---
source: "70 素材/知识图谱App/OpenClaw工作区/COGNITIVE_ARCHITECTURE_V3.md"
date: 2026-05-26
topic: 知识图谱App
---

# COGNITIVE_ARCHITECTURE_V3 — 知识图谱 App 认知科学设计白皮书

## 核心定位

> 不是"记笔记的工具"，而是"人类心智网络（Mind-Network）的数字外脑"。每一行代码都必须有认知科学和教育学理论支撑。

## 4 大理论来源与产品映射

### 认知心理学
- **认知负荷理论**（Sweller 1988）→ 原子化卡片 + 目录树=工作记忆缓冲区
- **双重编码理论**（Paivio 1971）→ 文字 Markdown + ECharts 力导向图**实时联动**

### 教育学
- **ZPD**（Vygotsky）→ 拓扑排序学习路径；前置节点未点亮则阻止进入
- **布卢姆分类学** → 内嵌 Python 沙盒；让用户从"记忆/理解"升到"应用"

### 学习方法论
- **间隔重复+主动召回**（Ebbinghaus）→ edges=提问线索；复习模式隐藏节点让用户填空
- **费曼技巧** → "苏格拉底模式"：AI 扮小白，用户当老师，AI 找茬评估

### 认知科学
- **联结主义** → **edges（关系）比 nodes（内容）更重要**；创建连线必须填 Relation Context

## 3 阶段架构规划

1. **原子知识网**（阶段一，进行中）：Zettelkasten + 双链 + ECharts 导航器
2. **ZPD 学习导航仪**（阶段二）：知识点状态机 + 最短学习路径算法
3. **苏格拉底/费曼竞技场**（阶段三）：AI 扮小白 + 评判 + 颜色状态反馈

## 核心数据库设计原则（见 knowledge_graph_schema.sql）

- `edges.context` 字段强制用户写"为什么连"——联结主义的核心实现
- `edges.strength` 用于记忆衰减算法
- `nodes.blooms_level` 追踪布卢姆认知层级
- `review_queue` 实现间隔重复

## 跟 prototype-spark / 学习 instance 的关联

这份白皮书的理论层（认知科学 + 教育学）可以作为"扩大版尝试帮助工具"的**学习 instance** 的理论基础：
- prototype-spark：帮写作者尝试
- 知识图谱 app → 学习 instance：帮学习者从"认知超载/迷茫"走向"可尝试的下一步"

COGNITIVE_ARCHITECTURE_V3 里的 ZPD（"从模糊到可尝试"）和 prototype-spark 的"帮助尝试"哲学同构。

## See Also

- [[80 知识库/知识图谱App/_主题页]] — 主题综合
- [[10 Projects/AI应用构思 - 原型刺激器路线]] — 可能的学习 instance 蓝图
- [[80 知识库/output/认知本体论-帮助尝试工具-2026-05]] — "尝试"哲学

> Updated: 2026-05-26
