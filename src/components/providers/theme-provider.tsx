"use client";

import { useEffect, type ReactNode } from "react";
import { applyThemeToDocument, useThemeStore } from "@/lib/store/theme-store";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const setTheme = useThemeStore((s) => s.setTheme);

  useEffect(() => {
    setTheme("light");
    applyThemeToDocument("light");
  }, [setTheme]);

  return children;
}
