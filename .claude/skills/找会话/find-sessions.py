#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
找会话辅助脚本 — 扫描 Claudian/CLI 会话，映射到 jsonl 和 vault 归档。
用法：
  python find-sessions.py list              # 列出所有会话
  python find-sessions.py recent [n]        # 最近 n 个会话（默认 10）
  python find-sessions.py id <session-id>   # 查一个会话详情
  python find-sessions.py missing           # 列出归档缺失的会话
  python find-sessions.py extract <jsonl> [start] [end]  # 提取对话文本
"""

import json, os, glob, sys
from datetime import datetime

VAULT = r'C:\Users\lnp\Documents\Obsidian Vault'
SESSIONS_DIR = os.path.join(VAULT, '.claudian', 'sessions')
ARCHIVE_DIR = os.path.join(VAULT, '10 Projects', 'ai-conversations')
CLAUDE_PROJECTS = os.path.join(os.path.expanduser('~'), '.claude', 'projects')

# ── helpers ──────────────────────────────────────────────

def load_meta(path):
    try:
        return json.load(open(path, 'r', encoding='utf-8'))
    except:
        return None

def find_jsonl(provider_session_id):
    """Given a providerSessionId, find the corresponding jsonl file."""
    # Search in Obsidian Vault project
    vault_project = os.path.join(CLAUDE_PROJECTS, 'C--Users-lnp-Documents-Obsidian-Vault')
    jsonl = os.path.join(vault_project, f'{provider_session_id}.jsonl')
    if os.path.exists(jsonl):
        return jsonl

    # Search in all project directories
    for project_dir in glob.glob(os.path.join(CLAUDE_PROJECTS, '*')):
        jsonl = os.path.join(project_dir, f'{provider_session_id}.jsonl')
        if os.path.exists(jsonl):
            return jsonl

    # Search in subdirectories (some sessions are nested)
    for root, dirs, files in os.walk(CLAUDE_PROJECTS):
        for f in files:
            if f == f'{provider_session_id}.jsonl':
                return os.path.join(root, f)

    return None

def find_archive(session_id):
    """Check if this session has been exported to the vault archive."""
    # Try to match by checking if any archive dir's raw.md mentions this session
    for adir in glob.glob(os.path.join(ARCHIVE_DIR, '*')):
        if not os.path.isdir(adir):
            continue
        raw_files = glob.glob(os.path.join(adir, 'raw*.md'))
        for rf in raw_files:
            try:
                with open(rf, 'r', encoding='utf-8', errors='ignore') as f:
                    head = f.read(500)
                    if session_id in head:
                        return adir
            except:
                pass
    return None

def ts_to_str(ms):
    """Convert JS millisecond timestamp to readable string."""
    try:
        return datetime.fromtimestamp(ms / 1000).strftime('%Y-%m-%d %H:%M')
    except:
        return str(ms)

def fix_encoding(text):
    """Attempt to fix GBK bytes mis-encoded as latin-1 in UTF-8 JSON."""
    for enc in ('gbk', 'gb18030'):
        try:
            return text.encode('latin-1').decode(enc)
        except:
            pass
    return text

def get_all_sessions():
    """Return list of all session metadata dicts, sorted by creation time."""
    sessions = []
    for f in sorted(glob.glob(os.path.join(SESSIONS_DIR, '*.meta.json'))):
        # Skip backup/corrupt files
        if '.bak' in f or '.CORRUPTED' in f or '.bom-backup' in f:
            continue
        meta = load_meta(f)
        if not meta:
            continue
        sid = meta.get('id', '')
        psid = meta.get('providerState', {}).get('providerSessionId', '')
        jsonl_path = find_jsonl(psid) if psid else None
        archive_path = find_archive(sid)
        
        sessions.append({
            'id': sid,
            'title': meta.get('title', '?'),
            'provider': meta.get('providerId', '?'),
            'created': meta.get('createdAt', 0),
            'updated': meta.get('updatedAt', 0),
            'provider_session_id': psid,
            'jsonl_path': jsonl_path,
            'jsonl_size_kb': os.path.getsize(jsonl_path) / 1024 if jsonl_path else 0,
            'archive_path': archive_path,
            'meta_path': f,
        })
    
    sessions.sort(key=lambda s: s['created'], reverse=True)
    return sessions

# ── commands ──────────────────────────────────────────────

def cmd_list():
    sessions = get_all_sessions()
    print(f"{'日期':<14} {'来源':<8} {'jsonl':>10} {'归档':<10} 标题")
    print("-" * 80)
    for s in sessions:
        dt = ts_to_str(s['created'])
        provider = s['provider']
        jsonl_info = f"{s['jsonl_size_kb']:.0f}KB" if s['jsonl_path'] else "--"
        archive_info = os.path.basename(s['archive_path'])[:20] if s['archive_path'] else "MISSING"
        print(f"{dt:<14} {provider:<8} {jsonl_info:>10} {archive_info:<10} {s['title'][:50]}")
    print(f"\n共 {len(sessions)} 个会话")

def cmd_recent(n=10):
    sessions = get_all_sessions()[:n]
    for s in sessions:
        dt = ts_to_str(s['created'])
        print(f"\n{'='*60}")
        print(f"  {dt}  [{s['provider']}]  {s['title']}")
        print(f"  Claudian ID: {s['id']}")
        print(f"  ProviderSessionId: {s['provider_session_id'][:30] if s['provider_session_id'] else '?'}")
        print(f"  JSONL: {s['jsonl_path'] or '[NOT FOUND]'}")
        print(f"  归档: {s['archive_path'] or '[MISSING]'}")

def cmd_id(session_id):
    sessions = get_all_sessions()
    for s in sessions:
        if s['id'] == session_id:
            print(f"标题: {s['title']}")
            print(f"来源: {s['provider']}")
            print(f"创建: {ts_to_str(s['created'])}")
            print(f"更新: {ts_to_str(s['updated'])}")
            print(f"ProviderSessionId: {s['provider_session_id']}")
            print(f"JSONL: {s['jsonl_path'] or '❌ 未找到'}")
            if s['jsonl_path']:
                print(f"  → 大小: {s['jsonl_size_kb']:.0f} KB")
            print(f"归档: {s['archive_path'] or '❌ 缺失'}")
            return
    print(f"未找到会话: {session_id}")

def cmd_missing():
    sessions = get_all_sessions()
    missing = [s for s in sessions if not s['archive_path'] and s['jsonl_path']]
    print(f"有 jsonl 但未归档的会话 ({len(missing)}):")
    print("-" * 60)
    for s in missing:
        dt = ts_to_str(s['created'])
        print(f"  {dt}  [{s['provider']}]  {s['title'][:50]}")
        print(f"    id={s['id']}")
        print(f"    jsonl={s['jsonl_path']}")
        if s['jsonl_size_kb']:
            print(f"    size={s['jsonl_size_kb']:.0f}KB")
    print(f"\n共 {len(missing)} 个未归档会话")

def cmd_extract(jsonl_path, start_ts=None, end_ts=None):
    """Extract user and assistant messages from a jsonl file."""
    def extract_text(content):
        texts = []
        if isinstance(content, str):
            texts.append(content)
        elif isinstance(content, list):
            for c in content:
                if isinstance(c, dict) and c.get('type') == 'text':
                    texts.append(c.get('text', ''))
        return ' '.join(texts).strip()

    count = 0
    for line in open(jsonl_path, 'r', encoding='utf-8', errors='replace'):
        line = line.strip()
        if not line:
            continue
        try:
            o = json.loads(line)
        except:
            continue
        
        t = o.get('type', '')
        if t not in ('user', 'assistant'):
            continue
        
        ts = o.get('timestamp', '')
        if start_ts and ts < start_ts:
            continue
        if end_ts and ts > end_ts:
            continue
        
        msg = o.get('message', {})
        role = msg.get('role', '')
        text = fix_encoding(extract_text(msg.get('content', '')))
        
        if not text:
            continue
        if role == 'user' and (text.startswith('<command') or 'tool_result' in text):
            continue
        
        count += 1
        print(f'\n=== [{count}] {ts[:19]} [{role}] ===')
        # Print first 400 chars as preview, full text is also available
        print(text[:3000])
    
    print(f'\n共 {count} 条消息')

# ── main ──────────────────────────────────────────────────

if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)
    
    cmd = args[0]
    if cmd == 'list':
        cmd_list()
    elif cmd == 'recent':
        n = int(args[1]) if len(args) > 1 else 10
        cmd_recent(n)
    elif cmd == 'id':
        if len(args) < 2:
            print("用法: find-sessions.py id <session-id>")
            sys.exit(1)
        cmd_id(args[1])
    elif cmd == 'missing':
        cmd_missing()
    elif cmd == 'extract':
        if len(args) < 2:
            print("用法: find-sessions.py extract <jsonl-path> [start-ts] [end-ts]")
            sys.exit(1)
        cmd_extract(args[1], args[2] if len(args) > 2 else None, args[3] if len(args) > 3 else None)
    else:
        print(f"未知命令: {cmd}")
        print(__doc__)
