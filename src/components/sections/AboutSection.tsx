import { motion } from "framer-motion";
import profileImage from "@/assets/profile.jpg";

const METRICS = [
  { value: "20+", label: "Automations Built" },
  { value: "3+", label: "Years Experience" },
  { value: "95%", label: "Client Satisfaction" },
  { value: "30%", label: "Avg. Process Improvement" },
] as const;

const TRUST_BADGES = [
  "20+ Automation Workflows Delivered",
  "AI Agents, Voice Agents & Integrations",
  "Available for Freelance & Contract Projects",
] as const;

const TECH_STACK = [
  "n8n",
  "Zapier",
  "Make",
  "GoHighLevel",
  "Python"
] as const;

export default function AboutSection() {
  return (
    <section
      id="about"
      className="about-section relative overflow-hidden"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 py-24 md:px-12 md:py-32 lg:gap-12 lg:px-20 lg:py-[120px]">
        {/* Section Label — above both columns */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-[14px] font-medium uppercase text-primary"
          style={{ letterSpacing: "0.25em" }}
        >
          01 — About Me
        </motion.span>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          {/* LEFT — Profile image (sticky on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex w-full max-w-[320px] flex-col gap-6 lg:sticky lg:top-24 lg:mx-0 lg:max-w-[500px]"
          >
            <div
              className="about-profile-photo w-full overflow-hidden"
            >
              <img
                src={profileImage}
                alt="Portrait of Rey Binay-an, Automation Engineer"
                className="h-auto w-full object-cover object-top"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* RIGHT — Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            {/* 2. Name */}


            {/* 2. Name */}
            <h2
              className="text-center font-display font-bold leading-tight lg:text-left"
              style={{ fontSize: "clamp(34px, 6vw, 72px)" }}
            >
              Rey W. Binay-an
            </h2>

            {/* Trust badges */}
            <ul className="flex flex-col gap-2 text-sm text-foreground/80">
              {TRUST_BADGES.map((badge) => (
                <li key={badge} className="flex items-start gap-2">
                  <span className="mt-1 text-primary">✓</span>
                  <span>{badge}</span>
                </li>
              ))}
            </ul>

            {/* 3. Position */}
            <p className="about-role-badge">
              Automation Engineer &amp; AI Systems Builder
            </p>

            {/* 4. Value Proposition */}
            <p
              className="max-w-[800px] border-l-[3px] border-primary pl-6 text-[18px] leading-[1.6] text-foreground/90 md:text-[22px]"
            >
              I help businesses automate repetitive processes, reduce manual work,
              and build AI-powered systems that save time, improve customer
              experience, and increase operational efficiency.
            </p>

            {/* 5. Metrics Row */}
            <div className="about-stats-grid grid grid-cols-2 gap-4 lg:grid-cols-4">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className="about-stat-card min-w-0 transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="about-stat-card__value font-display">
                    {m.value}
                  </div>
                  <div className="about-stat-card__label mt-2 break-words">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* 6. Supporting Story */}
            <div className="max-w-[800px] space-y-4 text-[16px] leading-relaxed text-foreground/80 md:text-[18px]">
              <p>
                Over the past 3+ years, I have worked across engineering, process
                improvement, safety management, and automation development.
              </p>
              <p>
                Today, I specialize in designing AI agents, workflow automations,
                and custom integrations using n8n, Zapier, Python, APIs, and modern
                automation platforms. My goal is simple: eliminate repetitive work
                so teams can focus on higher-value activities.
              </p>
            </div>

            {/* 7. Tech stack */}
            <div className="flex flex-col gap-3">
              <span
                className="text-xs font-medium uppercase text-muted-foreground"
                style={{ letterSpacing: "0.25em" }}
              >
                Tech I Work With
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-2 opacity-85">
                {TECH_STACK.map((t) => (
                  <span
                    key={t}
                    className="text-sm text-foreground/80 md:text-base"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>

  );
}
