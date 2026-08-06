import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useFlipCard } from "@/hooks/useFlipCard";
import { useScrollTilt } from "@/hooks/useScrollTilt";
import { useIdlePeek } from "@/hooks/useIdlePeek";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import type { Project } from "@/types";

interface FlipCardProps {
  project: Project;
  entryDelayMs?: number;
  isFlipped: boolean;
  onFlip: () => void;
  siblingPeekTrigger?: number;
}

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function FlipCard({
  project,
  entryDelayMs = 0,
  isFlipped,
  onFlip,
  siblingPeekTrigger = 0,
}: FlipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { tiltDegrees } = useScrollTilt(cardRef);

  const { flipState, dragRotation, handleClick, handleDragStart, handleDragMove, handleDragEnd } =
    useFlipCard({ isFlipped, onFlip });

  const isInteracting = flipState === "dragging" || isFlipped;

  const { isPeeking, peekDegrees } = useIdlePeek({
    peekDegrees: 20,
    peekDuration: 600,
    disabled: isInteracting,
    peekTrigger: siblingPeekTrigger,
  });

  const [hoverPeekRotation, setHoverPeekRotation] = useState(0);
  const hoverPeekTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearHoverPeekTimers = () => {
    hoverPeekTimers.current.forEach(clearTimeout);
    hoverPeekTimers.current = [];
  };

  const handleHoverStart = () => {
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
    if (isPeeking) return peekDegrees;
    if (hoverPeekRotation !== 0) return hoverPeekRotation;
    return 0;
  })();

  const springTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 28 };

  const peekTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 180, damping: 22 };

  const activeTransition = isDragging
    ? { duration: 0 }
    : isPeeking
      ? peekTransition
      : springTransition;

  return (
    <motion.div
      className="hero-project-card-shell perspective-1000 h-full w-full"
      whileHover={{}}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      style={{ transformOrigin: "center bottom" }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      <motion.div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`View ${project.title} project details`}
        aria-pressed={isFlipped}
        className="hero-project-card-frame relative h-full w-full preserve-3d cursor-grab select-none touch-manipulation active:cursor-grabbing focus-visible:outline-none"
        animate={{
          rotateY: computedYRotation,
          rotateX: isInteracting ? 0 : tiltDegrees,
        }}
        whileHover={isInteracting || prefersReducedMotion ? {} : { rotateX: -6 }}
        transition={activeTransition}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <CardFront project={project} />
        <CardBack project={project} isVisible={isFlipped} />
      </motion.div>
    </motion.div>
  );
}
