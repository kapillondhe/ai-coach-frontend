"use client";

import { useEffect, useRef, useState } from "react";
import { streamChatMessage } from "@/lib/api";
import type { ChatMessage } from "@/app/components/chat/MessageBubble";

export const useChat = ({ isSignedIn }: { isSignedIn: boolean }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  const wasSignedInRef = useRef(isSignedIn);
  useEffect(() => {
    if (!wasSignedInRef.current && isSignedIn) {
      conversationIdRef.current = null;
      setMessages([]);
    }
    wasSignedInRef.current = isSignedIn;
  }, [isSignedIn]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const priorTurns = messages;

    setMessages([
      ...priorTurns,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setLoading(true);
    setError(null);

    try {
      await streamChatMessage(message, {
        history: isSignedIn
          ? undefined
          : priorTurns.map((m) => ({ role: m.role, content: m.content })),
        conversationId: isSignedIn ? conversationIdRef.current : undefined,
        onConversationId: (conversationId) => {
          conversationIdRef.current = conversationId;
        },
        onDelta: (delta) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + delta };
            return next;
          });
        },
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Failed to reach the coach API. Is the backend reachable?");
      setMessages((prev) => prev.slice(0, -2));
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
        abortRef.current = null;
      }
    }
  };

  return { messages, loading, error, send };
};
