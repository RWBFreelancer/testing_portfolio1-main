import { useState, useRef } from "react";
import { projects } from "@/data/projects";
import FlipCard from "./FlipCard";

const ENTRY_STAGGER_MS = 100;

export default function FlipCardGrid() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [siblingPeekTrigger, setSiblingPeekTrigger] = useState(0);
  const hasEverFlipped = useRef(false);

  const handleCardFlip = (id: string) => {
    const isClosing = activeCardId === id;

    if (isClosing) {
      setActiveCardId(null);
      if (hasEverFlipped.current) {
        setSiblingPeekTrigger((prev) => prev + 1);
      }
    } else {
      hasEverFlipped.current = true;
      setActiveCardId(id);
    }
  };

  return (
    <div className="hero-project-grid">
      {projects.map((project, i) => (
        <div key={project.id} className="hero-project-grid__item">
          <FlipCard
            project={project}
            entryDelayMs={i * ENTRY_STAGGER_MS}
            isFlipped={activeCardId === project.id}
            onFlip={() => handleCardFlip(project.id)}
            siblingPeekTrigger={activeCardId === project.id ? 0 : siblingPeekTrigger}
          />
        </div>
      ))}
    </div>
  );
}
