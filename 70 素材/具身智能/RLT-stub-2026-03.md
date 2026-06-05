# Precise Manipulation with Efficient Online RL (RLT)

> **来源**：Physical Intelligence
> **发布日期**：March 19, 2026
> **项目页**：https://www.pi.website/research/rlt
> **官方论文**：RLT.pdf
> **作者**：Charles Xu, Jost Tobias Springenberg, Michael Equi, Ali Amin, Adnan Esmail, Sergey Levine, Liyiming Ke

---

## ⚠️ 原文存档说明

WebFetch 受限于 pi.website 域名。本文件为元数据 stub。

---

## 摘要（基于 WebSearch 综合）

RLT（RL Tokens）= 精细动作的快速 RL 适配。

在 VLA 输出加一个特殊 "RL token"，作为 VLA 与轻量 RL policy 之间的紧凑接口。**不动整个 VLA 权重**，只训这一个 token 的 policy。训练数据需求：几分钟到几小时（vs Recap 的几十小时）。

跟 Recap 互补：
- Recap（π*0.6）= **宽**：长时任务的整体改进
- RLT = **窄**：精细动作的快速适配

在 4 个精细操作任务上，最精细阶段加速 3x。
