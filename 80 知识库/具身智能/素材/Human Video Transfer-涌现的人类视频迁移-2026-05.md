---
source: "70 素材/具身智能/Human Video Transfer-stub-2025.md"
date: 2026-05-23
topic: 具身智能
---

# Human Video Transfer：VLA scale up 后，"看人类做"会涌现地变成训练资源

> Physical Intelligence + Georgia Tech 发布。研究发现 VLA 模型 scale 到 π0.5 这种规模后，会**涌现性地**学会从人类第一视角视频里学技能——**没有任何特殊机制**。小模型把人类手当"外星物体"，π0.5 把人类视频当训练资源，泛化任务表现提升 ~2x。这是 VLA 领域的 "GPT-3 moment" 之一：规模带来的能力跃迁。

> ⚠️ 基于 WebSearch 合成，非原文存档。

## 核心论点

- **VLA 的涌现性 = LLM 的涌现性**：跟 LLM 一样，VLA 模型**只有 scale 够大才会出现某些能力**。Human-to-robot transfer 就是其中之一。

- **关键发现**：小模型看人类视频学不到东西（人手对模型来说是"无关像素"）；π0.5 同样 fine-tune 同样视频，泛化任务表现**翻倍**。

- **没有特殊机制**：PI 团队没加翻译层、没用 Sunday Robotics 那种数据手套、没做 morphology mapping。**纯靠模型自己学到 align 人类动作和机器人动作**。

- **PI 的话**："We did not include any special mechanism to facilitate transfer."

- **具体数据**（清理家居）：
  - 清香料架：32% → 71%
  - 清桌面：25% → 50%
  - 桌子 bussing：53% → 63%

- **解释**：在 latent space 投影里，人类视频数据和机器人数据**几何上重叠**，模型把它们当数学上相似的动作。

- **战略意义**：解决了 robot data 稀缺问题的一个潜在方向——**网上有海量人类做家务的视频**，如果能用，VLA 的数据瓶颈大大缓解。

## 关键观点（WebSearch 综合，非原文逐字）

> "Much like large language models, larger VLAs may not only improve performance but also unlock entirely new capabilities. Using human video may be just one such capability, and it's exciting to imagine what others might emerge as we continue to scale up robotic foundation models."

> "We did not include any special mechanism to facilitate transfer."

> "The overlap between human video data and robot data in latent space projections indicates that the scaled-up model treats human and robot actions as mathematically similar."

## 跟主线的位置

Human Video Transfer 是 **VLA scaling laws 的 evidence**：
- 之前怀疑 VLA 能不能像 LLM 一样有涌现能力
- 这个研究给了证据——**至少在"从人类视频学"这一项上，π0.5 是涌现的**

跟 π0.7 的关系：π0.7 论文里也提到用 human videos 作为数据源——这个研究为那个用法提供了 scientific backing。

也回应了主题页里的一个问题：**数据稀缺**怎么办？答案之一是"等模型够大，人类视频就成了数据"。

## 关键技术细节

- **测试模型**：π0.5
- **训练数据**：第一视角人类视频
- **任务**：清香料架、清桌面、bus 桌
- **核心方法**：fine-tune（不需要特殊架构）

## 我的笔记

（待补充）

## See Also

- [[80 知识库/具身智能/_主题页]] — 主题鸟瞰
- [[80 知识库/具身智能/素材/π0.5-Open-World泛化-2026-05]] — 这个研究的载体模型
- [[80 知识库/具身智能/素材/π0.7-Steerable通用模型-2026-05]] — π0.7 论文里 human videos 是关键数据源之一
- [[小林的/50 Learning/计划5]] — 学习清单
