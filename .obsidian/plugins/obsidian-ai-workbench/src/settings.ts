import { App, PluginSettingTab, Setting } from "obsidian";
import { ObsidianAiWorkbenchPlugin } from "./main";
import { WriteBackMode } from "./types";

function addModeSelect(setting: Setting, value: WriteBackMode, onChange: (mode: WriteBackMode) => void): void {
  setting.addDropdown((dropdown) => {
    dropdown
      .addOption("append", "Append")
      .addOption("replace-selection", "Replace selection")
      .addOption("new-page", "New page")
      .setValue(value)
      .onChange((nextValue) => {
        onChange(nextValue as WriteBackMode);
      });
  });
}

export class WorkbenchSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: ObsidianAiWorkbenchPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "OpenClaw Workbench" });

    new Setting(containerEl)
      .setName("OpenClaw base URL")
      .setDesc("Base URL for the local OpenClaw service.")
      .addText((text) =>
        text
          .setPlaceholder("http://127.0.0.1:3000")
          .setValue(this.plugin.settings.openClawBaseUrl)
          .onChange(async (value) => {
            this.plugin.settings.openClawBaseUrl = value.trim();
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Chat path")
      .setDesc("Relative path used for chat requests.")
      .addText((text) =>
        text
          .setPlaceholder("/chat")
          .setValue(this.plugin.settings.openClawChatPath)
          .onChange(async (value) => {
            this.plugin.settings.openClawChatPath = value.trim();
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("OpenClaw API key")
      .setDesc("Optional bearer token for local auth.")
      .addText((text) =>
        text
          .setPlaceholder("optional")
          .setValue(this.plugin.settings.openClawApiKey)
          .onChange(async (value) => {
            this.plugin.settings.openClawApiKey = value.trim();
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Model")
      .setDesc("Model name sent to the OpenClaw proxy.")
      .addText((text) =>
        text
          .setPlaceholder("codex/gpt-5.5")
          .setValue(this.plugin.settings.openClawModel)
          .onChange(async (value) => {
            this.plugin.settings.openClawModel = value.trim();
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Result folder")
      .setDesc("Folder used when creating new result pages.")
      .addText((text) =>
        text
          .setPlaceholder("OpenClaw Results")
          .setValue(this.plugin.settings.resultFolder)
          .onChange(async (value) => {
            this.plugin.settings.resultFolder = value.trim();
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Stream timeout")
      .setDesc("Timeout in milliseconds for streaming responses.")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.streamTimeoutMs))
          .onChange(async (value) => {
            const next = Number(value);
            if (!Number.isNaN(next) && next > 0) {
              this.plugin.settings.streamTimeoutMs = next;
              await this.plugin.saveSettings();
            }
          }),
      );

    new Setting(containerEl)
      .setName("Default write-back mode")
      .setDesc("Default destination for assistant output.")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("append", "Append")
          .addOption("replace-selection", "Replace selection")
          .addOption("new-page", "New page")
          .setValue(this.plugin.settings.defaultWriteBackMode)
          .onChange(async (value) => {
            this.plugin.settings.defaultWriteBackMode = value as WriteBackMode;
            await this.plugin.saveSettings();
          }),
      );
  }
}
