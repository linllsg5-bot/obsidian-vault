import { OpenClawChatRequest, OpenClawTransportConfig, OpenClawStreamEvent, StreamHandlers } from "./types";
import { ConversationMessage } from "../types";

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export class OpenClawClient {
  constructor(private readonly config: OpenClawTransportConfig) {}

  isConfigured(): boolean {
    return Boolean(this.config.baseUrl.trim()) && Boolean(this.config.chatPath.trim()) && Boolean(this.config.model.trim());
  }

  async streamChat(request: OpenClawChatRequest, handlers: StreamHandlers): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error("OpenClaw endpoint is not configured");
    }

    const payload = this.toChatCompletionPayload(request);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), this.config.timeoutMs);

    let response: Response;
    try {
      response = await fetch(joinUrl(this.config.baseUrl, this.config.chatPath), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey ? { Authorization: `Bearer ${this.config.apiKey}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Error(`OpenClaw request timed out after ${this.config.timeoutMs}ms`);
      }
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`OpenClaw request failed (${response.status}): ${errorText || response.statusText}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => null);
      const content = extractCompletionText(data);
      if (content) {
        handlers.onDelta(content);
      }
      handlers.onEvent?.(data as OpenClawStreamEvent);
      handlers.onComplete?.();
      return;
    }

    if (!response.body) {
      handlers.onComplete?.();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const text = line.trim();
        if (!text) {
          continue;
        }

        const data = text.startsWith("data:") ? text.slice(5).trim() : text;
        if (data === "[DONE]") {
          handlers.onComplete?.();
          return;
        }

        let parsed: unknown = data;
        if (looksLikeJson(data)) {
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
        }

        const delta = extractDelta(parsed);
        if (delta) {
          handlers.onDelta(delta);
        }
        handlers.onEvent?.(parsed as OpenClawStreamEvent);
      }
    }

    const tail = buffer.trim();
    if (tail) {
      const data = tail.startsWith("data:") ? tail.slice(5).trim() : tail;
      if (data !== "[DONE]") {
        let parsed: unknown = data;
        if (looksLikeJson(data)) {
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
        }
        const delta = extractDelta(parsed);
        if (delta) {
          handlers.onDelta(delta);
        }
        handlers.onEvent?.(parsed as OpenClawStreamEvent);
      }
    }

    handlers.onComplete?.();
  }

  createFallbackEvent(message: string): OpenClawStreamEvent {
    return { type: "message", role: "assistant", content: message };
  }

  private toChatCompletionPayload(request: OpenClawChatRequest): {
    model: string;
    messages: Array<{ role: ConversationMessage["role"]; content: string }>;
    stream: boolean;
    temperature: number;
  } {
    const systemPrompt = [
      "You are the Obsidian side of an OpenClaw-powered AI workbench.",
      "Read the current note context carefully and help the user inside Obsidian.",
      `Write-back mode: ${request.mode}`,
      `Session ID: ${request.sessionId}`,
      `Context: ${JSON.stringify(request.context)}`,
    ].join("\n");

    return {
      model: this.config.model,
      stream: true,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        ...request.messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    };
  }
}

function looksLikeJson(value: string): boolean {
  return value.startsWith("{") || value.startsWith("[");
}

function extractDelta(payload: unknown): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return "";
  }

  const anyPayload = payload as Record<string, unknown>;

  if (typeof anyPayload.content === "string") {
    return anyPayload.content;
  }

  const choices = anyPayload.choices as Array<Record<string, unknown>> | undefined;
  const firstChoice = choices?.[0];
  if (!firstChoice) {
    return "";
  }

  const delta = firstChoice.delta as Record<string, unknown> | undefined;
  if (typeof delta?.content === "string") {
    return delta.content;
  }

  const message = firstChoice.message as Record<string, unknown> | undefined;
  if (typeof message?.content === "string") {
    return message.content;
  }

  return "";
}

function extractCompletionText(payload: unknown): string {
  return extractDelta(payload);
}
