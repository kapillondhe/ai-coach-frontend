"use client";

import { useState } from "react";
import { sendChatMessage } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const message = input.trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await sendChatMessage(message);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setError("Failed to reach the coach API. Is the backend reachable?");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSend();
    }
  }

  return (
    <main className="mx-auto flex h-screen max-w-2xl flex-col p-4">
      <h1 className="mb-4 text-2xl font-semibold">AI Coach</h1>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-black/10 p-4 dark:border-white/10">
        {messages.length === 0 && (
          <p className="text-sm text-black/50 dark:text-white/50">
            Send a message to start chatting with the coach.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-sm text-black/50 dark:text-white/50">
            Coach is thinking…
          </p>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          disabled={loading}
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-white/10"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </main>
  );
}
