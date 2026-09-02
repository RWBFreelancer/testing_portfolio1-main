/**
 * Render the social share card (public/og-image.png).
 *
 *   node scripts/make-og.mjs
 *
 * Why a headless browser and not an image model: the card is mostly type, and
 * diffusion models garble letterforms. This composes the real site fonts over
 * the site's own background, so the share card and the page cannot drift
 * apart. Update the copy here whenever the hero headline changes.
 *
 * Chrome is required. The path is picked up from CHROME_PATH if set.
 */
import { writeFile, readFile, mkdir, stat } from "node:fs/promises";
import sharp from "sharp";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";

const CHROME =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;
const OUT = "public/og-image.png";

// The site's own backdrop, inlined so the page needs no server.
const bg = await readFile("src/assets/bg-dark.webp");
const bgUri = `data:image/webp;base64,${bg.toString("base64")}`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; overflow:hidden;
         background:#010717 url("${bgUri}") center/cover no-repeat;
         font-family:"Instrument Sans",system-ui,sans-serif; color:#fff; }
  .veil { position:absolute; inset:0;
          background:linear-gradient(100deg, rgba(1,7,23,.94) 0%, rgba(1,7,23,.82) 52%, rgba(1,7,23,.35) 100%); }
  .wrap { position:relative; padding:64px 72px; height:100%;
          display:flex; flex-direction:column; justify-content:space-between; }
  .logo { font-family:"Archivo",sans-serif; font-weight:800; font-size:34px;
          font-stretch:118%; letter-spacing:-.02em; }
  .logo i { font-style:normal; color:#00d4ff; }
  .eyebrow { font-family:"JetBrains Mono",monospace; font-size:14px; font-weight:500;
             letter-spacing:.14em; text-transform:uppercase; color:#8c9db5; margin-bottom:20px; }
  h1 { font-family:"Archivo",sans-serif; font-weight:700; font-size:62px; font-stretch:118%;
       letter-spacing:-.035em; line-height:1.0; }
  h1 span { color:#00d4ff; }
  .pills { display:flex; gap:10px; margin-top:30px; }
  .pills li { list-style:none; padding:8px 16px; border:1px solid rgba(126,178,240,.22);
              border-radius:999px; background:rgba(255,255,255,.05);
              font-family:"JetBrains Mono",monospace; font-size:13px; letter-spacing:.04em;
              color:#cbd5e1; }
  .foot { font-family:"JetBrains Mono",monospace; font-size:14px; color:#8c9db5; letter-spacing:.03em; }
  .foot b { color:#00d4ff; font-weight:500; }
</style></head><body>
<div class="veil"></div>
<div class="wrap">
  <div class="logo">Bin<i>AI</i></div>
  <div>
    <div class="eyebrow">Rey W. Binay-an &middot; AI Automation Engineer</div>
    <h1>I build AI systems for<br><span>small and medium businesses.</span></h1>
    <ul class="pills"><li>Voice agents</li><li>Chatbots</li><li>n8n workflows</li></ul>
  </div>
  <div class="foot">Baguio City, Philippines &nbsp;<b>&middot;</b>&nbsp; rwbinai.vercel.app</div>
</div></body></html>`;

const dir = join(tmpdir(), "og-build");
await mkdir(dir, { recursive: true });
const page = join(dir, "og.html");
await writeFile(page, html, "utf8");

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${join(dir, "profile")}`,
    "--window-size=1200,630",
    "about:blank",
  ],
  { stdio: "ignore", detached: false },
);

const rpc = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const t = list.find((x) => x.type === "page");
      if (t) return t.webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("Chrome debug endpoint never came up");
};

const ws = new WebSocket(await rpc());
let id = 0;
const waiting = new Map();
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const mid = ++id;
    waiting.set(mid, { res, rej });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
ws.addEventListener("message", (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && waiting.has(m.id)) {
    const { res, rej } = waiting.get(m.id);
    waiting.delete(m.id);
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
  }
});
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1200,
  height: 630,
  deviceScaleFactor: 2, // retina share card
  mobile: false,
});
await send("Page.navigate", { url: `file:///${page.replace(/\\/g, "/")}` });

// The webfonts come off the network. Screenshotting before they land gives a
// card set in the fallback face.
for (let i = 0; i < 40; i++) {
  await new Promise((r) => setTimeout(r, 250));
  const { result } = await send("Runtime.evaluate", {
    expression: "document.fonts.status === 'loaded' && document.fonts.size > 0",
    returnByValue: true,
  });
  if (result.value) break;
}
await new Promise((r) => setTimeout(r, 600));

const shot = await send("Page.captureScreenshot", { format: "png" });

// Rendered at 2x for clean type, then resampled down to the 1200x630 that
// every social scraper actually wants. The downsample is what gives the text
// its antialiasing; shooting at 1x directly looks coarser and is not smaller
// enough to matter. A raw 2x PNG is about 1 MB, which is absurd for a card
// that is only ever shown at thumbnail size.
const png = await sharp(Buffer.from(shot.data, "base64"))
  .resize(1200, 630)
  .png({ quality: 90, compressionLevel: 9, palette: true })
  .toBuffer();

await writeFile(OUT, png);
console.log(`wrote ${OUT}  ${Math.round((await stat(OUT)).size / 1024)} kB`);

ws.close();
chrome.kill();
process.exit(0);
