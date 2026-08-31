import { motion, useReducedMotion } from "framer-motion";
import profileImage from "@/assets/profile.jpg";

const TECH_STACK = [
  "n8n",
  "Zapier",
  "Make",
  "GoHighLevel",
  "Retell AI",
  "Elevenlabs",
  "Vapi",
  "ChatGPT",
  "Claude",
  "Gemini",
  "Python",
] as const;

export default function AboutSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="about" className="about-section relative overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 py-20 md:px-12 md:py-24 lg:gap-12 lg:px-20 lg:py-24">
        {/* Section Label — above both columns */}
        <motion.span
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="label-mono text-primary"
        >
          About Me
        </motion.span>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          {/* LEFT — Profile image (sticky on desktop) */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex w-full max-w-[320px] flex-col gap-6 lg:sticky lg:top-24 lg:mx-0 lg:max-w-[500px]"
          >
            <div className="about-profile-photo w-full overflow-hidden">
              <img
                src={profileImage}
                alt="Portrait of Rey Binay-an, Automation Engineer"
                className="h-auto w-full object-cover object-top"
                width={1024}
                height={1535}
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* RIGHT — Content */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            <h2 className="about-name text-center lg:text-left">Rey W. Binay-an</h2>

            <p className="about-role-badge">Automation Engineer &amp; AI Systems Builder</p>

            <p className="about-lede max-w-[62ch] border-l-2 border-primary pl-6">
              I help businesses automate repetitive processes, reduce manual work, and build
              AI-powered systems that save time, improve customer experience, and increase
              operational efficiency.
            </p>

            <div className="about-body max-w-[62ch] space-y-4">
              <p>
                I spent 9 years as a licensed electrical engineer, safety officer, and operations
                lead before moving into automation full time. That background is why I read a
                business as a system first and reach for a tool second.
              </p>
              <p>
                Today, I specialize in designing AI agents, workflow automations, and custom
                integrations using n8n, Zapier, Python, APIs, and modern automation platforms. My
                goal is simple: eliminate repetitive work so teams can focus on higher-value
                activities.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="label-mono text-muted-foreground">Tech I Work With</span>
              <div className="about-stack">
                {TECH_STACK.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
