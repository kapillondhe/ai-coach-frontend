export const SkeletonCards = () => (
  <div
    aria-hidden="true"
    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
  >
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="h-28 animate-pulse rounded-lg border border-border bg-surface-2 motion-safe-only"
      />
    ))}
  </div>
);
