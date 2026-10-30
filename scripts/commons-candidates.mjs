// Cherche des photos libres (Wikimedia Commons) pour chaque recette et produit des planches de vignettes
// pour une sélection visuelle. Usage : node scripts/commons-candidates.mjs  (nécessite `sharp`)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const UA = "BudgemyPhotoBot/1.0 (https://www.budgemy.com)";
const QUERIES = JSON.parse(readFileSync(new URL("./photo-queries.json", import.meta.url), "utf8"));
const OUT = process.env.OUT ?? "photo-review";
const PER = 6;
const ROWS = 6;
const TW = 240;
const TH = 160;
const LABEL = 250;

const strip = (html = "") => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const okLicense = (l = "") => /^(cc0|public domain|pd|cc by(-sa)? [0-9.]+|cc by(-sa)?)/i.test(l) && !/nc|nd/i.test(l);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(q) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  Object.entries({
    action: "query", format: "json", generator: "search", gsrsearch: `${q} filetype:bitmap`, gsrnamespace: "6", gsrlimit: "25",
    prop: "imageinfo", iiprop: "url|size|mime|extmetadata", iiurlwidth: "1280",
  }).forEach(([k, v]) => u.searchParams.set(k, v));
  const res = await fetch(u, { headers: { "User-Agent": UA } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = Object.values(data.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  return pages
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return null;
      const md = ii.extmetadata ?? {};
      return {
        title: p.title,
        src: (ii.thumburl ?? ii.url).split("?")[0],
        page: ii.descriptionurl,
        width: ii.width,
        height: ii.height,
        mime: ii.mime,
        license: md.LicenseShortName?.value ?? "",
        author: strip(md.Artist?.value) || "Wikimedia Commons",
      };
    })
    .filter((c) => c && /jpeg|png/.test(c.mime) && c.width >= 900 && c.width / c.height >= 1.05 && c.width / c.height <= 2.1 && okLicense(c.license))
    .slice(0, PER);
}

async function thumb(src) {
  const res = await fetch(src, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(String(res.status));
  return sharp(Buffer.from(await res.arrayBuffer())).resize(TW, TH, { fit: "cover" }).jpeg({ quality: 70 }).toBuffer();
}

const label = (text, w, h, size = 15, color = "#111") =>
  Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/>` +
      text
        .match(/.{1,26}(\s|$)/g)
        .slice(0, 6)
        .map((line, i) => `<text x="8" y="${24 + i * (size + 6)}" font-family="sans-serif" font-size="${size}" fill="${color}">${line.trim().replace(/&/g, "&amp;")}</text>`)
        .join("") +
      `</svg>`,
  );

mkdirSync(OUT, { recursive: true });
const slugs = Object.keys(QUERIES);
const candidates = {};
for (const slug of slugs) {
  try {
    candidates[slug] = await search(QUERIES[slug]);
  } catch {
    candidates[slug] = [];
  }
  console.log(slug, candidates[slug].length);
  await sleep(250);
}
writeFileSync(`${OUT}/candidates.json`, JSON.stringify(candidates, null, 1));

// Planches de vignettes pour une relecture humaine (désactivables avec SHEETS=0)
for (let s = 0; process.env.SHEETS !== "0" && s * ROWS < slugs.length; s++) {
  const rows = slugs.slice(s * ROWS, s * ROWS + ROWS);
  const W = LABEL + PER * (TW + 6);
  const layers = [];
  for (const [r, slug] of rows.entries()) {
    const y = r * (TH + 8);
    layers.push({ input: label(`${s * ROWS + r}. ${slug}`, LABEL, TH), left: 0, top: y });
    for (const [i, c] of candidates[slug].entries()) {
      try {
        layers.push({ input: await thumb(c.src), left: LABEL + i * (TW + 6), top: y });
        layers.push({ input: label(String(i), 26, 26, 16, "#d00"), left: LABEL + i * (TW + 6), top: y });
      } catch {
        /* vignette indisponible */
      }
    }
  }
  await sharp({ create: { width: W, height: rows.length * (TH + 8), channels: 3, background: "#ddd" } })
    .composite(layers)
    .jpeg({ quality: 72 })
    .toFile(`${OUT}/sheet-${String(s).padStart(2, "0")}.jpg`);
  console.log("sheet", s);
}
console.log("DONE");
