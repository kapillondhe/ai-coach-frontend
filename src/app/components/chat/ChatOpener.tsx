"use client";

import { useAuth } from "@/lib/auth-context";

interface ChatOpenerProps {
  onChipSelect: (text: string) => void;
}

export const ChatOpener = ({ onChipSelect }: ChatOpenerProps) => {
  const { session } = useAuth();
  const signedIn = Boolean(session);

  const opener = signedIn
    ? "Good to see you. What's on your mind for training this week?"
    : "What are you training for?";

  const chips = signedIn
    ? [
        "Build me a training plan",
        "Log how today's run felt",
        "What should I eat before a long ride?",
      ]
    : [
        "I'm training for my first 70.3",
        "How much protein do I need?",
        "Explain zone 2 training",
      ];

  return (
    <div className="flex flex-col gap-3 px-1 pb-2 pt-1">
      <p className="text-[15.5px] font-medium leading-relaxed text-ink">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink-muted">
          Coach
        </span>
        {opener}
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
