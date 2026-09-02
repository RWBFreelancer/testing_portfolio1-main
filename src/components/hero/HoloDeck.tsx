import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import StarField from "./StarField";
import DemoModal from "./DemoModal";
import type { Project } from "@/types";

/**
 * The project row.
 *
 * Every project renders, always, side by side. There is no fixed slot count and
 * no placeholder card: the row is exactly as long as the work is. Nothing is
 * hidden behind a click, so the ten-second visitor reads all of it.
 *
 * The only state here is which demo is open. The hover tilt is handled inside
 * each card against the DOM, so moving the pointer never re-renders this tree.
 */
export default function HoloDeck() {
  const [playing, setPlaying] = useState<Project | null>(null);

  return (
    <div className="hero-holo">
      <StarField />

      <div className="hero-holo__row">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onPlay={() => setPlaying(project)}
          />
        ))}
      </div>

      <DemoModal project={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
