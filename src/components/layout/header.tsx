"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Home,
  Grid3X3,
  Heart,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { resolveImageSrc } from "@/lib/brand/logo-asset";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store/cart-store";
import { searchProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type SectionId = "home" | "collections" | "collection" | "about" | "contact";

const navLinks: {
  href: string;
  label: string;
  icon: LucideIcon;
  section: SectionId;
}[] = [
  { href: "/#home", label: "Home", icon: Home, section: "home" },
  { href: "/#collection", label: "Shop", icon: Grid3X3, section: "collection" },
  { href: "/#about", label: "About", icon: Heart, section: "about" },
  { href: "/#contact", label: "Visit", icon: MapPin, section: "contact" },
];

function PremiumNavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("premium-nav-link", active && "premium-nav-link--active")}
    >
      {active && (
        <motion.span
          layoutId="premium-nav-indicator"
          className="premium-nav-link__indicator"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <Icon className="premium-nav-link__icon" strokeWidth={2.25} />
      <span>{label}</span>
    </Link>
  );
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds: SectionId[] = ["home", "collections", "collection", "about", "contact"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id as SectionId);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      setSearchResults(searchProducts(searchQuery).slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) {
      mobileSearchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const renderSearchResults = () =>
    searchResults.map((product) => (
      <Link
        key={product.id}
        href={`/collection?highlight=${product.slug}`}
        onClick={closeSearch}
        className="flex items-center gap-3 p-3 hover:bg-brand-pink/5 transition-colors"
      >
        <Image
          src={resolveImageSrc(product.images[0])}
          alt={product.name}
          width={44}
          height={44}
          className="rounded-xl object-cover ring-2 ring-[var(--glass-border)]"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{product.name}</p>
          <p className="text-xs text-brand-mint font-bold">{formatPrice(product.price)}</p>
        </div>
      </Link>
    ));

  return (
    <>
      <AnnouncementBar />

      <div className="premium-nav-shell">
        <motion.header
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn("premium-nav-bar", scrolled && "premium-nav-bar--scrolled")}
        >
          <div className="container mx-auto px-3 sm:px-5">
            <div ref={searchRef}>
              <div className="flex h-[4.5rem] items-center justify-between gap-3">
                <Link href="/" className="shrink-0 min-w-0 premium-nav-logo">
                  <Logo size="md" />
                </Link>

                <nav className="hidden lg:flex items-center premium-nav-pill">
                  {navLinks.map((link) => (
                    <PremiumNavLink
                      key={link.href}
                      {...link}
                      active={activeSection === link.section}
                    />
                  ))}
                </nav>

                <div className="hidden md:block relative flex-1 max-w-xs lg:max-w-[15rem]">
                  <div className="premium-search-wrap relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-blue pointer-events-none" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 rounded-[inherit] text-sm"
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
                        className="absolute top-full mt-2 w-full rounded-2xl premium-glass-panel overflow-hidden z-50"
                      >
                        {renderSearchResults()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="md:hidden premium-icon-btn"
                    onClick={() => setSearchOpen((open) => !open)}
                    aria-label="Search"
                    aria-expanded={searchOpen}
                  >
                    <Search className="h-5 w-5" />
                  </Button>

                  <Link href="/cart" className="relative premium-icon-btn" aria-label="Cart">
                    <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.25} />
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-brand-pink px-1 text-[9px] font-bold text-white shadow-lg ring-2 ring-white"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </Link>
                </div>
              </div>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="md:hidden overflow-hidden border-t border-white/70 pt-3 pb-3"
                  >
                    <div className="premium-search-wrap relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-blue pointer-events-none" />
                      <Input
                        ref={mobileSearchInputRef}
                        placeholder="Search products..."
                        className="pl-10 h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 rounded-[inherit] text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {searchResults.length > 0 && (
                      <div className="mt-2 rounded-2xl premium-glass-panel overflow-hidden">
                        {renderSearchResults()}
                      </div>
                    )}
                    {searchQuery.length > 1 && searchResults.length === 0 && (
                      <p className="mt-2 px-2 py-3 text-sm text-muted-foreground text-center">
                        No products found.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>
      </div>
    </>
  );
}
