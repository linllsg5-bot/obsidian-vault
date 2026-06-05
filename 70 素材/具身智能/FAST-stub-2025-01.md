# FAST: Efficient Action Tokenization for Vision-Language-Action Models

> **来源**：Physical Intelligence + UC Berkeley + Stanford
> **发布日期**：January 16, 2025
> **arXiv**：[2501.09747](https://arxiv.org/abs/2501.09747)
> **项目页**：https://www.pi.website/research/fast
> **开源**：[physical-intelligence/fast on HuggingFace](https://huggingface.co/physical-intelligence/fast)
> **作者**：Karl Pertsch, Kyle Stachowicz, Brian Ichter, Danny Driess, Suraj Nair, Quan Vuong, Oier Mees, Chelsea Finn, Sergey Levine

---

## ⚠️ 原文存档说明

由于 WebFetch 受限于 pi.website 和 arxiv.org 域名，**本文件不是原文存档**，仅为元数据 stub。

需要原文内容时，请直接访问上述 URL，或自己从浏览器复制粘贴正文重新 ingest。

---

## 摘要（基于 WebSearch 综合）

FAST = **Frequency-space Action Sequence Tokenization**。用 DCT（离散余弦变换）做时序压缩，替代传统的 per-dimension binning。autoregressive π0-FAST 跟 diffusion-based π0 性能持平，但训练快 5 倍。同时开源 FAST+ 通用 tokenizer（100 万条数据训练）。
