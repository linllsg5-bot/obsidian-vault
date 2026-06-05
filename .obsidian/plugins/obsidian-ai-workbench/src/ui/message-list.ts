import { ConversationMessage } from "../types";
import { truncate } from "../utils/text";

export function renderMessages(container: HTMLElement, messages: ConversationMessage[]): void {
  container.innerHTML = "";

  for (const message of messages) {
    container.appendChild(createMessageElement(message));
  }
}

export function createMessageElement(message: ConversationMessage): HTMLElement {
  const item = document.createElement("div");
  item.className = "ocw-message";
  item.dataset.role = message.role;

  const meta = document.createElement("div");
  meta.className = "ocw-message-meta";
  meta.appendChild(textSpan(message.role));
  meta.appendChild(textSpan(new Date(message.createdAt).toLocaleTimeString()));
  item.appendChild(meta);

  const body = document.createElement("div");
  body.textContent = truncate(message.content, 2000);
  item.appendChild(body);

  return item;
}

function textSpan(text: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}
