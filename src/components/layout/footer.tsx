"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MapPin, MessageCircle, Clock, Shield, Heart, Star } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { FacebookIcon, InstagramIcon } from "@/components/brand/social-icons";
import { storeInfo } from "@/lib/data/store";

const trustItems = [
  { icon: Shield, label: "Quality Assured" },
  { icon: Heart, label: "Parent Trusted" },
  { icon: Star, label: "5★ Rated Store" },
];

export function Footer() {
  return (
    <footer className="relative glass-nav border-t mt-auto overflow-hidden theme-surface">
      <div className="absolute inset-0 rainbow-accent pointer-events-none opacity-80" />

      <div className="container mx-auto px-4 py-14 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <p className="text-brand-pink italic text-sm font-semibold">{storeInfo.tagline}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {storeInfo.about}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {trustItems.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-green" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold mb-4 text-brand-green">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Collections", href: "/#collections" },
                { label: "Collection", href: "/#collection" },
                { label: "About Us", href: "/#about" },
                { label: "Contact", href: "/#contact" },
                { label: "Full Collection", href: "/collection" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-brand-pink transition-colors font-medium hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold mb-4 text-brand-pink">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                {storeInfo.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-green" />
                <a href={storeInfo.landlineLink} className="hover:text-brand-green transition-colors">
                  {storeInfo.landline}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-brand-green" />
                <a href={storeInfo.whatsappLink} className="hover:text-brand-green transition-colors">
                  {storeInfo.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-green" />
                {storeInfo.timings.weekdays}
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href={storeInfo.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl glass-card text-brand-pink hover:gradient-brand hover:text-white transition-all"
              >
                <FacebookIcon className="h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href={storeInfo.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl glass-card text-brand-pink hover:gradient-brand hover:text-white transition-all"
              >
                <InstagramIcon className="h-4 w-4" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border-color)] text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {storeInfo.name}. Order via WhatsApp — visit store to purchase.
        </div>
      </div>
    </footer>
  );
}
