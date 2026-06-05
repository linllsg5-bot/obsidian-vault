---
source: "70 素材/具身智能/Knowledge Insulation-stub-2025-05.md"
date: 2026-05-23
topic: 具身智能
---

# Knowledge Insulation：保护 VLM 骨架不被 action expert 污染——VLA 训练快 3x

> Physical Intelligence 2025-05 发布（arXiv:2505.23705，NeurIPS 2025 poster）。揭示"二代 VLA"（带 action expert 的 π0 类模型）的隐藏问题：新加的 motor 参数会**破坏 VLM 原有的语义知识**——一种 "forgetfulness"。提出 **Knowledge Insulation** = co-training + joint-training + 联合离散/连续动作预测。效果：训练快 3x，性能更好，语言理解保护得更好。

> ⚠️ 基于 WebSearch 合成，非原文存档。

## 核心论点

- **二代 VLA 的隐藏代价**：π0 这类模型在 VLM 上加了 action expert（continuous 输出头）。这些**新参数从零初始化**，跟 VLM 一起 fine-tune 时，会"污染"原 VLM 的内部表征——损害语言理解和泛化能力。

- **生动比喻**：把"motor cortex"硬接在 VLM 上，可能造成"forgetfulness"——训练慢、语言能力降级。

- **不能直接 freeze VLM**：那样会失去机器人需要的 robotics 适配；表征不够。

- **解决方案：Knowledge Insulation**，三个组件：
  1. **Co-training**：跟非机器人数据共训
  2. **Joint-training**：联合训练多目标
  3. **Joint discrete/continuous action prediction**：同时预测
     - 离散动作（用 FAST tokenization）—— language modeling 风格目标
     - 连续动作（用 flow matching action expert）—— diffusion 风格目标

- **关键洞察**：让模型在 backbone 上"两条腿走路"——一边走 FAST 语言路线保住 VLM 知识，一边走 flow matching 路线学连续控制。互相牵制保护核心 weights。

## 性能

- **训练快 3x**（wall-clock）
- 性能不降反升
- 语言理解能力**得到保护**
- 代价：训练计算 +20%（但更快收敛抵消）
- 局限：语言跟随仍不完美

## 关键观点（WebSearch 综合，非原文逐字）

> "Vision-language-action (VLA) models combine end-to-end learning with transfer of semantic knowledge from web-scale VLM training. However, the constraints of real-time control are often at odds with the design of VLMs."

> "Adding new motor control weights to the model during VLA finetuning resulted in complex learning dynamics that could damage the VLM's internal representations. Essentially, grafting this 'motor cortex' onto the VLM in such a crude way could cause a kind of 'forgetfulness'."

> "While these modules improve real-time and control capabilities, it remains an open question whether they preserve or degrade the semantic knowledge contained in the pretrained VLM. The paper shows that naively including such experts significantly harms both training speed and knowledge transfer."

## 跟主线的位置

Knowledge Insulation 是 **VLA 工程层面的关键洞察**：
- 之前的 π0/π0.5 用 action expert，但没人系统研究"会不会破坏 VLM 知识"
- 这篇揭示问题 + 给出方案
- 后续模型（π0.6/π*0.6/π0.7）应该都受益于这套方法
- 是 [[80 知识库/具身智能/素材/FAST-高效动作Tokenization-2026-05]] 的技术延伸——FAST 让 autoregressive 路径快，Knowledge Insulation 让 hybrid 路径稳

## 关键技术细节

- **作者**：Danny Driess 等 + Sergey Levine
- **arxiv**：[2505.23705](https://arxiv.org/abs/2505.23705)
- **会议**：NeurIPS 2025 poster
- **核心**：双目标训练（FAST discrete + flow matching continuous）

## 我的笔记

（待补充）

## See Also

- [[80 知识库/具身智能/_主题页]] — 主题鸟瞰
- [[80 知识库/具身智能/素材/FAST-高效动作Tokenization-2026-05]] — Knowledge Insulation 用了 FAST tokenization 作为 discrete 路径
- [[80 知识库/具身智能/素材/π0-通用机器人策略-2026-05]] — π0 是 action expert 范式的起点
- [[小林的/50 Learning/计划5]] — 学习清单
