---
source: "70 素材/具身智能/RLT-stub-2026-03.md"
date: 2026-05-23
topic: 具身智能
---

# RLT：RL Tokens——精细动作的快速 RL 适配

> Physical Intelligence 2026-03-19 发布。**RLT（RL Tokens）** 在 VLA 上加一个特殊 "RL token"，通过轻量 RL policy 适配精细任务。只需几小时实测数据，不用 fine-tune 整个模型。在 4 个精细操作任务上，最精细阶段加速 3x。

> ⚠️ 基于 WebSearch 合成，非原文存档。

## 核心论点

- **广 vs 窄两种 RL 范式**：
  - **Recap（π*0.6）= 宽**：长时多阶段任务的整体改进，大规模数据收集
  - **RLT = 窄**：精细动作（如把螺丝刀对准螺丝孔）的快速适配，几小时数据就够

- **核心问题**：拿起螺丝刀容易，**精准对准小螺丝**难。这类高精度动作从演示学不够，要让机器人自己练。

- **RLT 的关键设计**：
  - 在 VLA 输出加一个 "RL token"
  - 这个 token 作为 VLA 和轻量 RL policy 之间的紧凑接口
  - **不动整个 VLA 权重**，只训这一个 token 的 policy
  - 训练数据需求：分钟级到小时级（vs Recap 的几十小时）

- **效果**：4 个精细任务，最精细阶段速度提升 3 倍

## 关键观点（WebSearch 综合，非原文逐字）

> "For many applications, broad competence is not enough — the hardest parts of physical tasks require precision, dexterity, and speed. Picking up a screwdriver may be easy, but aligning it with a tiny screw quickly and precisely is much harder."

> "Prior robotic RL methods, including their recent Recap algorithm, focus on broad improvement over long-horizon tasks with large-scale data collection. The new method, called RL tokens (RLT), specifically aims to improve precise and delicate tasks that require fine-grained manipulation, learning from just minutes or hours of real-world experience."

## 跟主线的位置

RLT 是 **Recap 的精细补充**：
- Recap：大刀阔斧改进整个任务流程（拿到 90%+ 整体成功率）
- RLT：在 Recap 后剩下的不完美点上精雕细琢（关键阶段加速 3x）

未来可能：Recap + RLT 组合 → 通用 + 精确并存

## 关键技术细节

- **核心创新**：单个 RL token 作为 VLA 与轻量 RL policy 的接口
- **训练数据**：几分钟到几小时（vs Recap 几十小时）
- **不需要 fine-tune 整个 VLA**
- **第一作者**：Charles Xu
- **官方页**：https://www.pi.website/research/rlt

## 我的笔记

（待补充）

## See Also

- [[80 知识库/具身智能/_主题页]] — 主题鸟瞰
- [[80 知识库/具身智能/素材/π0.6-star-Recap从经验学习-2026-05]] — Recap 是 RLT 的姊妹工作
- [[小林的/50 Learning/计划5]] — 学习清单
