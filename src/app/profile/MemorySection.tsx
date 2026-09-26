"use client";

import { useEffect, useState } from "react";
import { listMemories, deleteMemory, type MemoryData } from "@/lib/api";
import { Icon } from "../components/Icon";

export const MemorySection = () => {
  const [memories, setMemories] = useState<MemoryData[] | null>(null);
  const [error, setError] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listMemories()
      .then((data) => {
        if (!cancelled) setMemories(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMemory(id);
      setMemories((prev) => (prev ? prev.filter((m) => m.id !== id) : prev));
    } catch {
      setError(true);
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  if (error && !memories) {
    return (
      <p className="py-3 text-[13px] text-danger">
        Couldn&apos;t load your memories — try reloading.
      </p>
    );
  }

  if (memories === null) {
    return (
      <div
        aria-hidden="true"
        className="divide-y divide-border rounded-lg border border-border px-4"
      >
        {[0, 1].map((i) => (
          <div key={i} className="flex min-h-11 items-center gap-4 py-3">
            <span className="h-4 w-full animate-pulse rounded bg-surface-2 motion-safe-only" />
          </div>
        ))}
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="rounded-lg border border-border px-4 py-6 text-center">
        <p className="text-[13px] text-ink-muted">Nothing remembered yet.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border px-4">
      {memories.map((memory) => (
        <div
          key={memory.id}
          className="flex min-h-11 items-center justify-between gap-4 py-3"
        >
          <span className="text-[13px] text-ink">{memory.content}</span>
          {pendingDeleteId === memory.id ? (
            <span className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => handleDelete(memory.id)}
                disabled={deletingId === memory.id}
                className="min-h-8 rounded-md bg-danger px-2 py-1 text-[12px] font-semibold text-white disabled:opacity-50"
              >
                {deletingId === memory.id ? "Deleting…" : "Confirm"}
              </button>
              <button
                onClick={() => setPendingDeleteId(null)}
                disabled={deletingId === memory.id}
                className="min-h-8 rounded-md px-2 py-1 text-[12px] text-ink-muted disabled:opacity-50"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              onClick={() => setPendingDeleteId(memory.id)}
              aria-label={`Delete memory: ${memory.content}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted hover:text-danger"
            >
              <Icon name="trash" className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
