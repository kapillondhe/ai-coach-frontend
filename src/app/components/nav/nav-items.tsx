import type { IconName } from "../Icon";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Chat", icon: "chat" },
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/profile", label: "Profile", icon: "profile" },
];
