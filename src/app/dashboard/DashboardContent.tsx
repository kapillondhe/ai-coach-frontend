"use client";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/lib/api";
import type { DashboardSummary } from "@/lib/api";
import { TrendCard } from "./TrendCard";
import { SkeletonCards } from "./SkeletonCards";
import { NoDeviceEmptyState } from "./NoDeviceEmptyState";
import { SyncingState } from "./SyncingState";

type LoadState = "loading" | "loaded" | "error";

export const DashboardContent = () => {
  const [state, setState] = useState<LoadState>("loading");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      try {
        const data = await getDashboardSummary(controller.signal);
        if (!cancelled) {
          setSummary(data);
          setState("loaded");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (!cancelled) setState("error");
      }
    };
    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  if (state === "loading") return <SkeletonCards />;

  if (state === "error") {
    return (
      <div className="rounded-lg border border-border bg-surface p-10 text-center text-[13px] text-ink-muted">
        Couldn&apos;t load your dashboard right now. Try again shortly.
      </div>
    );
  }

  if (!summary || !summary.connected) return <NoDeviceEmptyState />;
  if (summary.syncing) return <SyncingState />;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-ink-muted">Trends</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summary.trends.map((trend) => (
            <TrendCard key={trend.id} trend={trend} />
          ))}
        </div>
      </section>
    </div>
  );
};
