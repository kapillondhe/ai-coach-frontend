"use client";

import { useAuth } from "@/lib/auth-context";

interface ChatOpenerProps {
  onChipSelect: (text: string) => void;
}

const OPENER = {
  anonymous: {
    text: "What are you training for?",
    chips: [
      "I'm training for my first 70.3",
      "How much protein do I need?",
      "Explain zone 2 training",
    ],
  },
  signedIn: {
    text: "Good to see you. What's on your mind for training this week?",
    chips: [
      "Log how today's run felt",
      "What should I eat before a long ride?",
      "How should I structure a long run?",
    ],
  },
};

export const ChatOpener = ({ onChipSelect }: ChatOpenerProps) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div aria-hidden="true" className="flex flex-col gap-3 px-1 pb-2 pt-1">
        <div className="h-4 w-48 animate-pulse rounded bg-surface-2 motion-safe-only" />
        <div className="flex flex-wrap gap-2">
          <div className="h-9 w-40 animate-pulse rounded-full bg-surface-2 motion-safe-only" />
          <div className="h-9 w-32 animate-pulse rounded-full bg-surface-2 motion-safe-only" />
        </div>
      </div>
    );
  }

  const signedIn = Boolean(session);
  const { text, chips } = signedIn ? OPENER.signedIn : OPENER.anonymous;

  return (
    <div className="flex flex-col gap-3 px-1 pb-2 pt-1">
      <p className="text-[15.5px] font-medium leading-relaxed text-ink">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink-muted">
          Coach
        </span>
        {text}
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChipSelect(chip)}
            className="min-h-9 rounded-full border border-border bg-surface px-3.5 py-2 text-[12.5px] font-semibold text-ink hover:border-accent hover:text-accent"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};
