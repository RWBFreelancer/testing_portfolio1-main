import { motion } from "framer-motion";
import FlipCardGrid from "./FlipCardGrid";

export default function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-section__inner">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="hero-section__text"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__badge"
          >
            HI, I'M REY <span aria-hidden>👋</span>
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
            <span className="hero-section__headline-accent italic">
              that solve real bottlenecks.
            </span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            className="hero-section__subtitle"
          >
            AI voice agents, chatbots, and workflow systems designed to automate
            repetitive operations and elevate customer experience.
          </motion.p>

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
