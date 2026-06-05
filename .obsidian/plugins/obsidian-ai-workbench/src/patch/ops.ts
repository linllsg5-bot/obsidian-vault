import { WriteBackMode } from "../types";

export function getWriteBackVerb(mode: WriteBackMode): string {
  switch (mode) {
    case "append":
      return "append";
    case "replace-selection":
      return "replace";
    case "new-page":
      return "write";
  }
}
