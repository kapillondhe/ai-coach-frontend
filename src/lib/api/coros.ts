import { apiFetch, apiFetchJson } from "./client";

export interface CorosStatus {
  connected: boolean;
  connected_at: string | null;
}

export const getCorosStatus = (): Promise<CorosStatus> =>
  apiFetchJson<CorosStatus>("/api/integrations/coros/status");

export const startCorosConnect = async (): Promise<void> => {
  const data = await apiFetchJson<{ authorization_url: string }>(
    "/api/integrations/coros/connect",
    { method: "POST" },
  );
  window.location.href = data.authorization_url;
};

export const disconnectCoros = async (): Promise<void> => {
  await apiFetch("/api/integrations/coros/disconnect", { method: "POST" });
};
