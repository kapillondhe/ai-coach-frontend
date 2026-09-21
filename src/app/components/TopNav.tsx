"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInControl } from "./SignInControl";

// Minimal nav stub — not the full 4-tab shell from docs/ui-ux-design.md yet.
const LINKS = [
  { href: "/", label: "Chat" },
  { href: "/profile", label: "Profile" },
];

export const TopNav = () => {
  const pathname = usePathname();

  return (
    <nav className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2">
        <div className="flex gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <SignInControl />
      </div>
    </nav>
  );
};
