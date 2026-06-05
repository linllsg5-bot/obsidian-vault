import { App, MarkdownView, TAbstractFile, TFile, TFolder, normalizePath } from "obsidian";

export function getActiveMarkdownView(app: App): MarkdownView | null {
  const view = app.workspace.getActiveViewOfType(MarkdownView);
  return view ?? null;
}

export function getActiveFile(app: App): TFile | null {
  const file = app.workspace.getActiveFile();
  return file instanceof TFile ? file : null;
}

export function isFile(value: TAbstractFile | null | undefined): value is TFile {
  return value instanceof TFile;
}

export async function ensureFolder(app: App, folderPath: string): Promise<void> {
  const normalized = normalizePath(folderPath);
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
    } else if (!(existing instanceof TFolder)) {
      throw new Error(`Path exists but is not a folder: ${current}`);
    }
  }
}

export function stripMarkdownExtension(path: string): string {
  return path.replace(/\.md$/i, "");
}
