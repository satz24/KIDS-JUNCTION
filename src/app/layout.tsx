import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Love_Ya_Like_A_Sister } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/client-providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FloatingWhatsAppButton } from "@/components/layout/floating-whatsapp-button";
import { FloatingCartButton } from "@/components/layout/floating-cart-button";
import { StickyMobileCartBar } from "@/components/cart/sticky-mobile-cart-bar";
import { AddToCartToast } from "@/components/shared/add-to-cart-toast";
import { CursorGlow } from "@/components/shared/cursor-glow";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  variable: "--font-love-ya",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kids Junction — Kids Clothing & Toys | Guduvanchery",
    template: "%s | Kids Junction",
  },
  description:
    "Browse kids clothing & toys at Kids Junction. Add to cart and order easily via WhatsApp. Guduvanchery's No.1 baby shop.",
  keywords: [
    "kids clothing Guduvanchery",
    "baby shop",
    "WhatsApp order kids",
    "Kids Junction",
  ],
  openGraph: {
    title: "Kids Junction — Order via WhatsApp",
    description: "Explore our collection and place orders through WhatsApp.",
    type: "website",
    locale: "en_IN",
    siteName: "Kids Junction",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${loveYaLikeASister.variable} min-h-screen flex flex-col antialiased`}
      >
        <ClientProviders>
          <CursorGlow />
          <Header />
          <main className="flex-1 pb-20 md:pb-0 theme-surface">{children}</main>
          <Footer />
          <MobileNav />
          <StickyMobileCartBar />
          <FloatingCartButton />
          <FloatingWhatsAppButton />
          <AddToCartToast />
        </ClientProviders>
      </body>
    </html>
  );
}
