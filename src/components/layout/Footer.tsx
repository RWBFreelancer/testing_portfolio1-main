import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from "@/lib/site-contact";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Reynaldo W. Binay-an</p>
        {/* The only contact route on the page that depends on nothing. */}
        <p>
          <a href={CONTACT_EMAIL_HREF} className="site-footer__email">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p>Baguio City, PH</p>
      </div>
    </footer>
  );
}
