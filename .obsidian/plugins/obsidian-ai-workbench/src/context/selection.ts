import { MarkdownView } from "obsidian";

export function getSelection(view: MarkdownView | null): string {
  if (!view?.editor) {
    return "";
  }
  return view.editor.getSelection().trim();
}
