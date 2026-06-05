import { CachedMetadata, TFile } from "obsidian";
import { joinNonEmpty } from "../utils/text";

export function collectTags(metadata: CachedMetadata | null): string[] {
  const tags = new Set<string>();
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

export function collectLinks(metadata: CachedMetadata | null): string[] {
  return [...new Set((metadata?.links ?? []).map((link) => link.link).filter(Boolean))];
}

export function collectHeadings(metadata: CachedMetadata | null): string[] {
  return (metadata?.headings ?? []).map((heading) => heading.heading).filter(Boolean);
}

export function buildExcerpt(file: TFile | null, metadata: CachedMetadata | null): string {
  const headings = collectHeadings(metadata).slice(0, 3);
  const tags = collectTags(metadata).slice(0, 5);
  return joinNonEmpty([file?.path ?? null, headings.join(" / ") || null, tags.length ? `#${tags.join(" #")}` : null]);
}
