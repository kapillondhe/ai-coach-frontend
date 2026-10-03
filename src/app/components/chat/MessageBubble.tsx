"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { GroundingPill } from "./GroundingPill";
import { SourcePill } from "./SourcePill";
import { Icon } from "../Icon";
import { Tooltip } from "../Tooltip";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  groundingLabel?: string;
  sourceLabel?: string;
  suggestions?: string[];
}

const MarkdownContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
      ul: ({ children }) => (
        <ul className="mb-2 list-disc space-y-0.5 pl-5 last:mb-0">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="mb-2 list-decimal space-y-0.5 pl-5 last:mb-0">
          {children}
        </ol>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold text-ink">{children}</strong>
      ),
      a: ({ children, href }) => (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline underline-offset-2"
        >
          {children}
        </a>
      ),
      code: ({ children }) => (
        <code className="rounded bg-surface-2 px-1 py-0.5 text-[13px]">
          {children}
        </code>
      ),
      table: ({ children }) => (
        <div className="mb-2 overflow-x-auto last:mb-0">
          <table className="w-full border-collapse text-[13.5px]">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className="border-b border-border text-left">
          {children}
        </thead>
      ),
      th: ({ children }) => (
        <th className="px-2 py-1 font-semibold text-ink">{children}</th>
      ),
      td: ({ children }) => (
        <td className="border-t border-border px-2 py-1 align-top">
          {children}
        </td>
      ),
      h1: ({ children }) => (
        <h3 className="mb-1.5 text-[15px] font-semibold text-ink">
          {children}
        </h3>
      ),
      h2: ({ children }) => (
        <h3 className="mb-1.5 text-[15px] font-semibold text-ink">
          {children}
        </h3>
      ),
      h3: ({ children }) => (
        <h3 className="mb-1.5 text-[14.5px] font-semibold text-ink">
          {children}
        </h3>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied or unavailable; no-op
    }
  };

  return (
    <Tooltip label={copied ? "Copied" : "Copy"}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy message"
        className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-surface-2 hover:text-ink"
      >
        <Icon
          name={copied ? "check" : "copy"}
          className="h-3.5 w-3.5"
          aria-hidden="true"
        />
      </button>
    </Tooltip>
  );
};

export const MessageBubble = ({
  message,
  isStreaming,
  onSuggestionSelect,
}: {
  message: ChatMessage;
  isStreaming: boolean;
  onSuggestionSelect?: (text: string) => void;
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2.5 text-[14px] font-medium leading-snug text-accent-ink">
          {message.content}
        </div>
      </div>
    );
  }

  const showCursor = isStreaming && message.content && !prefersReducedMotion;
  const showPulse = isStreaming && !message.content;

  return (
    <div className="group flex justify-start">
      <div className="max-w-[92%] text-[14.5px] leading-relaxed text-ink">
        {showPulse ? (
          <span
            className="flex items-center gap-1 py-1"
            role="status"
            aria-label="Coach is typing"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="motion-safe-only h-2 w-2 animate-bounce rounded-full bg-ink-muted"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        ) : (
          <>
            <MarkdownContent content={message.content} />
            {showCursor && (
              <span
                className="motion-safe-only ml-0.5 animate-pulse"
                aria-hidden="true"
              >
                ▍
              </span>
            )}
          </>
        )}
        {!isStreaming && (message.groundingLabel || message.sourceLabel) && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {message.groundingLabel && (
              <GroundingPill label={message.groundingLabel} />
            )}
            {message.sourceLabel && <SourcePill label={message.sourceLabel} />}
          </div>
        )}
        {!isStreaming && message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestionSelect?.(suggestion)}
                disabled={!onSuggestionSelect}
                className="min-h-8 rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {!isStreaming && message.content && (
          <div className="mt-1 opacity-60 transition-opacity hover:opacity-100 focus-within:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
            <CopyButton content={message.content} />
          </div>
        )}
      </div>
    </div>
  );
};
