/**
 * Render the CV (public/Reynaldo-Binay-an-CV.pdf) from docs/cv/cv.html.
 *
 *   node scripts/make-cv.mjs
 *
 * The CV lives as HTML so it can be edited in the repo like any other text.
 * Chrome prints it to PDF, so links in the PDF stay clickable.
 *
 * Chrome is required. The path is picked up from CHROME_PATH if set.
 */
import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CHROME =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const source = pathToFileURL(resolve("docs/cv/cv.html")).href;
const out = resolve("public/Reynaldo-Binay-an-CV.pdf");

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  // Gives the Google Font time to load before the page is printed.
  "--virtual-time-budget=5000",
  `--print-to-pdf=${out}`,
  source,
]);

chrome.on("close", async (code) => {
  if (code !== 0) {
    console.error(`chrome exited with code ${code}`);
    process.exit(1);
  }
  const { size } = await stat(out);
  console.log(`wrote public/Reynaldo-Binay-an-CV.pdf  ${Math.round(size / 1024)} kB`);
});
