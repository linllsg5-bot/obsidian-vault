# Real-Time Execution of Action Chunking Flow Policies

> **来源**：Physical Intelligence + UC Berkeley
> **发布日期**：June 2025
> **arXiv**：[2506.07339](https://arxiv.org/abs/2506.07339)
> **项目页**：https://www.pi.website/research/real_time_chunking
> **作者**：Kevin Black, Manuel Y. Galliker, Sergey Levine
> **后续**：[Training-Time RTC, arXiv:2512.05964](https://arxiv.org/abs/2512.05964)

---

## ⚠️ 原文存档说明

WebFetch 受限于 pi.website 和 arxiv.org 域名。本文件为元数据 stub。

---

## 摘要（基于 WebSearch 综合）

RTC（Real-Time Action Chunking）解决大型 VLA 的推理延迟问题：在执行当前 chunk 时异步生成下一个 chunk，已确定执行部分 frozen，未执行部分 inpaint 补全。对任意 diffusion/flow VLA 即插即用，无需重训。在 300ms+ 延迟下仍能完成精确任务（如点火柴）。

实验：12 个动态任务（Kinetix simulator）+ 6 个真实双手操作任务。
