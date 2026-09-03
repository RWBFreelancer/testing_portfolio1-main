import { motion, useReducedMotion } from "framer-motion";
import { Download } from "lucide-react";
import { useCalendlyModal } from "@/hooks/useCalendlyModal";
import { CV_URL } from "@/components/layout/Navbar";
import HoloDeck from "./HoloDeck";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const { openCalendly } = useCalendlyModal();

  return (
    <section id="hero" className="hero-section">
      <div className="hero-section__inner">
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: shouldReduceMotion ? 0 : 0.15 },
            },
          }}
          className="hero-section__text"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__eyebrow label-mono"
          >
            Rey W. Binay-an — Automation Engineer
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__headline font-display"
          >
            I build AI systems for
            <br />
            <span className="hero-section__headline-accent">small and medium businesses.</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__subtitle"
          >
            Voice agents that qualifies leads. Chatbots that resolve customer issues. n8n workflows that move
            data so nobody has to retype it.
          </motion.p>

          {/* Rate, hours and timezone are the first three filters on
              OnlineJobs.ph and Upwork. Leaving them buried costs the screen. */}
          <motion.ul
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__availability"
          >
            <li className="hero-section__availability-status">
              <span aria-hidden className="hero-section__availability-dot" />
              Available for new work
            </li>
            <li>40 hrs/wk</li>
            <li>Philippines · UTC+8 · overlaps 9am–1pm EST</li>
            <li>Rate on request</li>
          </motion.ul>

          {/* The hero used to spend this line telling the visitor to scroll.
              A screener who is already sold should be able to act here. */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__actions"
          >
            <button
              type="button"
              onClick={openCalendly}
              className="site-navbar__cta hero-section__cta-primary"
            >
              Book a Call <span aria-hidden>→</span>
            </button>

            <a href={CV_URL} download className="hero-section__cta-secondary">
              <Download className="h-4 w-4" aria-hidden />
              Download CV
            </a>
          </motion.div>
        </motion.div>

        <HoloDeck />
      </div>
    </section>
  );
}
