#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
backup_codex_sessions.py
========================
Codex 原始会话 JSONL 独立私有冷备工具。

功能：
1. 扫描本地 `~/.codex/sessions/` 下的所有原始 `.jsonl` 会话。
2. 镜像归档至物理隔离的私有冷备目录（默认：`~/.codex-cold-archive/`，位于任何 Git 仓库之外）。
3. 生成全量文件的 SHA-256 / MD5 校验和清单 `checksums.sha256` 与 `manifest.json`。
4. 提供 `--verify` 选项验证冷备完整性。

安全声明：
冷备目录独立于 Obsidian Vault 与代码库，杜绝敏感环境数据泄露风险。
"""

import os
import glob
import shutil
import hashlib
import json
import datetime
import sys

SOURCE_DIR = os.path.expanduser(r'~/.codex/sessions')
DEFAULT_BACKUP_ROOT = os.path.expanduser(r'~/.codex-cold-archive')

def compute_hashes(file_path: str):
    with open(file_path, 'rb') as f:
        data = f.read()
        return {
            'size': len(data),
            'md5': hashlib.md5(data).hexdigest(),
            'sha256': hashlib.sha256(data).hexdigest()
        }

def run_backup(dest_root: str = DEFAULT_BACKUP_ROOT):
    if not os.path.exists(SOURCE_DIR):
        print(f"Error: Source directory {SOURCE_DIR} does not exist.")
        return False

    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = os.path.join(dest_root, f"codex_sessions_backup_{timestamp}")
    latest_mirror_dir = os.path.join(dest_root, "latest")
    
    os.makedirs(backup_dir, exist_ok=True)
    os.makedirs(latest_mirror_dir, exist_ok=True)

    jsonl_files = glob.glob(os.path.join(SOURCE_DIR, '**', '*.jsonl'), recursive=True)
    print(f"[*] Found {len(jsonl_files)} sessions in {SOURCE_DIR}")
    print(f"[*] Creating cold backup in: {backup_dir}")

    manifest = {
        'backup_time': datetime.datetime.now().isoformat(),
        'source_dir': SOURCE_DIR,
        'file_count': len(jsonl_files),
        'files': []
    }

    checksum_lines = []

    for src_path in jsonl_files:
        rel_path = os.path.relpath(src_path, SOURCE_DIR)
        dest_path = os.path.join(backup_dir, rel_path)
        mirror_path = os.path.join(latest_mirror_dir, rel_path)

        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        os.makedirs(os.path.dirname(mirror_path), exist_ok=True)

        shutil.copy2(src_path, dest_path)
        shutil.copy2(src_path, mirror_path)

        h = compute_hashes(dest_path)
        file_info = {
            'relative_path': rel_path,
            'filename': os.path.basename(src_path),
            'size_bytes': h['size'],
            'md5': h['md5'],
            'sha256': h['sha256']
        }
        manifest['files'].append(file_info)
        checksum_lines.append(f"{h['sha256']} *{rel_path}")

    # Write manifest and checksums
    manifest_path = os.path.join(backup_dir, "manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    checksum_path = os.path.join(backup_dir, "checksums.sha256")
    with open(checksum_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(checksum_lines) + "\n")

    # Also write to latest mirror
    with open(os.path.join(latest_mirror_dir, "manifest.json"), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    with open(os.path.join(latest_mirror_dir, "checksums.sha256"), 'w', encoding='utf-8') as f:
        f.write("\n".join(checksum_lines) + "\n")

    print(f"[+] Backup completed successfully! {len(jsonl_files)} files archived.")
    print(f"[+] Manifest: {manifest_path}")
    print(f"[+] Checksums: {checksum_path}")
    return True

def verify_backup(backup_dir: str):
    manifest_path = os.path.join(backup_dir, "manifest.json")
    if not os.path.exists(manifest_path):
        print(f"Error: Manifest not found in {backup_dir}")
        return False

    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    passed = 0
    failed = 0
    for item in manifest.get('files', []):
        file_path = os.path.join(backup_dir, item['relative_path'])
        if not os.path.exists(file_path):
            print(f"[-] Missing: {file_path}")
            failed += 1
            continue
        h = compute_hashes(file_path)
        if h['sha256'] == item['sha256']:
            passed += 1
        else:
            print(f"[-] Checksum mismatch: {file_path}")
            failed += 1

    print(f"[*] Verification summary: {passed} passed, {failed} failed.")
    return failed == 0

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--verify':
        target = sys.argv[2] if len(sys.argv) > 2 else os.path.join(DEFAULT_BACKUP_ROOT, "latest")
        verify_backup(target)
    else:
        dest = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_BACKUP_ROOT
        run_backup(dest)
