import { CorosConnectionRow } from "./CorosConnectionRow";

export const ConnectionsSkeleton = () => (
  <div
    aria-hidden="true"
    className="divide-y divide-border rounded-lg border border-border px-4"
  >
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex flex-col">
        <span className="h-5 w-16 animate-pulse rounded bg-surface-2 motion-safe-only" />
        <span className="h-4 w-32 animate-pulse rounded bg-surface-2 motion-safe-only" />
      </div>
      <span className="h-9 w-24 animate-pulse rounded-lg bg-surface-2 motion-safe-only" />
    </div>
  </div>
);

export const ConnectionsSection = () => {
  return (
    <div className="divide-y divide-border rounded-lg border border-border px-4">
      <CorosConnectionRow />
      {/* Future device rows (Garmin, Strava, etc.) append here. */}
    </div>
  );
};
