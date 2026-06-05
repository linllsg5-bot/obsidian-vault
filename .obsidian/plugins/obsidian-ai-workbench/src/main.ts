import { Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { WorkbenchSettingTab } from "./settings";
import { ChatView, OBSIDIAN_AI_WORKBENCH_VIEW } from "./ui/chat-view";
import { OpenClawClient } from "./openclaw/client";
import { SessionManager } from "./session/manager";
import { PersistedSessionStore, createEmptySessionStore } from "./session/store";
import { WorkbenchSettings } from "./types";

interface WorkbenchData {
  settings?: WorkbenchSettings;
  sessions?: PersistedSessionStore;
}

export const DEFAULT_SETTINGS: WorkbenchSettings = {
  openClawBaseUrl: "http://127.0.0.1:8317",
  openClawChatPath: "/v1/chat/completions",
  openClawApiKey: "",
  openClawModel: "codex/gpt-5.5",
  defaultWriteBackMode: "append",
  resultFolder: "OpenClaw Results",
  sessionPrefix: "ocw",
  streamTimeoutMs: 120000,
};

export class ObsidianAiWorkbenchPlugin extends Plugin {
  settings: WorkbenchSettings = DEFAULT_SETTINGS;
  client = new OpenClawClient({
    baseUrl: "",
    chatPath: "/v1/chat/completions",
    apiKey: "",
    model: "codex/gpt-5.5",
    timeoutMs: DEFAULT_SETTINGS.streamTimeoutMs,
  });
  sessionManager = new SessionManager(
    async () => ((await this.loadData()) as WorkbenchData | null)?.sessions ?? createEmptySessionStore(),
    async (store) => {
      const data = ((await this.loadData()) as WorkbenchData | null) ?? {};
      await this.saveData({
        ...data,
        sessions: store,
      });
    },
  );

  async onload(): Promise<void> {
    await this.loadSettings();
    await this.sessionManager.hydrate();

    this.registerView(
      OBSIDIAN_AI_WORKBENCH_VIEW,
      (leaf: WorkspaceLeaf) => new ChatView(leaf, this),
    );

    this.addRibbonIcon("message-square", "OpenClaw Workbench", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open-workbench",
      name: "Open OpenClaw Workbench",
      callback: () => {
        void this.activateView();
      },
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
      }),
    );
  }

  onunload(): void {
    this.app.workspace.getLeavesOfType(OBSIDIAN_AI_WORKBENCH_VIEW).forEach((leaf) => leaf.detach());
  }

  async loadSettings(): Promise<void> {
    const data = (await this.loadData()) as WorkbenchData | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(data?.settings ?? {}),
    };
    this.syncClient();
  }

  async saveSettings(): Promise<void> {
    await this.saveData({
      ...(((await this.loadData()) as WorkbenchData | null) ?? {}),
      settings: this.settings,
    });
    this.syncClient();
  }

  syncClient(): void {
    this.client = new OpenClawClient({
      baseUrl: this.settings.openClawBaseUrl,
      chatPath: this.settings.openClawChatPath,
      apiKey: this.settings.openClawApiKey,
      model: this.settings.openClawModel,
      timeoutMs: this.settings.streamTimeoutMs,
    });
  }

  private async activateView(): Promise<void> {
    const leaf = this.app.workspace.getLeavesOfType(OBSIDIAN_AI_WORKBENCH_VIEW)[0]
      ?? this.app.workspace.getRightLeaf(false);

    if (!leaf) {
      new Notice("Could not open the workbench");
      return;
    }

    await leaf.setViewState({
      type: OBSIDIAN_AI_WORKBENCH_VIEW,
      active: true,
    });

    this.app.workspace.revealLeaf(leaf);
  }
}

export default ObsidianAiWorkbenchPlugin;
