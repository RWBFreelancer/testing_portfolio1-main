/**
 * Build the project card thumbnails from the real screenshots.
 *
 *   node scripts/make-card-thumbs.mjs
 *   node scripts/make-card-thumbs.mjs "D:/some/other/Portfolio"
 *
 * The sources are screenshots of the real tools, and they live in Google
 * Drive, not in this repo. Only the finished WebP files are committed, so a
 * clone without the Drive folder still builds. Re-run this only when a
 * screenshot is replaced.
 *
 * Why crops and not whole screenshots: the card frame is 16:10 and about
 * 380 px wide. A full 1600 px browser window scaled into that reads as grey
 * mush. Each entry below picks the part of the window that carries the proof -
 * the workflow, the dashboard, the scenario list - and nothing else.
 *
 * REDACTION. Some sources show a client's own customers, staff names, and
 * folder names. Those regions are blurred here, at full resolution, before the
 * image is scaled down. The blur is part of the committed file: there is no
 * unredacted copy in the repo and no way to recover the text from the WebP.
 */
import sharp from "sharp";

const SOURCE_ROOT = process.argv[2] ?? "C:/GoogleDrive/Resume/Portfolio";

/** The card is 16:10, and 900 px covers a 380 px slot on a 2x screen. */
const OUT_WIDTH = 900;

/**
 * The redaction strips for the Make scenario list, in crop coordinates.
 *
 * One entry per visible row: where the title sits, where the owner's name
 * sits, and where the client folder name sits. The columns are ragged, so
 * each row carries its own x range rather than sharing one band - a shared
 * band wide enough for the longest row would swallow the dates, and the dates
 * are part of what makes the screenshot evidence.
 *
 * Measured once against the 1400x875 crop. If the source screenshot is ever
 * replaced, re-measure: nothing here adapts on its own.
 */
function makeRowRedactions() {
  /** Title baseline for each row, then [owner x, width] and [folder x, width]. */
  const ROWS = [
    { y: 219, owner: [358, 146], folder: [790, 84] },
    { y: 314, owner: [370, 126], folder: [801, 84] },
    { y: 409, owner: [276, 140], folder: [705, 74] },
    { y: 504, owner: [276, 140], folder: [713, 144] },
    { y: 599, owner: [276, 140], folder: [715, 144] },
    { y: 695, owner: [333, 146], folder: [777, 104] },
    { y: 790, owner: [330, 139], folder: [760, 149] },
  ];

  return ROWS.flatMap(({ y, owner, folder }) => [
    // The scenario name. It is the client's campaign, in the client's words.
    { left: 175, top: y - 15, width: 412, height: 28 },
    // The person who owns the scenario, and the client folder it sits in.
    { left: owner[0], top: y + 17, width: owner[1], height: 26 },
    { left: folder[0], top: y + 17, width: folder[1], height: 26 },
  ]);
}

const CARDS = [
  {
    out: "project-family-law-outbound",
    src: "Outbound Family Law Voice Agent/n8n_instance.png",
    // The three labelled groups: place the call, send the payment link, write
    // the result back to the CRM.
    crop: { left: 330, top: 80, width: 1120, height: 700 },
  },
  {
    out: "project-family-law-inbound",
    src: "Inbound Family Law Voice Agent/n8n_instance.png",
    // The availability check and the end-of-call report that opens the lead.
    crop: { left: 480, top: 170, width: 880, height: 550 },
  },
  {
    out: "project-hyperlite-chatbot",
    src: "Hyperlite Chatbot/brave_bxD0csptY5.png",
    // Keeps the "Chat Responder AI" title bar, so the frame says what it is.
    crop: { left: 0, top: 0, width: 1192, height: 745 },
  },
  {
    out: "project-aios-crm",
    src: "Marketing Captain - CRM/brave_xhO9G6VtX1.png",
    // The department picker the walkthrough video opens on.
    crop: { left: 250, top: 130, width: 1120, height: 700 },
  },
  {
    out: "project-make-audit",
    src: "Marketing Captain - Make/brave_o3AZ38loZS.png",
    crop: { left: 405, top: 44, width: 1400, height: 875 },
    // Every row names one of the agency's own clients, and the person who
    // owns the scenario. Those are not mine to publish, so the three strips
    // that carry them - the scenario title, the owner, the client folder -
    // are blurred per row. What stays sharp is the part that is evidence:
    // the connectors on each row, the run counts, the data volumes, the dates
    // and the live toggles.
    blur: makeRowRedactions(),
  },
  {
    out: "project-field-service-voice",
    src: "Ninja Mobile Mechanics/fullpage_snapshot_dashboard_retellai.png",
    // Call counts, duration and latency across the live account. The workspace
    // name was already masked in the source, which is what lets this one card
    // show real numbers while the client stays unnamed.
    crop: { left: 240, top: 0, width: 1680, height: 1050 },
  },
];

for (const card of CARDS) {
  const src = `${SOURCE_ROOT}/${card.src}`;
  const dest = new URL(`../src/assets/${card.out}.webp`, import.meta.url).pathname.replace(
    /^\/([A-Za-z]:)/,
    "$1",
  );

  const cropped = await sharp(src).extract(card.crop).toBuffer();

  let composed = sharp(cropped);
  if (card.blur) {
    const patches = await Promise.all(
      card.blur.map(async (rect) => ({
        input: await sharp(cropped).extract(rect).blur(6).toBuffer(),
        left: rect.left,
        top: rect.top,
      })),
    );
    composed = sharp(await sharp(cropped).composite(patches).toBuffer());
  }

  const info = await composed
    .resize({ width: OUT_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);

  console.log(
    `${card.out.padEnd(30)} ${card.crop.width}x${card.crop.height} -> ${info.width}x${info.height}  ${Math.round(info.size / 1024)} kB${card.blur ? "  (redacted)" : ""}`,
  );
}
