"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { GroundingPill } from "./GroundingPill";
import { SourcePill } from "./SourcePill";

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
    <div className="flex justify-start">
      <div className="max-w-[92%] text-[14.5px] leading-relaxed text-ink">
        {showPulse ? (
          <span
            className="motion-safe-only inline-block h-4 w-4 animate-pulse rounded-full bg-surface-2"
            aria-hidden="true"
          />
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
                className="min-h-8 rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-ink hover:border-accent hover:text-accent"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
