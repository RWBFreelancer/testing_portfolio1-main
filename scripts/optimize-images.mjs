/**
 * Shrink the source images in src/assets.
 *
 * The site shipped 2.5 MB of JPEG for a hero that never draws any of it larger
 * than about 900 px. This resizes each image to the largest size the layout can
 * actually use, then writes a WebP next to it. Run it by hand after adding or
 * replacing an asset:
 *
 *   node scripts/optimize-images.mjs
 *
 * It is not part of the build. The optimized files are committed, so a deploy
 * never has to re-encode anything.
 */
import { readdir, stat, rename } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const ASSET_DIR = new URL("../src/assets/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

/** The widest each image is ever painted, plus headroom for a 2x screen. */
const MAX_WIDTH = {
  "project-1": 900,
  "project-2": 900,
  "project-3": 900,
  profile: 900,
  "bg-dark": 1920,
  "bg-light": 1920,
};

const DEFAULT_WIDTH = 1600;

const kb = (n) => `${Math.round(n / 1024)} kB`;

const files = (await readdir(ASSET_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));

let before = 0;
let after = 0;

for (const file of files) {
  const src = join(ASSET_DIR, file);
  const name = basename(file, extname(file));
  const width = MAX_WIDTH[name] ?? DEFAULT_WIDTH;

  const startSize = (await stat(src)).size;
  before += startSize;

  const image = sharp(src);
  const meta = await image.metadata();
  // Never upscale. A source already narrower than the cap keeps its own width.
  const targetWidth = Math.min(width, meta.width ?? width);

  // sharp cannot read and write the same path in one pass, so write beside it
  // and swap the file in afterwards.
  const tmp = join(ASSET_DIR, `.tmp-${file}`);
  await sharp(src)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toFile(tmp);
  await rename(tmp, src);

  // The WebP sits next to the JPEG so a <picture> or an import can pick it up.
  const webp = join(ASSET_DIR, `${name}.webp`);
  await sharp(src).resize({ width: targetWidth, withoutEnlargement: true }).webp({ quality: 76 }).toFile(webp);

  const endSize = (await stat(src)).size;
  const webpSize = (await stat(webp)).size;
  after += webpSize;

  console.log(
    `${file.padEnd(16)} ${kb(startSize).padStart(8)} -> jpg ${kb(endSize).padStart(8)}  webp ${kb(webpSize).padStart(8)}  (${meta.width}px -> ${targetWidth}px)`,
  );
}

console.log(`\ntotal: ${kb(before)} -> ${kb(after)} as WebP`);
