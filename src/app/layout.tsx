import type { Metadata } from "next";
import "./globals.css";
import { TelemetryInit } from "./telemetry-init";
import { NavShell } from "./components/nav/NavShell";
import { SignInModal } from "./components/SignInModal";
import { AuthProvider } from "@/lib/auth-context";
import { SignInModalProvider } from "@/lib/sign-in-modal-context";

export const metadata: Metadata = {
  title: "AI Coach",
  description: "AI Coach web app",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className="bg-bg text-ink antialiased">
        <TelemetryInit />
        <AuthProvider>
          <SignInModalProvider>
            <NavShell>{children}</NavShell>
            <SignInModal />
          </SignInModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
