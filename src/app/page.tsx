"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useChat } from "@/lib/use-chat";
import { ChatOpener } from "./components/chat/ChatOpener";
import { ChatInputBar } from "./components/chat/ChatInputBar";
import { MessageBubble } from "./components/chat/MessageBubble";

const ChatPage = () => {
  const { session } = useAuth();
  const { messages, loading, error, send } = useChat({
    isSignedIn: !!session,
  });
  const [input, setInput] = useState("");

  const sendText = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    await send(text);
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
