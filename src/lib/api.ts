const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_ID_KEY = "ai-coach-session-id";

function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  return sessionId;
}

export async function sendChatMessage(message: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/coach/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: getSessionId() }),
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data: { reply: string } = await res.json();
  return data.reply;
}

export async function streamChatMessage(
  message: string,
  onDelta: (delta: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/coach/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: getSessionId() }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`Request failed with status ${res.status}`);
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
}
