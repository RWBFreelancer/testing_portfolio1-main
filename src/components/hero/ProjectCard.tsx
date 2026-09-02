import { PlayCircle } from "lucide-react";
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
 */
export default function ProjectCard({
  project,
  index,
  onPlay,
}: {
  project: Project;
  index: number;
  onPlay: () => void;
}) {
  const { ref, onPointerMove, onPointerLeave } = useHoloTilt<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="hero-holo-card"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <article className="hero-holo-card__inner">
        <button
          type="button"
          className="hero-holo-card__thumb"
          onClick={onPlay}
          aria-label={`Play the ${project.title} demo video`}
        >
          <img
            src={project.thumbnailUrl}
            alt=""
            className="hero-holo-card__image"
            width={1280}
            height={800}
            // The first card is the largest thing above the fold, so it loads
            // eagerly and gets fetch priority. The rest can wait.
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            sizes="(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 380px"
            draggable={false}
          />
          <span className="hero-holo-card__shade" aria-hidden />
          <span className="hero-holo-card__play" aria-hidden>
            <PlayCircle className="h-7 w-7" strokeWidth={1.5} />
          </span>
          <span className="hero-holo-card__demo label-mono" aria-hidden>
            {project.demoLabel}
          </span>
        </button>

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
        </div>

        {/* Decoration, and both sit above the card face. They are last in the
            markup so nothing after them can be covered. */}
        <span className="hero-holo-card__sheen" aria-hidden />
        <span className="hero-holo-card__rim" aria-hidden />
      </article>
    </div>
  );
}
