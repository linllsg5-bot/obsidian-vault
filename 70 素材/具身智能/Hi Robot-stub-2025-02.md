# Hi Robot: Open-Ended Instruction Following with Hierarchical Vision-Language-Action Models

> **来源**：Physical Intelligence (pi.website/research/hirobot)
> **arXiv**：[2502.19417](https://arxiv.org/abs/2502.19417) (v2)
> **发布日期**：2025-02
> **官方博客**：https://www.pi.website/research/hirobot
> **作者**：Physical Intelligence 团队

---

## ⚠️ 原文存档说明

由于 WebFetch 受限于 pi.website 和 arxiv.org 域名，**本文件不是原文存档**，只是元数据 stub。

需要原文内容时，请直接访问：
- 官方博客页：https://www.pi.website/research/hirobot
- arxiv 论文：https://arxiv.org/abs/2502.19417
- HTML 版：https://arxiv.org/html/2502.19417v2

或自己从浏览器复制粘贴正文，给 Claudian 重新 ingest，覆盖此 stub。

---

## 摘要（基于 WebSearch 综合）

Hi Robot 提出一个**分层视觉-语言-动作模型**架构：高层 VLM 负责理解复杂指令、规划子步骤、处理实时反馈；低层 π0（VLA 模型）负责具体动作执行。类比 Kahneman 双系统理论的 System 2（慢思考）+ System 1（快反应），让机器人在执行前先用语言"想清楚"。

实验：清桌子、做三明治、超市采购，跨单臂/双臂/移动机器人。比 GPT-4o 高 40% 指令跟随准确度，超过 flat VLA。
