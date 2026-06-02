"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ShoppingBag,
  Search,
  Home,
  Grid3X3,
  Heart,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { storeInfo } from "@/lib/data/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart-store";
import { searchProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type NavAccent = "pink" | "blue" | "green" | "lavender";

const navLinks: {
  href: string;
  label: string;
  icon: LucideIcon;
  accent: NavAccent;
}[] = [
  { href: "/#home", label: "Home", icon: Home, accent: "pink" },
  { href: "/#collection", label: "Shop", icon: Grid3X3, accent: "blue" },
  { href: "/#about", label: "About", icon: Heart, accent: "green" },
  { href: "/#contact", label: "Visit", icon: MapPin, accent: "lavender" },
];

function NavTab({
  href,
  label,
  icon: Icon,
  accent,
  onClick,
  className,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  accent: NavAccent;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("nav-tab", `nav-tab-${accent}`, className)}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2.5} />
      {label}
    </Link>
  );
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      setSearchResults(searchProducts(searchQuery).slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className="gradient-brand text-white text-center text-xs sm:text-sm py-2.5 px-4">
        <span className="inline-flex items-center gap-1.5 font-semibold flex-wrap justify-center">
          <span className="italic opacity-95">{storeInfo.tagline}</span>
          <span className="hidden sm:inline opacity-60">·</span>
          <span className="hidden sm:inline opacity-95">Order via WhatsApp — No online payment</span>
        </span>
      </div>

      <div className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "glass-nav rounded-[1.75rem] transition-shadow duration-300",
            scrolled && "shadow-[var(--shadow-float)]"
          )}
        >
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex h-[4.25rem] items-center justify-between gap-2 lg:gap-3">
              <Link href="/" className="shrink-0 min-w-0">
                <Logo size="md" />
              </Link>

              <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
                {navLinks.map((link) => (
                  <NavTab key={link.href} {...link} />
                ))}
              </nav>

              <div ref={searchRef} className="hidden md:block relative flex-1 max-w-xs lg:max-w-[15rem] xl:max-w-xs">
                <div className="nav-search-wrap relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-blue pointer-events-none" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 rounded-[inherit]"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                  />
                </div>
                <AnimatePresence>
                  {searchOpen && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      className="absolute top-full mt-2 w-full rounded-2xl glass-card overflow-hidden z-50"
                    >
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/collection?highlight=${product.slug}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-brand-pink/5 transition-colors"
                        >
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={44}
                            height={44}
                            className="rounded-xl object-cover ring-2 ring-[var(--glass-border)]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{product.name}</p>
                            <p className="text-xs text-brand-green font-bold">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden nav-icon-btn nav-icon-btn-cart rounded-xl"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>

                <Link
                  href="/cart"
                  className="relative inline-flex nav-icon-btn nav-icon-btn-cart text-foreground"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-brand-pink px-1 text-[9px] font-bold text-white shadow-md ring-2 ring-white"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </Link>

                <a
                  href={storeInfo.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex nav-whatsapp-bubble"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.header>
      </div>
    </>
  );
}
