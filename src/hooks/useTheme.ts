import { useState, useEffect } from "react";
import type { ThemeMode } from "@/types";
import { syncBackgroundLayer } from "@/lib/background-layer";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored =
      (typeof window !== "undefined" && (localStorage.getItem("theme") as ThemeMode | null)) ||
      null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    syncBackgroundLayer(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}
