"use client";

import { useState } from "react";
import { streamChatMessage } from "@/lib/api";
import { ChatOpener } from "./components/chat/ChatOpener";
import { ChatInputBar } from "./components/chat/ChatInputBar";
import {
  MessageBubble,
  type ChatMessage,
} from "./components/chat/MessageBubble";

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendText = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      await streamChatMessage(message, (delta) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + delta };
          return next;
        });
      });
    } catch {
      setError("Failed to reach the coach API. Is the backend reachable?");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-[680px] flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-4">
        {messages.length === 0 && <ChatOpener onChipSelect={sendText} />}
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            message={m}
            isStreaming={
              loading && i === messages.length - 1 && m.role === "assistant"
            }
          />
        ))}
        {error && (
          <p className="text-[13px] text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
      <ChatInputBar
        value={input}
        onChange={setInput}
        onSend={() => sendText(input)}
        disabled={loading}
      />
    </div>
  );
};

export default ChatPage;
