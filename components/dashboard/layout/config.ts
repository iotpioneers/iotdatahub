import type { NavItemConfig } from "@/types/nav";

export const navItems = [
  {
    key: "overview",
    title: "Overview",
    href: "/organization/dashboard",
    icon: "chart-pie",
  },
  {
    key: "user-management",
    title: "User Management",
    href: "/organization/dashboard/users",
    icon: "users",
  },
  {
    key: "integrations",
    title: "Integrations",
    href: "/organization/dashboard/integrations",
    icon: "plugs-connected",
  },
  {
    key: "settings",
    title: "Settings",
    href: "/organization/dashboard/settings",
    icon: "gear-six",
  },
  {
    key: "account",
    title: "Account",
    href: "/organization/dashboard/account",
    icon: "user",
  },
] satisfies NavItemConfig[];
