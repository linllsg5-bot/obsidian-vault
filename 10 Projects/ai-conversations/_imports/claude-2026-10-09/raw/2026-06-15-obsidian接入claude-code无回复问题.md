---
title: "Obsidian接入Claude Code无回复问题"
created: 2026-06-15T15:29:24.990586Z
updated: 2026-06-15T15:33:09.610222Z
messages: 4
model: "claude-sonnet-4-6"
source: "Claude"
url: https://claude.ai/chat/1501585a-a76d-4e5e-bd7d-368eb54bdff4
---

# Obsidian接入Claude Code无回复问题

## You
*2026-06-15T15:29:25.511631Z*

我obsidian接入claude code 怎么一直没回复我，是因为anthropic前几天发布的政策吗？好像只允许在claude code 里用api？

---

## AI
*2026-06-15T15:30:11.257927Z*

[Tool Result]









今天(6月15日)确实是Anthropic一项新计费政策正式生效的日子,但具体内容跟"只允许在Claude Code里用API"不太一样,值得先理清楚,因为这关系到Claudian该往哪个方向排查。

按目前能查到的信息,Anthropic从今天起把Claude Code和Agent SDK的"程序化调用"(也就是`claude -p`这种headless模式、以及通过Agent SDK发起的请求)从订阅的共享额度里拆出来,单独算一个按API价格计费的额度池(Pro是20美元、Max 5x是100美元、Max 20x是200美元),用完即停,不会自动从你平时聊天的订阅额度里补,除非你手动开启"usage credits"溢出计费Starting June 15, 2026, Claude Agent SDK and claude -p usage no longer counts toward your Claude plan's usage limits。这个变化是5月14日就公告过的,今天正式生效。

这个跟之前(1月到4月)那一轮"封禁OpenClaw等第三方harness"的事是两件不同的事——那一轮针对的是用订阅OAuth去冒充Claude Code harness的第三方工具,5月份大部分已经通过Agent SDK授权恢复了。所以你听到的"只允许在Claude Code里用API"的说法,更可能是把这两轮政策混在一起了。

回到Claudian本身:它现在没反应,关键要看你这套Obsidian插件具体是怎么调用Claude的——

是直接shell调用`claude -p`(headless/non-interactive模式)吗?如果是,那今天这个变化就直接相关:你需要确认新的程序化额度credit有没有claim(官方说会发邮件/在账户里有提示),以及如果额度是0或者还没claim,请求大概率会被拒绝而不是报错弹窗,看起来就像"一直没反应"。

还是它走的是Agent SDK + 你自己的API key?那应该不受影响,因为本来就是按API计价。

或者根本不是网络/计费问题,而是Claude Code CLI本身报了某个错(比如认证过期、MCP server连接失败之类),只是错误信息没显示在Obsidian界面里?

你方便贴一下Claudian调用Claude的具体方式(是shell命令、还是走的Agent SDK/API key),以及"没回复"具体是什么表现——完全没输出、有loading但卡住、还是有错误日志?这样能更快定位是不是今天这个计费变化导致的。

### Artifact: web_search
```
{
  "query": "Anthropic Claude Code policy update third-party integration restriction June 2026"
}
```

---

## You
*2026-06-15T15:32:11.864781Z*

我也不知道，是社区第三方插件。是一直在思考十分钟了。

那意思就是说，如果不在claude code里使用基本上额度是不够用的是吗？

---

## AI
*2026-06-15T15:33:09.610222Z*

[Tool Result]








更准确的说法不是"在Claude Code里用 vs 不在里面用",而是"交互式 vs 程序化(headless)"——这个区分对你诊断Claudian的问题很关键。

按官方说明,从今天起Claude Agent SDK和claude -p命令的使用不再计入你的Claude套餐的使用限额,你的订阅使用限额保持不变,继续保留给Claude Code、Claude Cowork和Claude的交互式使用。也就是说:

你在终端里正常打开`claude`、像聊天一样跟它交互,这部分还是走原来的订阅额度,没变化。

但`claude -p "xxx"`这种非交互式命令(直接喂一个prompt、拿到文本输出就退出,适合脚本/插件调用)、以及Agent SDK的调用,从今天起改走一个新的、单独的月度credit——这个credit只覆盖Agent SDK使用,跟你的账单周期一起刷新,用完之后如果没开"usage credits"溢出计费,Agent SDK的请求就会直接停止,要等到下个周期credit刷新。

你那个社区Obsidian插件,几乎可以肯定底层就是用`claude -p`这种方式来拿输出的(因为它需要程序化获取结果,而不是开一个交互式会话给你)。所以今天这个变化对它是直接相关的。

至于"够不够用"——这个新credit是按套餐档位给的(Pro/Max不同档位金额不同),按API标准价格计费。对于偶尔调用一下的Obsidian笔记处理场景,大概率是够用的;但如果Claudian这套系统调用比较频繁(比如每次操作都触发好几轮带大量上下文的请求),确实有可能比较快就把这个独立的小额度用完,而且用完了不会自动借用你平时聊天的额度。

回到眼前"思考了十分钟"这个具体问题,我建议先做一个排除法:直接在终端里手动跑一遍 `claude -p "你好"`,看它是立刻报错(比如提示credit相关的问题)、正常返回、还是同样卡住。

如果终端里直接跑也卡住或报credit错误,那基本可以确认是今天这个计费变化的影响,大概率是新credit还没claim到账,或者账户里相关额度状态还没刷新(官方说claim邮件是"6月15日前后"发,实际到账时间可能有延迟)。

如果终端里跑是正常的,那"卡十分钟"更可能是插件本身的bug(比如某个MCP server连接卡住、或者插件等待某个回调没收到),跟今天这个政策关系不大,值得去插件的issue区看看是不是也有人报告同样情况——今天这种情况下,大概率会有不少人同时踩坑。

### Artifact: web_search
```
{
  "query": "docs.claude.com Agent SDK credit claude -p usage limits June 2026"
}
```

---
