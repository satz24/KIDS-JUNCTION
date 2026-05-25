"use client";

import confetti from "canvas-confetti";

export function triggerConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ["#22c55e", "#ec4899", "#86efac", "#f9a8d4", "#4ade80"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ["#22c55e", "#ec4899", "#86efac", "#f9a8d4", "#4ade80"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#5b9fd4", "#f9a8d4", "#fde68a", "#c4b5fd", "#6ee7b7"],
  });

  frame();
}
