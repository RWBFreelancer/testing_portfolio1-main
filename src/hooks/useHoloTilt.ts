import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** Degrees of tilt at the very corner of the card. Past about 8 the text edge
 *  starts to shear and the card reads as a toy rather than a panel. */
const MAX_TILT = 6.5;
/** How far the thumbnail slides against the tilt. The image is scaled 1.09, so
 *  this has to stay well inside the slack that scale creates. */
const PARALLAX = 9;

/**
 * Pointer-driven 3D tilt for one card.
 *
 * Everything the pointer drives is written straight to CSS custom properties
 * on the element. Nothing goes through React state, so moving the mouse across
 * a card repaints but never re-renders the tree — the old flip deck re-rendered
 * eight cards on every hover change and it showed.
 *
 * Writes are batched into one animation frame, so a mouse reporting at 1000 Hz
 * still only touches the DOM once per painted frame.
 */
export function useHoloTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const apply = useCallback(() => {
    frame.current = 0;
    const el = ref.current;
    const point = pending.current;
    if (!el || !point) return;

    const { width, height } = el.getBoundingClientRect();
    if (!width || !height) return;

    // -1 at the left/top edge, +1 at the right/bottom edge.
    const nx = (point.x / width) * 2 - 1;
    const ny = (point.y / height) * 2 - 1;

    // Pointing at the top tips the top edge away, which is what a real panel
    // under a finger does, so rotateX takes the negative.
    el.style.setProperty("--ry", `${(nx * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-ny * MAX_TILT).toFixed(2)}deg`);

    // The image slides against the tilt. Moving with it would read as the
    // image being painted on the glass instead of sitting behind it.
    el.style.setProperty("--px", `${(-nx * PARALLAX).toFixed(2)}px`);
    el.style.setProperty("--py", `${(-ny * PARALLAX).toFixed(2)}px`);

    el.style.setProperty("--mx", `${((point.x / width) * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${((point.y / height) * 100).toFixed(2)}%`);

    // The rake of the rim highlight follows the pointer around the card.
    const angle = (Math.atan2(ny, nx) * 180) / Math.PI + 90;
    el.style.setProperty("--rim-angle", `${angle.toFixed(1)}deg`);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      // Touch and pen have no hover state, so a tilt would latch on at the
      // first tap and stay there until the next one.
      if (shouldReduceMotion || e.pointerType !== "mouse") return;

      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      pending.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      el.dataset.tilting = "true";

      if (!frame.current) frame.current = requestAnimationFrame(apply);
    },
    [apply, shouldReduceMotion],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    pending.current = null;

    // Dropping data-tilting swaps the transition back to the slow ease, so the
    // card settles home instead of snapping.
    delete el.dataset.tilting;
    for (const prop of ["--rx", "--ry", "--px", "--py"]) el.style.removeProperty(prop);
  }, []);

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return { ref, onPointerMove, onPointerLeave };
}
