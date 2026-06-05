# 🧠 会话记忆恢复系统

## 问题
**每次新会话 = 失忆**：
1. 之前的任务被中断
2. 项目进展需要重新梳理
3. 用户反馈和决策丢失
4. 效率低下，重复解释

## 解决方案
> 更新说明：本文件记录的是较早一版“会话恢复”方案。新的主方案已迁移到 `CONTINUITY_ARCHITECTURE.md` 和 `state/` 目录，重点从“记忆恢复”升级为“任务状态 + 项目入口 + 持续执行载体”的联合架构。

### 三层记忆结构
```
┌─────────────────────────────────────┐
│  LEVEL 1: 持久项目状态 (PROJECT_LOG.md) │
│  • 项目进展、已完成任务、待办事项        │
│  • 架构决策、经验教训、下一步计划        │
│  • 更新频率：关键节点时                │
├─────────────────────────────────────┤
│  LEVEL 2: 每日详细日志 (memory/YYYY-MM-DD.md) │
│  • 当日所有任务细节                     │
│  • 工具调用结果、错误信息               │
│  • 用户沟通要点                         │
│  • 更新频率：会话结束时                 │
├─────────────────────────────────────┤
│  LEVEL 3: 用户记忆 (MEMORY.md)          │
│  • 用户个人信息、偏好                   │
│  • 长期决策、重要约定                   │
│  • 更新频率：偶尔                       │
└─────────────────────────────────────┘
```

## 🚀 自动化工作流

### 1. 新会话启动流程 (automatic)
```bash
# 每次会话开始时自动执行
1. 检查并创建必要的目录结构
2. 读取 PROJECT_LOG.md 获取项目状态
3. 读取当日和前一天的 memory/*.md 文件
4. 生成会话简报，快速了解进展
5. 提示用户是否继续上次未完成的任务
```

### 2. 会话进行中流程 (semi-automatic)
```bash
# 执行关键任务时记录
1. 每个重要工具调用后：更新 task-tracking.json
2. 用户给出重要反馈：立即记录到 memory/YYYY-MM-DD.md
3. 作出决策：更新 PROJECT_LOG.md 的"决策记录"
```

### 3. 会话结束流程 (required)
```bash
# 用户关闭会话或 inactivity 时触发
1. 自动保存当前任务状态到 pending-tasks.md
2. 更新 PROJECT_LOG.md 的"最新状态"
3. 完整记录本会话沟通要点到 memory/YYYY-MM-DD.md
4. 如有重大进展，更新 MEMORY.md
```

## 📁 文件结构
```
./
├── PROJECT_LOG.md                  # 项目状态（最顶层）
├── SESSION_RECOVERY_SYSTEM.md      # 本文件（运维手册）
├── CONVERSATION_ARCHIVE.md         # 按项目归档的重要对话
├── TASK_WORKFLOWS/
│   ├── optimize-wsl.lobster        # 具体工作流
│   ├── knowledge-graph-tasks.lobster
│   └── README.md                   # 工作流说明
├── memory/
│   ├── PROJECT-知识图谱App.md      # 项目专用记忆（所有进展）
│   ├── USER-FEEDBACK.md            # 用户反馈分类整理
│   ├── 2026-03-02.md               # 当日详细日志
│   └── archive/                    # 历史日志
├── logs/
│   ├── tool-calls-2026-03-02.json  # 工具调用日志
│   ├── errors-2026-03-02.md        # 错误记录
│   └── performance-metrics.json    # 性能指标
└── scripts/
    ├── session-start.sh            # 会话启动脚本
    ├── session-end.sh              # 会话结束脚本
    └── auto-recovery.py            # 自动恢复逻辑
```

## 🔧 实现步骤

### 阶段1：基础架构（现在）
```bash
# 1. 创建必要的目录结构
mkdir -p TASK_WORKFLOWS logs scripts memory/archive

# 2. 创建项目专用记忆文件
cp memory/2026-03-02.md memory/PROJECT-知识图谱App.md

# 3. 创建用户反馈收集文件
echo "# 用户反馈分类整理" > memory/USER-FEEDBOOK.md
```

