import { Sparkles } from "lucide-react";

/** Fills a deck slot that has no project yet. It looks like a face-down card,
 *  so an eight-card deck still reads as a deck when only three are built. */
export default function CardPlaceholder({ slotNumber }: { slotNumber: number }) {
  return (
    <div className="hero-project-card hero-card-placeholder absolute inset-0">
      <div className="hero-card-placeholder__mark" aria-hidden>
        <Sparkles className="h-6 w-6" strokeWidth={1.5} />
      </div>

      <div className="hero-card-placeholder__body">
        <div className="hero-card-placeholder__slot label-mono">
          Slot {String(slotNumber).padStart(2, "0")}
        </div>
        <h3 className="hero-card-placeholder__title font-display">More work coming soon</h3>
        <p className="hero-card-placeholder__copy">
          A new automation build lands here shortly. Check back, or ask me what I am shipping this
          week.
        </p>
      </div>
    </div>
  );
}
