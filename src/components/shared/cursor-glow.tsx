"use client";

import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) return;

    setEnabled(true);
    let rafId = 0;

    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const { clientX: x, clientY: y } = e;
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${x - 180}px, ${y - 180}px, 0)`;
          glowRef.current.style.opacity = "0.14";
        }
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${x - 6}px, ${y - 6}px, 0)`;
          dotRef.current.style.opacity = "0.8";
        }
      });
    };

    const handleLeave = () => {
      if (glowRef.current) glowRef.current.style.opacity = "0";
      if (dotRef.current) dotRef.current.style.opacity = "0";
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
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block mix-blend-normal opacity-0 will-change-transform"
        style={{ transition: "opacity 0.2s ease" }}
      >
        <div
          className="h-[360px] w-[360px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,203,0.35) 0%, rgba(106,190,255,0.25) 45%, rgba(107,255,175,0.2) 70%, transparent 75%)",
          }}
        />
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block h-3 w-3 rounded-full border border-brand-pink/40 bg-brand-pink/20 opacity-0 will-change-transform"
        style={{ transition: "opacity 0.2s ease" }}
      />
    </>
  );
}
