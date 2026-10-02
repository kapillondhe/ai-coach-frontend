const pulse = "animate-pulse rounded bg-surface-2 motion-safe-only";

// Mirrors DashboardContent's "Trends" section + TrendCard so the swap doesn't shift layout.
export const SkeletonCards = () => (
  <section aria-hidden="true">
    <div className={`mb-2 h-5 w-14 ${pulse}`} />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <div className={`mb-2 h-5 w-24 ${pulse}`} />
          <div className={`mb-2 h-10 w-full ${pulse}`} />
          <div className="flex h-[39px] flex-col justify-center gap-2">
            <div className={`h-2.5 w-full ${pulse}`} />
            <div className={`h-2.5 w-2/3 ${pulse}`} />
          </div>
        </div>
      ))}
    </div>
  </section>
);
