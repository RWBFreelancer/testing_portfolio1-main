import { motion, useReducedMotion } from "framer-motion";
import FlipCardGrid from "./FlipCardGrid";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

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
            I build AI automations
            <br />
            <span className="hero-section__headline-accent">that solve real bottlenecks.</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__subtitle"
          >
            Voice agents that answer and qualify. Chatbots that resolve. n8n workflows that move the
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
            <li>20 hrs/wk</li>
            <li>UTC+8 · overlaps 9am–1pm EST</li>
            <li>Rate on request</li>
          </motion.ul>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="hero-section__scroll-cta"
          >
            <span>Here are some of my recent projects</span>
            <span aria-hidden>↓</span>
          </motion.div>
        </motion.div>

        <FlipCardGrid />
      </div>
    </section>
  );
}
