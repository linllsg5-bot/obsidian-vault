# Knowledge Insulating Vision-Language-Action Models: Train Fast, Run Fast, Generalize Better

> **来源**：Physical Intelligence
> **发布日期**：May 30, 2025
> **arXiv**：[2505.23705](https://arxiv.org/abs/2505.23705)
> **NeurIPS 2025 poster**
> **项目页**：https://www.pi.website/research/knowledge_insulation
> **作者**：Danny Driess, Jost Tobias Springenberg, Brian Ichter, Lili Yu, Adrian Li-Bell, Karl Pertsch, Allen Z. Ren, Homer Walke, Quan Vuong, Lucy Xiaoyang Shi, Sergey Levine

---

## ⚠️ 原文存档说明

WebFetch 受限于 pi.website 和 arxiv.org 域名。本文件为元数据 stub。

---

## 摘要（基于 WebSearch 综合）

发现"二代 VLA"（π0 类有 action expert 的）有个隐藏问题：**加 action expert 时新参数会破坏 VLM 原有的 knowledge**——一种 "forgetfulness"，让训练变慢、语言理解能力降级。

提出 **Knowledge Insulation**：三个组件——co-training + joint-training + joint discrete/continuous action prediction（同时预测离散动作（FAST tokenization）和连续动作（flow matching））——保护 VLM 骨架。

效果：
- 训练快 3x
- 性能不降反升
- 语言理解能力得到保护

代价：训练计算 +20%，但 wall-clock time 因为更快收敛而下降。
