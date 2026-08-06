import { GraduationCap, Award } from "lucide-react";

export default function EducationSection() {
  return (
    <section id="education" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            03 — Education & Credentials
          </span>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Engineering <span className="italic text-primary">foundation.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="education-card rounded-2xl border border-border p-7 shadow-glow">
            <GraduationCap className="h-7 w-7 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl text-foreground">
              B.S. Electrical Engineering
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Saint Louis University · 2015</p>
          </div>

          <div className="education-card rounded-2xl border border-border p-7 shadow-glow">
            <Award className="h-7 w-7 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl text-foreground">Certifications</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-foreground/85">
              <li>Registered Electrical Engineer · Lic. No. 0057141</li>
              <li>Safety Officer 3 · PEME Consultancy Inc., Baguio City</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
