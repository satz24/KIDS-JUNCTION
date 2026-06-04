"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Leaf, Tag, Shield, Sparkles, Users, ExternalLink } from "lucide-react";
import { storeInfo } from "@/lib/data/store";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/scroll-reveal";
import { GoogleReviewsPanel } from "@/components/home/google-reviews-panel";
import { useGoogleReviews } from "@/hooks/use-google-reviews";

const highlights = [
  {
    icon: Heart,
    title: "Built on Trust",
    description: "Families across Guduvanchery choose us for safe, quality products their kids love.",
    gradient: "from-brand-pink to-brand-pink-dark",
  },
  {
    icon: Leaf,
    title: "Kids-Safe Materials",
    description: "Non-toxic, hypoallergenic fabrics and toys — every item checked for child safety.",
    gradient: "from-brand-green to-brand-green-dark",
  },
  {
    icon: Tag,
    title: "Affordable Pricing",
    description: "Premium quality without the premium price. Great value for growing families.",
    gradient: "from-sky-400 to-brand-green",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Handpicked products from trusted brands. We stand behind every item we sell.",
    gradient: "from-lavender to-brand-pink",
  },
];

export function AboutSection() {
  const { data } = useGoogleReviews();
  const reviewsUrl = data?.profileUrl ?? storeInfo.googleReviews.url;

  const stats = [
    { value: 13, suffix: "+", label: "Years Serving Families", href: undefined },
    { value: 2, suffix: "k+", label: "Products", href: undefined },
    {
      value: 4.9,
      suffix: "★",
      label: "Google Rating",
      href: reviewsUrl,
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 section-bg-green section-glow relative theme-surface">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-brand-pink italic text-sm mb-2">{storeInfo.tagline}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-brand-green">Kids Junction</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">{storeInfo.about}</p>
          <div className="mt-5 flex justify-center">
            <GoogleReviewsPanel variant="compact" />
          </div>
        </ScrollReveal>

        <ScrollReveal className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-14">
          {stats.map((stat) => {
            const content = (
              <>
                <p className="font-display text-2xl font-bold text-gradient-brand">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.suffix === "★" && stat.value % 1 !== 0 ? 1 : 0}
                  />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </>
            );

            if (stat.href) {
              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-center glass-card rounded-3xl py-5 px-2 transition-all hover:-translate-y-1 border border-[var(--glass-border)]"
                >
                  {content}
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-brand-green opacity-0 group-hover:opacity-100 transition-opacity">
                    View on Google
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </Link>
              );
            }

            return (
              <div key={stat.label} className="text-center glass-card rounded-3xl py-5 px-2">
                {content}
              </div>
            );
          })}
        </ScrollReveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -6 }}
                className="rounded-3xl glass-card p-6 h-full hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} mb-4 shadow-md`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-sm">
            <Users className="h-4 w-4 text-brand-green" />
            <span className="text-muted-foreground">
              Proudly serving <strong className="text-foreground">Guduvanchery</strong> & nearby areas
            </span>
            <Sparkles className="h-4 w-4 text-brand-pink" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
