/**
 * Build the project gallery screenshots from the real captures.
 *
 *   node scripts/make-gallery.mjs
 *   node scripts/make-gallery.mjs "D:/some/other/Portfolio"
 *
 * The sources live in Google Drive, not in this repo. Only the finished WebP
 * files are committed, so a clone without the Drive folder still builds.
 *
 * REDACTION. Every rectangle in a `blur` list is blurred here, before the file
 * is written. The blur is baked into the committed WebP: there is no
 * unredacted copy in the repo, and the text cannot be recovered from the
 * output. What is covered, in every case: a client's name, a client's own
 * customers, a staff name, an email address, an IP address, or a folder named
 * after a client.
 *
 * COORDINATE SPACE. Each source is scaled to 1400 px wide FIRST, and every
 * rectangle below is measured in that 1400 px space. That is also the output
 * size, so the numbers here are the numbers you see in the shipped image. If a
 * source screenshot is ever replaced, re-measure: nothing here adapts on its
 * own.
 *
 * CROP. An optional `crop` is cut from the source at its own size, before the
 * scale. It is for a capture that is mostly empty canvas around the part that
 * matters.
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SOURCE_ROOT = process.argv[2] ?? "C:/GoogleDrive/Resume/Portfolio";
const OUT_WIDTH = 1400;

const OUT_DIR = new URL("../src/assets/gallery/", import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  "$1",
);
mkdirSync(OUT_DIR, { recursive: true });

/** A Make.com scenario list. Each visible row names a client and an owner. */
function makeScenarioRows({ titleWidth, ownerLeft, ownerWidth, folder }) {
  const TITLE_Y = [191, 260, 329, 398, 467, 537, 607];
  const META_Y = [213, 282, 352, 421, 491, 560, 630];

  const rects = [];
  TITLE_Y.forEach((y) => {
    // The scenario name. It is the client's campaign, in the client's words.
    rects.push({ left: 422, top: y - 12, width: titleWidth, height: 24 });
  });
  META_Y.forEach((y) => {
    // The person who owns the scenario.
    rects.push({ left: ownerLeft, top: y - 10, width: ownerWidth, height: 20 });
    // The client folder the scenario sits in.
    if (folder) rects.push({ left: folder[0], top: y - 10, width: folder[1], height: 20 });
  });
  return rects;
}

