import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useFlipCard } from "@/hooks/useFlipCard";
import { useScrollTilt } from "@/hooks/useScrollTilt";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import type { Project } from "@/types";

interface FlipCardProps {
  project: Project;
  isFlipped: boolean;
  onFlip: () => void;
  /** False for cards sitting behind the active one in the deck: they are shown
   *  but not flippable, draggable or focusable. */
  interactive?: boolean;
}

export default function FlipCard({
  project,
  isFlipped,
  onFlip,
  interactive = true,
}: FlipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Read the preference through the hook, not a module-level matchMedia call:
  // the hook re-renders when the visitor changes the setting mid-session.
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { tiltDegrees } = useScrollTilt(cardRef, prefersReducedMotion);

  const { flipState, dragRotation, handleClick, handleDragStart, handleDragMove, handleDragEnd } =
    useFlipCard({ isFlipped, onFlip });

  const isInteracting = flipState === "dragging" || isFlipped;

  const [hoverPeekRotation, setHoverPeekRotation] = useState(0);
  const hoverPeekTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearHoverPeekTimers = () => {
    hoverPeekTimers.current.forEach(clearTimeout);
    hoverPeekTimers.current = [];
  };

  const handleHoverStart = () => {
    if (!interactive) return;
    if (isFlipped || flipState === "dragging") return;
    if (prefersReducedMotion) return;
    clearHoverPeekTimers();
    setHoverPeekRotation(15);
    hoverPeekTimers.current.push(setTimeout(() => setHoverPeekRotation(0), 220));
  };

  const handleHoverEnd = () => {
    clearHoverPeekTimers();
    setHoverPeekRotation(0);
  };

  const isDragging = flipState === "dragging";

  const computedYRotation = (() => {
    if (isDragging) return dragRotation;
    if (isFlipped) return 180;
    if (hoverPeekRotation !== 0) return hoverPeekRotation;
    return 0;
  })();

  const springTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 28 };

  const activeTransition = isDragging ? { duration: 0 } : springTransition;

  return (
    <motion.div
      className="hero-project-card-shell perspective-1000 h-full w-full"
      style={{ transformOrigin: "center bottom" }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      <motion.div
        ref={cardRef}
        role="button"
        tabIndex={interactive ? 0 : -1}
        aria-label={`View ${project.title} project details`}
        aria-pressed={isFlipped}
        className={`hero-project-card-frame relative h-full w-full preserve-3d select-none touch-manipulation focus-visible:outline-none ${
          interactive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        }`}
        animate={{
          rotateY: computedYRotation,
          rotateX: isInteracting ? 0 : tiltDegrees,
        }}
        whileHover={isInteracting || prefersReducedMotion || !interactive ? {} : { rotateX: -6 }}
        transition={activeTransition}
        onClick={interactive ? handleClick : undefined}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
        onMouseDown={interactive ? (e) => handleDragStart(e.clientX) : undefined}
        onMouseMove={interactive ? (e) => handleDragMove(e.clientX) : undefined}
        onMouseUp={interactive ? handleDragEnd : undefined}
        onMouseLeave={interactive ? handleDragEnd : undefined}
        onTouchStart={interactive ? (e) => handleDragStart(e.touches[0].clientX) : undefined}
        onTouchMove={interactive ? (e) => handleDragMove(e.touches[0].clientX) : undefined}
        onTouchEnd={interactive ? handleDragEnd : undefined}
      >
        <CardFront project={project} isVisible={!isFlipped} />
        <CardBack project={project} isVisible={isFlipped} />
      </motion.div>
    </motion.div>
  );
}
