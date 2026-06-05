# Emergence of Human to Robot Transfer in Vision-Language-Action Models

> **来源**：Physical Intelligence + Georgia Institute of Technology
> **发布**：2025-2026（具体日期未确认）
> **官方页**：pi.website/blog（"Human Video Transfer"博文）

---

## ⚠️ 原文存档说明

WebFetch 受限于 pi.website 域名。本文件为元数据 stub。

---

## 摘要（基于 WebSearch 综合）

VLA 模型 **scale 到一定规模后**，会**涌现性地**学会从人类第一视角视频里学技能。**不需要特殊机制**（没有专门的"翻译层"或手套设备）。

关键发现：小模型把人类手当作"无关物体"；π0.5 这种规模的模型，fine-tune 同样的人类视频，泛化任务表现提升 ~2x。

具体数据（清理家居任务）：
- 清香料架：32% → 71%
- 清桌面：25% → 50%
- 桌子 bussing：53% → 63%

PI 团队的话："We were surprised. We did not include any special mechanism to facilitate transfer."
