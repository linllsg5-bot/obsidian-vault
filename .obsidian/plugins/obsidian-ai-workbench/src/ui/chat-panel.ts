import { CapturedContext, ConversationMessage, WriteBackMode } from "../types";
import { createMessageElement, renderMessages } from "./message-list";
import { createComposer, ComposerHandle } from "./composer";
import { truncate } from "../utils/text";

export interface ChatPanelHandle {
  setContext: (context: CapturedContext) => void;
  setMessages: (messages: ConversationMessage[]) => void;
  appendMessage: (message: ConversationMessage) => void;
  setBusy: (busy: boolean) => void;
  setStatus: (text: string) => void;
  setMode: (mode: WriteBackMode) => void;
  getMode: () => WriteBackMode;
  clearComposer: () => void;
  focusComposer: () => void;
  destroy: () => void;
}

export function createChatPanel(container: HTMLElement, options: {
  initialMode: WriteBackMode;
  onSubmit: (content: string) => void;
  onModeChange: (mode: WriteBackMode) => void;
}): ChatPanelHandle {
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

  const composer: ComposerHandle = createComposer(composerRoot, options);

  const writeBackLabel = metaEl.createDiv({ text: "Write-back:" });
  writeBackLabel.addClass("ocw-context-meta");

  const setContext = (context: CapturedContext): void => {
    contextTitle.setText(context.title || "Untitled note");
    const lines = [
      context.filePath ? context.filePath : "No file",
      context.selection ? `Selection: ${truncate(context.selection, 160)}` : "No selection",
      context.tags.length ? `Tags: ${context.tags.join(", ")}` : "Tags: none",
      context.links.length ? `Links: ${context.links.join(", ")}` : "Links: none",
      context.headings.length ? `Headings: ${context.headings.slice(0, 4).join(" / ")}` : "Headings: none",
    ];
    contextMeta.setText(lines.join(" | "));
  };

  const setMessages = (messages: ConversationMessage[]): void => {
    renderMessages(messagesEl, messages);
  };

  const appendMessage = (message: ConversationMessage): void => {
    messagesEl.appendChild(createMessageElement(message));
  };

  return {
    setContext,
    setMessages,
    appendMessage,
    setBusy: composer.setBusy,
    setStatus(text: string) {
      statusEl.setText(text);
    },
    setMode: composer.setMode,
    getMode: composer.getMode,
    clearComposer: composer.clear,
    focusComposer: composer.focus,
    destroy() {
      container.empty();
    },
  };
}
