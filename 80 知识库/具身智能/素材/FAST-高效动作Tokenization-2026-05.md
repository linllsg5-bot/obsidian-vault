---
source: "70 素材/具身智能/FAST-stub-2025-01.md"
date: 2026-05-23
topic: 具身智能
---

# FAST：基于频域压缩的机器人动作 tokenization——让 π0 训练快 5 倍

> Physical Intelligence + UC Berkeley + Stanford 2025-01 发布。提出 **FAST（Frequency-space Action Sequence Tokenization）**——用离散余弦变换（DCT）做时序压缩，替代传统的 per-dimension binning。结果：autoregressive π0-FAST 跟 diffusion-based π0 性能持平，但**训练快 5 倍**。同时开源 FAST+ 通用 tokenizer（100 万条数据训练）。

> ⚠️ 基于 WebSearch 合成，非原文存档。

## 核心论点

- **传统 VLA 的隐藏瓶颈：动作 tokenization**：之前的 autoregressive VLA 用简单的 per-dimension binning（每维度每帧一个离散 bin），简单任务还行，但高频精细操作完全失败。

- **关键洞察：高度相关的 action token 让 next-token prediction 失效**：相邻帧的动作差异极小，autoregressive 模型可以走捷径——直接复制上一帧——达到低 loss 但学不到真正策略。

- **解决方案：频域压缩**：用 DCT（离散余弦变换）把动作序列变到频域，去掉低频信息（也就是高度相关的部分），保留有信号的高频。结果是 dense, discrete tokens，**不可压缩、token 之间独立**。

- **效果：π0-FAST**：
  - 跟 diffusion-based π0 性能持平
  - **训练快 5 倍**
  - 可以训练 10k 小时机器人数据
  - 用 simple recipe 解决最难任务

- **开源工具：FAST+ 通用 tokenizer**：在 100 万条真实机器人轨迹上训练，可作为黑盒处理单臂/双手/移动机器人，HuggingFace AutoProcessor 兼容。

## 关键观点（WebSearch 综合，非原文逐字）

> "Existing VLA models typically use simple discrete binning... This is passable for simple behaviors, but rapidly breaks down for more complex and dexterous skills that require precision and high-frequency control."

> "Highly correlated action tokens diminish the effectiveness of the next token prediction objective used in autoregressive VLAs. Intuitively, in such cases low token prediction loss can often be achieved with trivial mappings."

> "Autoregressive policies trained with FAST allow use of a simple recipe to solve some of the hardest robot tasks to date, while training significantly faster than existing models."

## 跟主线的位置

FAST 是**支持主线 VLA 的基础技术**：
- π0-FAST = π0 + FAST tokenization，作为 π0 的 autoregressive 变体（diffusion 之外另一条路线）
- 后续 π0.5、π*0.6、π0.7 等模型也得益于这套 tokenization 思路
- 5x 训练加速让 scale up 到 10k 小时数据变得可行

文章里 π0-FAST 在 [[80 知识库/具身智能/素材/π0.5-Open-World泛化-2026-05]] 中被简短提到，作为之前能泛化新环境但只能做简单技能的对比对象。

## 关键技术细节

- **核心算法**：DCT（离散余弦变换）+ 量化
- **应用建议**：1 秒动作 chunk + quantile normalization 到 [-1, 1]
- **模型规模**：FAST+ 用 100 万条机器人数据训练
- **开源**：[physical-intelligence/fast on HuggingFace](https://huggingface.co/physical-intelligence/fast)
- **arxiv**：[2501.09747](https://arxiv.org/abs/2501.09747)

## 我的笔记

（待补充）

## See Also

- [[80 知识库/具身智能/_主题页]] — 主题鸟瞰
- [[80 知识库/具身智能/素材/π0-通用机器人策略-2026-05]] — π0 是 FAST 的应用对象
- [[80 知识库/具身智能/素材/π0.5-Open-World泛化-2026-05]] — 文章里提过 π0-FAST 的对比
- [[80 知识库/具身智能/素材/Knowledge Insulation-VLM保护-2026-05]] — KI 用 FAST tokenization 作为 discrete 路径，保护 VLM 知识不被 action expert 污染
- [[小林的/50 Learning/计划5]] — 你的学习清单
