export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  /** What was broken before the automation existed. One sentence, plain words. */
  problem: string;
  /** What was built, and what it does now. One sentence, plain words. */
  solution: string;
  /** Kept optional. Numbers only return when a client name and a date range
   *  can stand behind them. */
  metrics?: { label: string; value: string }[];
  youtubeId: string;
  thumbnailUrl: string;
  techStack: string[];
  demoLabel: string;

  /* Not read by the hero today. Kept because they hold real information -
     ctaUrl on the Hyperlite project is the live storefront - and they are the
     obvious source for a future case-study page. */
  description: string;
  badge: string;
  ctaLabel: string;
  ctaUrl: string;
}

export type ThemeMode = "light" | "dark";
