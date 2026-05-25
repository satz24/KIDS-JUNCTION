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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border/50">
      <div className="flex items-center justify-around h-16 px-1">
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
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-[52px] relative",
                isActive ? "text-brand-green" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.showBadge && itemCount > 0 && (
                <span className="absolute top-0 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
