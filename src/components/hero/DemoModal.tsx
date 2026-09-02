import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Project } from "@/types";

/**
 * The demo player.
 *
 * Two rules the old flip card broke:
 *  - The iframe mounts only while the dialog is open, so no YouTube code is
 *    fetched on first paint, and closing the dialog really stops playback.
 *  - mute=1. A click must never make noise the visitor did not ask for.
 *    WCAG 2.1 SC 1.4.2 requires it for anything over three seconds.
 */
export default function DemoModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const open = project !== null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      {/* max-w-lg and gap-4 are baked into DialogContent, and a Tailwind utility
          beats an @layer components rule, so the override belongs here. */}
      <DialogContent className="hero-demo-modal max-w-[min(960px,94vw)] gap-2.5">
        {project && (
          <>
            <DialogTitle className="hero-demo-modal__title font-display">
              {project.title}
            </DialogTitle>
            <DialogDescription className="hero-demo-modal__subtitle">
              {project.tagline}
            </DialogDescription>

            <div className="hero-demo-modal__frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                title={`${project.title} demo video`}
                allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>

            {/* The video starts silent, so say so rather than let the visitor
                think the sound is broken. */}
            <p className="hero-demo-modal__note label-mono">
              Starts muted — use the player controls for sound.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
