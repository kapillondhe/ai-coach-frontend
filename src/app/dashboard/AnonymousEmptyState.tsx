"use client";

import { useSignInModal } from "@/lib/sign-in-modal-context";

export const AnonymousEmptyState = () => {
  const { openModal } = useSignInModal();
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-10 text-center">
      <p className="text-[13px] text-ink-muted">
        Sign in to see your training trends.
      </p>
      <button
        onClick={openModal}
        className="min-h-10 rounded-md bg-accent px-4 py-2 text-[13px] font-semibold text-accent-ink"
      >
        Sign in
      </button>
    </div>
  );
};
