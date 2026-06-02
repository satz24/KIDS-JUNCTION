"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { PageTransition } from "@/components/shared/page-transition";

export function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen theme-surface" style={{ background: "var(--bg-primary)" }}>
        {children}
      </div>
    );
  }

  return (
    <>
      <LoadingScreen />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
