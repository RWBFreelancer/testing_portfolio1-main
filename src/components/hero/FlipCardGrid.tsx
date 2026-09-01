import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "@/data/projects";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import FlipCard from "./FlipCard";
import CardPlaceholder from "./CardPlaceholder";
import type { Project } from "@/types";

/** The deck never grows past this. Past eight cards the fan stops reading as a
 *  hand of cards and starts reading as clutter. */
const DECK_SIZE = 8;

const CARD_WIDTH = 340;
/** Room reserved at each edge for the overlay arrow button. The arrow is 60px
 *  wide, and a card tilted 13 degrees about its bottom edge swings its top
 *  corner about 96px further out, so the lane has to clear both. */
const BUTTON_LANE = 140;

/** Fan geometry. BASE is the gap to the first neighbour; each card further out
 *  is tucked STEP_RATIO tighter, so a full deck still fits the width. */
const FAN_BASE_MAX = 188;
const FAN_BASE_MIN = 96;
const FAN_STEP_RATIO = 0.18;
const FAN_TILT = 3.2;
const MAX_TILT = 13;
const DEPTH_CAP = 4;

type Slot =
  | { kind: "project"; key: string; project: Project }
  | { kind: "placeholder"; key: string; slotNumber: number };

const slots: Slot[] = Array.from({ length: DECK_SIZE }, (_, i) => {
  const project = projects[i];
  return project
    ? ({ kind: "project", key: project.id, project } as Slot)
    : ({ kind: "placeholder", key: `slot-${i + 1}`, slotNumber: i + 1 } as Slot);
});

/** The stacked fallback has no fan to hide empty slots behind, so it shows the
 *  real projects and a single "coming soon" card rather than five of them. */
