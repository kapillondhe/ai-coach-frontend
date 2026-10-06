// Theme is purely a client-side UI preference stored in a cookie — it is not
// part of the backend's Profile model/API (see app/api/routes/profile.py),
// so it's defined here rather than in lib/api/profile.ts.
export type Theme = "light" | "dark";

export const THEME_COOKIE_KEY = "ai-coach-theme";

export const isStoredTheme = (value: string | undefined): value is Theme =>
  value === "light" || value === "dark";
