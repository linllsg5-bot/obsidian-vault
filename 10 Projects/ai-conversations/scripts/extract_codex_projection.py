#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_codex_projection.py
===========================
将本地 Codex 会话原始 JSONL（~/.codex/sessions/*.jsonl）
解析并生成 Obsidian Vault 可读投影（Markdown 格式）。

保留事件：
- user 消息
- assistant 可见消息
- developer / system 环境提示
- tool call（入参、工具名）
- tool result / error（执行结果、报错信息）

过滤事件：
- 底层 JSON-RPC 包装信封
- 内部重复状态快照
- Token 计费与 Telemetry 心跳

声明：
本脚本未对任何保留的正文内容进行二次总结或改写。
"""

import json
import os
import sys
import hashlib

def generate_projection(jsonl_path: str, output_md_path: str):
    if not os.path.exists(jsonl_path):
        print(f"Error: File not found {jsonl_path}")
        return False

    with open(jsonl_path, 'rb') as f:
        content = f.read()
        file_size = len(content)
        md5_hash = hashlib.md5(content).hexdigest()
        sha256_hash = hashlib.sha256(content).hexdigest()

    events = []
    with open(jsonl_path, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                events.append(data)
            except Exception:
                continue

    output_lines = [
        "> [!WARNING]",
        "> 这是从原始 Codex session 生成的可读投影，不是原始 source 本身。",
        "> 包含了 user / assistant 以及工具调用和返回的真实工程发生。",
        f"> **Source File**: `{jsonl_path}`",
        f"> **Size**: {file_size} bytes ({file_size / (1024*1024):.2f} MB)",
        f"> **MD5**: `{md5_hash}`",
        f"> **SHA256**: `{sha256_hash}`",
        "",
    ]

    for ev in events:
        ev_type = ev.get('type') or ev.get('role')
        
        # 1. User messages
        if ev_type in ('user', 'USER') or (isinstance(ev, dict) and ev.get('role') == 'user'):
            text = ev.get('content') or ev.get('text') or ''
            if isinstance(text, list):
                text = "\n".join([p.get('text', '') if isinstance(p, dict) else str(p) for p in text])
            if str(text).strip():
                output_lines.append(f"### [USER]\n\n{str(text).strip()}\n\n---\n")

        # 2. Assistant messages
        elif ev_type in ('assistant', 'ASSISTANT') or (isinstance(ev, dict) and ev.get('role') == 'assistant'):
            text = ev.get('content') or ev.get('text') or ''
            if isinstance(text, list):
                text = "\n".join([p.get('text', '') if isinstance(p, dict) else str(p) for p in text])
            if str(text).strip():
                output_lines.append(f"### [ASSISTANT]\n\n{str(text).strip()}\n\n---\n")

        # 3. Developer / System prompt
        elif ev_type in ('developer', 'system') or (isinstance(ev, dict) and ev.get('role') in ('developer', 'system')):
            text = ev.get('content') or ev.get('text') or ''
            if isinstance(text, list):
                text = "\n".join([p.get('text', '') if isinstance(p, dict) else str(p) for p in text])
            if str(text).strip():
                output_lines.append(f"### [DEVELOPER]\n\n{str(text).strip()}\n\n---\n")

        # 4. Tool Calls
        elif 'tool_calls' in ev or ev_type == 'tool_call':
            calls = ev.get('tool_calls', [])
            if isinstance(calls, list):
                for c in calls:
                    fn = c.get('function', {}) if isinstance(c, dict) else {}
                    name = fn.get('name', 'unknown_tool')
                    args = fn.get('arguments', '')
                    output_lines.append(f"### [TOOL CALL: {name}]\n```json\n{args}\n```\n\n---\n")

        # 5. Tool Results
        elif ev_type in ('tool', 'tool_result') or 'tool_call_id' in ev:
            content = ev.get('content') or ev.get('output') or ''
            output_lines.append(f"### [TOOL RESULT]\n\n{str(content).strip()}\n\n---\n")

    os.makedirs(os.path.dirname(output_md_path), exist_ok=True)
    with open(output_md_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(output_lines))

    print(f"Successfully generated projection: {output_md_path} ({len(output_lines)} blocks)")
    return True

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python extract_codex_projection.py <input_jsonl_path> <output_md_path>")
    else:
        generate_projection(sys.argv[1], sys.argv[2])
