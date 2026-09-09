import { motion, useReducedMotion } from "framer-motion";
import profileImage from "@/assets/profile.webp";

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
      <div className="section-shell flex flex-col gap-12">
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

            {/* One job title across the site: hero eyebrow, page title, here. */}
            <p className="about-role-badge">AI Automation Engineer</p>

            {/* The old lede was three abstractions in one sentence — save time,
                improve customer experience, increase efficiency — which the copy
                rules in docs/2026-09-01 ban by name. Open on a countable fact
                instead. Every project named here is a card in the hero. */}
            <p className="about-lede max-w-[62ch] border-l-2 border-primary pl-6">
              Six AI systems are running in production right now: two voice agents for family law
              firms, an after-hours agent for a mobile repair fleet, a chatbot for an LED store, a
              marketing workspace inside an agency&rsquo;s CRM, and a rescue job on three broken
              Make.com accounts. Each one replaced work a person was doing by hand.
            </p>

            <div className="about-body max-w-[62ch] space-y-4">
              <p>
                I spent nine years as a licensed electrical engineer, a safety officer, and an
                operations lead before I moved into automation. That is why I read a business as a
                system first and reach for a tool second. I find where the work leaks out, then I
                close the leak.
              </p>
              {/* Closes on the two objections that actually stop a small business
                  owner from booking: lock-in, and what happens when it breaks. */}
              <p>
                I build with Retell, Vapi, n8n, Make, GoHighLevel and Python. I test against real
                calls and real messages, not happy paths. Every build ships with a handover
                document, so your team can run it without me — and I stay on call if you would
                rather I did.
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
