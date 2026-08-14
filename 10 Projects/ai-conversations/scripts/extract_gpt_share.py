#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_gpt_share.py
====================
从 ChatGPT 公开分享页（或下载的 HTML）中解析 React Router Turbo-Stream
扁平引用数组，按 linear_conversation 真实顺序还原完整无损对话 Markdown。
"""

import urllib.request
import json
import re
import os
import sys

def extract_from_html(html_content: str, output_md_path: str):
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html_content, re.DOTALL)
    target_script = None
    for s in scripts:
        if 'window.__reactRouterContext' in s and 'linear_conversation' in s:
            target_script = s
            break
            
    if not target_script:
        # Fallback: search for any script with streamController.enqueue
        for s in scripts:
            if '.enqueue(' in s and 'linear_conversation' in s:
                target_script = s
                break

    if not target_script:
        print("Error: Could not locate turbo-stream script tag in HTML.")
        return False

    start_marker = '.enqueue("'
    start_idx = target_script.find(start_marker)
    if start_idx < 0:
        print("Error: .enqueue(\" not found")
        return False
        
    json_start = start_idx + len(start_marker)
    end_marker = '");'
    json_end = target_script.rfind(end_marker)
    raw_json_str = target_script[json_start:json_end]

    unescaped = json.loads('"' + raw_json_str + '"')
    arr = json.loads(unescaped)
    print(f"Parsed turbo-stream array: {len(arr)} elements")

    # Build key string index
    key_idx = {}
    for i, elem in enumerate(arr):
        if isinstance(elem, str) and len(elem) < 80:
            if elem not in key_idx:
                key_idx[elem] = i

    parts_ki = key_idx.get('parts')
    role_ki = key_idx.get('role')
    content_ki = key_idx.get('content')
    author_ki = key_idx.get('author')
    create_time_ki = key_idx.get('create_time')
    id_ki = key_idx.get('id')
    children_ki = key_idx.get('children')
    message_ki = key_idx.get('message')
    linear_ki = key_idx.get('linear_conversation')

    def resolve_ref(idx):
        if isinstance(idx, int) and 0 <= idx < len(arr):
            return arr[idx]
        return idx

    def get_dict_val(d, target_key_idx):
        for k, v in d.items():
            m = re.match(r'^_(\d+)$', k)
            if m and int(m.group(1)) == target_key_idx:
                return v
        return None

    # Find all mapping node objects
    node_objects = []
    for i, elem in enumerate(arr):
        if isinstance(elem, dict):
            has_message = False
            has_children = False
            for k in elem.keys():
                m = re.match(r'^_(\d+)$', k)
                if m:
                    ki = int(m.group(1))
                    if ki == message_ki:
                        has_message = True
                    if ki == children_ki:
                        has_children = True
            if has_message and has_children:
                node_objects.append((i, elem))

    messages_by_node_idx = {}
    for node_arr_idx, node in node_objects:
        msg_ref = get_dict_val(node, message_ki)
        if msg_ref is None:
            continue
        msg_obj = resolve_ref(msg_ref)
        if not isinstance(msg_obj, dict):
            continue

        author_ref = get_dict_val(msg_obj, author_ki)
        author_obj = resolve_ref(author_ref) if author_ref is not None else {}
        role_ref = get_dict_val(author_obj, role_ki) if isinstance(author_obj, dict) else None
        role = resolve_ref(role_ref) if role_ref is not None else 'unknown'

        content_ref = get_dict_val(msg_obj, content_ki)
        content_obj = resolve_ref(content_ref) if content_ref is not None else {}
        parts_ref = get_dict_val(content_obj, parts_ki) if isinstance(content_obj, dict) else None
        parts_list = resolve_ref(parts_ref) if parts_ref is not None else []

        text_parts = []
        if isinstance(parts_list, list):
            for p in parts_list:
                resolved = resolve_ref(p)
                if isinstance(resolved, str):
                    text_parts.append(resolved)

        text = ''.join(text_parts).strip()
        if not text:
            continue

        ct_ref = get_dict_val(msg_obj, create_time_ki)
        ct = resolve_ref(ct_ref) if ct_ref is not None else 0

        messages_by_node_idx[node_arr_idx] = {
            'role': role if isinstance(role, str) else 'unknown',
            'text': text,
            'create_time': ct,
            'node_idx': node_arr_idx,
        }

    # Find linear_conversation order
    linear_list = None
    for i, elem in enumerate(arr):
        if isinstance(elem, dict):
            lc_ref = get_dict_val(elem, linear_ki)
            if lc_ref is not None:
                lc = resolve_ref(lc_ref)
                if isinstance(lc, list) and len(lc) > 10:
                    linear_list = lc
                    break

    ordered_messages = []
    if linear_list:
        for ref in linear_list:
            node_idx = ref if isinstance(ref, int) else None
            if node_idx is not None and node_idx in messages_by_node_idx:
                msg = messages_by_node_idx[node_idx]
                if msg['role'] in ('user', 'assistant'):
                    ordered_messages.append(msg)
    else:
        ordered_messages = sorted(
            [m for m in messages_by_node_idx.values() if m['role'] in ('user', 'assistant')],
            key=lambda m: m['create_time']
        )

    os.makedirs(os.path.dirname(output_md_path), exist_ok=True)
    with open(output_md_path, 'w', encoding='utf-8') as f:
        f.write(f"# ChatGPT 分享页完整对话（{len(ordered_messages)} 条消息）\n\n")
        f.write("> 从公开分享页的 React Router turbo-stream 数据中提取。\n")
        f.write("> 按 linear_conversation 顺序排列。包含所有 user 和 assistant 最终可见消息。\n\n")
        for i, m in enumerate(ordered_messages):
            f.write(f"## [{m['role'].upper()}] (msg {i+1})\n\n")
            f.write(f"{m['text']}\n\n---\n\n")

    print(f"Successfully extracted {len(ordered_messages)} messages to {output_md_path}")
    return True

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python extract_gpt_share.py <input_html_path_or_url> <output_md_path>")
    else:
        src = sys.argv[1]
        out = sys.argv[2]
        if src.startswith('http'):
            req = urllib.request.Request(src, headers={'User-Agent': 'Mozilla/5.0'})
            html = urllib.request.urlopen(req).read().decode('utf-8', 'ignore')
        else:
            with open(src, 'r', encoding='utf-8') as f:
                html = f.read()
        extract_from_html(html, out)
