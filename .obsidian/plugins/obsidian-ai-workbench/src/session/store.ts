import { SessionState } from "../types";

export interface PersistedSessionStore {
  activeSessionId: string;
  sessions: SessionState[];
}

export function createEmptySessionStore(): PersistedSessionStore {
  return {
    activeSessionId: "",
    sessions: [],
  };
}
