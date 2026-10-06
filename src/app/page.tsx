"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useChat } from "@/lib/use-chat";
import { usePageHeaderActions } from "@/lib/header-actions-context";
import { useFaviconState } from "@/lib/favicon-context";
import { ChatOpener } from "./components/chat/ChatOpener";
import { ChatInputBar } from "./components/chat/ChatInputBar";
import { MessageBubble } from "./components/chat/MessageBubble";
import { ConversationHistoryButton } from "./components/chat/ConversationHistoryButton";
import { Icon } from "./components/Icon";
import { Tooltip } from "./components/Tooltip";

const ChatPage = () => {
  const { session, loading: authLoading } = useAuth();
  const isSignedIn = !!session;
  const {
    messages,
    loading,
    error,
    cooldownSeconds,
    send,
    stop,
    retry,
    conversationId,
    newChat,
    openConversation,
    forgetConversation,
  } = useChat({ isSignedIn });
  const [input, setInput] = useState("");
  const { setFaviconState } = useFaviconState();
  const wasLoadingRef = useRef(false);

  useEffect(() => {
    if (loading) {
      setFaviconState("loading");
      wasLoadingRef.current = true;
      return;
    }
    if (wasLoadingRef.current) {
      wasLoadingRef.current = false;
      setFaviconState(document.hidden ? "unread" : "idle");
    }
  }, [loading, setFaviconState]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      const atBottom = distanceFromBottom < 80;
      stickToBottomRef.current = atBottom;
      setShowJumpToBottom(!atBottom && el.scrollHeight > el.clientHeight + 80);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (stickToBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      setShowJumpToBottom(false);
    }
  }, [messages]);

  const scrollToBottom = () => {
    stickToBottomRef.current = true;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    setShowJumpToBottom(false);
  };

  const sendText = async (text: string) => {
    if (!text.trim() || loading || cooldownSeconds) return;
    setInput("");
    stickToBottomRef.current = true;
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
      {(isSignedIn || authLoading) && (
        <div className="hidden min-h-11 items-center justify-end gap-1 px-4 pt-2 lg:flex">
          {chatActions}
        </div>
      )}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="h-full space-y-4 overflow-y-auto px-4 pb-4 pt-4"
        >
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
            <div className="flex items-center justify-between gap-2 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2">
              <p className="text-[13px] text-danger" role="alert">
                {error}
              </p>
              <button
                type="button"
                onClick={retry}
                disabled={!!cooldownSeconds}
                aria-label="Retry last message"
                className="flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[12.5px] font-semibold text-danger hover:bg-danger/10 disabled:opacity-50"
              >
                <Icon name="refresh" className="h-3.5 w-3.5" aria-hidden="true" />
                Retry
              </button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {showJumpToBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to latest message"
            className="absolute bottom-3 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-md hover:bg-surface-2"
          >
            <Icon name="arrowDown" className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <ChatInputBar
        value={input}
        onChange={setInput}
        onSend={() => sendText(input)}
        onStop={stop}
        loading={loading}
        disabled={!!cooldownSeconds}
      />
    </div>
  );
};

export default ChatPage;
