import { motion } from "framer-motion";

const groups = [
  {
    title: "Automation & Integration",
    items: ["n8n", "Zapier", "Make", "UiPath", "AutoHotKey"],
  },
  {
    title: "CRM & Support Platforms",
    items: ["GoHighLevel (GHL)", "QuickCEP", "Shopify", "Amazon Seller Central", "Trello", "Microsoft Planner"],
  },
  {
    title: "AI & Automation",
    items: ["Retell AI", "Elevenlabs", "Vapi", "ChatGPT", "Claude", "Gemini"],
  },
  {
    title: "Dev & Scripting",
    items: ["Python", "JavaScript", "React", "HTML/CSS", "Adobe Creative Suite"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="skills-section relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            03 — Skills
          </span>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            The <span className="italic text-primary">toolkit</span> behind the work.
          </h2>
        </div>

        <div className="skills-grid grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="skills-card"
            >
              <h3 className="skills-card__title">{g.title}</h3>
              <ul className="skills-card__chips">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="skills-card__chip"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
