"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  className,
}: AnimatedCounterProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          spring.set(value);
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, spring, hasAnimated]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
