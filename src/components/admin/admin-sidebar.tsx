"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/logo";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-card min-h-screen hidden md:block">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <LogoMark />
          <span className="font-display font-bold text-sm">
            <span className="text-brand-green">KJ</span>{" "}
            <span className="text-muted-foreground">Admin</span>
          </span>
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-green/10 text-brand-green"
                  : "text-muted-foreground hover:bg-brand-pink/5 hover:text-brand-pink"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-green transition-colors px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
