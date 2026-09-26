import { apiFetch, apiFetchJson } from "./client";

export interface ConversationSummary {
  id: string;
  title: string | null;
  updated_at: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationDetail {
  id: string;
  title: string | null;
  messages: ConversationMessage[];
}

export const listConversations = (
  signal?: AbortSignal,
): Promise<ConversationSummary[]> =>
  apiFetchJson<ConversationSummary[]>("/api/conversations", { signal });

export const getConversation = (
  id: string,
  signal?: AbortSignal,
): Promise<ConversationDetail> =>
  apiFetchJson<ConversationDetail>(`/api/conversations/${id}`, { signal });

export const deleteConversation = (id: string): Promise<void> =>
  apiFetch(`/api/conversations/${id}`, { method: "DELETE" }).then(() => undefined);
