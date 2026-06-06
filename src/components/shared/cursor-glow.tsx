"use client";

import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) return;

    setEnabled(true);
    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    let cardHover = false;

    const animate = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX - 200}px, ${currentY - 200}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX - 5}px, ${targetY - 5}px, 0)`;
      }
      if (ringRef.current) {
        const scale = cardHover ? 1.35 : 1;
        ringRef.current.style.transform = `translate3d(${currentX - 22}px, ${currentY - 22}px, 0) scale(${scale})`;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (glowRef.current) glowRef.current.style.opacity = "0.18";
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "0.55";

      const target = (e.target as HTMLElement | null)?.closest("[data-cursor-card]");
      cardHover = Boolean(target);
      if (ringRef.current) {
        ringRef.current.style.borderColor = cardHover
          ? "rgba(255, 95, 183, 0.55)"
          : "rgba(103, 199, 255, 0.35)";
      }
    };

    const handleLeave = () => {
      if (glowRef.current) glowRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0 z-[9997] hidden md:block opacity-0 will-change-transform"
      >
        <div className="cursor-glow-aura" />
      </div>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block h-11 w-11 rounded-full border opacity-0 will-change-transform transition-[scale,border-color] duration-300"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block h-2.5 w-2.5 rounded-full opacity-0 will-change-transform cursor-glow-dot"
      />
    </>
  );
}