const SHOTS = [
  /* ---- Family Law Outbound -------------------------------------------- */
  {
    out: "family-law-outbound-1",
    src: "Outbound Family Law Voice Agent/n8n_instance.png",
    // Three labelled groups: place the call, send the payment link, write the
    // result back to the CRM. No client name anywhere on this one.
  },
  {
    out: "family-law-outbound-2",
    src: "Outbound Family Law Voice Agent/retell_agent.png",
    blur: [
      // Agent title bar, and the prompt line that names the firm.
      { left: 78, top: 8, width: 440, height: 26 },
      { left: 76, top: 220, width: 620, height: 20 },
    ],
  },
  {
    out: "family-law-outbound-3",
    src: "Outbound Family Law Voice Agent/vapi_agent.png",
    blur: [
      // Header title, the draft id beside it, and the assistant list.
      { left: 316, top: 6, width: 290, height: 24 },
      { left: 380, top: 28, width: 130, height: 16 },
      { left: 60, top: 144, width: 210, height: 170 },
      // The opening line and the prompt line, both of which name the firm.
      { left: 318, top: 452, width: 640, height: 22 },
      { left: 316, top: 600, width: 690, height: 20 },
    ],
  },

  /* ---- Family Law Inbound --------------------------------------------- */
  {
    out: "family-law-inbound-1",
    src: "Inbound Family Law Voice Agent/n8n_instance.png",
    // The availability check and the end-of-call report. Nothing named.
  },
  {
    out: "family-law-inbound-2",
    src: "Inbound Family Law Voice Agent/retell_agent.png",
    blur: [
      // Agent title bar.
      { left: 58, top: 6, width: 380, height: 26 },
      // Every prompt line that spells out the firm's name.
      { left: 222, top: 258, width: 480, height: 20 },
      { left: 222, top: 441, width: 420, height: 20 },
      { left: 400, top: 524, width: 320, height: 20 },
    ],
  },

  /* ---- Field service voice agent (client under NDA) -------------------- */
  {
    out: "field-service-voice-1",
    src: "Ninja Mobile Mechanics/fullpage_snapshot_dashboard_retellai.png",
    // The workspace name was already masked in the source, which is what lets
    // this one show real call counts while the client stays unnamed.
  },
  {
    out: "field-service-voice-2",
    src: "Ninja Mobile Mechanics/fullpage_snapshot_agent_a.png",
    // The agent title names the client.
    blur: [{ left: 62, top: 6, width: 292, height: 26 }],
  },
  {
    out: "field-service-voice-3",
    src: "Ninja Mobile Mechanics/fullpage_snapshot_agent_b.png",
    blur: [{ left: 62, top: 6, width: 292, height: 26 }],
  },
  {
    out: "field-service-voice-4",
    src: "Ninja Mobile Mechanics/n8n_workflow.png",
    // The run tag carries a person's name and the client's field tool.
    blur: [{ left: 678, top: 101, width: 250, height: 18 }],
  },

  /* ---- Hyperlite chatbot ---------------------------------------------- */
  {
    out: "hyperlite-chatbot-1",
    src: "Hyperlite Chatbot/brave_bxD0csptY5.png",
    // The flow itself. Nothing on it belongs to a shopper.
  },
  {
    out: "hyperlite-chatbot-2",
    src: "Hyperlite Chatbot/brave_0vFiys1j71.png",
    // The prompt. The brand is public, so nothing here is covered.
  },
  {
    out: "hyperlite-chatbot-3",
    src: "Hyperlite Chatbot/brave_p6Mvcm8WVh.png",
    blur: [
      // Open conversation tabs, the shopper list, the name on one bubble, and
      // the whole customer panel: email, IP address, session id.
      { left: 372, top: 58, width: 160, height: 22 },
      { left: 68, top: 186, width: 284, height: 424 },
      { left: 448, top: 230, width: 62, height: 18 },
      { left: 1138, top: 94, width: 258, height: 470 },
    ],
  },

  /* ---- AI marketing department (AIOS CRM) ------------------------------ */
  {
    out: "aios-crm-marketing-1",
    src: "Marketing Captain - CRM/brave_xhO9G6VtX1.png",
    // The department picker. The product name stays; no person is on it.
  },
  {
    out: "aios-crm-marketing-2",
    src: "Marketing Captain - CRM/brave_wdLVffKsF8.png",
    blur: [
      // The account holder's name, in the header and in the greeting.
      { left: 44, top: 25, width: 100, height: 16 },
      { left: 1084, top: 146, width: 92, height: 16 },
    ],
  },
  {
    out: "aios-crm-marketing-3",
    src: "Marketing Captain - CRM/brave_hSbnBoVGDS.png",
    blur: [{ left: 44, top: 25, width: 100, height: 16 }],
  },
  {
    out: "aios-crm-marketing-4",
    src: "Marketing Captain - CRM/brave_x2M1DL19bR.png",
    blur: [{ left: 44, top: 25, width: 100, height: 16 }],
  },
  {
    out: "aios-crm-marketing-5",
    src: "Marketing Captain - CRM/brave_CYaag5jayO.png",
    blur: [{ left: 44, top: 25, width: 100, height: 16 }],
  },

  /* ---- Make.com audit and repair --------------------------------------- */
  {
    out: "make-audit-1",
    src: "Marketing Captain - Make/brave_o3AZ38loZS.png",
    blur: [
      ...makeScenarioRows({
        titleWidth: 400,
        ownerLeft: 495,
        ownerWidth: 180,
        folder: [822, 140],
      }),
      // The folder list down the side is one client per line.
      { left: 102, top: 362, width: 152, height: 218 },
    ],
  },
  {
    out: "make-audit-2",
    src: "Marketing Captain - Make/brave_xcMrb3UzwN.png",
    blur: [
      ...makeScenarioRows({
        titleWidth: 400,
        ownerLeft: 495,
        ownerWidth: 200,
        folder: [822, 140],
      }),
      { left: 102, top: 362, width: 152, height: 218 },
    ],
  },
  {
    out: "make-audit-3",
    src: "Marketing Captain - Make/brave_dyIpUEIsgg.png",
    blur: [
      // This account is opened under the client's own company name.
      { left: 110, top: 10, width: 130, height: 20 },
      ...makeScenarioRows({
        titleWidth: 400,
        ownerLeft: 495,
        ownerWidth: 210,
        folder: null,
      }),
    ],
  },

  /* ---- Facebook inbox system (own Page, own test account) -------------- */
  {
    out: "facebook-inbox-1",
    src: "Facebook Inbox System/n8n_workflow.png",
    // The canvas is mostly empty. Keep the two webhook paths and nothing else.
    crop: { left: 140, top: 270, width: 1380, height: 400 },
  },
  {
    out: "facebook-inbox-2",
    src: "Facebook Inbox System/airtable_conversations.png",
    // The sender id is a Messenger user id. It is a test account, but an id
    // like this is never published.
    blur: [{ left: 514, top: 150, width: 120, height: 78 }],
  },
  {
    out: "facebook-inbox-3",
    src: "Facebook Inbox System/airtable_handoffs.png",
    blur: [{ left: 366, top: 150, width: 130, height: 22 }],
  },
];

for (const shot of SHOTS) {
  let source = sharp(`${SOURCE_ROOT}/${shot.src}`);
  if (shot.crop) source = sharp(await source.extract(shot.crop).toBuffer());
  const base = await source.resize({ width: OUT_WIDTH, withoutEnlargement: true }).png().toBuffer();

  const { width, height } = await sharp(base).metadata();

  let pipeline = sharp(base);
  if (shot.blur) {
    // Clip every rectangle to the page, so one wrong number cannot fail the
    // whole build, and blur hard enough that no glyph shape survives.
    const patches = await Promise.all(
      shot.blur
        .map((r) => ({
          left: Math.max(0, Math.min(r.left, width - 1)),
          top: Math.max(0, Math.min(r.top, height - 1)),
          width: Math.min(r.width, width - Math.max(0, r.left)),
          height: Math.min(r.height, height - Math.max(0, r.top)),
        }))
        .filter((r) => r.width > 1 && r.height > 1)
        .map(async (r) => ({
          input: await sharp(base).extract(r).blur(9).toBuffer(),
          left: r.left,
          top: r.top,
        })),
    );
    pipeline = sharp(await sharp(base).composite(patches).toBuffer());
  }

  const info = await pipeline.webp({ quality: 82 }).toFile(`${OUT_DIR}${shot.out}.webp`);

  console.log(
    `${shot.out.padEnd(26)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} kB` +
      `${shot.blur ? `  (${shot.blur.length} redactions)` : ""}`,
  );
}
