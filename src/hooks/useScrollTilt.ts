import { useState, useEffect, useRef, type RefObject } from "react";

export function useScrollTilt(elementRef: RefObject<HTMLElement | null>, disabled = false) {
  const [tiltDegrees, setTiltDegrees] = useState(0);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | undefined>(undefined);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Under reduced motion the flip transition is instant, so a live tilt would
    // snap between angles on every scroll frame. Hold it flat instead.
    if (disabled) {
      setTiltDegrees(0);
      return;
    }

    const handleScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;
        lastScrollY.current = currentScrollY;
        const el = elementRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) {
          setTiltDegrees(0);
          return;
        }
        const clamped = Math.max(-8, Math.min(8, delta * 0.4));
        setTiltDegrees(clamped);
        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setTiltDegrees(0), 180);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [elementRef, disabled]);

  return { tiltDegrees };
}
