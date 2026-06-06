import { Header } from "@/components/layout/header";
import { CategoryStrip } from "@/components/layout/category-strip";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FloatingWhatsAppButton } from "@/components/layout/floating-whatsapp-button";
import { FloatingCartButton } from "@/components/layout/floating-cart-button";
import { StickyMobileCartBar } from "@/components/cart/sticky-mobile-cart-bar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CategoryStrip />
      <main className="flex-1 pb-20 md:pb-0 theme-surface">{children}</main>
      <MobileNav />
      <StickyMobileCartBar />
      <FloatingCartButton />
      <FloatingWhatsAppButton />
    </>
  );
}
