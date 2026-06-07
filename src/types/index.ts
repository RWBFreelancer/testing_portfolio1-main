export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  metrics: { label: string; value: string }[];
  youtubeId: string;
  thumbnailUrl: string;
  techStack: string[];
  badge: string;
  demoLabel: string;
  ctaLabel: string;
  ctaUrl: string;
}

export type FlipState = "idle" | "flipped" | "dragging";
export type ThemeMode = "light" | "dark";
