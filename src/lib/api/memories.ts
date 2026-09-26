import { apiFetch, apiFetchJson } from "./client";

export interface MemoryData {
  id: string;
  content: string;
  created_at: string;
}

export const listMemories = (signal?: AbortSignal): Promise<MemoryData[]> =>
  apiFetchJson<MemoryData[]>("/api/memories", { signal });

export const deleteMemory = (id: string): Promise<void> =>
  apiFetch(`/api/memories/${id}`, { method: "DELETE" }).then(() => undefined);
