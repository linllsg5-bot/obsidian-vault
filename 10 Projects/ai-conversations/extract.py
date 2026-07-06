import json, sys, os

jsonl_path = r'C:\Users\lnp\.codex\sessions\2026\06\27\rollout-2026-06-27T02-41-25-019f053c-840f-7c70-bad6-afc150743c1f.jsonl'
raw_path = r'C:\Users\lnp\Documents\Obsidian Vault\10 Projects\ai-conversations\temp_raw.md'

def fix_encoding(text):
    for enc in ('gbk', 'gb18030'):
        try: return text.encode('latin-1').decode(enc)
        except: pass
    return text

with open(jsonl_path, 'r', encoding='utf-8', errors='replace') as f, open(raw_path, 'w', encoding='utf-8') as out:
    out.write('---\n')
    out.write('type: annotated-conversation\n')
    out.write('date: 2026-06-27\n')
    out.write('source: terminal\n')
    out.write('---\n\n')
    for line in f:
        line = line.strip()
        if not line: continue
        try: o = json.loads(line)
        except: continue
        
        if o.get('type') != 'response_item': continue
        payload = o.get('payload', {})
        if payload.get('type') != 'message': continue
        
        role = payload.get('role', '')
        if role not in ('user', 'assistant'): continue
        
        ts = o.get('timestamp', '')[:19]
        content = payload.get('content', '')
        
        texts = []
        if isinstance(content, str): texts.append(content)
        elif isinstance(content, list):
            for c in content:
                # Include all text types, not just 'text' and 'input_text'
                if isinstance(c, dict) and 'text' in c:
                    texts.append(c.get('text', ''))
        
        text = fix_encoding(' '.join(texts).strip())
        if not text: continue
        
        # skip tool commands from user side
        if role == 'user' and (text.startswith('<command') or 'tool_result' in text or 'AGENTS.md instructions' in text[:50]):
            continue
            
        out.write(f'=== {ts} [{role}] ===\n')
        out.write(text + '\n\n')

print(f'Done. Wrote to {raw_path}')
