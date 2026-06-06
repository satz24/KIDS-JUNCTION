"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingBag, Info, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";

const navItems = [
  { href: "/#home", icon: Home, label: "Home" },
  { href: "/#collection", icon: Grid3X3, label: "Shop" },
  { href: "/cart", icon: ShoppingBag, label: "Cart", showBadge: true },
  { href: "/#about", icon: Info, label: "About" },
  { href: "/#contact", icon: MapPin, label: "Visit" },
];

export function MobileNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden premium-glass-v2 border border-[var(--glass-v2-border)] mx-2 mb-2 rounded-[1.25rem] shadow-[var(--glass-v2-shadow)] theme-surface pb-[env(safe-area-inset-bottom,0px)]">
      <div className="grid grid-cols-5 h-[4.25rem] min-h-[4.25rem]">
        {navItems.map((item) => {
          const isActive =
            item.href === "/cart"
              ? pathname === "/cart"
              : item.href === "/#home"
                ? pathname === "/"
                : false;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 py-1 rounded-xl transition-colors relative",
                isActive ? "text-brand-pink" : "text-muted-foreground"
              )}
            >
              <span className="relative inline-flex shrink-0">
                <item.icon className={cn("h-[1.15rem] w-[1.15rem]", isActive && "scale-110")} />
                {item.showBadge && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full gradient-brand text-[8px] font-bold text-white shadow-sm">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </span>
              <span className="w-full truncate text-center text-[9px] font-semibold leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
