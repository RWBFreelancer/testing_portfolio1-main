import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import type { ThemeMode } from "@/types";
import { useCalendlyModal } from "@/hooks/useCalendlyModal";

interface Props {
  theme: ThemeMode;
  onThemeToggle: () => void;
}

const links = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ theme, onThemeToggle }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#hero");
  const { openCalendly } = useCalendlyModal();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);

      let currentHref = "#hero";
      for (const link of links) {
        const element = document.getElementById(link.href.slice(1));
        if (element && element.getBoundingClientRect().top <= 120) {
          currentHref = link.href;
        }
      }

      setActiveHref(currentHref);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Backdrop overlay - rendered OUTSIDE header to avoid stacking context traps */}
      <AnimatePresence>
        {open && (
          <motion.button
            key="mobile-backdrop"
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <header className={`site-navbar${scrolled ? " scrolled" : ""}`}>
        <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <a href="#hero" className="site-navbar__logo font-display text-2xl">
            <span className="site-navbar__logo-bin">Bin</span>
            <span className="site-navbar__logo-ai">AI</span>
          </a>

          {/* Center: absolutely centered nav links (desktop) */}
          <ul className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
            {links.map((l) => (
              <li key={l.href} className="pointer-events-auto">
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveHref(l.href);
                    document.getElementById(l.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`site-navbar__link text-sm${
                    activeHref === l.href ? " active" : ""
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: CTA + icons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCalendly}
              aria-label="Book a discovery call"
              className="site-navbar__cta hidden items-center gap-2 text-sm sm:inline-flex"
            >
              Book a Call <span aria-hidden>→</span>
            </button>
            <button
              onClick={onThemeToggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="site-navbar__theme-toggle"
            >
              <Sun
                className={`site-navbar__theme-icon h-5 w-5${
                  theme === "dark" ? " active" : ""
                }`}
              />
              <Moon
                className={`site-navbar__theme-icon h-5 w-5${
                  theme === "light" ? " active" : ""
                }`}
              />
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              className="grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown panel - inside header so it inherits z-50 */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav-panel"
              key="mobile-panel"
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-50 overflow-hidden border-t border-border md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <ul className="flex flex-col items-center justify-center gap-2 px-4 py-4 text-center">
                {links.map((l) => (
                  <li key={l.href} className="w-full">
                    <a
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveHref(l.href);
                        setOpen(false);
                        setTimeout(() => {
                          document.getElementById(l.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
                        }, 50);
                      }}
                      className={`site-navbar__link block w-full px-3 py-4 text-center text-base font-medium${
                        activeHref === l.href ? " active" : ""
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="w-full pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openCalendly();
                    }}
                    className="site-navbar__cta flex w-full items-center justify-center gap-2 text-sm font-medium"
                  >
                    Book a Call <span aria-hidden>→</span>
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
