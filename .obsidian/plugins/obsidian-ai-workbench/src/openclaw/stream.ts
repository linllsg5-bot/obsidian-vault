import { OpenClawStreamEvent, StreamHandlers } from "./types";

function parseLine(line: string): OpenClawStreamEvent | null {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("data:")) {
    const data = trimmed.slice(5).trim();
    if (data === "[DONE]") {
      return { type: "done" };
    }
    try {
      const parsed = JSON.parse(data) as OpenClawStreamEvent;
      return parsed;
    } catch {
      return { type: "delta", content: data };
    }
  }

  try {
    return JSON.parse(trimmed) as OpenClawStreamEvent;
  } catch {
    return { type: "delta", content: trimmed };
  }
}

export async function consumeStream(response: Response, handlers: StreamHandlers): Promise<void> {
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
      const event = parseLine(line);
      if (!event) {
        continue;
      }
      handlers.onEvent?.(event);
      if (event.type === "delta") {
        handlers.onDelta(event.content);
      } else if (event.type === "error") {
        handlers.onError?.(new Error(event.message));
      } else if (event.type === "done") {
        handlers.onComplete?.();
      }
    }
  }

  const tail = buffer.trim();
  if (tail) {
    const event = parseLine(tail);
    if (event) {
      handlers.onEvent?.(event);
      if (event.type === "delta") {
        handlers.onDelta(event.content);
      } else if (event.type === "error") {
        handlers.onError?.(new Error(event.message));
      }
    }
  }

  handlers.onComplete?.();
}
