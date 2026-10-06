"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  streamChatMessage,
  getConversation,
  ApiError,
  MAX_MESSAGE_CHARS,
} from "@/lib/api";
import type { ApiErrorDetail } from "@/lib/api";
import type { ChatMessage } from "@/app/components/chat/MessageBubble";

const DEFAULT_RATE_LIMIT_COOLDOWN_SECONDS = 60;

const describeValidationError = (detail?: ApiErrorDetail): string => {
  if (Array.isArray(detail)) {
    const hitsMessageField = detail.some((d) => d.loc.includes("message"));
    if (hitsMessageField) {
      return `That message is too long (max ${MAX_MESSAGE_CHARS.toLocaleString()} characters).`;
    }
  }
  return "Couldn't send that message.";
};

export const useChat = ({ isSignedIn }: { isSignedIn: boolean }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const lastMessageRef = useRef<string | null>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCooldownTimer = () => {
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
  };

  const startRateLimitCooldown = (seconds: number, detailText: string) => {
    clearCooldownTimer();
    let remaining = seconds;
    const describe = (s: number) => `${detailText} Try again in ${s}s.`;
    setCooldownSeconds(remaining);
    setError(describe(remaining));
    cooldownTimerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearCooldownTimer();
        setCooldownSeconds(null);
        setError(null);
        return;
      }
      setCooldownSeconds(remaining);
      setError(describe(remaining));
    }, 1000);
  };

  const setConversation = (id: string | null) => {
    conversationIdRef.current = id;
    setConversationId(id);
  };

  const wasSignedInRef = useRef(isSignedIn);
  useEffect(() => {
    if (!wasSignedInRef.current && isSignedIn) {
      setConversation(null);
      setMessages([]);
    }
    wasSignedInRef.current = isSignedIn;
  }, [isSignedIn]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      clearCooldownTimer();
    };
  }, []);

  const newChat = useCallback(() => {
    abortRef.current?.abort();
    clearCooldownTimer();
    setCooldownSeconds(null);
    setConversation(null);
    setMessages([]);
    setError(null);
  }, []);

  const forgetConversation = useCallback(
    (id: string) => {
      if (id === conversationIdRef.current) newChat();
    },
    [newChat],
  );

  const openConversation = useCallback(async (id: string) => {
    if (id === conversationIdRef.current) return;
    abortRef.current?.abort();
    setError(null);
    try {
      const data = await getConversation(id);
      setConversation(data.id);
      setMessages(
        data.messages.map((m) => ({ role: m.role, content: m.content })),
      );
    } catch {
      setError("Failed to load that conversation.");
    }
  }, []);

  const send = async (text: string) => {
    const message = text.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!message || loading || cooldownSeconds) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    lastMessageRef.current = message;

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
        onConversationId: (id) => {
          setConversation(id);
        },
        onDelta: (delta) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + delta };
            return next;
          });
        },
        onSuggestions: (suggestions) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, suggestions };
            return next;
          });
        },
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setMessages((prev) => prev.slice(0, -2));
      if (err instanceof ApiError && err.status === 429) {
        const detailText =
          typeof err.detail === "string"
            ? err.detail
            : "Too many messages. Please wait a moment and try again.";
        const wait =
          typeof err.retryAfterSeconds === "number" && err.retryAfterSeconds > 0
            ? Math.ceil(err.retryAfterSeconds)
            : DEFAULT_RATE_LIMIT_COOLDOWN_SECONDS;
        startRateLimitCooldown(wait, detailText);
      } else if (err instanceof ApiError && err.status === 422) {
        setError(describeValidationError(err.detail));
      } else {
        setError("Failed to reach the coach API. Is the backend reachable?");
      }
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
        abortRef.current = null;
      }
    }
  };

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  }, []);

  const retry = useCallback(() => {
    if (!lastMessageRef.current || loading || cooldownSeconds) return;
    const message = lastMessageRef.current;
    setMessages((prev) =>
      prev.length && prev[prev.length - 1].role === "user"
        ? prev.slice(0, -1)
        : prev,
    );
    send(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, cooldownSeconds]);

  return {
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
  };
};
