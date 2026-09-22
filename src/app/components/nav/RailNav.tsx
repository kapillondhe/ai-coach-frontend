"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { SignInControl } from "../SignInControl";
import { Icon } from "../Icon";

export const RailNav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-44 flex-shrink-0 flex-col gap-1 border-r border-border bg-surface p-3"
    >
      <div className="px-2 pb-3 pt-1 text-sm font-bold tracking-tight">
        AI Coach
      </div>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-semibold ${
              active
                ? "bg-accent-soft text-accent"
                : "text-ink-muted hover:bg-surface-2"
            }`}
          >
            <Icon
              name={item.icon}
              className="h-[19px] w-[19px] flex-shrink-0"
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <div className="mt-auto px-1 pt-3">
        <SignInControl compact />
      </div>
    </nav>
  );
};
