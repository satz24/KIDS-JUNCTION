"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl gradient-brand p-8 md:p-16 text-center text-white">
            {/* Decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
            />

            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm">
                <Gift className="h-4 w-4" />
                Get 10% off your first order
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Join the Kids Junction Family
              </h2>
              <p className="text-white/80 text-sm md:text-base">
                Subscribe for exclusive deals, new arrivals, and parenting tips
                delivered to your inbox.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-lg font-semibold"
                >
                  <Sparkles className="h-5 w-5" />
                  Welcome to the family! Check your inbox.
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-white text-foreground border-0 h-12 rounded-xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-white text-brand-green hover:bg-white/90 shadow-lg h-12 rounded-xl font-bold"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
