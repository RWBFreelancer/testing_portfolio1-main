import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";

interface Props {
  project: Project;
  isVisible: boolean;
}

export default function CardBack({ project, isVisible }: Props) {
  return (
    <div
      className="hero-project-card absolute inset-0 backface-hidden"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
      aria-hidden={!isVisible}
      inert={!isVisible}
    >
      <div className="flex h-full w-full flex-col">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-black">
          {isVisible ? (
            <iframe
              title={`${project.title} demo video`}
              src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <div className="h-full w-full bg-black/60" aria-hidden />
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
            style={{ wordWrap: "break-word", whiteSpace: "normal" }}
          >
            <div className="grid grid-cols-3 gap-2 border-b border-border pb-2.5">
              {project.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="font-mono text-[length:var(--step-1)] text-[var(--accent)]">
                    {m.value}
                  </div>
                  <div className="mt-0.5 font-mono text-[length:var(--step-mono)] uppercase tracking-wider text-muted-foreground leading-tight">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[length:var(--step--1)] leading-relaxed text-foreground/85 break-words">
              {project.description}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {project.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[var(--accent-glow)] px-2 py-0.5 font-mono text-[length:var(--step-mono)] text-[var(--accent)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <a
            href={project.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="cta-primary mt-3 w-full shrink-0 justify-center"
          >
            {project.ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
