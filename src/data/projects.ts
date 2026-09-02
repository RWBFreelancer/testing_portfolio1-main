import type { Project } from "@/types";
import thumb1 from "@/assets/project-1.webp";
import thumb2 from "@/assets/project-2.webp";
import thumb3 from "@/assets/project-3.webp";

/* Each card reads problem first, then solution. A visitor who does not know
   what n8n is can still tell whether this person fixes their kind of problem. */
export const projects: Project[] = [
  {
    id: "project-1",
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
    thumbnailUrl: thumb1,
    techStack: ["GHL", "n8n", "Retell AI"],
    badge: "Automated payment recovery calls",
    demoLabel: "1:26 Demo",
    ctaLabel: "Watch the Demo",
    ctaUrl: "https://www.youtube.com/watch?v=P8bSvgO0-MI",
  },
  {
    id: "project-3",
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
    thumbnailUrl: thumb3,
    techStack: ["GHL", "n8n", "Retell AI"],
    badge: "Automated intake & scheduling",
    demoLabel: "5:21 Demo",
    ctaLabel: "Watch the Demo",
    ctaUrl: "https://www.youtube.com/watch?v=9Hb7Q9BXREw",
  },
  {
    id: "project-2",
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
    thumbnailUrl: thumb2,
    techStack: ["QuickCEP", "Shopify", "GPT-4"],
    badge: "Always-on customer support",
    demoLabel: "4:22 Demo",
    ctaLabel: "View Website",
    ctaUrl: "https://hi-hyperlite.com/",
  },
];
