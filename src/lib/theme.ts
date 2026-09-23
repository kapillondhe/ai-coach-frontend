import type { Theme } from "@/lib/api";

export const THEME_COOKIE_KEY = "ai-coach-theme";

export const isStoredTheme = (value: string | undefined): value is Theme =>
  value === "light" || value === "dark";
