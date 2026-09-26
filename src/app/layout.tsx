import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { TelemetryInit } from "./telemetry-init";
import { NavShell } from "./components/nav/NavShell";
import { SignInModal } from "./components/SignInModal";
import { AuthProvider } from "@/lib/auth-context";
import { SignInModalProvider } from "@/lib/sign-in-modal-context";
import { HeaderActionsProvider } from "@/lib/header-actions-context";
import { ThemeProvider } from "@/lib/theme-context";
import { THEME_COOKIE_KEY, isStoredTheme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "AI Coach",
  description: "AI Coach web app",
};

const RootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(THEME_COOKIE_KEY)?.value;

  const theme = isStoredTheme(cookieTheme) ? cookieTheme : "light";

  return (
    <html lang="en" data-theme={theme}>
      <body className="bg-bg text-ink antialiased">
        <TelemetryInit />
        <AuthProvider>
          <ThemeProvider initialTheme={theme}>
            <SignInModalProvider>
              <HeaderActionsProvider>
                <NavShell>{children}</NavShell>
              </HeaderActionsProvider>
              <SignInModal />
            </SignInModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
