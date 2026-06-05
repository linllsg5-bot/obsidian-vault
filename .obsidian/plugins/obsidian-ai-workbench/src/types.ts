export type WriteBackMode = "append" | "replace-selection" | "new-page";

export interface WorkbenchSettings {
  openClawBaseUrl: string;
  openClawChatPath: string;
  openClawApiKey: string;
  openClawModel: string;
  defaultWriteBackMode: WriteBackMode;
  resultFolder: string;
  sessionPrefix: string;
  streamTimeoutMs: number;
}

export interface ConversationMessage {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface CapturedContext {
  title: string;
  filePath: string | null;
  selection: string;
  tags: string[];
  links: string[];
  headings: string[];
  excerpt: string;
}

export interface OpenClawChatRequest {
  sessionId: string;
  mode: WriteBackMode;
  messages: ConversationMessage[];
  context: CapturedContext;
}

export interface WriteBackResult {
  mode: WriteBackMode;
  path: string | null;
  content: string;
}

export interface SessionState {
  id: string;
  title: string;
  mode: WriteBackMode;
  createdAt: string;
  updatedAt: string;
  lastContextTitle: string;
  messageCount: number;
}
