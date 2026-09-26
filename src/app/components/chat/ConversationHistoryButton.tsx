"use client";

import { useEffect, useRef, useState } from "react";
import { listConversations, deleteConversation, ApiError } from "@/lib/api";
import type { ConversationSummary } from "@/lib/api";
import { Icon } from "../Icon";

interface ConversationHistoryButtonProps {
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onDeleted: (id: string) => void;
}

const formatUpdatedAt = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const ConversationHistoryButton = ({
  activeConversationId,
  onSelect,
  onDeleted,
}: ConversationHistoryButtonProps) => {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  const toggleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setError(null);
      setPendingDeleteId(null);
      try {
        const data = await listConversations();
        setConversations(data);
      } catch (err) {
        setConversations([]);
        setError(
          err instanceof ApiError
            ? "Couldn't load conversation history."
            : "Couldn't reach the coach API.",
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteConversation(id);
      setConversations((prev) => (prev ? prev.filter((c) => c.id !== id) : prev));
      onDeleted(id);
    } catch {
      setError("Couldn't delete that conversation.");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Conversation history"
        className="flex min-h-9 min-w-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-2 hover:text-ink"
      >
        <Icon name="history" className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Past conversations"
          className="absolute left-0 top-full z-20 mt-2 max-h-80 w-[min(18rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-border bg-surface p-1.5 shadow-lg lg:left-auto lg:right-0"
        >
          {conversations === null && (
            <p className="px-3 py-4 text-[13px] text-ink-muted">Loading…</p>
          )}
          {error && (
            <p className="px-3 py-4 text-[13px] text-danger" role="alert">
              {error}
            </p>
          )}
          {conversations !== null && conversations.length === 0 && !error && (
            <p className="px-3 py-4 text-[13px] text-ink-muted">
              No past conversations yet.
            </p>
          )}
          {conversations?.map((c) => (
            <div
              key={c.id}
              className={`flex w-full items-center gap-1 rounded-md px-1.5 ${
                c.id === activeConversationId ? "bg-accent-soft" : "hover:bg-surface-2"
              }`}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect(c.id);
                  setOpen(false);
                }}
                aria-current={c.id === activeConversationId ? "true" : undefined}
                className={`flex min-h-11 flex-1 min-w-0 flex-col items-start justify-center gap-0.5 py-1.5 text-left ${
                  c.id === activeConversationId ? "text-accent" : "text-ink"
                }`}
              >
                <span className="w-full truncate text-[13px] font-semibold">
                  {c.title || "Untitled conversation"}
                </span>
                <span className="text-[11px] text-ink-muted">
                  {formatUpdatedAt(c.updated_at)}
                </span>
              </button>
              {pendingDeleteId === c.id ? (
                <span className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                    className="min-h-8 rounded-md bg-danger px-2 py-1 text-[12px] font-semibold text-white disabled:opacity-50"
                  >
                    {deletingId === c.id ? "Deleting…" : "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(null)}
                    disabled={deletingId === c.id}
                    className="min-h-8 rounded-md px-2 py-1 text-[12px] text-ink-muted disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setPendingDeleteId(c.id)}
                  aria-label={`Delete conversation: ${c.title || "Untitled conversation"}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted hover:text-danger"
                >
                  <Icon name="trash" className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
