import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Calendar,
  CheckCircle,
  X,
  Linkedin,
  Github,
  Briefcase,
  Handshake,
} from "lucide-react";
import { useContactForm } from "@/hooks/useContactForm";
import { useCalendlyModal } from "@/hooks/useCalendlyModal";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const fadeUp = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ─── Social Link (icon button with tooltip + hover/tap animation) ────────────
type SocialLinkProps = {
  href: string;
  label: string;
  tooltip: string;
  icon: React.ReactNode;
};

function SocialLink({ href, label, tooltip, icon }: SocialLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.92 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--glass-border)] bg-transparent text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {icon}
        </motion.a>
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({ onClose, onBookCall }: { onClose: () => void; onBookCall: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={panelRef}
        className="relative z-10 flex w-full max-w-md flex-col gap-5 overscroll-contain rounded-2xl border border-border bg-background p-8 shadow-glow"
        initial={{
          opacity: 0,
          scale: prefersReducedMotion ? 1 : 0.96,
          y: prefersReducedMotion ? 0 : 16,
        }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--primary-10)]">
            <CheckCircle className="text-primary" size={24} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 id="success-title" className="font-display text-2xl text-foreground">
              Thanks for reaching out.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your inquiry has been received. I usually respond within 24 hours.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Prefer to talk directly? You can also schedule a quick call.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookCall();
            }}
            className="site-navbar__cta flex flex-1 items-center justify-center gap-2 !py-2.5 !text-sm"
          >
            <Calendar size={15} />
            Book a Call
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Contact Form Card (Secondary) ────────────────────────────────────────────
function ContactFormCard() {
  const {
    form,
    status,
    errorMessage,
    SERVICE_OPTIONS,
    updateField,
    toggleService,
    submit,
    resetForm,
    formRef,
  } = useContactForm();

  const { openCalendly } = useCalendlyModal();

  return (
    <>
      <AnimatePresence>
        {status === "success" && (
          <SuccessModal key="success-modal" onClose={resetForm} onBookCall={openCalendly} />
        )}
      </AnimatePresence>

      <div
        className="contact-form-container mx-auto w-full rounded-[var(--radius-panel)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 sm:p-10 lg:py-12 !flex-none"
        style={{ boxShadow: "none" }}
      >
        <div className="mx-auto w-full max-w-[560px] flex h-full flex-col gap-5">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="label-mono text-primary mb-2 block">Prefer to write first?</span>
            <h3 className="section-heading" style={{ fontSize: "var(--step-2)" }}>
              Send a message
            </h3>
            <p className="text-sm text-muted-foreground">I'll get back to you within 24 hours.</p>
          </div>

          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex h-full flex-col gap-4 mt-2"
            noValidate
          >
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={form.honeypot}
              onChange={(e) => updateField("honeypot", e.target.value)}
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              style={{ display: "none" }}
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-name"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Name <span className="font-normal normal-case opacity-60">(optional)</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="contact-field !bg-background/50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-email"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Email <span className="text-primary">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
                className="contact-field !bg-background/50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                I'm interested in
              </span>
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((service) => {
                  const selected = form.services.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      aria-pressed={selected}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-transparent text-muted-foreground hover:border-[var(--primary-50)] hover:text-foreground"
                      }`}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-message"
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
              >
                Your situation <span className="text-primary">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="What process, workflow, or task would you like to improve or automate?"
                rows={3}
                required
                className="contact-field !bg-background/50 resize-none leading-relaxed"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-destructive" role="alert">
                {errorMessage}
              </p>
            )}

            <div className="mt-2 pt-2">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent px-6 py-4 text-[length:var(--step--1)] font-semibold text-primary transition-all hover:bg-[var(--primary-10)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "submitting" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary-foreground-30)] border-t-primary" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Inquiry
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ContactSection() {
  const { openCalendly } = useCalendlyModal();

  return (
    <TooltipProvider delayDuration={150}>
      <section
        id="contact"
        className="contact-section relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
        aria-labelledby="contact-heading"
      >
        <div className="mx-auto flex flex-col gap-12 sm:gap-16 items-center w-full max-w-7xl">
          {/* Was a symmetric 1-3-1 grid: two tall empty rails holding four small
              icons, with the whole block centred. Left-aligned and single-column
              takes roughly half the height and stops out-measuring the work. */}
          <motion.div
            className="contact-cta"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
          >
            <div className="contact-cta__main">
              <span className="label-mono text-primary">Let&rsquo;s talk</span>
              <h2 id="contact-heading" className="section-heading mt-4">
                Tell me what you&rsquo;d like to automate.
              </h2>
              <p className="contact-cta__lede">
                Bring a process that eats your week. In 30 minutes I will tell you whether it can be
                automated, roughly what it takes, and what it would save. No pitch.
              </p>

              <div className="contact-cta__actions">
                <button
                  onClick={openCalendly}
                  aria-label="Open Calendly booking modal"
                  className="site-navbar__cta inline-flex items-center justify-center gap-2 !py-3.5"
                >
                  <Calendar size={17} />
                  Book a Call
                </button>
                <span className="contact-cta__note label-mono">
                  30 min · no commitment · Baguio City, PH
                </span>
              </div>
            </div>

            <div className="contact-cta__links">
              <div className="contact-cta__link-group">
                <span className="label-mono text-muted-foreground">Hire me</span>
                <div className="contact-cta__icons">
                  <SocialLink
                    href="https://www.onlinejobs.ph/jobseekers/info/859381"
                    label="OnlineJobs.ph profile"
                    tooltip="View OnlineJobs.ph Profile"
                    icon={<Briefcase className="h-5 w-5" />}
                  />
                  <SocialLink
                    href="https://www.upwork.com/freelancers/~01c1eaec96fb3b5c6c?mp_source=share"
                    label="Upwork profile"
                    tooltip="View Upwork Profile"
                    icon={<Handshake className="h-5 w-5" />}
                  />
                </div>
              </div>

              <div className="contact-cta__link-group">
                <span className="label-mono text-muted-foreground">Connect</span>
                <div className="contact-cta__icons">
                  <SocialLink
                    href="https://www.linkedin.com/in/reywbinay-an/"
                    label="LinkedIn"
                    tooltip="View LinkedIn Profile"
                    icon={<Linkedin className="h-5 w-5" />}
                  />
                  <SocialLink
                    href="https://github.com/RWBFreelancer"
                    label="GitHub"
                    tooltip="View GitHub Profile"
                    icon={<Github className="h-5 w-5" />}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. SECONDARY CARD (Low-Pressure Fallback) */}
          <motion.div
            className="w-full flex justify-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={0.1}
          >
            <ContactFormCard />
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  );
}
