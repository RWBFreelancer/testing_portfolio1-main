import type { Project } from "@/types";
import thumb1 from "@/assets/project-1.jpg";
import thumb2 from "@/assets/project-2.jpg";
import thumb3 from "@/assets/project-3.jpg";

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Family Law Outbound Agent",
    category: "AI Automation · Voice AI",
    tagline: "AI voice agent automating overdue client follow-ups for family law firms.",
    description:
      "An AI voice system that places outbound payment-recovery calls for family law firms, logs every interaction to the CRM, and triggers smart follow-up sequences, turning days of admin into minutes.",
    metrics: [
      { label: "Recovery lift", value: "3.2×" },
      { label: "Hours saved / wk", value: "24h" },
      { label: "Calls automated", value: "100%" },
    ],
    youtubeId: "P8bSvgO0-MI",
    thumbnailUrl: thumb1,
    techStack: ["GHL", "n8n", "Retell AI"],
    badge: "Automated payment recovery calls",
    demoLabel: "1:24 Demo",
    ctaLabel: "View Case Study",
    ctaUrl: "https://www.youtube.com/watch?v=P8bSvgO0-MI",
  },
  {
    id: "project-2",
    title: "Hyperlite LED Chatbot",
    category: "AI Automation · Chatbot",
    tagline: "24/7 AI chatbot handling support, product recommendations, and warranty inquiries.",
    description:
      "A QuickCEP-powered conversational assistant for an LED lighting ecommerce brand. Resolves support tickets, recommends fixtures, and processes warranty intake around the clock.",
    metrics: [
      { label: "First response", value: "<30s" },
      { label: "Resolution rate", value: "95%" },
      { label: "Coverage", value: "24/7" },
    ],
    youtubeId: "1vhT-IMSvVU",
    thumbnailUrl: thumb2,
    techStack: ["QuickCEP", "Shopify", "GPT-4"],
    badge: "Always-on customer support",
    demoLabel: "0:58 Demo",
    ctaLabel: "View Case Study",
    ctaUrl: "https://www.youtube.com/watch?v=1vhT-IMSvVU",
  },
  {
    id: "project-3",
    title: "Family Law Inbound Agent",
    category: "AI Automation · Voice AI",
    tagline: "AI inbound assistant for lead qualification and automated consultation routing.",
    description:
      "A 24/7 inbound voice agent that greets callers, qualifies leads, books consultations directly into the firm's calendar, and routes urgent matters to the on-call attorney.",
    metrics: [
      { label: "Lead capture", value: "+62%" },
      { label: "Avg pickup", value: "1 ring" },
      { label: "Booked / wk", value: "18" },
    ],
    youtubeId: "9Hb7Q9BXREw",
    thumbnailUrl: thumb3,
    techStack: ["GHL", "n8n", "Retell AI"],
    badge: "Automated intake & scheduling",
    demoLabel: "1:37 Demo",
    ctaLabel: "View Case Study",
    ctaUrl: "https://www.youtube.com/watch?v=9Hb7Q9BXREw",
  },
];
