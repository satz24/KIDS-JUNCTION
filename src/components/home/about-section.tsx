"use client";

import { motion } from "framer-motion";
import { Heart, Leaf, Tag, Shield, Sparkles, Users } from "lucide-react";
import { storeInfo } from "@/lib/data/store";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/scroll-reveal";

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
  return (
    <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-background to-brand-green/5">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-brand-pink italic text-sm mb-2">{storeInfo.tagline}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-brand-green">Kids Junction</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">{storeInfo.about}</p>
        </ScrollReveal>

        <ScrollReveal className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-14">
          {[
            { value: 10, suffix: "+", label: "Years Serving Families" },
            { value: 500, suffix: "+", label: "Products" },
            { value: 4.9, suffix: "★", label: "Customer Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center glass rounded-2xl py-4">
              <p className="font-display text-2xl font-bold text-gradient-brand">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </ScrollReveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -6 }}
                className="rounded-2xl border bg-card p-6 h-full shadow-sm hover:shadow-lg transition-shadow"
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