### 阶段2：自动化脚本
```python
# scripts/auto-recovery.py
"""
新会话启动时自动恢复项目状态
"""
import sys
import os
from datetime import datetime

def load_project_status():
    """读取项目状态并生成简报"""
    if os.path.exists('PROJECT_LOG.md'):
        with open('PROJECT_LOG.md', 'r', encoding='utf-8') as f:
            content = f.read()
            # 提取关键信息
            # ...
            return f"✅ 项目状态已恢复：知识图谱App重构中"
    return "❌ 项目状态文件不存在"

def main():
    today = datetime.now().strftime('%Y-%m-%d')
    print(f"=== 会话记忆恢复系统启动 [{today}] ===")
    print(load_project_status())
    
    # 检查是否有Pending任务
    if os.path.exists('pending-tasks.md'):
        print("⚠️ 检测到未完成的任务，建议优先处理")
    
    # 显示今日进展
    memory_file = f"memory/{today}.md"
    if os.path.exists(memory_file):
        print(f"📅 今日已有进展记录：{memory_file}")

if __name__ == '__main__':
    main()
```

### 阶段3：OpenClaw集成
1. **修改AGENTS.md**，加入会话恢复协议
2. **创建HEARTBEAT.md**任务，定期备份状态
3. **设计Lobster工作流**，标准化任务执行

## 📋 会话启动检查表（必须执行）
每次新会话开始时，执行以下命令：

```bash
# 检查项目状态
lobster run check-project-status  # 未来实现

# 或手动执行
python scripts/auto-recovery.py

# 然后读取关键文件
cat PROJECT_LOG.md | head -20      # 查看项目状态
tail -n 50 memory/$(date +%Y-%m-%d).md 2>/dev/null || echo "无当日记录"
```

## 💡 用户需要做的改变
### 习惯养成
1. **项目开始前**：确认 `PROJECT_LOG.md` 存在且更新
2. **给出重要指令时**：明确说"记录到项目日志"
3. **会话结束时**：提醒我更新状态文件

### 指令模板
```
"记录这个决策到项目日志：API密钥必须用环境变量"

"更新项目状态：WSL迁移已完成50%"

"保存这个反馈到用户反馈文件：我注意到跨会话任务会中断"
```

## 🛠️ 立即行动
### 1. 创建基础结构
```bash
mkdir -p TASK_WORKFLOWS logs scripts memory/archive

# 整合现有记忆到项目文件
cat memory/2026-03-01.md memory/2026-03-02.md > memory/PROJECT-知识图谱App.md 2>/dev/null || true

# 创建用户反馈文件
echo "# 🗣️ 用户反馈记录" > memory/USER-FEEDBACK.md
echo "- 2026-03-02: '每次开个新会话就会删掉前面正在执行的任务' - 指出会话丢失问题" >> memory/USER-FEEDBACK.md
echo "- 2026-03-02: '把每个阶段总结写进文件，你还能读取，这样就不会忘记了' - 要求记忆恢复系统" >> memory/USER-FEEDBACK.md
```

### 2. 更新AGENTS.md（添加会话协议）
在AGENTS.md中添加：
```markdown
## 🧠 会话记忆恢复协议

### 新会话启动（必须执行）
1. 读取 PROJECT_LOG.md 了解项目状态
2. 读取 memory/PROJECT-*.md 了解项目历史
3. 读取当日 memory/YYYY-MM-DD.md
4. 生成状态简报反馈给用户

### 重要事件记录
- 用户给出关键反馈 → 记录到 memory/USER-FEEDBACK.md
- 作出技术决策 → 更新 PROJECT_LOG.md 决策记录
- 完成任务 → 更新 PROJECT_LOG.md 最新状态

### 会话结束
- 自动更新 pending-tasks.md
- 更新 memory/YYYY-MM-DD.md 完整记录
- 如有重大进展，更新 MEMORY.md
```

### 3. 创建恢复脚本
```bash
# scripts/session-start.sh
echo "🧠 正在恢复项目记忆..."
python scripts/auto-recovery.py 2>/dev/null || echo "请先创建 auto-recovery.py"

# 显示提示
echo ""
echo "📋 建议下一步："
echo "1. 查看项目状态: cat PROJECT_LOG.md | head -30"
echo "2. 继续未完成任务: cat pending-tasks.md 2>/dev/null || echo '无未完成任务'"
echo "3. 执行工作流: lobster run TASK_WORKFLOWS/optimize-wsl.lobster"
```

## 📊 效益预期
### 解决问题前
- 新会话：需要5-10分钟重新解释项目
- 丢失任务：中断导致重复工作
- 用户沮丧：需要重复表达相同诉求

### 解决问题后  
- 新会话：10秒恢复状态
- 连续进展：任务不中断，持续推进
- 用户满意：记忆被尊重，反馈被记录

## 🎯 下一步
1. 执行"立即行动"中的创建命令
2. 测试新会话恢复流程
3. 优化 auto-recovery.py 脚本
4. 创建更多标准化工作流

---

*系统设计者：OpenClaw AI助理*
*设计日期：2026-03-02*
*核心目标：解决"每次开个新会话就失忆"的痛点*