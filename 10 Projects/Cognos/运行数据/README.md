---
type: runtime-data-entry
project: Cognos
source_role: running-projection
epistemic_status: provisional
updated: 2026-08-13
---

# Cognos 运行数据

> 这里保存 Cognos 当前运行体实际追加的发生记录。它是运行投影，不是认识论协议、项目当前解释或最终数据模型。

## 当前写入者

- 运行体：`C:\Users\lnp\Documents\Playground\cognos\web\`
- 当前文件：[[第一发生场.jsonl]]
- 写入链：浏览器 → 本地 FastAPI → Codex thread → 追加 JSONL
- 每条 AI 回复保留 `runtime / thread_id / turn_id`，用于回到实际运行来源。

## 文件地位

`第一发生场.jsonl` 当前承担的是**发生层**：保存小林和 Codex 在网页竖切里实际写出的最终内容及运行引用。

它不直接证明：

- 某条发言已经成为 Cognos 当前结论；
- JSONL 就是未来正式存储权威；
- `author / content / in_reply_to / runtime_ref` 已经是完整永久 schema；
- 同一 Codex thread 已经解决了历史重读和朝向连续性。

后续认识、索引和项目判断应另建当前视图或认识史，不能回写 JSONL 正文来修正过去。

## 操作边界

1. 运行记录只追加，不手工改写既有行；发生错误时追加校正或在认识层说明。
2. 代码需要新增字段时，先由真实断裂证明需要；不要先把所有可能字段列满。
3. 读取失败、模型失败或回复缺失时，已经发生的小林原文仍应保留。
4. 当前文件可以成为迁移探针来源，但不能拿运行便利反向定义 Cognos 本体。

## 历史运行体

`C:\Users\lnp\Documents\cognos\` 是 2026-07 的 Attempt/Reading JSONL 原型。它曾把“尝试—读”具体化为固定模型，并提供“未读尝试”检查；ex.1 后已经暴露会把概念描述误造为 Attempt，因此不再作为当前启动入口。代码和旧轨迹暂留作历史实验，不自动迁移进本目录。

## 当前开放问题

- JSONL、SQLite、Markdown 三者未来各自承担发生、索引和当前视图中的哪一层？
- 同一发生后来被拆分、合并或撤销对象身份时，运行引用怎样不断？
- 当前 thread 延续到底在哪些地方仍然读错过去？

这些问题由真实使用暴露后再进入 [[10 Projects/Cognos/当前架构|当前架构]] 与 [[10 Projects/Cognos/实施计划|实施计划]]。

## See Also

- [[10 Projects/Cognos/_入口|Cognos 入口]]
- [[10 Projects/Cognos/承载认识史|承载认识史]]
- [[10 Projects/_状态板]]
