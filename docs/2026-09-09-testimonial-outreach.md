# Getting the third-party proof

Date: 2026-09-09

## Why this exists

The site's own review file has carried this line since 0.4.0:

> **No third-party proof.** Zero testimonials, client names, or logos. Every
> trust signal is self-authored. **This is now the largest open item.**

It is still open. Nothing on the page is written by anyone except the person
asking to be trusted. No copy change fixes that. Only a client can.

Target: **three written quotes, with a name and a company, and permission to
publish both.** Two is enough to ship. One is better than none.

## Who to ask

Ask in this order. Best odds first.

1. **Hi-Hyperlite** — already named on the site, a two-year working relationship.
2. **The family law firm** — two agents built, both live.
3. **The marketing agency** (AI Marketing Department) — an agency understands
   why a portfolio needs a quote and will usually say yes.
4. **The Make.com audit client** — a rescue job. Rescue clients give the
   warmest quotes, because you fixed something that was hurting.
5. **The mobile repair fleet** — ask last. This one is under NDA, so ask
   whether a quote is possible *without* the company name: "Operations
   Manager, mobile equipment repair company, 40 vehicles" still works.

## The message

Send it as a plain email or the channel you already use with them. Do not
attach anything. Short beats polished.

---

Subject: A quick favour — two sentences?

Hi [Name],

I am putting my portfolio in front of new clients, and the one thing missing
is a word from someone I have actually worked with.

Would you write two sentences about the [voice agent / chatbot / workflow] I
built for you? Something like what the problem was before, and what changed
after. Plain words are perfect. It does not need to be flattering, only true.

If it is easier, answer these three and I will draft it for you to approve:

1. What was the problem before we started?
2. What does the system do for you now?
3. Would you recommend the work to someone else? Why?

Two more things, both a plain yes or no:

- May I show your name and company next to the quote? If not, I will use
  something like "Operations Manager, family law firm" instead.
- May I name [Company] as a client in my project list?

No rush, and no problem at all if the answer is no.

Thank you,
Rey

---

## Rules for using what comes back

- **Never write the quote yourself.** If you draft it from their three answers,
  send the draft back and get a written "yes, publish that" before it ships.
- **Never invent a name, a role, a company or a photograph.** The design doc
  bans fabricated evidence, and a fake testimonial is the fastest way to lose
  a deal when someone checks.
- **A number in a quote still needs a source.** "Cut our missed calls by half"
  is fine if the client wrote it. Do not add a number they did not say.
- Keep the written permission. An email saying "yes, go ahead" is enough.

## Where it goes on the site

Once two quotes land, build:

- `src/data/testimonials.ts` — one entry per quote: `quote`, `name`, `role`,
  `company`, `permissionOnFile` (a date).
- `src/components/sections/TestimonialsSection.tsx` — placed straight after the
  hero, before About. It is proof, so it belongs where the buyer is still
  deciding whether to keep reading.
- Follow `docs/2026-09-01-hire-ready-and-visual-system.md`: `--step-*` sizes
  only, flat panel with a lit rim, two radii, no frosted glass, no emoji.

Do not build the section against placeholder text. An empty testimonial
component is a temptation to fill it with something invented.
