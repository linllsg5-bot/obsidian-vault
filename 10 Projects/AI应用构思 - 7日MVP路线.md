# AI应用构思 — 7 日 MVP 路线

> 关联：[[AI应用构思]]
> 状态：**代码已生成，等你跑起来**
> 项目路径：`C:\Users\lnp\Documents\huansheng-tracker\`
> 开始日期：2026-05-23
> 完成日期：______

---

## ⚡ 跳到「跑起来」

代码已经写完。你现在只需要做：

```bash
cd C:\Users\lnp\Documents\huansheng-tracker
pip install -r requirements.txt
python init_db.py
streamlit run app.py
```

四条命令，浏览器自动打开。

下面的「7 日路线」保留作为：**理解每一块在做什么 + 第 7 天的自我评估指南**。

---

## 这一版要解决的具体问题

**不是**"做一个通用的 AI 群像引擎"。
**是**"做一个只给我自己用的、追踪《幻生蝶梦》人物关系的小工具"。

成功标准只有一条：**第 8 天我写场景之前，会主动打开它看一眼当前角色关系状态。** 做不到这一点，七天就算白做。

---

## 技术栈（不许再加）

- Python 3.11+
- SQLite（本地数据库）
- Streamlit（一行命令变网页）
- Anthropic Python SDK（调 Claude API）

**禁止扩展**：不要碰 React、不要碰 FastAPI、不要碰 Docker、不要做用户系统、不要做云部署。这些都是逃避真正困难的方式。

---

## 每日清单

### Day 1 — 环境就绪（2 小时）

- [x] 装 Python 3.11+（命令行能跑 `python --version`）
- [x] 装 VS Code，配好 Python 插件
- [x] 装 [DB Browser for SQLite](https://sqlitebrowser.org/)（看数据库用）
- [x] 在 vault **外**新建项目文件夹 `huansheng-tracker/`
- [ ] 在里面跑出 `hello.py` 打印 "六姐妹来了"

✅ **交付**：终端能跑 `python hello.py` 看到输出

🚩 **红线**：如果这一步超过 4 小时，停下来。环境问题不解决，后面全废。

---

### Day 2 — 数据表设计 + 手动建库（2 小时）

设计三张表：

```sql
-- characters：角色
id, name, group_name, traits, desire, fear, secret

-- relationships：关系（A → B 是有方向的）
id, from_id, to_id, kind, intensity, public, notes
-- kind: 爱/恨/嫉妒/依恋/崇拜/愧疚/...
-- intensity: -10 到 10
-- public: 是否公开

-- events：场景事件
id, scene_title, date_in_story, summary, source_file
```

- [ ] 在 DB Browser 里建好这三张表
- [ ] 手动录入 6 个角色（六姐妹大姐到小六）
- [ ] 手动录入 6 条关系（参考你写过的 [[六姐妹]] 大纲）

✅ **交付**：一个 `huansheng.db` 文件，能在 DB Browser 里看到数据

---

### Day 3 — Python 读数据库（3 小时）

学习目标：`sqlite3` 标准库的最基本用法。

- [ ] 写 `list_characters.py`：列出所有角色名字
- [ ] 写 `show_character.py`：传入名字，显示她的所有关系
  - 例：`python show_character.py 三妹` → 输出三妹对每个人的关系

✅ **交付**：上述两个脚本能跑出正确结果

🚩 **常见坑**：编码问题。文件保存为 UTF-8。中文路径用绝对路径。

---

### Day 4 — 录完核心角色（2 小时，不写代码）

不要碰编辑器。今天只录数据。

- [ ] 录入 [[幻生蝶梦·总篇]] 里的所有命名角色（周然、白夏凞、陈芊芊、清子、裴智英、失吹樱）
- [ ] 录入 [[语莹、敏慧 （墨青、白百合）]] 的角色
- [ ] 录入 [[初华 祥子]] 的角色
- [ ] 至少录入 15 条关系，覆盖最重要的张力点

✅ **交付**：角色 ≥ 12 个，关系 ≥ 15 条

💡 **隐藏价值**：这一步本身就是创作整理。你会发现自己有些关系从没明确想过。

---

### Day 5 — 第一个网页（4 小时）

- [ ] 跟着 Streamlit 官方 quickstart 跑通一个 hello world
- [ ] 写 `app.py`：
  - 主页：所有角色卡片
  - 点角色 → 显示她的关系列表
- [ ] 加一个简陋的关系网络图（用 `pyvis` 或 `streamlit-agraph`，5 行代码够了）

✅ **交付**：`streamlit run app.py` 能看到本地网页，浏览得动

🚩 **不要做**：登录、注册、好看的 CSS、移动端适配。

---

### Day 6 — 接入 Claude API（4 小时，最难的一天）

- [ ] 在 Anthropic Console 拿 API Key（**不要**用 vault 里那个 `claude code 密钥.md`，单独申请一个）
- [ ] 装 `anthropic` 库
- [ ] 写 `extract.py`：
  - 输入：一段场景文字
  - 调用 Claude，让它返回 JSON：`[{from, to, kind, intensity_delta, reason}]`
- [ ] 拿 [[二姐梦境片段]] 里的二姐梦境段落测一遍

✅ **交付**：用你真实写过的小说片段输入，能输出结构化的关系变化

🚩 **红线**：如果 JSON 老解析失败，加一个 retry + 让 Claude 自己修复格式的 prompt。不要花一整天调 prompt。

📌 **prompt 模板参考**：
```
你是一个文学分析助手。读下面的小说片段，
提取角色之间的关系变化。
只输出 JSON，不要任何解释。
格式：[{from: 角色名, to: 角色名, kind: 关系类型, 
        intensity_delta: -10到10的整数, reason: 简短原因}]

小说片段：
{scene_text}
```

---

### Day 7 — 闭环 + 自我评估（3 小时）

- [ ] 在 Streamlit 里加一个页面 "录入新场景"：
  - 文本框输入场景
  - 点按钮 → 调用 extract.py → 显示提取结果
  - 用户审核 → 确认 → 写入数据库
- [ ] 把昨天到今天写的任何一段创作录进去，跑一次完整闭环
- [ ] **关键**：写一份 [[AI应用构思 - 7日复盘]]，回答：
  - 我自己以后会用它吗？
  - 如果不会，是因为工具的问题还是因为我没在写？
  - 下一步是再改一周，还是承认这条路不通？

✅ **交付**：完整闭环 + 复盘文档

---

## 停止规则（提前定好，别到时心软）

| 信号 | 处置 |
|------|------|
| Day 3 结束还没让脚本跑起来 | 暂停，先补 Python 基础再回来 |
| Day 5 结束 Streamlit 还没跑通 | 跳过 Day 6，直接做命令行版本 |
| Day 7 闭环跑不完 | **不要**延期到 Day 8。承认这一版失败，写复盘，分析原因 |
| 七天都做完了，但自己根本不打开 | **不要**做 v2。先回去写小说，工具是为写作服务的，不是反过来 |

---

## 不要做的事

- 不要在 Day 1-3 里幻想"以后要做成 SaaS"
- 不要在第三天就开始改 UI 颜色
- 不要在 Day 6 之前接入 AI（先把死数据跑通）
- 不要把 [[claude code 密钥.md]] 里那个 key 提交到 GitHub
- 不要在 7 天内告诉任何人你在做这个（公开承诺会让你为面子继续做无效的事）

---

## 第 8 天

> 第 8 天的早上，打开你正在写的下一个场景之前，问自己一句：
> **"我现在会打开那个追踪器看一眼吗？"**
>
> 答案就是这次 MVP 的真实结果。
