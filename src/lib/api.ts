const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendChatMessage(message: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/coach/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data: { reply: string } = await res.json();
  return data.reply;
}
