import { Images, PlayCircle } from "lucide-react";
import { useHoloTilt } from "@/hooks/useHoloTilt";
import type { Project } from "@/types";

/**
 * One project, fully readable with no clicks.
 *
 * Order is deliberate: what kind of automation, what was broken, what was
 * built. A business owner who does not know what n8n is can still tell in one
 * read whether this is their problem.
 *
 * On hover the panel tilts towards the pointer, a nebula sheen tracks across
 * its face, and the thumbnail slides the other way behind the frame. All of it
 * is driven by CSS custom properties written in `useHoloTilt`.
 *
 * A project with no recorded demo yet renders the same frame as a plain figure:
 * no button, no play badge, and the corner says the demo is coming. A play
 * button that opens nothing is worse than no play button. The screenshot
 * button under the card follows the same rule: it appears only where there
 * are screenshots to show.
 */
export default function ProjectCard({
  project,
  index,
  onPlay,
  onOpenGallery,
}: {
  project: Project;
  index: number;
  onPlay: () => void;
  onOpenGallery: () => void;
}) {
  const { ref, onPointerMove, onPointerLeave } = useHoloTilt<HTMLDivElement>();
  const hasDemo = Boolean(project.youtubeId);
  const shotCount = project.gallery?.length ?? 0;

  // The frame is a button only when there is something to open. Everything
  // inside it is the same either way.
  const Frame = hasDemo ? "button" : "div";
  const frameProps = hasDemo
    ? ({
        type: "button",
        onClick: onPlay,
        "aria-label": `Play the ${project.title} demo video`,
      } as const)
    : {};

  return (
    <div
      ref={ref}
      className="hero-holo-card"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <article className="hero-holo-card__inner">
        <Frame
          className={`hero-holo-card__thumb${hasDemo ? "" : " hero-holo-card__thumb--static"}`}
          {...frameProps}
        >
          <img
            src={project.thumbnailUrl}
            alt=""
            className="hero-holo-card__image"
            width={900}
            height={563}
            // The top row is the largest thing above the fold, so it loads
            // eagerly and the first card gets fetch priority. The rest can wait.
            loading={index < 3 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            sizes="(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 380px"
            draggable={false}
          />
          <span className="hero-holo-card__shade" aria-hidden />
          {hasDemo && (
            <span className="hero-holo-card__play" aria-hidden>
              <PlayCircle className="h-6 w-6" strokeWidth={1.5} />
            </span>
          )}
          <span
            className={`hero-holo-card__demo label-mono${hasDemo ? "" : " hero-holo-card__demo--pending"}`}
            aria-hidden
          >
            {project.demoLabel}
          </span>
        </Frame>

        <div className="hero-holo-card__body">
          <p className="hero-holo-card__kind label-mono">{project.category}</p>
          <h3 className="hero-holo-card__title font-display">{project.title}</h3>

          <dl className="hero-holo-card__facts">
            <dt className="label-mono">Problem</dt>
            <dd>{project.problem}</dd>
            <dt className="label-mono">Solution</dt>
            <dd>{project.solution}</dd>
          </dl>

          <ul className="hero-holo-card__stack">
            {project.techStack.map((tech) => (
              <li key={tech} className="label-mono">
                {tech}
              </li>
            ))}
          </ul>

          {/* The video is the pitch; the screenshots are the proof. They sit
              at opposite ends of the card so neither one competes with the
              other for the same click. */}
          {shotCount > 0 && (
            <button
              type="button"
              className="hero-holo-card__shots label-mono"
              onClick={onOpenGallery}
            >
              <Images className="h-4 w-4" strokeWidth={1.6} aria-hidden />
              View screenshots
              <span className="hero-holo-card__shots-count">{shotCount}</span>
            </button>
          )}
        </div>

        {/* Decoration, and both sit above the card face. They are last in the
            markup so nothing after them can be covered. */}
        <span className="hero-holo-card__sheen" aria-hidden />
        <span className="hero-holo-card__rim" aria-hidden />
      </article>
    </div>
  );
}
