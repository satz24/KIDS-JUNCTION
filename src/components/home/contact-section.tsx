"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Smile,
  ExternalLink,
} from "lucide-react";
import { storeInfo } from "@/lib/data/store";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { FacebookIcon, InstagramIcon } from "@/components/brand/social-icons";

export function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-transparent to-brand-pink/5 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Visit <span className="text-brand-green">Us</span> Today
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Walk into our store or reach out — we&apos;re happy to help you find the perfect products
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="rounded-3xl overflow-hidden border shadow-lg h-64 lg:h-full min-h-[280px]">
              <iframe
                src={storeInfo.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 280 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kids Junction location"
                className="w-full h-full"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="rounded-3xl border bg-card p-6 md:p-8 shadow-lg space-y-6 h-full">
              <Logo size="md" />

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Store Timings</p>
                    <p className="text-sm text-muted-foreground">
                      Mon – Sat: {storeInfo.timings.weekdays}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sunday: {storeInfo.timings.sunday}
                    </p>
                    <p className="text-xs text-brand-green mt-1">{storeInfo.timings.note}</p>
                  </div>
                </div>

                <a href={`https://maps.google.com/?q=${encodeURIComponent(storeInfo.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="flex gap-3 group">
                  <MapPin className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Address</p>
                    <p className="text-sm text-muted-foreground group-hover:text-brand-pink transition-colors">
                      {storeInfo.address}
                    </p>
                  </div>
                </a>

                <a href={storeInfo.landlineLink} className="flex gap-3 group">
                  <Phone className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <p className="text-sm text-brand-green font-medium group-hover:underline">
                      {storeInfo.landline}
                    </p>
                  </div>
                </a>
              </div>

              <div>
                <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Smile className="h-4 w-4 text-brand-pink" /> We Offer
                </p>
                <div className="flex flex-wrap gap-2">
                  {storeInfo.products.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1 rounded-full bg-muted font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href={storeInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button size="lg" variant="gradient" className="w-full">
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp Us
                  </Button>
                </a>
                <a href={storeInfo.instagram.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full gap-2">
                    <InstagramIcon className="h-4 w-4" />
                    Instagram
                  </Button>
                </a>
              </div>

              <div className="flex gap-3">
                <a
                  href={storeInfo.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-pink transition-colors"
                >
                  <FacebookIcon className="h-4 w-4" />
                  {storeInfo.facebook.handle}
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(storeInfo.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-green transition-colors ml-auto"
                >
                  <ExternalLink className="h-4 w-4" />
                  Directions
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
