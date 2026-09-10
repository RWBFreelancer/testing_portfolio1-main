import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Download } from "lucide-react";
import { track } from "@vercel/analytics";
import { useCalendlyModal } from "@/hooks/useCalendlyModal";
import { CV_URL } from "@/components/layout/Navbar";

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
            Rey W. Binay-an - AI Automation Engineer
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__headline font-display"
          >
            Less time on repeat work.
            <br />
            <span className="hero-section__headline-accent">More revenue for you.</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__subtitle"
          >
            Automations that cut hours of repeat work.
            <br />
            Revenue systems like after hours agents and speed to lead follow up.
            <br />I build it and it is live in 2 to 4 weeks.
          </motion.p>

          {/* Rate, hours and timezone are the first three filters on
              OnlineJobs.ph and Upwork. Leaving them buried costs the screen.
              No figure is published by choice, so the rate line names the
              pricing model instead — a buyer who reads "on request" reads a
              dead end, and one who reads "fixed price" reads a bounded risk. */}
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
            <li>Philippines · UTC+8 · 9pm–1am overlap with US East</li>
            <li>Fixed-price builds · quote after the call</li>
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

            <a
              href={CV_URL}
              download
              onClick={() => track("cv_download", { from: "hero" })}
              className="hero-section__cta-secondary"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download CV
            </a>
          </motion.div>

          {/* The hero fills the first screen, so the project row is below the
              fold by design. This cue names what is down there and links to
              it, so the visitor never has to guess whether to scroll. */}
          <motion.a
            href="#work"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__scroll-cue"
          >
            <span className="hero-section__scroll-cue-label label-mono">6 projects below</span>
            <span aria-hidden className="hero-section__scroll-cue-arrow">
              <ChevronDown className="h-4 w-4" />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
