import Link from "next/link";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">
          VR Living Studio
        </h2>

        <p className="text-sm text-muted-foreground">
          Admin Panel
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-muted"
            >
              <Icon className="h-5 w-5" />

              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}