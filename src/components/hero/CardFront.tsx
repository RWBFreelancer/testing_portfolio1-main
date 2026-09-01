import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import type { Project } from "@/types";

export default function CardFront({
  project,
  isVisible = true,
}: {
  project: Project;
  isVisible?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  // backface-visibility hides the turned-away face on screen, but leaves it in
  // the tab order and the accessibility tree. inert removes it from both.
  return (
    <div
      className="hero-project-card absolute inset-0 backface-hidden"
      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
      aria-hidden={!isVisible}
      inert={!isVisible}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="hero-project-card__thumb">
        <img
          src={project.thumbnailUrl}
          alt={`${project.title} preview`}
          className="hero-project-card__image"
          width={1280}
          height={800}
          draggable={false}
        />
        <div className="hero-project-card__shade" />

        <motion.div
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="hero-project-card__play-wrap"
        >
          <div className="hero-project-card__play">
            <PlayCircle className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>
        </motion.div>

        <span className="hero-project-card__demo">{project.demoLabel}</span>
      </div>

      <div className="hero-project-card__info">
        <div>
          <div className="hero-project-card__category">{project.category}</div>
          <h3 className="hero-project-card__title font-display">{project.title}</h3>
          <p className="hero-project-card__description">{project.tagline}</p>
        </div>

        <div className="hero-project-card__metrics">
          {project.metrics.map((metric) => (
            <span key={metric.label} className="hero-project-card__metric">
              <strong>{metric.value}</strong> {metric.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
