import { apiFetchJson } from "./client";

export interface SparklinePoint {
  date: string;
  value: number | null;
}

export interface TrendCard {
  id: string;
  label: string;
  sparkline: SparklinePoint[];
  takeaway: string;
  latest_value: number | null;
  extra: Record<string, unknown>;
}

export interface DashboardSummary {
  connected: boolean;
  syncing: boolean;
  trends: TrendCard[];
}

export const getDashboardSummary = (
  signal?: AbortSignal,
): Promise<DashboardSummary> =>
  apiFetchJson<DashboardSummary>("/api/dashboard/summary", { signal });
