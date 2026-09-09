import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Two tiers on purpose. A hiring manager scanning for automation skill should
 * not have to read past four facilities and safety roles to find it. The older
 * engineering career still earns its place, but as one compact credential
 * block rather than as four cards competing with the automation work.
 */
const automationRoles = [
  {
    title: "Freelance AI Automation Developer",
    company: "Freelance / Multiple Clients",
    location: "Remote · Part-Time",
    dates: "01/2026 - Present",
    bullets: [
      "Built an inbound voice agent that qualifies **law firm** leads and an outbound agent that chases overdue invoices, using **Retell AI** wired to **n8n and GoHighLevel** so every call updates the CRM.",
      "Built an inbound voice agent that qualifies **mechanic repair** leads, filters them in **n8n**, and pushes only qualified jobs into **Fieldpulse**.",
      "Built and maintain **Make** scenarios connected to **Meta Ads**, and extended a client's self-coded CRM with **Claude Code**.",
      "Ship client-facing websites and dashboards with **Claude Code, Codex, Cursor, and Antigravity**.",
    ],
  },
  {
    title: "Facebook Automation Specialist",
    company: "Freelance / Multiple Clients",
    location: "Remote · Part-Time",
    dates: "08/2025 - 06/2026",
    bullets: [
      "Built **n8n** workflows that watch Facebook Page inboxes, sort customer messages with **ChatGPT and Claude**, and send accurate auto-replies.",
      "Connected the **Facebook Graph API** to n8n to handle comment replies, direct messages, and lead sorting across several client pages at once.",
      "Set up escalation rules so sensitive or unclear questions go to a real person instead of the AI.",
      "Cut client response times and turned more inbox conversations into sales.",
    ],
  },
  {
    title: "Technical Virtual Assistant",
    company: "Hi-Hyperlite",
    location: "Remote · Full-Time",
    dates: "07/2024 - 07/2026",
    bullets: [
      "Implemented AI-powered automation (QuickCEP CRM, n8n, AutoHotKey) — **cutting response time from 2 hours to under 30 minutes**.",
      "Delivered multi-channel support across email, phone, and chat, holding **95% first-contact resolution**.",
      "Created lighting simulations in DIALux, AutoCAD, and Photoshop, earning an **80% client approval rate** on first submission.",
    ],
  },
];

const earlierCareer = [
  {
    title: "Resident Engineer",
    company: "The SM Store Baguio",
    dates: "2024",
    note: "Ran maintenance for all mechanical, electrical, plumbing, and fire safety systems, and led code-compliant renovations on time and on budget.",
  },
  {
    title: "Safety Officer 3",
    company: "Global Agility Solutions, LLC",
    dates: "2019 - 2024",
    note: "Cut workplace incidents by 30% over five years, hit 100% training compliance, and passed every external audit with zero violations.",
  },
  {
    title: "Virtual Assistant",
    company: "Atlantic for Wholesale & Distribution, LLC",
    dates: "2021 - 2023",
    note: "Built Python scraping tools that surfaced new product opportunities, and grew a social following from 150 to 9,500.",
  },
  {
    title: "Technical Virtual Assistant",
    company: "G&K Electrical Services",
    dates: "2021",
    note: "Produced lighting and solar designs in AutoCAD, DIALux, and SketchUp, managed through a Trello workflow.",
  },
  {
    title: "Maintenance Supervisor",
    company: "The SM Store Baguio",
    dates: "2018",
    note: "Led electricians and plumbers with a 15-minute emergency response time.",
  },
  {
    title: "Chat Support Representative",
    company: "Chatsmith Online",
    dates: "2017 - 2018",
    note: "Handled 100-150 chats a day for U.S. real estate clients at 95% satisfaction, and labelled LIDAR data for AI training.",
  },
  {
    title: "Cadet Engineer",
    company: "Benguet Electric Cooperative (BENECO)",
    dates: "2015 - 2016",
    note: "Maintained meters and line poles, and made the electrical permit process faster.",
  },
];

function renderBullet(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function ExperienceEntry({
  role,
  index,
}: {
  role: (typeof automationRoles)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const visibleBullets = role.bullets.slice(0, 2);
  const hiddenBullets = role.bullets.slice(2);

  return (
    <motion.li
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : index * 0.06 }}
      className="experience-entry"
    >
      <div className="experience-entry__card">
        <div className="experience-entry__meta">
          <span className="experience-entry__date">{role.dates}</span>
          <span className="experience-entry__location">{role.location}</span>
        </div>

        <h3 className="experience-entry__title font-display">{role.title}</h3>
        <div className="experience-entry__company font-display">{role.company}</div>

        <ul className="experience-entry__bullets">
          {visibleBullets.map((bullet, bulletIndex) => (
            <li key={bulletIndex} className="experience-entry__bullet">
              <span aria-hidden className="experience-entry__bullet-dot" />
              <span>{renderBullet(bullet)}</span>
            </li>
          ))}
        </ul>

        {hiddenBullets.length > 0 && (
          <>
            <ul
              id={`experience-extra-${index}`}
              aria-hidden={!expanded}
              className={`experience-entry__extra${expanded ? " expanded" : ""}`}
            >
              {hiddenBullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="experience-entry__bullet">
                  <span aria-hidden className="experience-entry__bullet-dot" />
                  <span>{renderBullet(bullet)}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="experience-entry__toggle"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              aria-controls={`experience-extra-${index}`}
            >
              {expanded ? "Show less ↑" : "Show more ↓"}
            </button>
          </>
        )}
      </div>
    </motion.li>
  );
}

function EarlierCareer() {
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="earlier-career"
    >
      <p className="earlier-career__lede">
        Before automation: <strong className="text-foreground">9 years</strong> as a licensed
        electrical engineer, safety officer, and operations lead. That is where the systems thinking
        comes from — reading a process, finding the failure point, and designing the fix.
      </p>

      <button
        type="button"
        className="earlier-career__toggle"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls="earlier-career-list"
      >
        {expanded ? "Hide earlier roles ↑" : `Show all ${earlierCareer.length} earlier roles ↓`}
      </button>

      <ul
        id="earlier-career-list"
        aria-hidden={!expanded}
        className={`earlier-career__list${expanded ? " expanded" : ""}`}
      >
        {earlierCareer.map((role) => (
          <li key={`${role.company}-${role.dates}`} className="earlier-career__item">
            <span className="earlier-career__dates">{role.dates}</span>
            <div>
              <span className="earlier-career__title">{role.title}</span>
              <span className="earlier-career__company">{role.company}</span>
              <p className="earlier-career__note">{role.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function ExperienceSection() {
  return (
    <section id="experience" className="experience-section relative">
      <div className="section-shell">
        <div className="mb-12 max-w-2xl">
          <span className="label-mono text-primary">Experience</span>
          <h2 className="section-heading mt-4">More than 2 years in AI & Automation</h2>
        </div>

        <ol className="experience-timeline">
          {automationRoles.map((role, index) => (
            <ExperienceEntry key={`${role.company}-${role.dates}`} role={role} index={index} />
          ))}
        </ol>

        <EarlierCareer />
      </div>
    </section>
  );
}
