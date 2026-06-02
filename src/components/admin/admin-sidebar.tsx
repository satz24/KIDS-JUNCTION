"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  ShoppingCart,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { supabase } from "@/lib/supabase/client";

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: Grid3X3, label: "Categories" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <aside className="w-64 shrink-0 glass-nav border-r min-h-screen hidden md:flex flex-col">
      <div className="p-6 border-b border-[var(--border-color)]">
        <Link href="/admin/dashboard">
          <Logo size="sm" />
        </Link>
        <p className="text-xs text-muted-foreground mt-2 font-semibold">Admin Portal</p>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                isActive
                  ? "nav-tab-green nav-tab"
                  : "text-muted-foreground hover:bg-brand-pink/8 hover:text-brand-pink"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-1 border-t border-[var(--border-color)]">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-green transition-colors px-4 py-2 font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors px-4 py-2 font-semibold"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
