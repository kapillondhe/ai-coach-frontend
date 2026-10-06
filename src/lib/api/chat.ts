import { apiFetch, getSessionId } from "./client";
import { readSse } from "./sse";

export interface ChatHistoryTurn {
  role: "user" | "assistant";
  content: string;
}

// Mirror the backend's ChatRequest limits in app/api/routes/coach.py
// (_MAX_MESSAGE_CHARS / _MAX_HISTORY_TURNS / _MAX_HISTORY_TURN_CHARS).
export const MAX_MESSAGE_CHARS = 4000;
export const MAX_HISTORY_TURNS = 50;
export const MAX_HISTORY_TURN_CHARS = 8000;

// Only sent for anonymous users (signed-in users send `conversation_id` and
// the server loads their history instead). Keeps the last MAX_HISTORY_TURNS
// turns, trimmed so the window starts on a "user" turn (so the model never
// sees a dangling assistant reply first), with each turn's content capped
// and any non-user/assistant or empty-placeholder turns dropped.
export const boundHistoryForAnonymous = (
  history: ChatHistoryTurn[],
): ChatHistoryTurn[] => {
  const usable = history.filter(
    (turn) =>
      (turn.role === "user" || turn.role === "assistant") &&
      turn.content.length > 0,
  );
  let windowed = usable.slice(-MAX_HISTORY_TURNS);
  if (windowed.length > 0 && windowed[0].role !== "user") {
    windowed = windowed.slice(1);
  }
  return windowed.map((turn) => ({
    role: turn.role,
    content: turn.content.slice(0, MAX_HISTORY_TURN_CHARS),
  }));
};

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
      history: history ? boundHistoryForAnonymous(history) : [],
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
