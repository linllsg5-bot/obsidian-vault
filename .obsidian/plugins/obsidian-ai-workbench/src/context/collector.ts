import { App } from "obsidian";
import { CapturedContext } from "../types";
import { getActiveFile, getTitle } from "./active-note";
import { buildExcerpt, collectHeadings, collectLinks, collectTags } from "./metadata";
import { getSelection } from "./selection";
import { truncate } from "../utils/text";
import { getActiveMarkdownView } from "../utils/obsidian";

export function collectContext(app: App): CapturedContext {
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
    excerpt: truncate(buildExcerpt(file, metadata), 240),
  };
}
