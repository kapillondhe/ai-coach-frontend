"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Theme } from "@/lib/api";
import { THEME_COOKIE_KEY } from "@/lib/theme";

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
};

const writeThemeCookie = (theme: Theme) => {
  document.cookie = `${THEME_COOKIE_KEY}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
};

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: ReactNode;
}) => {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
    writeThemeCookie(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    writeThemeCookie(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
