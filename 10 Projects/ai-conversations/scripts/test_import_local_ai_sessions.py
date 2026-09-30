"""仅用临时目录和合成内容，不扫描真实 home。"""
from datetime import date
import json
from pathlib import Path
import tempfile
import unittest

import import_local_ai_sessions as imp


class ImportTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.args = imp.parser().parse_args([])
        self.args.since = date(2026, 1, 1)
        self.args.output_dir = self.root / "out"
        for name in ("pi_dir", "codex_dir", "codex_archived_dir", "claude_dir", "claudian_dir"):
            setattr(self.args, name, self.root / name)
            getattr(self.args, name).mkdir()
        self.args.chatgpt_state = self.root / "responses-state.json"

    def jsonl(self, folder, name, events):
        p = getattr(self.args, folder) / name
        p.write_text("\n".join(json.dumps(e) for e in events), encoding="utf-8")
        return p

    def fixtures(self):
        pi = self.jsonl("pi_dir", "a.jsonl", [
            {"type": "session", "version": 3, "id": "pi-one", "timestamp": "2026-08-01T00:00:00Z"},
            {"type": "message", "id": "a", "message": {"role": "user", "content": "python testing\npassword=hunter99"}},
            {"type": "message", "id": "b", "parentId": "a", "message": {"role": "assistant", "content": [{"type": "thinking", "thinking": "HIDDEN_REASONING"}, {"type": "text", "text": "visible answer"}, {"type": "toolCall", "name": "read", "arguments": {"api_key": "hidden-key"}}]}},
            {"type": "message", "id": "c", "parentId": "a", "message": {"role": "user", "content": "second branch"}},
            {"type": "message", "message": {"role": "system", "content": "SYSTEM_ONLY"}},
            {"type": "message", "message": {"role": "toolResult", "content": "TOOL_ONLY"}},
        ])
        self.jsonl("codex_dir", "b.jsonl", [
            {"type": "session_meta", "payload": {"id": "codex-one", "timestamp": "2026-08-02T00:00:00Z"}},
            {"type": "response_item", "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": "hello"}]}},
            {"type": "response_item", "payload": {"type": "message", "role": "assistant", "channel": "analysis", "content": [{"type": "output_text", "text": "HIDDEN_REASONING"}]}},
            {"type": "message", "role": "assistant", "content": "ok"},
            {"type": "response_item", "payload": {"type": "function_call", "name": "shell", "arguments": "TOOL_ONLY"}},
        ])
        (self.args.claudian_dir / "meta.meta.json").write_text(json.dumps({"id": "meta-one", "title": "学习", "createdAt": "2026-08-03", "messages": ["NOT_BODY"]}), encoding="utf-8")
        self.args.chatgpt_state.write_text(json.dumps({"states": {"s1": {"created_at": "2026-08-04", "messages": [{"role": "user", "content": "web user"}, {"role": "assistant", "content": {"parts": ["web answer"]}}], "diagnostics": {"role": "assistant", "text": "NOT_BODY"}}, "s2": {"created_at": "2026-08-04", "messages": [{"role": "user", "text": "second state"}]}}}), encoding="utf-8")
        return pi

    def test_parse_redact_and_idempotence(self):
        self.fixtures()
        first = imp.run(self.args)
        self.assertEqual(first["counts"]["created"], 5)
        all_text = "\n".join((self.args.output_dir / f["path"]).read_text(encoding="utf-8") for f in first["files"])
        for secret in ("hunter99", "HIDDEN_REASONING", "SYSTEM_ONLY", "TOOL_ONLY", "NOT_BODY"):
            self.assertNotIn(secret, all_text)
        self.assertIn("[REDACTED:", all_text)
        meta = next(f for f in first["files"] if f["source"] == "claudian")
        self.assertEqual(meta["content_status"], "metadata-only")
        self.assertEqual(meta["message_count"], 0)
        second = imp.run(self.args)
        self.assertEqual(second["counts"]["unchanged"], 5)
        self.assertEqual(first["files"], second["files"])
        self.args.include_tools = self.args.include_system = True
        third = imp.run(self.args)
        text = "\n".join((self.args.output_dir / f["path"]).read_text(encoding="utf-8") for f in third["files"])
        self.assertIn("SYSTEM_ONLY", text)
        self.assertIn("TOOL_ONLY", text)
        self.assertNotIn("hidden-key", text)
        self.assertNotIn("HIDDEN_REASONING", text)

    def test_dry_run(self):
        self.fixtures()
        self.args.dry_run = True
        plan = imp.run(self.args)
        self.assertEqual(plan["counts"]["created"], 5)
        self.assertFalse(self.args.output_dir.exists())
        self.args.dry_run = False
        imp.run(self.args)
        before = {p: p.read_bytes() for p in self.args.output_dir.rglob("*") if p.is_file()}
        self.args.dry_run = True
        imp.run(self.args)
        self.assertEqual(before, {p: p.read_bytes() for p in before})

    def test_duplicates_updates_and_manual_file(self):
        pi = self.fixtures()
        (pi.parent / "copy.jsonl").write_bytes(pi.read_bytes())
        first = imp.run(self.args)
        self.assertEqual(first["counts"]["created"], 5)
        self.assertEqual(first["counts"]["duplicates"], 1)
        entry = next(f for f in first["files"] if f["source"] == "pi")
        target = self.args.output_dir / entry["path"]
        with pi.open("a", encoding="utf-8") as stream:
            stream.write('\n' + json.dumps({"type": "message", "timestamp": "2026-08-05", "message": {"role": "user", "content": "new text"}}))
        second = imp.run(self.args)
        self.assertEqual(second["counts"]["total_archived"], 5)
        self.assertIn("new text", target.read_text(encoding="utf-8"))
        target.write_text("manual change", encoding="utf-8")
        third = imp.run(self.args)
        self.assertEqual(target.read_text(encoding="utf-8"), "manual change")
        self.assertTrue(any(s["skipped_reason"] == "existing_or_modified_file" for s in third["skipped"]))

    def test_errors_date_and_exclusions(self):
        self.fixtures()
        (self.args.pi_dir / "bad.jsonl").write_text("not json", encoding="utf-8")
        (self.args.claudian_dir / "bad.CORRUPTED.meta.json").write_text("not json", encoding="utf-8")
        self.jsonl("claude_dir", "old.jsonl", [{"type": "user", "sessionId": "old", "timestamp": "2020-01-01", "message": {"role": "user", "content": "too old"}}])
        manifest = imp.run(self.args)
        reasons = [s["skipped_reason"] for s in manifest["skipped"]]
        self.assertIn("before_since", reasons)
        self.assertIn("invalid_json_line", reasons)
        self.assertFalse(any("CORRUPTED" in s["source_file"] for s in manifest["skipped"]))

    def test_redaction(self):
        for text, value in [('Authorization: Bearer abc123', 'abc123'), ('Cookie: a=one; b=two', 'two'), ('{"api_key": "quoted secret"}', 'quoted secret'), ('OPENAI_API_KEY=some-secret', 'some-secret'), ('https://u:fakepass99@host', 'fakepass99'), ('token=abc', 'abc'), ('--api-key "fake key"', 'fake key')]:
            self.assertNotIn(value, imp.redact(text))

    def test_claude_partial_and_source_filter(self):
        p = self.jsonl("claude_dir", "a.jsonl", [
            {"type": "user", "sessionId": "c1", "timestamp": "2026-08-01", "message": {"role": "user", "content": "original\n  spacing"}},
            {"type": "assistant", "sessionId": "c1", "timestamp": "2026-08-02", "message": {"role": "assistant", "content": [{"type": "thinking", "text": "HIDDEN"}, {"type": "text", "text": "first"}, {"type": "text", "text": "second"}]}},
        ])
        with p.open("a", encoding="utf-8") as stream:
            stream.write("\n{truncated")
        self.args.source = "claude"
        result = imp.run(self.args)
        self.assertEqual(len(result["source_inventory"]), 1)
        entry = result["files"][0]
        self.assertEqual(entry["message_count"], 2)
        self.assertEqual(entry["content_status"], "partial-visible-text")
        text = (self.args.output_dir / entry["path"]).read_text(encoding="utf-8")
        self.assertIn("original\n  spacing", text)
        self.assertIn("first\nsecond", text)
        self.assertNotIn("HIDDEN", text)

    def test_web_mapping_and_unparseable_state(self):
        mapping = {"b": {"parent": "a", "message": {"role": "assistant", "text": "second"}}, "a": {"parent": None, "message": {"role": "user", "text": "first"}}}
        self.assertEqual(imp.web_messages({"mapping": mapping, "current_node": "b"}), [("user", "first"), ("assistant", "second")])
        self.assertEqual(imp.web_messages({"mapping": mapping}), [])
        self.args.source = "chatgpt"
        self.args.chatgpt_state.write_text('{"states":{"x":{"diagnostics":{"role":"assistant","text":"not a session"}}}}', encoding="utf-8")
        result = imp.run(self.args)
        self.assertFalse(result["files"])
        self.assertEqual(result["skipped"][0]["skipped_reason"], "no_reliable_visible_messages")

    def test_unowned_and_path_escape(self):
        self.fixtures()
        self.args.output_dir.mkdir()
        (self.args.output_dir / "按时间.md").write_text("manual", encoding="utf-8")
        manifest = imp.run(self.args)
        self.assertEqual((self.args.output_dir / "按时间.md").read_text(encoding="utf-8"), "manual")
        self.assertTrue(manifest["skipped"])
        with self.assertRaises(ValueError):
            imp.output_path(self.args.output_dir, "../outside.md")

    def test_web_list_of_pairs_items(self):
        hidden = {"role": "assistant", "content": "HIDDEN"}
        items = [
            {"type": "message", "message": {"role": "user", "content": [{"type": "input_text", "text": "question password=fake-secret"}]}},
            {"type": "message", "role": "assistant", "message": {"role": "assistant", "content": [
                {"type": "output_text", "text": "answer"},
                {"type": "thinking", "text": "HIDDEN"},
                {"type": "reasoning", "text": "HIDDEN"},
                {"type": "diagnostic", "text": "HIDDEN"},
                {"type": "log", "text": "HIDDEN"},
                {"type": "additional_tools", "content": [hidden]},
            ]}},
            {"type": "message", "role": "user", "message": {"content": "follow-up"}},
            {"type": "message", "role": "assistant", "content": {"parts": ["final"]}},
            {"type": "message", "message": {"role": "system", "content": "HIDDEN"}},
            {"type": "message", "role": "system", "message": hidden},
            {"type": "message", "role": "assistant", "message": {"role": "developer", "content": "HIDDEN"}},
            {"type": "message", "message": {"content": "HIDDEN"}},
            {"type": "message", "message": {**hidden, "channel": "analysis"}},
            {"type": "message", "channel": "reasoning", "message": hidden},
        ]
        for kind in ("reasoning", "thinking", "diagnostic", "log", "additional_tools", "raw_html"):
            items.append({"type": kind, "message": hidden})
        state = {"id": "not-the-state-id", "createdAt": 1785801600000,
                 "updated_at": "2030-01-01", "items": items,
                 "additional_tools": {"messages": [hidden]},
                 "raw_html": {"messages": [hidden]}, "diagnostics": [hidden],
                 "system_prompt": {"messages": [hidden]}}
        data = {"version": 1, "states": [
            ["state-one", state],
            ["state-two", {"createdAt": "2026-08-05T00:00:00Z", "items": [{"type": "message", "message": {"role": "user", "content": "other session"}}]}],
            ["state-empty", {"createdAt": "2026-08-06", "items": items[4:], "additional_tools": [hidden]}],
        ]}
        sessions = imp.parse_web(data)
        self.assertEqual(sessions, imp.parse_web({"states": dict(data["states"])}))
        self.assertEqual([s["id"] for s in sessions], ["state-one", "state-two", "state-empty"])
        self.assertEqual(sessions[0]["messages"], [
            ("user", "question password=[REDACTED: credential]"),
            ("assistant", "answer"), ("user", "follow-up"), ("assistant", "final")])
        self.assertEqual(sessions[0]["times"], [imp.stamp("2026-08-04")])
        self.assertEqual(sessions[2]["messages"], [])
        self.args.source = "chatgpt"
        self.args.include_tools = self.args.include_system = True
        self.args.chatgpt_state.write_text(json.dumps(data), encoding="utf-8")
        self.args.dry_run = True
        preview = imp.run(self.args)
        self.assertEqual(preview["counts"]["created"], 2)
        self.assertFalse(self.args.output_dir.exists())
        self.args.dry_run = False
        first = imp.run(self.args)
        self.assertEqual(first["counts"]["created"], 2)
        self.assertTrue(any(s.get("state_id") == "state-empty" and s["skipped_reason"] == "no_reliable_visible_messages" for s in first["skipped"]))
        for entry in first["files"]:
            self.assertEqual(entry["date_basis"], "source_timestamp")
            self.assertIn("by-date/2026/08/", entry["path"])
            text = (self.args.output_dir / entry["path"]).read_text(encoding="utf-8")
            self.assertNotIn("HIDDEN", text)
            self.assertNotIn("fake-secret", text)
        second = imp.run(self.args)
        self.assertEqual(second["counts"]["unchanged"], 2)
        self.assertEqual(first["files"], second["files"])


if __name__ == "__main__":
    unittest.main()
