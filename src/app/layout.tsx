import type { Metadata } from "next";
import "./globals.css";
import { TelemetryInit } from "./telemetry-init";
import { TopNav } from "./components/TopNav";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "AI Coach",
  description: "AI Coach web app",
};

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className="antialiased">
        <TelemetryInit />
        <AuthProvider>
          <TopNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
