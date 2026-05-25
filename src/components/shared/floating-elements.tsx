"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  Shirt,
  Baby,
  Car,
  Puzzle,
  Gift,
  Sparkles,
  Cloud,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingItem = {
  icon: ComponentType<{ className?: string }>;
  label?: string;
  color: "green" | "pink" | "mixed";
  size: "sm" | "md" | "lg";
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay: number;
  duration: number;
  rotate?: number;
};

const items: FloatingItem[] = [
  { icon: Star, color: "pink", size: "md", top: "8%", left: "6%", delay: 0, duration: 5, rotate: 12 },
  { icon: Shirt, color: "green", size: "lg", top: "18%", right: "8%", delay: 0.4, duration: 6 },
  { icon: Heart, color: "pink", size: "sm", top: "45%", left: "4%", delay: 0.8, duration: 4.5 },
  { icon: Puzzle, color: "green", size: "md", bottom: "22%", left: "12%", delay: 1.2, duration: 5.5, rotate: -8 },
  { icon: Car, color: "pink", size: "md", bottom: "12%", right: "10%", delay: 0.6, duration: 4.8 },
  { icon: Baby, color: "green", size: "sm", top: "55%", right: "5%", delay: 1.5, duration: 6.2 },
  { icon: Gift, color: "mixed", size: "md", top: "30%", left: "15%", delay: 2, duration: 5.8, rotate: 6 },
  { icon: Crown, color: "pink", size: "sm", bottom: "35%", right: "18%", delay: 1, duration: 4.2 },
  { icon: Cloud, color: "green", size: "lg", top: "5%", right: "22%", delay: 0.3, duration: 7 },
  { icon: Sparkles, color: "pink", size: "sm", bottom: "8%", left: "25%", delay: 1.8, duration: 5 },
];

const colorStyles = {
  green: "bg-brand-green/15 text-brand-green border-brand-green/25 shadow-brand-green/10",
  pink: "bg-brand-pink/15 text-brand-pink border-brand-pink/25 shadow-brand-pink/10",
  mixed: "bg-gradient-to-br from-brand-green/15 to-brand-pink/15 text-brand-green border-brand-green/20 shadow-brand-pink/10",
};

const sizeStyles = {
  sm: "h-10 w-10 [&_svg]:h-4 [&_svg]:w-4",
  md: "h-14 w-14 [&_svg]:h-6 [&_svg]:w-6",
  lg: "h-[4.5rem] w-[4.5rem] [&_svg]:h-8 [&_svg]:w-8",
};

interface FloatingElementsProps {
  className?: string;
  dense?: boolean;
}

export function FloatingElements({ className, dense = false }: FloatingElementsProps) {
  const visibleItems = dense ? items : items.slice(0, 7);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* Soft gradient orbs */}
      <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-brand-pink/10 blur-3xl animate-pulse-soft" style={{ animationDelay: "2s" }} />

      {visibleItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            className={cn(
              "absolute flex items-center justify-center rounded-2xl border backdrop-blur-sm shadow-lg",
              colorStyles[item.color],
              sizeStyles[item.size]
            )}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
            }}
            initial={{ opacity: 0, scale: 0, rotate: item.rotate ?? 0 }}
            animate={{
              opacity: [0.7, 1, 0.7],
              y: [0, -18, 0],
              rotate: [item.rotate ?? 0, (item.rotate ?? 0) + 6, item.rotate ?? 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="drop-shadow-sm" />
          </motion.div>
        );
      })}

      {/* Decorative dots & stars */}
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`dot-${i}`}
          className={cn(
            "absolute rounded-full",
            i % 2 === 0 ? "bg-brand-green/40" : "bg-brand-pink/40",
            i % 3 === 0 ? "h-2 w-2" : "h-1.5 w-1.5"
          )}
          style={{
            top: `${10 + (i * 7) % 80}%`,
            left: `${5 + (i * 11) % 90}%`,
          }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
