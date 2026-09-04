import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Coach",
  description: "AI Coach web app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
