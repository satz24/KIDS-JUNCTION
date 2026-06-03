"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CategoryStrip } from "@/components/layout/category-strip";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FloatingWhatsAppButton } from "@/components/layout/floating-whatsapp-button";
import { FloatingCartButton } from "@/components/layout/floating-cart-button";
import { StickyMobileCartBar } from "@/components/cart/sticky-mobile-cart-bar";
import { isAdminPath } from "@/lib/admin-path";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = isAdminPath(pathname);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <CategoryStrip />
      <main className="flex-1 pb-20 md:pb-0 theme-surface">{children}</main>
      <Footer />
      <MobileNav />
      <StickyMobileCartBar />
      <FloatingCartButton />
      <FloatingWhatsAppButton />
    </>
  );
}
