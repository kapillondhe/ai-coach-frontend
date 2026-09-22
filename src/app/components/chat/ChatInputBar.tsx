"use client";

import { Icon } from "../Icon";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export const ChatInputBar = ({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSend();
  };

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-bg from-60% to-transparent px-4 pb-4 pt-2">
      <div className="mx-auto flex max-w-[680px] items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-4 pr-1.5 shadow-sm">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach anything…"
          aria-label="Message"
          disabled={disabled}
          className="min-h-9 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-muted"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink disabled:opacity-50"
        >
          <Icon name="send" className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