const stackSlots: Slot[] = [
  ...slots.filter((slot) => slot.kind === "project"),
  ...slots.filter((slot) => slot.kind === "placeholder").slice(0, 1),
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** The widest the fan ever has to reach, in FAN_BASE units. */
const REACH_UNITS = 1 + (DECK_SIZE - 2) * FAN_STEP_RATIO;

const slotLabel = (slot: Slot) =>
  slot.kind === "project" ? slot.project.title : `Empty slot ${slot.slotNumber}`;

export default function FlipCardGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [fanBase, setFanBase] = useState(FAN_BASE_MAX);

  const shouldReduceMotion = useReducedMotion();
  const isFan = useMediaQuery("(min-width: 1101px)");

  const wrapRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  // The fan is sized from the real container width, so eight cards never spill
  // past the edges, and never sit under the arrow buttons, on a smaller laptop.
  useEffect(() => {
    const el = deckRef.current;
    if (!el || !isFan) return;

    const measure = () => {
      const halfRoom = el.clientWidth / 2 - CARD_WIDTH / 2 - BUTTON_LANE;
      setFanBase(clamp(halfRoom / REACH_UNITS, FAN_BASE_MIN, FAN_BASE_MAX));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isFan]);

  // An open card autoplays a YouTube video. Close it once the deck scrolls out
  // of view, or the sound follows the visitor down the whole page.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setFlippedId(null);
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectCard = useCallback((index: number) => {
    setActiveIndex(index);
    setFlippedId(null); // never leave a video playing behind the fan
  }, []);

  const step = useCallback((delta: number) => {
    setFlippedId(null);
    setActiveIndex((i) => clamp(i + delta, 0, slots.length - 1));
  }, []);

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < slots.length - 1;

  const renderCard = (slot: Slot, isActive: boolean) =>
    slot.kind === "project" ? (
      <FlipCard
        project={slot.project}
        isFlipped={flippedId === slot.project.id}
        onFlip={() =>
          setFlippedId((current) => (current === slot.project.id ? null : slot.project.id))
        }
        interactive={!isFan || isActive}
      />
    ) : (
      <div className="hero-project-card-shell perspective-1000 h-full w-full">
        <div className="hero-project-card-frame relative h-full w-full">
          <CardPlaceholder slotNumber={slot.slotNumber} />
        </div>
      </div>
    );

  // Below the fan breakpoint the cards fall back to a plain grid, because a fan
  // needs horizontal room a phone does not have.
  if (!isFan) {
    return (
      <div className="hero-deck-stack" ref={wrapRef}>
        {stackSlots.map((slot) => (
          <div key={slot.key} className="hero-deck-stack__item">
            {renderCard(slot, true)}
          </div>
        ))}
      </div>
    );
  }

  const fanStep = fanBase * FAN_STEP_RATIO;

  return (
    <div className="hero-deck-wrap" ref={wrapRef}>
      <p className="hero-deck__lead">
        <span className="hero-deck__lead-icon" aria-hidden>
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.25} />
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
        </span>
        Click any card to bring it to the front, or use the arrows, the dots and your left and right
        keys. Click the front card to play its demo.
      </p>

      <div className="hero-deck__stage">
        <div
          ref={deckRef}
          className="hero-deck"
          role="group"
          aria-roledescription="carousel"
          aria-label="Project deck"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              step(-1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              step(1);
            } else if (e.key === "Home") {
              e.preventDefault();
              selectCard(0);
            } else if (e.key === "End") {
              e.preventDefault();
              selectCard(slots.length - 1);
            }
          }}
        >
          {slots.map((slot, i) => {
            const offset = i - activeIndex;
            const depth = Math.abs(offset);
            const isActive = offset === 0;
            const isHovered = hoveredIndex === i && !isActive;

            const x = isActive ? 0 : Math.sign(offset) * (fanBase + (depth - 1) * fanStep);
            const lift = isActive ? -26 : Math.min(depth, DEPTH_CAP) * 12 - (isHovered ? 18 : 0);
            const scale = 1 - Math.min(depth, DEPTH_CAP) * 0.045;

            return (
              <motion.div
                key={slot.key}
                className="hero-deck__card"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slots.length}: ${slotLabel(slot)}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex((current) => (current === i ? null : current))}
                animate={{
                  x,
                  y: lift,
                  rotate: clamp(offset * FAN_TILT, -MAX_TILT, MAX_TILT),
                  scale,
                  filter: isActive ? "brightness(1)" : `brightness(${isHovered ? 0.88 : 0.74})`,
                }}
                style={{ zIndex: slots.length - depth }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 260, damping: 28 }
                }
              >
                {/* inert keeps the hidden card out of the tab order and off the
                    screen reader, but it also swallows clicks — so the click
                    target for "bring this card to the front" has to be a
                    sibling of the inert wrapper, not inside it. */}
                <div className="hero-deck__card-face" aria-hidden={!isActive} inert={!isActive}>
                  {renderCard(slot, isActive)}
                </div>

                {!isActive && (
                  <button
                    type="button"
                    className="hero-deck__card-hit"
                    tabIndex={-1}
                    aria-hidden
                    onClick={() => selectCard(i)}
                  >
                    <span className="hero-deck__card-hit-badge" aria-hidden>
                      View
                    </span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* aria-disabled, not disabled: a real disabled attribute would drop
            focus to the body the moment you reach the end of the deck. */}
        <button
          type="button"
          className="hero-deck__nav hero-deck__nav--prev"
          onClick={() => canGoPrev && step(-1)}
          aria-disabled={!canGoPrev}
          aria-label="Previous project"
        >
          <ChevronLeft className="h-7 w-7" strokeWidth={2.25} />
        </button>

        <button
          type="button"
          className="hero-deck__nav hero-deck__nav--next"
          onClick={() => canGoNext && step(1)}
          aria-disabled={!canGoNext}
          aria-label="Next project"
        >
          <ChevronRight className="h-7 w-7" strokeWidth={2.25} />
        </button>
      </div>

      <div className="hero-deck__footer">
        <span className="hero-deck__count label-mono">
          {String(activeIndex + 1).padStart(2, "0")} / {String(slots.length).padStart(2, "0")}
        </span>

        <ul className="hero-deck__dots">
          {slots.map((slot, i) => (
            <li key={slot.key}>
              <button
                type="button"
                className="hero-deck__dot"
                data-active={i === activeIndex}
                data-empty={slot.kind === "placeholder"}
                onClick={() => i !== activeIndex && selectCard(i)}
                aria-label={`Show card ${i + 1}: ${slotLabel(slot)}`}
                aria-current={i === activeIndex}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Focus never moves when the deck advances, so the change is announced
          here instead. */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Card {activeIndex + 1} of {slots.length}: {slotLabel(slots[activeIndex])}
      </p>
    </div>
  );
}
