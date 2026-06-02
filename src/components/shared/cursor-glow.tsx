"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

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
    <>
      <motion.div
        className="pointer-events-none fixed z-[9999] hidden md:block mix-blend-normal"
        animate={{
          x: position.x - 180,
          y: position.y - 180,
          opacity: isVisible ? 0.14 : 0,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.6 }}
      >
        <div
          className="h-[360px] w-[360px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,203,0.35) 0%, rgba(106,190,255,0.25) 45%, rgba(107,255,175,0.2) 70%, transparent 75%)",
          }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed z-[9998] hidden md:block h-3 w-3 rounded-full border border-brand-pink/40 bg-brand-pink/20"
        animate={{
          x: position.x - 6,
          y: position.y - 6,
          opacity: isVisible ? 0.8 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.2 }}
      />
    </>
  );
}
