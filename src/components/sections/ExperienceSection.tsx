import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const roles = [
  {
    title: "Freelance AI Automation Developer",
    company: "Freelance / Multiple Clients",
    location: "Remote - Part-Time",
    dates: "05/2026 - Present",
    bullets: [
      "Build automation workflows for small business clients using **n8n, Zapier, and Make**.",
      "Connect CRMs such as **GoHighLevel and HubSpot** to automation tools like **n8n, Claude Code, and Make**.",
      "Develop websites and dashboards using **Claude Code, Codex, Cursor, and Antigravity**.",
      "Develop voice agents using **ElevenLabs, Retell, and Vapi**.",
    ],
  },
  {
    title: "Technical Virtual Assistant",
    company: "Hi-Hyperlite",
    location: "Remote - Full-Time",
    dates: "07/2024 - 07/2026",
    bullets: [
      "Implemented AI-powered automation (QuickCEP CRM, n8n, AutoHotKey) - **cutting response time from 2 hours to under 30 minutes**.",
      "Created customized lighting simulations using DIALux, AutoCAD, and Photoshop, resulting in **80% client approval rate** on first submission.",
      "Delivered multi-channel support (email, phone, chat) maintaining **95% first-contact resolution**.",
    ],
  },
  {
    title: "Resident Engineer",
    company: "The SM Store Baguio",
    location: "Baguio City",
    dates: "03/2024 - 07/2024",
    bullets: [
      "Orchestrated comprehensive maintenance for mechanical, electrical, plumbing, and fire protection systems.",
      "Directed renovation projects in adherence to Philippine building codes, on schedule and within budget.",
      "Implemented preventive maintenance scheduling in Microsoft Planner, reducing emergency repairs.",
    ],
  },
  {
    title: "Safety Officer 3",
    company: "Global Agility Solutions, LLC",
    location: "Baguio City",
    dates: "01/2019 - 02/2024",
    bullets: [
      "Reduced workplace incidents by **30% over five years** through inspections and corrective measures.",
      "Built training modules and visual safety campaigns achieving **100% employee compliance**.",
      "Used AI tools (Perplexity, Claude) to analyze incident patterns - cutting repeat incidents to near zero.",
      "Ensured full RA 11058 / OSH compliance with **zero violations** on external audits.",
    ],
  },
  {
    title: "Virtual Assistant",
    company: "Atlantic for Wholesale & Distribution, LLC",
    location: "Remote - Part-Time",
    dates: "10/2021 - 06/2023",
    bullets: [
      "Built Python-based scraping tools that identified new product opportunities and generated additional revenue.",
      "Grew social following from **150 to 9,500** and increased engagement by **65%**.",
      "Optimized site code (HTML/CSS/JS/React) for a **10% page-load improvement**.",
    ],
  },
  {
    title: "Technical Virtual Assistant",
    company: "G&K Electrical Services",
    location: "Remote - Part-Time",
    dates: "01/2021 - 08/2021",
    bullets: [
      "Created precise engineering designs for lighting and solar installs using AutoCAD, DIALux, and SketchUp.",
      "Implemented Trello-based workflow system - perfect on-time delivery and client retention.",
    ],
  },
  {
    title: "Maintenance Supervisor",
    company: "The SM Store Baguio",
    location: "Baguio City",
    dates: "01/2018 - 06/2018",
    bullets: [
      "Led electricians and plumbers; responded to emergencies within **15 minutes**.",
      "Implemented a preventive maintenance program that reduced critical failures.",
    ],
  },
  {
    title: "Chat Support Representative",
    company: "Chatsmith Online",
    location: "Baguio City",
    dates: "01/2017 - 09/2018",
    bullets: [
      "Real-time support for U.S. real estate clients - **95% CSAT** and sub-30s response times.",
      "Performed LIDAR data labeling, improving AI training data accuracy by **25%**.",
    ],
  },
  {
    title: "Cadet Engineer",
    company: "Benguet Electric Cooperative (BENECO)",
    location: "Baguio City",
    dates: "10/2015 - 09/2016",
    bullets: [
      "Improved electrical system reliability via systematic meter and pole maintenance.",
      "Streamlined permit processing, reducing approval times.",
    ],
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

function ExperienceEntry({ role, index }: { role: (typeof roles)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const visibleBullets = role.bullets.slice(0, 2);
  const hiddenBullets = role.bullets.slice(2);

  return (
    <motion.li
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.05 }}
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
            <ul className={`experience-entry__extra${expanded ? " expanded" : ""}`}>
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
            >
              {expanded ? "Show less ↑" : "Show more ↓"}
            </button>
          </>
        )}
      </div>
    </motion.li>
  );
}

export default function ExperienceSection() {
  return (
    <section id="experience" className="experience-section relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">02 — Experience</span>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            A track record of <span className="italic text-primary">measurable wins.</span>
          </h2>
        </div>

        <ol className="experience-timeline">
          {roles.map((role, index) => (
            <ExperienceEntry key={`${role.company}-${index}`} role={role} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
