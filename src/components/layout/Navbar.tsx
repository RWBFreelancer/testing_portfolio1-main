import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Sun, Moon, Download } from "lucide-react";
import { track } from "@vercel/analytics";
import type { ThemeMode } from "@/types";
import { useCalendlyModal } from "@/hooks/useCalendlyModal";

interface Props {
  theme: ThemeMode;
  onThemeToggle: () => void;
}

const links = [
  { href: "#hero", label: "Home" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export const CV_URL = "/Reynaldo-Binay-an-CV.pdf";

export default function Navbar({ theme, onThemeToggle }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#hero");
  const { openCalendly } = useCalendlyModal();
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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

      <header className={`site-navbar${scrolled ? " scrolled" : ""}${open ? " is-open" : ""}`}>
        {/* No max-width cap: the pill is already capped at 1320px, and a 1280px
            cap inside it re-centred the row and broke the left edge. lg:px-10
            is 40px, the same side padding the hero text and the card row use. */}
        <nav className="relative mx-auto flex h-16 w-full items-center justify-between gap-2 px-5 sm:px-6 lg:px-10">
          {/* Left: Logo */}
          <a href="#hero" className="site-navbar__logo">
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
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    setActiveHref(l.href);
                    document
                      .getElementById(l.href.slice(1))
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`site-navbar__link text-sm${activeHref === l.href ? " active" : ""}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: CTA + icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Recruiters copy your history into their own tracker; give them the file. */}
            <a
              href={CV_URL}
              download
              onClick={() => track("cv_download", { from: "navbar" })}
              className="site-navbar__cv hidden items-center gap-1.5 text-sm lg:inline-flex"
            >
              <Download className="h-4 w-4" aria-hidden />
              CV
            </a>
            {/* Visible on every width: most job-board visitors arrive on a phone. */}
            <button
              type="button"
              onClick={openCalendly}
              aria-label="Book a discovery call"
              className="site-navbar__cta h-10 shrink-0 items-center gap-2 whitespace-nowrap !px-4 text-[13px] sm:!px-6 sm:text-sm"
            >
              Book a Call{" "}
              <span aria-hidden className="hidden sm:inline">
                →
              </span>
            </button>
            <button
              onClick={onThemeToggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="site-navbar__theme-toggle"
            >
              <Sun
                className={`site-navbar__theme-icon h-5 w-5${theme === "dark" ? " active" : ""}`}
              />
              <Moon
                className={`site-navbar__theme-icon h-5 w-5${theme === "light" ? " active" : ""}`}
              />
            </button>
            <button
              ref={menuButtonRef}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              className="site-navbar__menu-toggle grid h-10 w-10 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown panel - inside header so it inherits z-50 */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id="mobile-nav-panel"
              key="mobile-panel"
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="site-navbar__panel relative z-50 overflow-hidden border-t border-border md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <ul className="flex flex-col items-stretch gap-1 px-4 py-3 text-center">
                {links.map((l) => (
                  <li key={l.href} className="w-full">
                    <a
                      href={l.href}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                        e.preventDefault();
                        setActiveHref(l.href);
                        setOpen(false);
                        setTimeout(() => {
                          document
                            .getElementById(l.href.slice(1))
                            ?.scrollIntoView({ behavior: "smooth" });
                        }, 50);
                      }}
                      className={`site-navbar__link block w-full rounded-[14px] px-3 py-3 text-center text-base font-medium${
                        activeHref === l.href ? " active" : ""
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="w-full pt-2">
                  <a
                    href={CV_URL}
                    download
                    onClick={() => {
                      track("cv_download", { from: "mobile-menu" });
                      setOpen(false);
                    }}
                    className="site-navbar__cv flex w-full items-center justify-center gap-2 text-base font-medium"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    Download CV
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
