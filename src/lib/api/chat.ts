import { apiFetch, getSessionId } from "./client";
import { readSse } from "./sse";

export interface ChatHistoryTurn {
  role: "user" | "assistant";
  content: string;
}

interface StreamChatOptions {
  history?: ChatHistoryTurn[];
  conversationId?: string | null;
  onDelta: (delta: string) => void;
  onConversationId?: (conversationId: string) => void;
  onSuggestions?: (suggestions: string[]) => void;
  signal?: AbortSignal;
}

export const streamChatMessage = async (
  message: string,
  options: StreamChatOptions,
): Promise<void> => {
  const { history, conversationId, onDelta, onConversationId, onSuggestions, signal } =
    options;

  const res = await apiFetch("/api/coach/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      session_id: getSessionId(),
      history: history ?? [],
      conversation_id: conversationId ?? null,
    }),
    signal,
  });

  for await (const { event, data } of readSse(res)) {
    switch (event) {
      case "done":
        return;
      case "error": {
        const parsed: { detail?: string; message?: string } = JSON.parse(data);
        throw new Error(parsed.detail ?? parsed.message ?? "Stream error");
      }
      case "conversation": {
        const parsed: { conversation_id?: string } = JSON.parse(data);
        if (parsed.conversation_id) onConversationId?.(parsed.conversation_id);
        break;
      }
      case "suggestions": {
        const parsed: { suggestions?: string[] } = JSON.parse(data);
        if (parsed.suggestions) onSuggestions?.(parsed.suggestions);
        break;
      }
      default: {
        const parsed: { delta?: string } = JSON.parse(data);
        if (parsed.delta) onDelta(parsed.delta);
      }
    }
  }
};
