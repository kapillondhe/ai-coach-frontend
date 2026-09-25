export const SyncingState = () => (
  <div
    className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-10 text-center"
    aria-live="polite"
  >
    <p className="text-[13px] font-medium text-ink">
      Syncing your recent activities…
    </p>
    <p className="text-[12px] text-ink-muted">
      This can take a minute the first time. Check back shortly.
    </p>
  </div>
);
