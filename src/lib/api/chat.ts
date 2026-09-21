import { apiFetch, apiFetchJson, getSessionId } from "./client";

export const sendChatMessage = async (message: string): Promise<string> => {
  const data = await apiFetchJson<{ reply: string }>("/api/coach/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: getSessionId() }),
  });
  return data.reply;
};

export const streamChatMessage = async (
  message: string,
  onDelta: (delta: string) => void,
  signal?: AbortSignal,
): Promise<void> => {
  const res = await apiFetch("/api/coach/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: getSessionId() }),
    signal,
  });

  if (!res.body) {
    throw new Error("Response body missing for stream request");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const rawEvent of events) {
      let eventType = "message";
      let data = "";
      for (const line of rawEvent.split("\n")) {
        if (line.startsWith("event:")) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          data += line.slice(5).trim();
        }
      }
      if (!data) continue;
      if (eventType === "done") return;
      if (eventType === "error") {
        const parsed: { message?: string } = JSON.parse(data);
        throw new Error(parsed.message ?? "Stream error");
      }
      const parsed: { delta?: string } = JSON.parse(data);
      if (parsed.delta) onDelta(parsed.delta);
    }
  }
};
