"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Leaf,
  Truck,
  RotateCcw,
  Tag,
  BadgeCheck,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/shared/scroll-reveal";

const features = [
  {
    icon: Shield,
    title: "Safe Products",
    description: "Every item is rigorously safety-tested and certified for kids of all ages.",
    color: "from-brand-green to-brand-green-dark",
  },
  {
    icon: Leaf,
    title: "Kid-Friendly Materials",
    description: "Organic cotton, non-toxic paints, and hypoallergenic fabrics only.",
    color: "from-brand-pink to-brand-pink-dark",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Free shipping on orders $50+. Most orders arrive within 2-3 business days.",
    color: "from-brand-green-light to-brand-green",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns. We make exchanges simple for growing kids.",
    color: "from-brand-pink-light to-brand-pink",
  },
  {
    icon: Tag,
    title: "Affordable Pricing",
    description: "Premium quality without the premium price tag. Great value for families.",
    color: "from-brand-green to-brand-pink",
  },
  {
    icon: BadgeCheck,
    title: "Quality Checked",
    description: "Hand-inspected by our team before shipping. Only the best reaches your door.",
    color: "from-brand-pink to-brand-green",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 section-glow relative">
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Why Parents Choose Kids Junction
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We go the extra mile so you can shop with complete peace of mind
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative p-6 rounded-2xl border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
