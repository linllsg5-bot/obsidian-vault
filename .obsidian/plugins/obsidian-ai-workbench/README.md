# Obsidian AI Workbench

An Obsidian plugin scaffold for the `OpenClaw -> Obsidian` AI workstation.

## Current MVP Boundary

- Right-side chat view
- Active note context capture: file path, title, selection, tags, links, headings
- Configurable OpenClaw-compatible chat completion endpoint
- OpenAI-style `v1/chat/completions` payload with streaming and non-streaming fallback
- Write-back modes:
  - append to active note
  - replace current selection
  - create a new result page

## Build

```bash
npm install
npm run build
```

The build outputs `main.js` beside `manifest.json`.

## OpenClaw Contract Draft

The plugin currently sends an OpenAI-style payload:

```json
{
  "model": "codex/gpt-5.5",
  "stream": true,
  "temperature": 0.4,
  "messages": [
    {
      "role": "system",
      "content": "..."
    }
  ]
}
```

The response may be:

- SSE lines with OpenAI `choices[0].delta.content`
- Plain JSON responses with `choices[0].message.content`
- Plain text lines, treated as delta chunks
- Completion marker: `data: [DONE]`

## Next

1. Decide the real OpenClaw endpoint and auth shape.
2. Install or symlink this folder into the default vault's `.obsidian/plugins/`.
3. Test the panel inside Obsidian and adjust UI/runtime assumptions.
