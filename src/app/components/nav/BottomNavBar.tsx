"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import { Icon } from "../Icon";

export const BottomNavBar = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="flex border-t border-border bg-surface"
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10.5px] font-semibold ${
              active ? "text-accent" : "text-ink-muted"
            }`}
          >
            <Icon
              name={item.icon}
              className="h-[21px] w-[21px]"
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
