import { ItemView, WorkspaceLeaf, Notice } from "obsidian";
import { ObsidianAiWorkbenchPlugin } from "../main";
import { collectContext } from "../context/collector";
import { createId, truncate } from "../utils/text";
import { createChatPanel, ChatPanelHandle } from "./chat-panel";
import { ConversationMessage, WriteBackMode } from "../types";
import { applyWriteBack } from "../patch/apply";

export const OBSIDIAN_AI_WORKBENCH_VIEW = "obsidian-ai-workbench-view";

export class ChatView extends ItemView {
  private panel: ChatPanelHandle | null = null;
  private messages: ConversationMessage[] = [];
  private currentAssistantIndex: number | null = null;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly plugin: ObsidianAiWorkbenchPlugin,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return OBSIDIAN_AI_WORKBENCH_VIEW;
  }

  getDisplayText(): string {
    return "OpenClaw Workbench";
  }

  getIcon(): string {
    return "message-square";
  }

  async onOpen(): Promise<void> {
    this.panel = createChatPanel(this.containerEl, {
      initialMode: this.plugin.settings.defaultWriteBackMode,
      onSubmit: (content) => {
        void this.handleSubmit(content);
      },
      onModeChange: (mode) => {
        this.plugin.settings.defaultWriteBackMode = mode;
        void this.plugin.saveSettings();
      },
    });

    this.refreshContext();
    this.panel.setMessages(this.messages);
    this.panel.setStatus(this.getStatusText());
    this.panel.focusComposer();
  }

  async onClose(): Promise<void> {
    this.panel?.destroy();
    this.panel = null;
  }

  refreshContext(): void {
    const context = collectContext(this.app);
    this.panel?.setContext(context);
  }

  private getStatusText(): string {
    const session = this.plugin.sessionManager.getActiveSession();
    return `Session ${session.id.slice(-6)} | ${session.mode} | ${session.messageCount} messages`;
  }

  private ensureSession(title: string, mode: WriteBackMode): void {
    const session = this.plugin.sessionManager.getActiveSession();
    if (session.title !== title || session.mode !== mode) {
      this.plugin.sessionManager.updateSession(session.id, {
        title,
        mode,
        lastContextTitle: title,
      });
    }
  }

  private pushMessage(role: ConversationMessage["role"], content: string): ConversationMessage {
    const message: ConversationMessage = {
      id: createId(role),
      role,
      content,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(message);
    this.panel?.setMessages(this.messages);
    return message;
  }

  private updateAssistantContent(index: number, nextContent: string): void {
    const current = this.messages[index];
    if (!current) {
      return;
    }
    current.content = nextContent;
    this.panel?.setMessages(this.messages);
  }

  private async handleSubmit(content: string): Promise<void> {
    const context = collectContext(this.app);
    const mode = this.panel?.getMode() ?? this.plugin.settings.defaultWriteBackMode;
    this.ensureSession(context.title, mode);

    const session = this.plugin.sessionManager.getActiveSession();
    this.plugin.sessionManager.updateSession(session.id, {
      lastContextTitle: context.title,
      mode,
      messageCount: session.messageCount + 2,
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
      context,
    };

    if (!this.plugin.client.isConfigured()) {
      this.updateAssistantContent(
        this.currentAssistantIndex ?? this.messages.length - 1,
        "Configure the OpenClaw endpoint in settings to enable streaming replies.",
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
          new Notice(error.message);
          this.panel?.setStatus(`Error: ${error.message}`);
        },
      });

      if (accumulated.trim()) {
        await applyWriteBack(this.app, context, mode, accumulated, this.plugin.settings.resultFolder);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.updateAssistantContent(
        this.currentAssistantIndex ?? this.messages.length - 1,
        message,
      );
      this.panel?.setStatus(`OpenClaw failed: ${message}`);
    } finally {
      this.panel?.setBusy(false);
      this.panel?.setStatus(this.getStatusText());
      this.refreshContext();
    }
  }
}
