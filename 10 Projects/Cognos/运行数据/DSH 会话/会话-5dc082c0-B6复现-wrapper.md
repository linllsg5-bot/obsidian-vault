---
type: dsh-session-digest
project: Cognos
source_role: running-projection
epistemic_status: provisional
updated: 2026-08-17
---

# B6 受控复现（wrapper）

> DSH session 机械摘要（非发生场 occurrence）。raw log 不进入 Vault；真相源见 native_ref。

| 字段 | 值 |
| --- | --- |
| native_session_id | `session-5dc082c0-daf0-442b-82f9-94071740d3eb` |
| 创建时间 | 2026-08-16 20:14 |
| cwd | `/mnt/c/Users/lnp/Documents/Playground/cognos` |
| provider / model | opencode-go / deepseek-v4-pro |
| 相关性 | cognos-core |
| turn/end 序列 | ['completed'] |
| 工具 | bash |
| 事件数 | 1 turn / 1 tool call |

## 文本消息

### assistant

完成。

- **实际运行的命令**: `echo b6-probe-ok`
- **输出**: `b6-probe-ok`（exit code 0；stderr 仅有一条 Landlock 环境提示，无错误）
- **测试输出摘要**: 无（任务未要求测试）
- **修改的文件清单**: 无（未读取、修改或创建任何文件）

## 来源

- projection: `cognos.boundary.dsh.projection.v1`
- native_ref（raw log，不在 Vault）: `/tmp/cognos-dsh-home/sessions/--mnt-c-Users-lnp-Documents-Playground-cognos--/session-5dc082c0-daf0-442b-82f9-94071740d3eb/session.jsonl.zstd`
