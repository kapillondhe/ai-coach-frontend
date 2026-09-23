"use client";

import { useTheme } from "@/lib/theme-context";
import type { Theme } from "@/lib/api";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const AppearanceControl = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Appearance"
      className="flex gap-1 rounded-lg border border-border bg-surface-2 p-1"
    >
      {OPTIONS.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(opt.value)}
            className={`min-h-9 flex-1 rounded-md px-3 py-1.5 text-[13px] font-semibold ${
              active
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
