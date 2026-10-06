import { supabase } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_ID_KEY = "ai-coach-session-id";

export type ApiErrorDetail =
  | string
  | { loc: (string | number)[]; msg: string; type: string }[];

export class ApiError extends Error {
  readonly status: number;
  readonly detail?: ApiErrorDetail;
  readonly retryAfterSeconds?: number | null;

  constructor(
    status: number,
    message?: string,
    detail?: ApiErrorDetail,
    retryAfterSeconds?: number | null,
  ) {
    super(message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.retryAfterSeconds = retryAfterSeconds;
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
  if (!res.ok) {
    let detail: ApiErrorDetail | undefined;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string" || Array.isArray(body?.detail)) {
        detail = body.detail;
      }
    } catch {
      // Body wasn't JSON (or was empty) — leave detail undefined.
    }
    const retryAfterRaw = res.headers.get("Retry-After");
    const retryAfterParsed = retryAfterRaw ? Number(retryAfterRaw) : NaN;
    const retryAfterSeconds = Number.isFinite(retryAfterParsed)
      ? retryAfterParsed
      : null;
    throw new ApiError(
      res.status,
      typeof detail === "string" ? detail : undefined,
      detail,
      retryAfterSeconds,
    );
  }
  return res;
};

export const apiFetchJson = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const res = await apiFetch(path, init);
  return res.json() as Promise<T>;
};
