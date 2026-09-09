/**
 * Was two equal-height cards: the degree card held two lines of text and then
 * 150px of nothing, because the certifications card set the row height.
 * Credentials are a list of facts, so this renders them as one - a ruled
 * register rather than a card grid.
 */
const credentials = [
  {
    year: "2025",
    title: "Oracle Cloud Infrastructure Generative AI Professional",
    issuer: "Oracle",
    kind: "Certification",
  },
  {
    year: "2025",
    title: "Oracle Cloud Infrastructure Certified Data Science Professional",
    issuer: "Oracle",
    kind: "Certification",
  },
  {
    year: "2025",
    title: "Oracle Cloud Infrastructure Certified AI Foundations Associate",
    issuer: "Oracle",
    kind: "Certification",
  },
  {
    year: "2015",
    title: "B.S. Electrical Engineering",
    issuer: "Saint Louis University, Baguio City",
    kind: "Degree",
  },
  // The licence number is deliberately not published. Next to a full legal
  // name, a city and a photograph it is identity-theft material, and no
  // automation buyer verifies a PRC electrical licence. Give it on request.
  {
    year: "Active",
    title: "Registered Electrical Engineer",
    issuer: "Professional Regulation Commission, Philippines",
    kind: "Licence",
  },
  {
    year: "Active",
    title: "Safety Officer 3",
    issuer: "PEME Consultancy Inc., Baguio City",
    kind: "Certification",
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="relative">
      <div className="section-shell">
        <div className="mb-12 max-w-2xl">
          <span className="label-mono text-primary">Education &amp; Credentials</span>
          <h2 className="section-heading mt-4">Licensed engineer, certified in AI.</h2>
        </div>

        <ul className="credential-register">
          {credentials.map((c) => (
            <li key={c.title} className="credential-register__row">
              <span className="credential-register__year">{c.year}</span>
              <span className="credential-register__title">{c.title}</span>
              <span className="credential-register__issuer">{c.issuer}</span>
              <span className="credential-register__kind">{c.kind}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
