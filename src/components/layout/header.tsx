"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, MessageCircle, ShoppingBag, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/brand/logo";
import { storeInfo } from "@/lib/data/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart-store";
import { searchProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import type { Product } from "@/types";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#collection", label: "Collection" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => setMounted(true), []);

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
      <div className="gradient-brand text-white text-center text-xs sm:text-sm py-2 px-4">
        <span className="inline-flex items-center gap-1.5 font-medium flex-wrap justify-center">
          <span className="italic">{storeInfo.tagline}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Order via WhatsApp — No online payment</span>
        </span>
      </div>

      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link href="/" className="shrink-0">
              <Logo size="md" />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-brand-green rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div ref={searchRef} className="hidden md:block relative flex-1 max-w-xs lg:max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 bg-muted/50 border-0 h-10"
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
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full mt-2 w-full rounded-2xl border bg-card shadow-xl overflow-hidden z-50"
                  >
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/collection?highlight=${product.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={44}
                          height={44}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-brand-green font-semibold">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}

              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </Button>
              </Link>

              <a href={storeInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
                <Button size="sm" variant="gradient">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </a>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/cart" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full mt-2">
                    <ShoppingBag className="h-4 w-4" />
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </Button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
