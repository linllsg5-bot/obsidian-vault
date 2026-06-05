"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  DEFAULT_SETTINGS: () => DEFAULT_SETTINGS,
  ObsidianAiWorkbenchPlugin: () => ObsidianAiWorkbenchPlugin,
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var import_obsidian8 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var WorkbenchSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "OpenClaw Workbench" });
    new import_obsidian.Setting(containerEl).setName("OpenClaw base URL").setDesc("Base URL for the local OpenClaw Gateway or OpenAI-compatible proxy.").addText(
      (text) => text.setPlaceholder("http://127.0.0.1:18789").setValue(this.plugin.settings.openClawBaseUrl).onChange(async (value) => {
        this.plugin.settings.openClawBaseUrl = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Chat path").setDesc("Relative path used for chat requests.").addText(
      (text) => text.setPlaceholder("/chat").setValue(this.plugin.settings.openClawChatPath).onChange(async (value) => {
        this.plugin.settings.openClawChatPath = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("OpenClaw API key").setDesc("Optional bearer token for local auth.").addText(
      (text) => text.setPlaceholder("optional").setValue(this.plugin.settings.openClawApiKey).onChange(async (value) => {
        this.plugin.settings.openClawApiKey = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Model").setDesc("OpenClaw agent target, such as openclaw/default or openclaw/<agentId>.").addText(
      (text) => text.setPlaceholder("openclaw/default").setValue(this.plugin.settings.openClawModel).onChange(async (value) => {
        this.plugin.settings.openClawModel = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Result folder").setDesc("Folder used when creating new result pages.").addText(
      (text) => text.setPlaceholder("OpenClaw Results").setValue(this.plugin.settings.resultFolder).onChange(async (value) => {
        this.plugin.settings.resultFolder = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Stream timeout").setDesc("Timeout in milliseconds for streaming responses.").addText(
      (text) => text.setValue(String(this.plugin.settings.streamTimeoutMs)).onChange(async (value) => {
        const next = Number(value);
        if (!Number.isNaN(next) && next > 0) {
          this.plugin.settings.streamTimeoutMs = next;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(containerEl).setName("Default write-back mode").setDesc("Default destination for assistant output.").addDropdown(
      (dropdown) => dropdown.addOption("append", "Append").addOption("replace-selection", "Replace selection").addOption("new-page", "New page").setValue(this.plugin.settings.defaultWriteBackMode).onChange(async (value) => {
        this.plugin.settings.defaultWriteBackMode = value;
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/ui/chat-view.ts
var import_obsidian7 = require("obsidian");

// src/context/active-note.ts
var import_obsidian2 = require("obsidian");
function getActiveFile(app) {
  const file = app.workspace.getActiveFile();
  return file instanceof import_obsidian2.TFile ? file : null;
}
function getTitle(file) {
  return file?.basename ?? "Untitled";
}

// src/utils/text.ts
function createId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function truncate(value, limit = 120) {
  if (value.length <= limit) {
    return value;
  }
  return `${value.slice(0, limit - 1)}\u2026`;
}
function joinNonEmpty(values, separator = ", ") {
  return values.filter((value) => Boolean(value && value.trim())).join(separator);
}
function toSafeFileName(value) {
  const cleaned = value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-").replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned : "Untitled";
}

// src/context/metadata.ts
function collectTags(metadata) {
  const tags = /* @__PURE__ */ new Set();
  for (const tag of metadata?.tags ?? []) {
    tags.add(tag.tag.replace(/^#/, ""));
  }
  const frontmatterTags = metadata?.frontmatter?.tags;
  if (Array.isArray(frontmatterTags)) {
    for (const tag of frontmatterTags) {
      tags.add(String(tag).replace(/^#/, ""));
    }
  } else if (typeof frontmatterTags === "string") {
    tags.add(frontmatterTags.replace(/^#/, ""));
  }
  return [...tags].filter(Boolean);
}
function collectLinks(metadata) {
  return [...new Set((metadata?.links ?? []).map((link) => link.link).filter(Boolean))];
}
function collectHeadings(metadata) {
  return (metadata?.headings ?? []).map((heading) => heading.heading).filter(Boolean);
}
function buildExcerpt(file, metadata) {
  const headings = collectHeadings(metadata).slice(0, 3);
  const tags = collectTags(metadata).slice(0, 5);
  return joinNonEmpty([file?.path ?? null, headings.join(" / ") || null, tags.length ? `#${tags.join(" #")}` : null]);
}

// src/context/selection.ts
function getSelection(view) {
  if (!view?.editor) {
    return "";
  }
  return view.editor.getSelection().trim();
}

// src/utils/obsidian.ts
var import_obsidian3 = require("obsidian");
function getActiveMarkdownView(app) {
  const view = app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
  return view ?? null;
}
async function ensureFolder(app, folderPath) {
  const normalized = (0, import_obsidian3.normalizePath)(folderPath);
  if (app.vault.getAbstractFileByPath(normalized)) {
    return;
  }
  const parts = normalized.split("/").filter(Boolean);
  let current = "";
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    const existing = app.vault.getAbstractFileByPath(current);
    if (!existing) {
      await app.vault.createFolder(current);
    } else if (!(existing instanceof import_obsidian3.TFolder)) {
      throw new Error(`Path exists but is not a folder: ${current}`);
    }
  }
}

// src/context/collector.ts
function collectContext(app) {
  const file = getActiveFile(app);
  const view = getActiveMarkdownView(app);
  const metadata = file ? app.metadataCache.getFileCache(file) : null;
  const selection = getSelection(view);
  const title = getTitle(file);
  return {
    title,
    filePath: file?.path ?? null,
    selection,
    tags: collectTags(metadata),
    links: collectLinks(metadata),
    headings: collectHeadings(metadata),
    excerpt: truncate(buildExcerpt(file, metadata), 240)
  };
}

// src/ui/message-list.ts
function renderMessages(container, messages) {
  container.innerHTML = "";
  for (const message of messages) {
    container.appendChild(createMessageElement(message));
  }
}
function createMessageElement(message) {
  const item = document.createElement("div");
  item.className = "ocw-message";
  item.dataset.role = message.role;
  const meta = document.createElement("div");
  meta.className = "ocw-message-meta";
  meta.appendChild(textSpan(message.role));
  meta.appendChild(textSpan(new Date(message.createdAt).toLocaleTimeString()));
  item.appendChild(meta);
  const body = document.createElement("div");
  body.textContent = truncate(message.content, 2e3);
  item.appendChild(body);
  return item;
}
function textSpan(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}

// src/ui/composer.ts
function createComposer(container, options) {
  const wrapper = container.createDiv({ cls: "ocw-composer" });
  const textarea = wrapper.createEl("textarea", {
    attr: {
      placeholder: "Ask OpenClaw to work with the current note..."
    }
  });
  const actions = wrapper.createDiv({ cls: "ocw-composer-actions" });
  const modeWrap = actions.createDiv({ cls: "ocw-modes" });
  const submit = actions.createEl("button", { text: "Send" });
  let mode = options.initialMode;
  let busy = false;
  const setActiveMode = () => {
    modeWrap.querySelectorAll("button").forEach((button) => button.classList.remove("is-active"));
    const active = modeWrap.querySelector(`[data-mode="${mode}"]`);
    active?.classList.add("is-active");
  };
  const addModeButton = (value, label) => {
    const button = modeWrap.createEl("button", {
      text: label,
      cls: "ocw-mode-button"
    });
    button.dataset.mode = value;
    button.addEventListener("click", () => {
      mode = value;
      options.onModeChange(value);
      setActiveMode();
    });
  };
  addModeButton("append", "Append");
  addModeButton("replace-selection", "Replace");
  addModeButton("new-page", "New Page");
  setActiveMode();
  const submitCurrent = () => {
    const value = textarea.value.trim();
    if (!value || busy) {
      return;
    }
    options.onSubmit(value);
  };
  submit.addEventListener("click", submitCurrent);
  textarea.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submitCurrent();
    }
  });
  return {
    setBusy(nextBusy) {
      busy = nextBusy;
      submit.disabled = busy;
      textarea.disabled = busy;
    },
    setMode(nextMode) {
      mode = nextMode;
      setActiveMode();
    },
    getMode() {
      return mode;
    },
    clear() {
      textarea.value = "";
    },
    focus() {
      textarea.focus();
    }
  };
}

// src/ui/chat-panel.ts
function createChatPanel(container, options) {
  container.empty();
  const shell = container.createDiv({ cls: "ocw-shell" });
  const toolbar = shell.createDiv({ cls: "ocw-toolbar" });
  const titleEl = toolbar.createDiv({ text: "OpenClaw Workbench" });
  const metaEl = toolbar.createDiv({ cls: "ocw-toolbar-group" });
  const statusEl = shell.createDiv({ cls: "ocw-status", text: "Idle" });
  const contextEl = shell.createDiv({ cls: "ocw-context" });
  const messagesEl = shell.createDiv({ cls: "ocw-messages" });
  const composerRoot = shell.createDiv();
  const contextTitle = contextEl.createDiv({ cls: "ocw-context-title", text: "No context loaded" });
  const contextMeta = contextEl.createDiv({ cls: "ocw-context-meta", text: "Open a markdown note to begin." });
  const composer = createComposer(composerRoot, options);
  const writeBackLabel = metaEl.createDiv({ text: "Write-back:" });
  writeBackLabel.addClass("ocw-context-meta");
  const setContext = (context) => {
    contextTitle.setText(context.title || "Untitled note");
    const lines = [
      context.filePath ? context.filePath : "No file",
      context.selection ? `Selection: ${truncate(context.selection, 160)}` : "No selection",
      context.tags.length ? `Tags: ${context.tags.join(", ")}` : "Tags: none",
      context.links.length ? `Links: ${context.links.join(", ")}` : "Links: none",
      context.headings.length ? `Headings: ${context.headings.slice(0, 4).join(" / ")}` : "Headings: none"
    ];
    contextMeta.setText(lines.join(" | "));
  };
  const setMessages = (messages) => {
    renderMessages(messagesEl, messages);
  };
  const appendMessage = (message) => {
    messagesEl.appendChild(createMessageElement(message));
  };
  return {
    setContext,
    setMessages,
    appendMessage,
    setBusy: composer.setBusy,
    setStatus(text) {
      statusEl.setText(text);
    },
    setMode: composer.setMode,
    getMode: composer.getMode,
    clearComposer: composer.clear,
    focusComposer: composer.focus,
    destroy() {
      container.empty();
    }
  };
}

// src/patch/apply.ts
var import_obsidian5 = require("obsidian");
function createResultPath(folder, title) {
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  return (0, import_obsidian5.normalizePath)(`${folder}/${toSafeFileName(`${title} ${stamp}`)}.md`);
}
async function writeNewPage(app, folder, title, content) {
  await ensureFolder(app, folder);
  const path = createResultPath(folder, title);
  await app.vault.create(path, content);
  return path;
}
async function appendToFile(app, file, content) {
  const current = await app.vault.read(file);
  const next = current.trimEnd() ? `${current.trimEnd()}

${content.trim()}
` : `${content.trim()}
`;
  await app.vault.modify(file, next);
}
async function replaceSelection(app, content) {
  const view = app.workspace.getActiveViewOfType(import_obsidian5.MarkdownView);
  if (!view?.editor) {
    throw new Error("No markdown editor is active");
  }
  view.editor.replaceSelection(content);
}
async function applyWriteBack(app, context, mode, content, resultFolder) {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Cannot write back an empty response");
  }
  if (mode === "append") {
    const file = context.filePath ? app.vault.getAbstractFileByPath(context.filePath) : null;
    if (!file) {
      throw new Error("No active file available for append");
    }
    await appendToFile(app, file, trimmed);
    new import_obsidian5.Notice(`Appended response to ${file.path}`);
    return { mode, path: file.path, content: trimmed };
  }
  if (mode === "replace-selection") {
    await replaceSelection(app, trimmed);
    new import_obsidian5.Notice("Replaced the current selection");
    return { mode, path: context.filePath, content: trimmed };
  }
  const path = await writeNewPage(app, resultFolder, context.title || "OpenClaw Result", trimmed);
  new import_obsidian5.Notice(`Created result page: ${path}`);
  return { mode, path, content: trimmed };
}

// src/ui/chat-view.ts
var OBSIDIAN_AI_WORKBENCH_VIEW = "obsidian-ai-workbench-view";
var ChatView = class extends import_obsidian7.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.panel = null;
    this.messages = [];
    this.currentAssistantIndex = null;
  }
  getViewType() {
    return OBSIDIAN_AI_WORKBENCH_VIEW;
  }
  getDisplayText() {
    return "OpenClaw Workbench";
  }
  getIcon() {
    return "message-square";
  }
  async onOpen() {
    this.panel = createChatPanel(this.containerEl, {
      initialMode: this.plugin.settings.defaultWriteBackMode,
      onSubmit: (content) => {
        void this.handleSubmit(content);
      },
      onModeChange: (mode) => {
        this.plugin.settings.defaultWriteBackMode = mode;
        void this.plugin.saveSettings();
      }
    });
    this.refreshContext();
    this.panel.setMessages(this.messages);
    this.panel.setStatus(this.getStatusText());
    this.panel.focusComposer();
  }
  async onClose() {
    this.panel?.destroy();
    this.panel = null;
  }
  refreshContext() {
    const context = collectContext(this.app);
    this.panel?.setContext(context);
  }
  getStatusText() {
    const session = this.plugin.sessionManager.getActiveSession();
    return `Session ${session.id.slice(-6)} | ${session.mode} | ${session.messageCount} messages`;
  }
  ensureSession(title, mode) {
    const session = this.plugin.sessionManager.getActiveSession();
    if (session.title !== title || session.mode !== mode) {
      this.plugin.sessionManager.updateSession(session.id, {
        title,
        mode,
        lastContextTitle: title
      });
    }
  }
  pushMessage(role, content) {
    const message = {
      id: createId(role),
      role,
      content,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.messages.push(message);
    this.panel?.setMessages(this.messages);
    return message;
  }
  updateAssistantContent(index, nextContent) {
    const current = this.messages[index];
    if (!current) {
      return;
    }
    current.content = nextContent;
    this.panel?.setMessages(this.messages);
  }
  async handleSubmit(content) {
    const context = collectContext(this.app);
    const mode = this.panel?.getMode() ?? this.plugin.settings.defaultWriteBackMode;
    this.ensureSession(context.title, mode);
    const session = this.plugin.sessionManager.getActiveSession();
    this.plugin.sessionManager.updateSession(session.id, {
      lastContextTitle: context.title,
      mode,
      messageCount: session.messageCount + 2
    });
    this.panel?.setBusy(true);
    this.panel?.setStatus(`Sending to OpenClaw for ${mode}`);
    this.panel?.clearComposer();
    this.pushMessage("user", content);
    const assistant = this.pushMessage("assistant", "");
    this.currentAssistantIndex = this.messages.findIndex((item) => item.id === assistant.id);
    const request = {
      sessionId: session.id,
      mode,
      messages: this.messages.slice(0, -1).slice(-12),
      context
    };
    if (!this.plugin.client.isConfigured()) {
      this.updateAssistantContent(
        this.currentAssistantIndex ?? this.messages.length - 1,
        "Configure the OpenClaw endpoint in settings to enable streaming replies."
      );
      this.panel?.setBusy(false);
      this.panel?.setStatus("OpenClaw is not configured");
      return;
    }
    let accumulated = "";
    try {
      await this.plugin.client.streamChat(request, {
        onDelta: (delta) => {
          accumulated += delta;
          this.updateAssistantContent(this.currentAssistantIndex ?? this.messages.length - 1, accumulated);
        },
        onComplete: () => {
          this.panel?.setStatus(`Streaming finished | ${truncate(accumulated, 80)}`);
        },
        onError: (error) => {
          new import_obsidian7.Notice(error.message);
          this.panel?.setStatus(`Error: ${error.message}`);
        }
      });
      if (accumulated.trim()) {
        await applyWriteBack(this.app, context, mode, accumulated, this.plugin.settings.resultFolder);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.updateAssistantContent(
        this.currentAssistantIndex ?? this.messages.length - 1,
        message
      );
      this.panel?.setStatus(`OpenClaw failed: ${message}`);
    } finally {
      this.panel?.setBusy(false);
      this.panel?.setStatus(this.getStatusText());
      this.refreshContext();
    }
  }
};

// src/openclaw/client.ts
var import_node_http = require("node:http");
var import_node_https = require("node:https");
var import_node_stream = require("node:stream");
function joinUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
var OpenClawClient = class {
  constructor(config) {
    this.config = config;
  }
  isConfigured() {
    return Boolean(this.config.baseUrl.trim()) && Boolean(this.config.chatPath.trim()) && Boolean(this.config.model.trim());
  }
  async streamChat(request, handlers) {
    if (!this.isConfigured()) {
      throw new Error("OpenClaw endpoint is not configured");
    }
    const payload = this.toChatCompletionPayload(request);
    const response = await this.postJson(joinUrl(this.config.baseUrl, this.config.chatPath), payload);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`OpenClaw request failed (${response.status}): ${errorText || response.statusText}`);
    }
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => null);
      const content = extractCompletionText(data);
      if (content) {
        handlers.onDelta(content);
      }
      handlers.onEvent?.(data);
      handlers.onComplete?.();
      return;
    }
    if (!response.body) {
      handlers.onComplete?.();
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const text = line.trim();
        if (!text) {
          continue;
        }
        const data = text.startsWith("data:") ? text.slice(5).trim() : text;
        if (data === "[DONE]") {
          handlers.onComplete?.();
          return;
        }
        let parsed = data;
        if (looksLikeJson(data)) {
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
        }
        const delta = extractDelta(parsed);
        if (delta) {
          handlers.onDelta(delta);
        }
        handlers.onEvent?.(parsed);
      }
    }
    const tail = buffer.trim();
    if (tail) {
      const data = tail.startsWith("data:") ? tail.slice(5).trim() : tail;
      if (data !== "[DONE]") {
        let parsed = data;
        if (looksLikeJson(data)) {
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
        }
        const delta = extractDelta(parsed);
        if (delta) {
          handlers.onDelta(delta);
        }
        handlers.onEvent?.(parsed);
      }
    }
    handlers.onComplete?.();
  }
  async postJson(url, body) {
    const target = new URL(url);
    const requestImpl = target.protocol === "https:" ? import_node_https.request : import_node_http.request;
    return await new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        req.destroy(new Error(`OpenClaw request timed out after ${this.config.timeoutMs}ms`));
      }, this.config.timeoutMs);
      const req = requestImpl(
        target,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream, application/json",
            ...this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}
          }
        },
        (res) => {
          window.clearTimeout(timeoutId);
          const headers = new Headers();
          for (const [name, value] of Object.entries(res.headers)) {
            if (Array.isArray(value)) {
              for (const item of value) {
                headers.append(name, item);
              }
            } else if (typeof value === "string") {
              headers.append(name, value);
            }
          }
          const bodyStream = import_node_stream.Readable.toWeb(res);
          resolve(
            new Response(bodyStream, {
              status: res.statusCode ?? 500,
              statusText: res.statusMessage ?? "",
              headers
            })
          );
        }
      );
      req.on("error", (error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      });
      req.write(JSON.stringify(body));
      req.end();
    });
  }
  createFallbackEvent(message) {
    return { type: "message", role: "assistant", content: message };
  }
  toChatCompletionPayload(request) {
    const systemPrompt = [
      "You are the Obsidian side of an OpenClaw-powered AI workbench.",
      "Read the current note context carefully and help the user inside Obsidian.",
      `Write-back mode: ${request.mode}`,
      `Session ID: ${request.sessionId}`,
      `Context: ${JSON.stringify(request.context)}`
    ].join("\n");
    return {
      model: this.config.model,
      stream: true,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        ...request.messages.map((message) => ({
          role: message.role,
          content: message.content
        }))
      ]
    };
  }
};
function looksLikeJson(value) {
  return value.startsWith("{") || value.startsWith("[");
}
function extractDelta(payload) {
  if (typeof payload === "string") {
    return payload;
  }
  if (!payload || typeof payload !== "object") {
    return "";
  }
  const anyPayload = payload;
  if (typeof anyPayload.content === "string") {
    return anyPayload.content;
  }
  const choices = anyPayload.choices;
  const firstChoice = choices?.[0];
  if (!firstChoice) {
    return "";
  }
  const delta = firstChoice.delta;
  if (typeof delta?.content === "string") {
    return delta.content;
  }
  const message = firstChoice.message;
  if (typeof message?.content === "string") {
    return message.content;
  }
  return "";
}
function extractCompletionText(payload) {
  return extractDelta(payload);
}

// src/session/store.ts
function createEmptySessionStore() {
  return {
    activeSessionId: "",
    sessions: []
  };
}

// src/session/manager.ts
var SessionManager = class {
  constructor(loadStore, saveStore) {
    this.loadStore = loadStore;
    this.saveStore = saveStore;
    this.store = createEmptySessionStore();
  }
  async hydrate() {
    const raw = await this.loadStore();
    if (raw && typeof raw === "object" && "sessions" in raw && "activeSessionId" in raw) {
      this.store = raw;
      return;
    }
    this.store = createEmptySessionStore();
  }
  getActiveSession() {
    const existing = this.store.sessions.find((session) => session.id === this.store.activeSessionId);
    if (existing) {
      return existing;
    }
    return this.createSession("OpenClaw Chat", "append", "No context yet");
  }
  createSession(title, mode, lastContextTitle) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const session = {
      id: createId("session"),
      title,
      mode,
      createdAt: now,
      updatedAt: now,
      lastContextTitle,
      messageCount: 0
    };
    this.store.sessions.unshift(session);
    this.store.activeSessionId = session.id;
    void this.persist();
    return session;
  }
  updateSession(sessionId, patch) {
    const session = this.store.sessions.find((entry) => entry.id === sessionId);
    if (!session) {
      throw new Error(`Unknown session: ${sessionId}`);
    }
    Object.assign(session, patch, {
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    void this.persist();
    return session;
  }
  setActiveSession(sessionId) {
    this.store.activeSessionId = sessionId;
    void this.persist();
  }
  listSessions() {
    return [...this.store.sessions];
  }
  async persist() {
    await this.saveStore(this.store);
  }
};

// src/main.ts
var DEFAULT_SETTINGS = {
  openClawBaseUrl: "http://127.0.0.1:18789",
  openClawChatPath: "/v1/chat/completions",
  openClawApiKey: "",
  openClawModel: "openclaw/default",
  defaultWriteBackMode: "append",
  resultFolder: "OpenClaw Results",
  sessionPrefix: "ocw",
  streamTimeoutMs: 12e4
};
var ObsidianAiWorkbenchPlugin = class extends import_obsidian8.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.client = new OpenClawClient({
      baseUrl: "",
      chatPath: "/v1/chat/completions",
      apiKey: "",
      model: "openclaw/default",
      timeoutMs: DEFAULT_SETTINGS.streamTimeoutMs
    });
    this.sessionManager = new SessionManager(
      async () => (await this.loadData())?.sessions ?? createEmptySessionStore(),
      async (store) => {
        const data = await this.loadData() ?? {};
        await this.saveData({
          ...data,
          sessions: store
        });
      }
    );
  }
  async onload() {
    await this.loadSettings();
    await this.sessionManager.hydrate();
    this.registerView(
      OBSIDIAN_AI_WORKBENCH_VIEW,
      (leaf) => new ChatView(leaf, this)
    );
    this.addRibbonIcon("message-square", "OpenClaw Workbench", () => {
      void this.activateView();
    });
    this.addCommand({
      id: "open-workbench",
      name: "Open OpenClaw Workbench",
      callback: () => {
        void this.activateView();
      }
    });
    this.addSettingTab(new WorkbenchSettingTab(this.app, this));
    this.registerEvent(
      this.app.workspace.on("file-open", () => {
        this.app.workspace.getLeavesOfType(OBSIDIAN_AI_WORKBENCH_VIEW).forEach((leaf) => {
          const view = leaf.view;
          if (view instanceof ChatView) {
            view.refreshContext();
          }
        });
      })
    );
  }
  onunload() {
    this.app.workspace.getLeavesOfType(OBSIDIAN_AI_WORKBENCH_VIEW).forEach((leaf) => leaf.detach());
  }
  async loadSettings() {
    const data = await this.loadData();
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...data?.settings ?? {}
    };
    this.syncClient();
  }
  async saveSettings() {
    await this.saveData({
      ...await this.loadData() ?? {},
      settings: this.settings
    });
    this.syncClient();
  }
  syncClient() {
    this.client = new OpenClawClient({
      baseUrl: this.settings.openClawBaseUrl,
      chatPath: this.settings.openClawChatPath,
      apiKey: this.settings.openClawApiKey,
      model: this.settings.openClawModel,
      timeoutMs: this.settings.streamTimeoutMs
    });
  }
  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(OBSIDIAN_AI_WORKBENCH_VIEW)[0];
    if (existing) {
      await existing.setViewState({
        type: OBSIDIAN_AI_WORKBENCH_VIEW,
        active: true
      });
      this.app.workspace.revealLeaf(existing);
      return;
    }
    const leaf = await this.app.workspace.ensureSideLeaf(OBSIDIAN_AI_WORKBENCH_VIEW, "right", {
      active: true,
      split: true,
      reveal: true
    });
    await leaf.setViewState({
      type: OBSIDIAN_AI_WORKBENCH_VIEW,
      active: true
    });
    this.app.workspace.revealLeaf(leaf);
  }
};
var main_default = ObsidianAiWorkbenchPlugin;
