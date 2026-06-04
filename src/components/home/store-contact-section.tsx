"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  MessageCircle,
  Smile,
  ExternalLink,
} from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/brand/social-icons";
import { storeInfo } from "@/lib/data/store";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export function StoreContactSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-background to-brand-pink/5 pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <ScrollReveal className="text-center mb-12">
          <p className="text-brand-pink italic text-sm mb-2">{storeInfo.tagline}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Visit <span className="text-brand-green">Kids</span>{" "}
            <span className="text-brand-pink">Junction</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your trusted local baby shop in Guduvanchery — visit us in store or reach out anytime
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact card */}
          <ScrollReveal>
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border bg-card p-6 md:p-8 shadow-lg h-full"
            >
              <Logo size="lg" className="mb-6" />

              <div className="space-y-5">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(storeInfo.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">Store Address</p>
                    <p className="text-sm text-muted-foreground group-hover:text-brand-pink transition-colors">
                      {storeInfo.address}
                    </p>
                  </div>
                </a>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">Phone</p>
                    <a
                      href={storeInfo.mobileLink}
                      className="block text-sm text-brand-green font-medium hover:underline"
                    >
                      {storeInfo.mobile}
                    </a>
                    <a
                      href={storeInfo.landlineLink}
                      className="block text-sm text-brand-green font-medium hover:underline mt-1"
                    >
                      {storeInfo.landline}
                    </a>
                  </div>
                </div>

                <a
                  href={storeInfo.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">WhatsApp</p>
                    <p className="text-sm text-brand-green font-medium group-hover:underline">
                      {storeInfo.whatsappDisplay}
                    </p>
                  </div>
                </a>

                <div className="flex gap-3 pt-2">
                  <a
                    href={storeInfo.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-brand-pink/10 px-4 py-2.5 text-sm font-medium text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
                  >
                    <FacebookIcon className="h-4 w-4" />
                    {storeInfo.facebook.handle}
                  </a>
                  <a
                    href={storeInfo.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-brand-pink/10 px-4 py-2.5 text-sm font-medium text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    {storeInfo.instagram.handle}
                  </a>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Products & CTA */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-3xl gradient-brand p-6 md:p-8 text-white h-full flex flex-col">
              <h3 className="font-display text-xl font-bold mb-6">What We Offer</h3>
              <ul className="space-y-3 flex-1">
                {storeInfo.products.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <Smile className="h-5 w-5 shrink-0 opacity-90" />
                    <span className="font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a href={storeInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-white text-brand-green hover:bg-white/90 font-bold"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </Button>
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(storeInfo.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/40 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Get Directions
                  </Button>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
