"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] hidden md:block"
      animate={{
        x: position.x - 200,
        y: position.y - 200,
        opacity: isVisible ? 0.15 : 0,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
    >
      <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-r from-brand-green/40 via-brand-pink/30 to-brand-green/40 blur-3xl" />
    </motion.div>
  );
}
