import bgDark from "@/assets/bg-dark.webp";
import bgLight from "@/assets/bg-light.webp";
import type { ThemeMode } from "@/types";

export function syncBackgroundLayer(theme: ThemeMode) {
  if (typeof document === "undefined") return;

  let bgLayer = document.getElementById("bg-layer") as HTMLImageElement | null;
  if (!bgLayer) {
    bgLayer = document.createElement("img");
    bgLayer.id = "bg-layer";
    bgLayer.alt = "";
    bgLayer.setAttribute("aria-hidden", "true");
  }

  bgLayer.src = theme === "dark" ? bgDark : bgLight;

  if (document.body.firstElementChild !== bgLayer) {
    document.body.insertBefore(bgLayer, document.body.firstChild);
  }
}
