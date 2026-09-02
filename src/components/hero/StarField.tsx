import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** Enough stars to read as a sky, few enough that one paint stays cheap. */
const STAR_COUNT = 90;
/** Pixels per second the whole field drifts left. Slow on purpose: a fast
 *  starfield reads as a screensaver, not as a background. */
const DRIFT_SPEED = 6;

type Star = { x: number; y: number; r: number; alpha: number; twinkle: number };

/**
 * The star field behind the project cards.
 *
 * It is a canvas, not 90 DOM nodes, so the browser paints one layer instead of
 * compositing ninety. The loop stops whenever the hero is off screen, and a
 * visitor who asked for reduced motion gets one static frame and no loop at all.
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap the pixel ratio at 2. A 3x phone screen triples the fill cost of a
    // background nobody looks at directly.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let last = 0;
    let offset = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.3,
        alpha: 0.2 + Math.random() * 0.55,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    // The star colour follows the theme, so the field stays visible on the
    // light nebula and does not glare on the dark one.
    const starColor = () =>
      document.documentElement.classList.contains("dark") ? "255, 255, 255" : "40, 70, 140";

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const rgb = starColor();

      for (const s of stars) {
        // Wrap the drift by hand instead of moving each star, so the array
        // itself never has to be rewritten.
        let x = s.x - offset;
        x = ((x % width) + width) % width;

        const pulse = shouldReduceMotion ? 1 : 0.75 + 0.25 * Math.sin(t / 1400 + s.twinkle);
        ctx.beginPath();
        ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${s.alpha * pulse})`;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      const dt = last ? (t - last) / 1000 : 0;
      last = t;
      offset += DRIFT_SPEED * dt;
      draw(t);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || shouldReduceMotion) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    seed();
    draw(0);

    // No point burning frames on a sky the visitor has scrolled past.
    const visibility = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    visibility.observe(canvas);

    const resize = new ResizeObserver(() => {
      seed();
      draw(0);
    });
    resize.observe(canvas);

    // The theme toggle swaps a class on <html>; repaint once so a paused
    // field does not keep the old colour.
    const theme = new MutationObserver(() => draw(0));
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onHidden = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onHidden);

    return () => {
      stop();
      visibility.disconnect();
      resize.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [shouldReduceMotion]);

  return <canvas ref={canvasRef} className="hero-holo__sky" aria-hidden />;
}
