/**
 * Generate the portfolio's decorative art with fal.ai, at build time only.
 *
 *   set -a; . path/to/fal.env; set +a       # or export FAL_KEY yourself
 *   node scripts/fal-generate.mjs cards     # the three project illustrations
 *   node scripts/fal-generate.mjs og        # the social-share backdrop
 *   node scripts/fal-generate.mjs backdrops # the portrait page backgrounds
 *   node scripts/fal-generate.mjs cards --variants 3 --out .fal-drafts
 *
 * The key is read from the environment and is never written to this repo.
 *
 * Why build time and not runtime: the visitor's browser must never call an
 * image API. Everything here is generated once, compressed, committed, and
 * shipped as a plain static file.
 *
 * What this may and may not draw
 * ------------------------------
 * These are ILLUSTRATIONS. They are decoration, and nobody can mistake them
 * for evidence. This script must never be used to generate a fake product
 * screenshot, a fake dashboard, a client logo, a testimonial, or a person
 * presented as a real client. That would fabricate proof of work, which is
 * the exact credibility problem the card copy was rewritten to avoid.
 *
 * Text is also off the table: diffusion models garble letterforms. Anything
 * with real words on it (the OG card) gets its text composited afterwards
 * from real fonts, over a generated background.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error("FAL_KEY is not set. Export it, or source your fal.env, and run again.");
  process.exit(1);
}

const MODEL = "https://fal.run/fal-ai/flux/dev";

/** One shared style anchor, so the three cards read as a set and not as three
 *  stock images. It carries the site palette and the restraint the design
 *  system asks for. */
const STYLE = [
  // The rendering language is pinned hard. The first pass drifted - one card
  // came back as line art, one as a glossy 3D render, one as generic blue
  // glow - and three styles do not read as a set.
  "precise technical schematic drawn in fine luminous line work, like a drafting diagram",
  "not a neon sign, no neon tube glow, no bar signage, no glossy 3D render, no photography",
  "deep near-black navy background #060d1f",
  "every line the same pale electric cyan #00d4ff, monochrome cyan only",
  "strictly no pink, no magenta, no purple, no violet, no warm colour anywhere",
  "very dark and very sparse, at least half the frame empty black space",
  "one clear subject, small in frame, centred",
  "flat orthographic elevation, no perspective floor, no horizon, no reflection, no mirror",
  "absolutely no text, no words, no letters, no numbers, no logos, no watermark",
  "no user interface, no screenshot, no dashboard, no people, no faces",
].join(", ");

const CARDS = {
  "card-outbound": [
    "a single telephone handset drawn as a glowing wireframe outline",
    "three concentric arcs leaving it on one side, widening outward",
    "the arcs ending in a small neat column of stacked horizontal bars",
    "one signal leaving, order arriving",
  ].join(", "),

  "card-inbound": [
    "a single arrow of light entering from the left edge and meeting one small ring",
    "from that ring exactly three thin lines fan out to the right",
    "each line ends in a small distinct wireframe glyph: a grid, a clock, a single dot",
    "one arrival being sorted three ways",
  ].join(", "),

  "card-chatbot": [
    "two overlapping speech-bubble outlines drawn as glowing wireframe strokes",
    "a single thin line dropping from them to one highlighted square",
    "that square sits in a sparse row of five plain wireframe squares",
    "a question finding one item",
  ].join(", "),
};

const OG = [
  "a wide cinematic deep-space nebula field",
  "deep navy and near black, a soft cyan and blue luminous cloud drifting from the left",
  "scattered fine stars, one faint distant planet edge low right",
  "vast empty dark space across the centre and right for text to sit on",
  "no text, no words, no letters, no logos, no people",
  "photographic, high dynamic range, subtle grain",
].join(", ");

/* Portrait backdrops. The landscape nebula is 1.55 wide; cover-cropped into a
   0.46 phone viewport it shows under 30% of the image, and everything of
   interest in it falls outside the crop, so the sky goes flat black. These are
   drawn tall so a phone gets a composition instead of a slice.

   They carry their own style, not STYLE: the card art is flat cyan line work,
   and these have to match the existing photographic nebulas instead. */
const BACKDROPS = {
  "bg-dark-portrait": [
    "vertical deep-space nebula photograph, tall portrait composition",
    "near-black background #010717 with deep navy blue",
    "a luminous blue and cyan nebula cloud sweeping diagonally from the upper left",
    "a second fainter cloud low in the frame, dark and quiet through the middle",
    "scattered fine stars of varying brightness, one faint distant planet edge",
    "deep, calm and unobtrusive, nothing bright enough to fight text laid over it",
    "photographic, high dynamic range, fine grain, no text, no logos, no people",
  ].join(", "),

  "bg-light-portrait": [
    "vertical high-altitude sky photograph, tall portrait composition",
    "very pale blue and soft cream white, bright airy and clean",
    "soft diffuse cloud banks in the upper area and lower corner",
    "a gentle open expanse through the middle, almost plain",
    "pale and low contrast throughout, nothing dark enough to fight text over it",
    "photographic, soft natural light, fine grain, no text, no logos, no people",
  ].join(", "),
};

const args = process.argv.slice(2);
const target = args[0] ?? "cards";
const variants = Number(args[args.indexOf("--variants") + 1]) || 1;
const outDir = args.includes("--out") ? args[args.indexOf("--out") + 1] : ".fal-drafts";

/** fal returns a hosted URL; pull the bytes down and keep them locally. */
async function generate(name, prompt, width, height, index, ownStyle = false) {
  const res = await fetch(MODEL, {
    method: "POST",
    headers: { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: ownStyle ? prompt : `${prompt}, ${STYLE}`,
      image_size: { width, height },
      num_images: 1,
      num_inference_steps: 34,
      guidance_scale: 3.5,
      enable_safety_checker: true,
      output_format: "jpeg",
    }),
  });

  if (!res.ok) throw new Error(`${name}: ${res.status} ${await res.text()}`);

  const data = await res.json();
  const url = data.images?.[0]?.url;
  if (!url) throw new Error(`${name}: no image in response`);

  const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
  const file = join(outDir, `${name}-${index + 1}.jpg`);
  await writeFile(file, bytes);
  console.log(`${file}  ${Math.round(bytes.length / 1024)} kB  seed ${data.seed}`);
  return file;
}

await mkdir(outDir, { recursive: true });

// Card art is generated at the thumbnail's own 16:10, so nothing is cropped
// away later and the composition survives into the card.
const jobs = [];
if (target === "cards" || target === "all") {
  for (const [name, prompt] of Object.entries(CARDS))
    for (let i = 0; i < variants; i++) jobs.push(() => generate(name, prompt, 1280, 800, i));
}
if (target === "og" || target === "all") {
  for (let i = 0; i < variants; i++) jobs.push(() => generate("og-bg", OG, 1200, 630, i));
}
if (target === "backdrops" || target === "all") {
  for (const [name, prompt] of Object.entries(BACKDROPS))
    for (let i = 0; i < variants; i++) jobs.push(() => generate(name, prompt, 768, 1536, i, true));
}

if (!jobs.length) {
  console.error(`unknown target "${target}". use: cards | og | all`);
  process.exit(1);
}

// Sequential on purpose. These cost money per call, and a failure halfway
// through should not have already fired the whole batch.
for (const job of jobs) {
  try {
    await job();
  } catch (err) {
    console.error(String(err.message).slice(0, 300));
  }
}

console.log(`\ndone. review ${outDir}/, then run scripts/optimize-images.mjs on what you keep.`);
