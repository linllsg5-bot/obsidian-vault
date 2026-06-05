---
source: "70 素材/具身智能/RTC-stub-2025-06.md"
date: 2026-05-23
topic: 具身智能
---

# RTC：实时动作 chunking——让大型 VLA 处理推理延迟

> Physical Intelligence + UC Berkeley 2025-06 发布（arXiv:2506.07339）。**RTC（Real-Time Action Chunking）** 解决大型 VLA 的推理延迟问题：边执行当前 chunk 边生成下一个，已确定执行的 frozen，未执行的 inpaint。**对任意 diffusion/flow VLA 即插即用，无需重训**。300ms+ 延迟下仍能精确完成"点火柴"等任务。

> ⚠️ 基于 WebSearch 合成，非原文存档。

## 核心论点

- **延迟杀手锏**：大型 VLA 推理慢（GPU heavy），机器人等模型想动作时世界已经变了。LLM 慢一点用户多等等没事，VLA 慢一点咖啡就洒了。

- **Chunk 边界是隐藏问题**：之前的 action chunking 让一段时间内动作连贯，但 chunk 之间过渡时模型还在算下一个 chunk —— 出现卡顿或 OOD jerky 动作。

- **RTC 的方案：异步执行 + inpaint**：在执行当前 chunk 的同时，开始生成下一个 chunk。当前已确定执行的部分"freeze"作为约束，未执行部分"inpaint"补全。这给模型一个时间窗口，又保证连贯。

- **关键特性：即插即用**：对任意 diffusion-based / flow-based VLA 都适用，**不需要重新训练**。这意味着 π0、π0.5、π*0.6 都能直接受益。

- **抗延迟极强**：在 300ms+ 推理延迟下（相当于预测时间窗口的 30%+），仍能完成精确动作如"点火柴"。

- **后续演进（2025-12）**：[Training-Time RTC](https://arxiv.org/abs/2512.05964) 把"延迟模拟"做进训练，省掉推理时 overhead，在 π0.6 的盒子和咖啡任务上进一步提升。

## 关键观点（WebSearch 综合，非原文逐字）

> "While a robot is 'thinking,' the world around it evolves according to physical laws, so delays between inputs and outputs have a tangible impact on performance."

> "For a language model, the difference between fast and slow generation is a satisfied or annoyed user; for a VLA, it could be the difference between a robot handing you a hot coffee or spilling it in your lap."

> "RTC enables the robot to perform highly dexterous and dynamic tasks, such as lighting a match—even in the presence of inference delays in excess of 300 milliseconds."

## 实验

- 12 个动态任务（Kinetix simulator）
- 6 个真实双手操作任务
- 关键演示：点火柴（高精度、抗延迟）

## 跟主线的位置

RTC 是**让大型 VLA 在真实机器人上跑得动的关键基础设施**：
- 没有 RTC：π0/π0.5/π*0.6 因为推理延迟，在动态任务上会卡顿
- 有了 RTC：相同 VLA 模型可以在 300ms+ 延迟下继续工作

后续工作（如 FASTER、A2C2）继续优化这个方向。

## 关键技术细节

- **算法**：inference-time inpainting（无需重训）
- **机制**：current chunk 执行时，下一个 chunk 异步生成，重叠区 frozen
- **适用**：所有 diffusion-based 或 flow-based VLA
- **arxiv**：[2506.07339](https://arxiv.org/abs/2506.07339)
- **第一作者**：Kevin Black

## 我的笔记

（待补充）

## See Also

- [[80 知识库/具身智能/_主题页]] — 主题鸟瞰
- [[80 知识库/具身智能/素材/π0-通用机器人策略-2026-05]] — RTC 适用于 π0 系列所有模型
- [[小林的/50 Learning/计划5]] — 学习清单
