import type { Metadata } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClientProviders } from "@/components/providers/client-providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FloatingWhatsAppButton } from "@/components/layout/floating-whatsapp-button";
import { FloatingCartButton } from "@/components/layout/floating-cart-button";
import { StickyMobileCartBar } from "@/components/cart/sticky-mobile-cart-bar";
import { AddToCartToast } from "@/components/shared/add-to-cart-toast";
import { CursorGlow } from "@/components/shared/cursor-glow";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${fredoka.variable} min-h-screen flex flex-col antialiased`}
      >
        <ThemeProvider>
          <ClientProviders>
            <CursorGlow />
            <Header />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
            <MobileNav />
            <StickyMobileCartBar />
            <FloatingCartButton />
            <FloatingWhatsAppButton />
            <AddToCartToast />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
