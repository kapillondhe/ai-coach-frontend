"use client";

import { useEffect, useRef } from "react";
import { Icon } from "../Icon";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  loading: boolean;
}

const MAX_HEIGHT_PX = 160;

export const ChatInputBar = ({
  value,
  onChange,
  onSend,
  onStop,
  loading,
}: ChatInputBarProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-bg from-60% to-transparent px-4 pb-4 pt-2">
      <div className="mx-auto flex max-w-[680px] items-end gap-2 rounded-3xl border border-border bg-surface py-1.5 pl-4 pr-1.5 shadow-sm">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach anything…"
          aria-label="Message"
          rows={1}
          className="min-h-9 flex-1 resize-none overflow-y-auto bg-transparent py-2 text-base leading-snug text-ink outline-none placeholder:text-ink-muted sm:text-[13.5px]"
        />
        {loading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink hover:bg-border"
          >
            <Icon name="stop" className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim()}
            aria-label="Send message"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink disabled:opacity-50"
          >
            <Icon name="send" className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
