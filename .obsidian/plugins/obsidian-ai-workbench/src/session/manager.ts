import { createId } from "../utils/text";
import { PersistedSessionStore, createEmptySessionStore } from "./store";
import { SessionState, WriteBackMode } from "../types";

export class SessionManager {
  private store: PersistedSessionStore = createEmptySessionStore();

  constructor(
    private readonly loadStore: () => Promise<unknown>,
    private readonly saveStore: (store: PersistedSessionStore) => Promise<void>,
  ) {}

  async hydrate(): Promise<void> {
    const raw = await this.loadStore();
    if (raw && typeof raw === "object" && "sessions" in raw && "activeSessionId" in raw) {
      this.store = raw as PersistedSessionStore;
      return;
    }
    this.store = createEmptySessionStore();
  }

  getActiveSession(): SessionState {
    const existing = this.store.sessions.find((session) => session.id === this.store.activeSessionId);
    if (existing) {
      return existing;
    }
    return this.createSession("OpenClaw Chat", "append", "No context yet");
  }

  createSession(title: string, mode: WriteBackMode, lastContextTitle: string): SessionState {
    const now = new Date().toISOString();
    const session: SessionState = {
      id: createId("session"),
      title,
      mode,
      createdAt: now,
      updatedAt: now,
      lastContextTitle,
      messageCount: 0,
    };

    this.store.sessions.unshift(session);
    this.store.activeSessionId = session.id;
    void this.persist();
    return session;
  }

  updateSession(sessionId: string, patch: Partial<SessionState>): SessionState {
    const session = this.store.sessions.find((entry) => entry.id === sessionId);
    if (!session) {
      throw new Error(`Unknown session: ${sessionId}`);
    }

    Object.assign(session, patch, {
      updatedAt: new Date().toISOString(),
    });
    void this.persist();
    return session;
  }

  setActiveSession(sessionId: string): void {
    this.store.activeSessionId = sessionId;
    void this.persist();
  }

  listSessions(): SessionState[] {
    return [...this.store.sessions];
  }

  private async persist(): Promise<void> {
    await this.saveStore(this.store);
  }
}
