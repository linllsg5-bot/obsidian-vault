import { App, MarkdownView, Notice, TFile, normalizePath } from "obsidian";
import { CapturedContext, WriteBackMode, WriteBackResult } from "../types";
import { ensureFolder } from "../utils/obsidian";
import { toSafeFileName } from "../utils/text";

function createResultPath(folder: string, title: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return normalizePath(`${folder}/${toSafeFileName(`${title} ${stamp}`)}.md`);
}

async function writeNewPage(app: App, folder: string, title: string, content: string): Promise<string> {
  await ensureFolder(app, folder);
  const path = createResultPath(folder, title);
  await app.vault.create(path, content);
  return path;
}

async function appendToFile(app: App, file: TFile, content: string): Promise<void> {
  const current = await app.vault.read(file);
  const next = current.trimEnd() ? `${current.trimEnd()}\n\n${content.trim()}\n` : `${content.trim()}\n`;
  await app.vault.modify(file, next);
}

async function replaceSelection(app: App, content: string): Promise<void> {
  const view = app.workspace.getActiveViewOfType(MarkdownView);
  if (!view?.editor) {
    throw new Error("No markdown editor is active");
  }
  view.editor.replaceSelection(content);
}

export async function applyWriteBack(
  app: App,
  context: CapturedContext,
  mode: WriteBackMode,
  content: string,
  resultFolder: string,
): Promise<WriteBackResult> {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Cannot write back an empty response");
  }

  if (mode === "append") {
    const file = context.filePath ? (app.vault.getAbstractFileByPath(context.filePath) as TFile | null) : null;
    if (!file) {
      throw new Error("No active file available for append");
    }
    await appendToFile(app, file, trimmed);
    new Notice(`Appended response to ${file.path}`);
    return { mode, path: file.path, content: trimmed };
  }

  if (mode === "replace-selection") {
    await replaceSelection(app, trimmed);
    new Notice("Replaced the current selection");
    return { mode, path: context.filePath, content: trimmed };
  }

  const path = await writeNewPage(app, resultFolder, context.title || "OpenClaw Result", trimmed);
  new Notice(`Created result page: ${path}`);
  return { mode, path, content: trimmed };
}
