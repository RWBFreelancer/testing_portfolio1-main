import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { CALENDLY_URL } from "@/lib/site-contact";

const SCRIPT_ID = "calendly-widget-script";
const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

export function useCalendlyModal() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).__calendlyScriptAdded) return;
    if (document.getElementById(SCRIPT_ID)) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__calendlyScriptAdded = true;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openCalendly = () => {
    if (typeof window === "undefined") return;
    // Every "Book a Call" on the site routes through here, so one event covers
    // the navbar, the hero, the contact section and the success modal. It also
    // records which path opened, so a widget blocked by an ad blocker shows up
    // as a rise in "fallback" rather than as silence.
    track("book_a_call_click", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      method: (window as any).Calendly?.initPopupWidget ? "widget" : "fallback",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Calendly = (window as any).Calendly;
    if (Calendly?.initPopupWidget) {
      // Force cleanup of any existing Calendly modals to prevent duplicates
      if (Calendly.closePopupWidget) {
        try {
          Calendly.closePopupWidget();
        } catch (e) {
          // Ignore if close fails
        }
      }

      // Manually remove any lingering overlay or inline widget elements
      const existingOverlays = document.querySelectorAll(".calendly-overlay");
      existingOverlays.forEach((overlay) => overlay.remove());

      Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
    }
  };

  // calendlyUrl is returned so a caller can render a real <a href> fallback.
  // If an ad blocker stops widget.js AND a pop-up blocker stops window.open,
  // every "Book a Call" button on the site does nothing and says nothing.
  return { openCalendly, calendlyUrl: CALENDLY_URL };
}
