"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MapPin, MessageCircle, Clock, Shield, Heart, Star, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { FacebookIcon, InstagramIcon } from "@/components/brand/social-icons";
import { DecorativeBg } from "@/components/shared/decorative-bg";
import { storeInfo } from "@/lib/data/store";

const trustItems = [
  { icon: Shield, label: "Quality Assured", tone: "mint" },
  { icon: Heart, label: "Parent Trusted", tone: "pink" },
  { icon: Star, label: "4.9★ Rated Store", tone: "blue" },
];

export function Footer() {
  return (
    <footer className="relative premium-footer theme-surface mt-auto overflow-hidden">
      <DecorativeBg variant="default" className="opacity-70" />
      <div className="premium-footer__gradient-bar" aria-hidden />

      <div className="container mx-auto px-4 py-16 md:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="premium-glass-v2 rounded-[1.75rem] p-6 md:p-7 space-y-4"
          >
            <Link href="/">
              <Logo size="md" />
            </Link>
            <p className="text-brand-pink italic text-sm font-semibold">{storeInfo.tagline}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{storeInfo.about}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {trustItems.map(({ icon: Icon, label, tone }) => (
                <span key={label} className={`premium-footer-trust premium-footer-trust--${tone}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="premium-glass-v2 rounded-[1.75rem] p-6 md:p-7"
          >
            <h3 className="font-display font-extrabold mb-4 gradient-text flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-pink" />
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Collections", href: "/#collections" },
                { label: "Shop All", href: "/#collection" },
                { label: "About Us", href: "/#about" },
                { label: "Contact", href: "/#contact" },
                { label: "Full Collection", href: "/collection" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="premium-footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="premium-glass-v2 rounded-[1.75rem] p-6 md:p-7"
          >
            <h3 className="font-display font-extrabold mb-4 gradient-text flex items-center gap-2">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                {storeInfo.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-green" />
                <a href={storeInfo.mobileLink} className="premium-footer-link inline">
                  {storeInfo.mobile}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-green" />
                <a href={storeInfo.landlineLink} className="premium-footer-link inline">
                  {storeInfo.landline}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-brand-green" />
                <a href={storeInfo.whatsappLink} className="premium-footer-link inline">
                  {storeInfo.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-green" />
                {storeInfo.timings.weekdays}
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              <motion.a
                whileHover={{ scale: 1.12, y: -3, rotate: -3 }}
                whileTap={{ scale: 0.96 }}
                href={storeInfo.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-social-btn"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.12, y: -3, rotate: 3 }}
                whileTap={{ scale: 0.96 }}
                href={storeInfo.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-social-btn premium-social-btn--pink"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--glass-border)] text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {storeInfo.name}. Order via WhatsApp — visit store to purchase.
        </div>
      </div>
    </footer>
  );
}
