import { CapturedContext, ConversationMessage, WriteBackMode } from "../types";

export interface OpenClawTransportConfig {
  baseUrl: string;
  chatPath: string;
  apiKey: string;
  model: string;
  timeoutMs: number;
}

export interface StreamHandlers {
  onDelta: (delta: string) => void;
  onEvent?: (event: unknown) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export interface OpenClawChatRequest {
  sessionId: string;
  mode: WriteBackMode;
  messages: ConversationMessage[];
  context: CapturedContext;
}

export type OpenClawStreamEvent =
  | { type: "delta"; content: string }
  | { type: "message"; role: "assistant" | "system"; content: string }
  | { type: "done" }
  | { type: "error"; message: string };
