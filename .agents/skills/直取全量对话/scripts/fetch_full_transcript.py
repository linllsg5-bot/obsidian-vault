import os
import sys
import json
import argparse

def fetch_full_transcript(brain_dir, output_path, include_tools=False):
    logs_dir = os.path.join(brain_dir, '.system_generated', 'logs')
    full_jsonl = os.path.join(logs_dir, 'transcript_full.jsonl')
    fallback_jsonl = os.path.join(logs_dir, 'transcript.jsonl')

    target_log = full_jsonl if os.path.exists(full_jsonl) else fallback_jsonl
    if not os.path.exists(target_log):
        print(f"Error: 无法找到全量日志文件 {target_log}", file=sys.stderr)
        sys.exit(1)

    print(f"=== 正在直取底层日志: {target_log} ===")
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    messages = []
    
    # 写入基础 frontmatter
    messages.append("---")
    messages.append("type: raw-transcript")
    messages.append(f"source: {os.path.basename(target_log)} 直取")
    messages.append("---")
    messages.append("")

    turn_count = 0
    with open(target_log, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue

            step_type = obj.get('type', '')
            source = obj.get('source', '')
            content = obj.get('content', '')

            # 提取用户输入
            if step_type == 'USER_INPUT' or source == 'USER_EXPLICIT':
                turn_count += 1
                messages.append(f"┌─── USER (Turn {turn_count}) ───┐")
                messages.append(content.strip())
                messages.append("└────────────────────────┘\n")
                continue
            
            # 提取 AI 回答
            if step_type == 'PLANNER_RESPONSE' or source == 'MODEL':
                if not content and not include_tools:
                    continue
                turn_count += 1
                messages.append(f"┌─── AI: Antigravity (Turn {turn_count}) ───┐")
                if content:
                    messages.append(content.strip())
                
                if include_tools and 'tool_calls' in obj:
                    tools = obj.get('tool_calls', [])
                    for t in tools:
                        messages.append(f"[Tool Call: {t.get('toolSummary', t.get('toolAction', ''))}]")
                
                messages.append("└─────────────────────────────────┘\n")
                continue

    with open(output_path, 'w', encoding='utf-8') as out_f:
        out_f.write('\n'.join(messages))
    
    print(f"成功直取全量对话，共提取 {turn_count} 轮交互！")
    print(f"文件已完全沉积至: {output_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Antigravity 直取全量对话日志导出脚本")
    parser.add_argument('--brain-dir', required=True, help="当前会话的 brain 根目录路径")
    parser.add_argument('--output', required=True, help="导出的目标 raw.md 绝对路径")
    parser.add_argument('--include-tools', action='store_true', help="是否保留工具调用的元数据标记")
    
    args = parser.parse_args()
    fetch_full_transcript(args.brain_dir, args.output, args.include_tools)
