import { supabase } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_ID_KEY = "ai-coach-session-id";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
  }
}

export const getSessionId = (): string => {
  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  return sessionId;
};

const authHeaders = async (): Promise<Record<string, string>> => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiFetch = async (
  path: string,
  init: RequestInit = {},
): Promise<Response> => {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...(await authHeaders()), ...init.headers },
  });
  if (!res.ok) throw new ApiError(res.status);
  return res;
};

export const apiFetchJson = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const res = await apiFetch(path, init);
  return res.json() as Promise<T>;
};
