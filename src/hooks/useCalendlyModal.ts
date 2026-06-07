import { useEffect } from "react";

const CALENDLY_URL =
  (import.meta.env.VITE_CALENDLY_URL as string | undefined) ??
  "https://calendly.com/reybinayan01/30min";

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
      const existingOverlays = document.querySelectorAll('.calendly-overlay');
      existingOverlays.forEach((overlay) => overlay.remove());

      Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
    }
  };

  return { openCalendly };
}
