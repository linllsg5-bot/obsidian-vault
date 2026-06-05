import { App, TFile } from "obsidian";

export function getActiveFile(app: App): TFile | null {
  const file = app.workspace.getActiveFile();
  return file instanceof TFile ? file : null;
}

export function getTitle(file: TFile | null): string {
  return file?.basename ?? "Untitled";
}
