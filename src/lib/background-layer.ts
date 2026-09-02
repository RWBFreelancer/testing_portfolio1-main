import bgDark from "@/assets/bg-dark.webp";
import bgLight from "@/assets/bg-light.webp";
import bgDarkPortrait from "@/assets/bg-dark-portrait.webp";
import bgLightPortrait from "@/assets/bg-light-portrait.webp";
import type { ThemeMode } from "@/types";

/** Below this the viewport is tall enough that the landscape backdrop loses
 *  most of itself to the cover crop. On a 390x844 phone under 30% of the
 *  landscape image survived, and everything of interest in it fell outside the
 *  crop, so the sky read as flat black. */
const PORTRAIT_QUERY = "(max-aspect-ratio: 3/4)";

/**
 * The fixed sky behind the page.
 *
 * It is a <picture> rather than a bare <img> so the browser picks the portrait
 * or landscape file itself, at the right moment, with no resize listener and
 * no second download. Only the chosen source is ever fetched.
 */
export function syncBackgroundLayer(theme: ThemeMode) {
  if (typeof document === "undefined") return;

  const dark = theme === "dark";

  let picture = document.getElementById("bg-picture") as HTMLPictureElement | null;
  let source: HTMLSourceElement;
  let img: HTMLImageElement;

  if (!picture) {
    picture = document.createElement("picture");
    picture.id = "bg-picture";
    picture.setAttribute("aria-hidden", "true");

    source = document.createElement("source");
    source.media = PORTRAIT_QUERY;

    img = document.createElement("img");
    img.id = "bg-layer";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");

    picture.append(source, img);
  } else {
    source = picture.querySelector("source") as HTMLSourceElement;
    img = picture.querySelector("img") as HTMLImageElement;
  }

  source.srcset = dark ? bgDarkPortrait : bgLightPortrait;
  img.src = dark ? bgDark : bgLight;

  if (document.body.firstElementChild !== picture) {
    document.body.insertBefore(picture, document.body.firstChild);
  }
}
