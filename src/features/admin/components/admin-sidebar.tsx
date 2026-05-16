"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ChartColumn,
  Boxes,
  Users,
  Settings,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/admin",
    icon:
      LayoutDashboard,
  },

  {
    label: "Products",
    href:
      "/admin/products",
    icon: Package,
  },

  {
    label: "Orders",
    href:
      "/admin/orders",
    icon:
      ShoppingBag,
  },

  {
    label:
      "Inventory",
    href:
      "/admin/products/deleted",
    icon: Boxes,
  },

  {
    label:
      "Analytics",
    href:
      "/admin/analytics",
    icon:
      ChartColumn,
  },

  {
    label:
      "Customers",
    href:
      "/admin/customers",
    icon: Users,
  },

  {
    label:
      "Settings",
    href:
      "/admin/settings",
    icon:
      Settings,
  },
];

export function AdminSidebar() {
  const pathname =
    usePathname();

  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-neutral-200 bg-white xl:flex xl:flex-col">
      <div className="border-b p-8">
        <h2 className="text-2xl font-bold tracking-tight">
          VR Living Studio
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Admin Dashboard
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-5">
        {links.map(
          (link) => {
            const Icon =
              link.icon;

            const active =
              pathname ===
              link.href;

            return (
              <Link
                key={
                  link.href
                }
                href={
                  link.href
                }
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
                  active
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Icon className="h-5 w-5" />

                {
                  link.label
                }
              </Link>
            );
          }
        )}
      </nav>
    </aside>
  );
}