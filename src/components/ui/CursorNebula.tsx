import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The layers of the pointer nebula, back to front.
 *
 * `chase` is the fraction of the remaining distance each layer closes per
 * frame. They differ on purpose: the core sits almost on the cursor, and the
 * two clouds fall behind it by different amounts, so a fast flick pulls the
 * outer cloud away from the inner one and the pair drifts back together when
 * the hand stops. One speed for all three would read as a single blurred dot.
 */
const LAYERS = [
  { key: "b", className: "cursor-neb__cloud cursor-neb__cloud--b", chase: 0.055 },
  { key: "a", className: "cursor-neb__cloud cursor-neb__cloud--a", chase: 0.1 },
  { key: "core", className: "cursor-neb__core", chase: 0.34 },
] as const;

/** Below this many pixels of remaining travel the layer has arrived, and a
 *  further frame would move it by less than the screen can show. */
const SETTLED = 0.1;

/**
 * A nebula that trails the mouse pointer.
 *
 * Mouse only. A finger has no hover, so there is nothing to trail, and a
 * visitor who asked the OS for less motion gets no layers at all.
 *
 * Every position is written straight onto the DOM node as a transform, exactly
 * as the card tilt does. Nothing goes through React state, so moving the mouse
 * across the page never re-renders the tree. The loop is not free-running
 * either: it stops as soon as all three layers have caught up with the cursor,
 * and the next pointer move starts it again. A still hand costs nothing.
 */
export default function CursorNebula() {
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    // Mouse only, decided once: a touch screen has no pointer to follow.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = rootRef.current;
    if (!root) return;
    const nodes = Array.from(root.children) as HTMLElement[];
    if (nodes.length !== LAYERS.length) return;

    // Start every layer at the centre of the screen. Starting at 0,0 would
    // throw the whole nebula in from the top-left corner on the first move.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = LAYERS.map(() => ({ ...target }));
    let frame = 0;
    let running = false;

    const loop = () => {
      let moving = false;

      for (let i = 0; i < nodes.length; i++) {
        const p = pos[i];
        p.x += (target.x - p.x) * LAYERS[i].chase;
        p.y += (target.y - p.y) * LAYERS[i].chase;

        if (Math.abs(target.x - p.x) > SETTLED || Math.abs(target.y - p.y) > SETTLED) {
          moving = true;
        }

        // translate3d first so the compositor handles it, then the centring
        // shift. The element itself is anchored at the top-left of the screen.
        nodes[i].style.transform =
          `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      }

      // Nothing left to catch up to, so stop asking for frames.
      if (!moving) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      // A pen or a touch can raise a pointer event on a machine that also has
      // a mouse. Only the mouse gets a trail.
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      root.dataset.live = "true";
      kick();
    };

    // Off the page, or the window lost focus: fade out rather than leaving a
    // nebula parked wherever the cursor happened to exit.
    const onLeave = () => {
      delete root.dataset.live;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
        onLeave();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [shouldReduceMotion]);

  // Rendered even under reduced motion, and simply never lit: the effect costs
  // one empty container, and the branch keeps the hook order fixed.
  return (
    <div ref={rootRef} className="cursor-neb" aria-hidden>
      {LAYERS.map((l) => (
        <span key={l.key} className={l.className} />
      ))}
    </div>
  );
}
