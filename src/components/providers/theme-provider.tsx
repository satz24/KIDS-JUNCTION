"use client";

import { useEffect, type ReactNode } from "react";
import { applyThemeToDocument, useThemeStore } from "@/lib/store/theme-store";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return children;
}
