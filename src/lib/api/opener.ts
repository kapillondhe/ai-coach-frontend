import { apiFetchJson } from "./client";

export interface ChatOpenerData {
  text: string;
  chips: string[];
}

export const getChatOpener = (signal?: AbortSignal): Promise<ChatOpenerData> =>
  apiFetchJson<ChatOpenerData>("/api/coach/opener", { signal });
