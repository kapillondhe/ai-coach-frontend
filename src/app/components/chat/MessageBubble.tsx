"use client";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { GroundingPill } from "./GroundingPill";
import { SourcePill } from "./SourcePill";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  groundingLabel?: string;
  sourceLabel?: string;
}

export const MessageBubble = ({
  message,
  isStreaming,
}: {
  message: ChatMessage;
  isStreaming: boolean;
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
      <div className="max-w-[92%] whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink">
        {showPulse ? (
          <span
            className="motion-safe-only inline-block h-4 w-4 animate-pulse rounded-full bg-surface-2"
            aria-hidden="true"
          />
        ) : (
          <>
            {message.content}
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
      </div>
    </div>
  );
};
