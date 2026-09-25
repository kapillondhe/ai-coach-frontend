import type { TrendCard as TrendCardData } from "@/lib/api";

const buildSparklinePath = (
  values: (number | null)[],
  width: number,
  height: number,
): string | null => {
  const points = values
    .map((v, i) => ({ v, i }))
    .filter((p): p is { v: number; i: number } => p.v !== null);
  if (points.length < 2) return null;

  const min = Math.min(...points.map((p) => p.v));
  const max = Math.max(...points.map((p) => p.v));
  const range = max - min || 1;
  const stepX = width / Math.max(1, values.length - 1);

  return points
    .map(({ v, i }) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

interface TrendCardProps {
  trend: TrendCardData;
}

export const TrendCard = ({ trend }: TrendCardProps) => {
  const width = 200;
  const height = 40;
  const values = trend.sparkline.map((p) => p.value);
  const path = buildSparklinePath(values, width, height);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="mb-2 text-[13px] font-semibold text-ink">
        {trend.label}
      </h3>
      {path ? (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${trend.label} trend sparkline`}
          className="mb-2 h-10 w-full motion-safe-only"
          preserveAspectRatio="none"
        >
          <polyline
            points={path}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      <p className="text-[12px] leading-relaxed text-ink-muted">
        {trend.takeaway}
      </p>
    </div>
  );
};
