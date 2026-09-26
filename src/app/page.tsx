"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useChat } from "@/lib/use-chat";
import { usePageHeaderActions } from "@/lib/header-actions-context";
import { ChatOpener } from "./components/chat/ChatOpener";
import { ChatInputBar } from "./components/chat/ChatInputBar";
import { MessageBubble } from "./components/chat/MessageBubble";
import { ConversationHistoryButton } from "./components/chat/ConversationHistoryButton";
import { Icon } from "./components/Icon";
import { Tooltip } from "./components/Tooltip";

const ChatPage = () => {
  const { session } = useAuth();
  const isSignedIn = !!session;
  const {
    messages,
    loading,
    error,
    send,
    conversationId,
    newChat,
    openConversation,
    forgetConversation,
  } = useChat({ isSignedIn });
  const [input, setInput] = useState("");

  const sendText = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    await send(text);
  };

  const chatActions = useMemo(
    () =>
      isSignedIn ? (
        <>
          <Tooltip label="New chat">
            <button
              type="button"
              onClick={newChat}
              disabled={messages.length === 0}
              aria-label="New chat"
              className="flex min-h-9 min-w-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40"
            >
              <Icon
                name="plus"
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
            </button>
          </Tooltip>
          <ConversationHistoryButton
            activeConversationId={conversationId}
            onSelect={openConversation}
            onDeleted={forgetConversation}
          />
        </>
      ) : null,
    [
      isSignedIn,
      messages.length,
      newChat,
      conversationId,
      openConversation,
      forgetConversation,
    ],
  );

  usePageHeaderActions(chatActions);

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[680px] flex-1 flex-col">
      {isSignedIn && (
        <div className="hidden items-center justify-end gap-1 px-4 pt-2 lg:flex">
          {chatActions}
        </div>
      )}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-4">
        {messages.length === 0 && <ChatOpener onChipSelect={sendText} />}
        {messages.map((m, i) => (
          <MessageBubble
            key={i}
            message={m}
            isStreaming={
              loading && i === messages.length - 1 && m.role === "assistant"
            }
            onSuggestionSelect={
              i === messages.length - 1 && m.role === "assistant" && !loading
                ? sendText
                : undefined
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
