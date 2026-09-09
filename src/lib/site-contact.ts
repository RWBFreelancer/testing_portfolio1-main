// Single source of truth for the ways a visitor can reach Rey.
//
// Every CTA on the site depends on a third party: Calendly needs an external
// script, the form needs Resend and Supabase. All three can fail silently.
// The email address below is the fallback that cannot fail, so it must stay
// correct and must be rendered wherever a booking or a form can break.
//
// Change CONTACT_EMAIL here and it changes everywhere.
export const CONTACT_EMAIL = "rwbfreelancer@gmail.com";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const CALENDLY_URL =
  (import.meta.env.VITE_CALENDLY_URL as string | undefined) ??
  "https://calendly.com/reybinayan01/30min";
