import type { Project } from "@/types";
import thumbOutbound from "@/assets/project-family-law-outbound.webp";
import thumbInbound from "@/assets/project-family-law-inbound.webp";
import thumbFieldService from "@/assets/project-field-service-voice.webp";
import thumbHyperlite from "@/assets/project-hyperlite-chatbot.webp";
import thumbCrm from "@/assets/project-aios-crm.webp";
import thumbMake from "@/assets/project-make-audit.webp";

/* Each card reads problem first, then solution. A visitor who does not know
   what n8n is can still tell whether this person fixes their kind of problem.

   Order is deliberate. On a wide screen the row is three across, so the first
   three cards are the three voice agents and the second three are the chat,
   CRM and repair work. Each row reads as one kind of job.

   Every thumbnail is a screenshot of the real tool, built by
   scripts/make-card-thumbs.mjs. None of them is an illustration. */
export const projects: Project[] = [
  {
    id: "family-law-outbound",
    title: "Family Law Outbound Agent",
    category: "Voice AI · Outbound",
    tagline: "AI voice agent automating overdue client follow-ups for family law firms.",
    description:
      "An AI voice system that places outbound payment-recovery calls for family law firms, logs every interaction to the CRM, and triggers smart follow-up sequences, turning days of admin into minutes.",
    problem:
      "Chasing overdue invoices means a person on the phone all afternoon, and the notes get written up later, or not at all.",
    solution:
      "A Retell voice agent places the calls, writes each outcome straight into GoHighLevel, and hands off to an n8n workflow that runs the follow-up.",
    youtubeId: "P8bSvgO0-MI",
    thumbnailUrl: thumbOutbound,
    techStack: ["GHL", "n8n", "Retell AI"],
    badge: "Automated payment recovery calls",
    demoLabel: "1:26 Demo",
    ctaLabel: "Watch the Demo",
    ctaUrl: "https://www.youtube.com/watch?v=P8bSvgO0-MI",
  },
  {
    id: "family-law-inbound",
    title: "Family Law Inbound Agent",
    category: "Voice AI · Inbound",
    tagline: "AI inbound assistant for lead qualification and automated consultation routing.",
    description:
      "A 24/7 inbound voice agent that greets callers, qualifies leads, books consultations directly into the firm's calendar, and routes urgent matters to the on-call attorney.",
    problem:
      "A first call to a law firm often lands on voicemail. Someone who needs a lawyer today rings the next firm on the list instead.",
    solution:
      "A Retell voice agent answers every call, asks the intake questions, books the consultation into the firm calendar, and flags urgent matters for the on-call attorney.",
    youtubeId: "9Hb7Q9BXREw",
    thumbnailUrl: thumbInbound,
    techStack: ["GHL", "n8n", "Retell AI"],
    badge: "Automated intake & scheduling",
    demoLabel: "5:21 Demo",
    ctaLabel: "Watch the Demo",
    ctaUrl: "https://www.youtube.com/watch?v=9Hb7Q9BXREw",
  },
  {
    id: "field-service-voice",
    title: "Field Service Voice Agent",
    category: "Voice AI · After hours",
    tagline:
      "AI voice agent that answers every after-hours call a mobile repair business was missing.",
    description:
      "An after-hours voice agent for a mobile fleet and equipment repair company. The client is not named here, under NDA. The agent is deliberately narrow: it never quotes a price, never books a job, and never promises that a technician is on the way. It takes the details and stops, so every decision that costs money still goes through a person. Holding an LLM inside that boundary, call after call, was the hard part of the build.",
    problem:
      "Calls that came in after hours, or while the crew was already on a job, went to voicemail, and each one was work walking away.",
    solution:
      "A voice agent answers every call, takes the name, callback number, location and fault, sorts it into routine service, roadside emergency, existing customer or sales, and sends the owner a recap by email and text within a minute of the call ending.",
    thumbnailUrl: thumbFieldService,
    techStack: ["Retell AI", "n8n", "GPT-4.1"],
    badge: "Every after-hours call answered",
    demoLabel: "Demo coming soon",
  },
  {
    id: "hyperlite-chatbot",
    title: "Hyperlite LED Chatbot",
    category: "Chatbot · Ecommerce",
    tagline: "24/7 AI chatbot handling support, product recommendations, and warranty inquiries.",
    description:
      "A QuickCEP-powered conversational assistant for an LED lighting ecommerce brand. Resolves support tickets, recommends fixtures, and processes warranty intake around the clock.",
    problem:
      "An LED store fields the same three questions all day: which fixture fits this space, is it in stock, and how does the warranty work.",
    solution:
      "A QuickCEP assistant on the Shopify storefront answers those, narrows the catalogue to the right fixture, and takes warranty claims without a human.",
    youtubeId: "1vhT-IMSvVU",
    thumbnailUrl: thumbHyperlite,
    techStack: ["QuickCEP", "Shopify", "GPT-4"],
    badge: "Always-on customer support",
    demoLabel: "4:22 Demo",
    ctaLabel: "View Website",
    ctaUrl: "https://hi-hyperlite.com/",
  },
  {
    id: "aios-crm-marketing",
    title: "AI Marketing Department",
    category: "Marketing AI · CRM",
    tagline:
      "A marketing workspace inside a CRM that turns one brief into a post for every channel.",
    description:
      "A marketing department built into a marketing agency's CRM. It has a room for each job: copy, creative, SEO and GEO, analytics, and campaigns. A brand kit holds the facts the writer is allowed to treat as true, and anything missing is tagged rather than invented.",
    problem:
      "A marketing team rewrites the same announcement eight times, once per channel, and the facts drift a little with every rewrite.",
    solution:
      "One brief goes in, and the workspace writes a version for each channel it is pointed at, inside that channel's own limits, using only the facts the brand kit allows.",
    youtubeId: "wLjbv97FStY",
    thumbnailUrl: thumbCrm,
    techStack: ["Gemini 2.5", "AIOS CRM"],
    badge: "One brief, every channel",
    demoLabel: "Walkthrough",
    ctaLabel: "Watch the Walkthrough",
    ctaUrl: "https://www.youtube.com/watch?v=wLjbv97FStY",
  },
  {
    id: "make-audit",
    title: "Make.com Audit & Repair",
    category: "Automation · Audit & repair",
    tagline: "Broken Make.com scenarios traced to their cause across several client accounts.",
    description:
      "An audit and repair job across several Make.com client accounts: duplicate leads flooding a CRM, an unclear Facebook connection error, a CRM that could not hold custom fields, and a webhook failing with an empty log. Each one was traced to its cause rather than patched at the symptom. Building scenarios is the easy half. Finding what is actually broken is the job.",
    problem:
      "Live scenarios across several client accounts were flooding a CRM with duplicate leads, and one webhook was failing with nothing at all in the error log.",
    solution:
      "I found the cause of each fault and fixed it: a trigger re-importing months of old leads, a login token standing in for a production one, a CRM schema that would not take custom fields, and a missing database mapping that dropped leads in silence.",
    thumbnailUrl: thumbMake,
    techStack: ["Make.com", "Facebook Lead Ads", "Google Sheets"],
    badge: "Stable scenarios, no duplicate leads",
    demoLabel: "Demo coming soon",
  },
];
