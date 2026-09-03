import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Project } from "@/types";

/**
 * The screenshot viewer.
 *
 * One picture at a time, a caption under it, and a strip of thumbnails to jump
 * with. The left and right arrow keys move as well, because a visitor reading
 * five screenshots should not have to reach for the mouse between each one.
 *
 * Every picture here was redacted at build time by scripts/make-gallery.mjs.
 * No client name, no customer of a client, and no email address survives into
 * a committed file, so nothing on this screen has to be hidden at run time.
 */
export default function GalleryModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const shots = project?.gallery ?? [];
  const open = project !== null && shots.length > 0;
  const [at, setAt] = useState(0);

  // A new project opens on its first picture, never on the index left behind
  // by the card the visitor looked at before.
  useEffect(() => setAt(0), [project?.id]);

  // Radix owns Escape and the focus trap. Only the two arrows are ours, and
  // they are bound only while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setAt((i) => (i + 1) % shots.length);
      if (e.key === "ArrowLeft") setAt((i) => (i - 1 + shots.length) % shots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shots.length]);

  const shot = shots[at];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      {/* max-w-lg and gap-4 are baked into DialogContent, and a Tailwind
          utility beats an @layer components rule, so the override sits here. */}
      <DialogContent className="hero-gallery max-w-[min(1180px,95vw)] gap-2.5">
        {open && project && shot && (
          <>
            <DialogTitle className="hero-gallery__title font-display">{project.title}</DialogTitle>
            <DialogDescription className="hero-gallery__subtitle">
              Screenshot {at + 1} of {shots.length} — client names and personal details are blurred.
            </DialogDescription>

            <div className="hero-gallery__stage">
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.caption}
                className="hero-gallery__image"
                decoding="async"
              />

              {shots.length > 1 && (
                <>
                  <button
                    type="button"
                    className="hero-gallery__arrow hero-gallery__arrow--prev"
                    onClick={() => setAt((i) => (i - 1 + shots.length) % shots.length)}
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    className="hero-gallery__arrow hero-gallery__arrow--next"
                    onClick={() => setAt((i) => (i + 1) % shots.length)}
                    aria-label="Next screenshot"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </>
              )}
            </div>

            {/* The caption is the alt text as well, so it has to say what the
                picture shows without leaning on the picture. */}
            <p className="hero-gallery__caption">{shot.caption}</p>

            {shots.length > 1 && (
              <ul className="hero-gallery__strip">
                {shots.map((s, i) => (
                  <li key={s.src}>
                    <button
                      type="button"
                      className={`hero-gallery__thumb${i === at ? " hero-gallery__thumb--on" : ""}`}
                      onClick={() => setAt(i)}
                      aria-label={`Show screenshot ${i + 1}`}
                      aria-current={i === at}
                    >
                      <img src={s.src} alt="" loading="lazy" decoding="async" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
