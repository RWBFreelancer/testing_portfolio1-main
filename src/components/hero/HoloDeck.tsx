import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";
import StarField from "./StarField";
import DemoModal from "./DemoModal";
import GalleryModal from "./GalleryModal";
import type { Project } from "@/types";

/**
 * The project row.
 *
 * Every project renders, always, side by side. There is no fixed slot count and
 * no placeholder card: the row is exactly as long as the work is. Nothing is
 * hidden behind a click, so the ten-second visitor reads all of it. On a wide
 * screen the projects fall in rows of three.
 *
 * The only state here is which demo is open, and which gallery is open. The
 * hover tilt is handled inside each card against the DOM, so moving the
 * pointer never re-renders this tree.
 */
export default function HoloDeck() {
  const [playing, setPlaying] = useState<Project | null>(null);
  const [viewing, setViewing] = useState<Project | null>(null);

  return (
    /* id="work" so the projects can be linked to directly. A proposal on
       Upwork needs a URL that lands on the work, not on the top of the page. */
    <div id="work" className="hero-holo" style={{ scrollMarginTop: "88px" }}>
      <StarField />

      <div className="hero-holo__row">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onPlay={() => project.youtubeId && setPlaying(project)}
            onOpenGallery={() => setViewing(project)}
          />
        ))}
      </div>

      <DemoModal project={playing} onClose={() => setPlaying(null)} />
      <GalleryModal project={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
