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
