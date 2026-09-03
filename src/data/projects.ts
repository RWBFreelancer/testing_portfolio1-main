import type { Project } from "@/types";
import thumbOutbound from "@/assets/project-family-law-outbound.webp";
import thumbInbound from "@/assets/project-family-law-inbound.webp";
import thumbFieldService from "@/assets/project-field-service-voice.webp";
import thumbHyperlite from "@/assets/project-hyperlite-chatbot.webp";
import thumbCrm from "@/assets/project-aios-crm.webp";
import thumbMake from "@/assets/project-make-audit.webp";

/* The gallery screenshots. Every one is a redacted capture of the real tool,
   built by scripts/make-card-thumbs.mjs' sibling, scripts/make-gallery.mjs.
   The blur is baked into the committed file: there is no unredacted copy in
   this repo, so nothing here can leak a client's name by mistake. */
import shotOutbound1 from "@/assets/gallery/family-law-outbound-1.webp";
import shotOutbound2 from "@/assets/gallery/family-law-outbound-2.webp";
import shotOutbound3 from "@/assets/gallery/family-law-outbound-3.webp";
import shotInbound1 from "@/assets/gallery/family-law-inbound-1.webp";
import shotInbound2 from "@/assets/gallery/family-law-inbound-2.webp";
import shotField1 from "@/assets/gallery/field-service-voice-1.webp";
import shotField2 from "@/assets/gallery/field-service-voice-2.webp";
import shotField3 from "@/assets/gallery/field-service-voice-3.webp";
import shotField4 from "@/assets/gallery/field-service-voice-4.webp";
import shotHyper1 from "@/assets/gallery/hyperlite-chatbot-1.webp";
import shotHyper2 from "@/assets/gallery/hyperlite-chatbot-2.webp";
import shotHyper3 from "@/assets/gallery/hyperlite-chatbot-3.webp";
import shotCrm1 from "@/assets/gallery/aios-crm-marketing-1.webp";
import shotCrm2 from "@/assets/gallery/aios-crm-marketing-2.webp";
import shotCrm3 from "@/assets/gallery/aios-crm-marketing-3.webp";
import shotCrm4 from "@/assets/gallery/aios-crm-marketing-4.webp";
import shotCrm5 from "@/assets/gallery/aios-crm-marketing-5.webp";
import shotMake1 from "@/assets/gallery/make-audit-1.webp";
import shotMake2 from "@/assets/gallery/make-audit-2.webp";
import shotMake3 from "@/assets/gallery/make-audit-3.webp";

/* Each card reads problem first, then solution. A visitor who does not know
   what n8n is can still tell whether this person fixes their kind of problem.

   Order is deliberate. On a wide screen the row is three across, so the first
   three cards are the three voice agents and the second three are the chat,
   CRM and repair work. Each row reads as one kind of job.

   Every thumbnail is a screenshot of the real tool, built by
   scripts/make-card-thumbs.mjs. None of them is an illustration. */
export const projects: Project[] = [

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
    youtubeId: "E_5ZXeye-0E",
    thumbnailUrl: thumbFieldService,
    gallery: [
      {
        src: shotField1,
        caption:
          "The live account: 606 calls, 1m 15s average, and the pick-up rate flat at 100%. The workspace name is masked.",
      },
      {
        src: shotField2,
        caption:
          "Agent A. Every branch the caller can take is a node, so the agent cannot wander outside them.",
      },
      {
        src: shotField3,
        caption: "Agent B, the shorter build, kept beside Agent A to compare cost and latency.",
      },
      {
        src: shotField4,
        caption:
          "The recap workflow in n8n. Each run sends the owner the call summary by email and text.",
      },
    ],
    techStack: ["Retell AI", "n8n", "FieldPulse"],
    badge: "Every after-hours call answered",
    demoLabel: "3:14 Demo",
    ctaLabel: "Watch the Demo",
    ctaUrl: "https://www.youtube.com/watch?v=E_5ZXeye-0E",
  },
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
    gallery: [
      {
        src: shotOutbound1,
        caption:
          "The n8n workflow, in three parts: place the call, send the payment link by SMS and email, then write the result back to the CRM.",
      },
      {
        src: shotOutbound2,
        caption:
          "The Retell agent. The prompt sets one job only: confirm the client can pay, send the link, verify receipt. The firm name is blurred.",
      },
      {
        src: shotOutbound3,
        caption:
          "The same agent on Vapi, with the model, voice and cost per minute side by side. The firm name is blurred.",
      },
    ],
    techStack: ["GHL", "n8n", "Vapi"],
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
    gallery: [
      {
        src: shotInbound1,
        caption:
          "The n8n workflow: look the caller up in the CRM, read the live calendar, then open or update the lead after the call.",
      },
      {
        src: shotInbound2,
        caption:
          "The Retell prompt. Worked examples teach the agent to turn away a caller outside New York State, or outside family law. The firm name is blurred.",
      },
    ],
    techStack: ["GHL", "n8n", "Retell AI"],
    badge: "Automated intake & scheduling",
    demoLabel: "5:21 Demo",
    ctaLabel: "Watch the Demo",
    ctaUrl: "https://www.youtube.com/watch?v=9Hb7Q9BXREw",
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
    gallery: [
      {
        src: shotHyper1,
        caption:
          "The responder flow: read the question, search the product knowledge base, then answer or hand over.",
      },
      {
        src: shotHyper2,
        caption:
          "The prompt. It fixes the scope to USA shipping, and gives a fallback line for anything it does not know.",
      },
      {
        src: shotHyper3,
        caption:
          "A live chat. The bot answers a fixture question with real dimensions. Every shopper detail is blurred.",
      },
    ],
    techStack: ["QuickCEP", "Shopify"],
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
    gallery: [
      {
        src: shotCrm1,
        caption: "The department picker: copy, creative, SEO and GEO, analytics, campaigns.",
      },
      {
        src: shotCrm2,
        caption:
          "The copy room. One brief on the right, one tab per channel on the left, each inside that channel's character limit.",
      },
      {
        src: shotCrm3,
        caption:
          "The creative step. Upload a picture, generate one, generate a clip, or publish the text on its own.",
      },
      {
        src: shotCrm4,
        caption:
          "The channel picker. Each channel carries its own limit and its own tone, so the writer stays inside them.",
      },
      {
        src: shotCrm5,
        caption:
          "The brand kit. It holds the facts the writer may treat as true. Anything missing is tagged, never invented.",
      },
    ],
    techStack: ["Claude Code", "Cursor", "OpenRouter", "fal.ai"],
    badge: "One brief, every channel",
    demoLabel: "4:22 Demo",
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
    gallery: [
      {
        src: shotMake1,
        caption:
          "Client account one. Run counts, data volumes and live toggles stay sharp; every client and staff name is blurred.",
      },
      {
        src: shotMake2,
        caption: "Client account two, with the same audit: what runs, how often, and what moved.",
      },
      {
        src: shotMake3,
        caption: "Client account three. The duplicate-lead fault was traced and fixed here.",
      },
    ],
    techStack: ["Make.com", "Facebook Lead Ads", "Google Sheets"],
    badge: "Stable scenarios, no duplicate leads",
    demoLabel: "Demo coming soon",
  },
];
