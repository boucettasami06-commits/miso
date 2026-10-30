// Sélectionne automatiquement la meilleure photo candidate de chaque recette avec CLIP :
// 1) l'image doit être reconnue comme CE plat parmi tous les plats du catalogue ;
// 2) elle doit ressembler à une photo culinaire soignée plutôt qu'à un cliché amateur.
// Usage : OUT=dossier node scripts/clip-select.mjs  (après commons-candidates.mjs)
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { AutoProcessor, AutoTokenizer, CLIPTextModelWithProjection, CLIPVisionModelWithProjection, RawImage } from "@huggingface/transformers";

const OUT = process.env.OUT ?? "photo-review";
const UA = "BudgemyPhotoBot/1.0 (https://www.budgemy.com)";
const MODEL = "Xenova/clip-vit-base-patch32";
const QUERIES = JSON.parse(readFileSync(new URL("./photo-queries.json", import.meta.url), "utf8"));
const candidates = JSON.parse(readFileSync(`${OUT}/candidates.json`, "utf8"));
const slugs = Object.keys(QUERIES);

const tokenizer = await AutoTokenizer.from_pretrained(MODEL);
const processor = await AutoProcessor.from_pretrained(MODEL);
const textModel = await CLIPTextModelWithProjection.from_pretrained(MODEL);
const visionModel = await CLIPVisionModelWithProjection.from_pretrained(MODEL);

const norm = (v) => {
  const n = Math.hypot(...v);
  return v.map((x) => x / n);
};
async function embedTexts(texts) {
  const inputs = tokenizer(texts, { padding: true, truncation: true });
  const { text_embeds } = await textModel(inputs);
  const dim = text_embeds.dims[1];
  return texts.map((_, i) => norm(Array.from(text_embeds.data.slice(i * dim, (i + 1) * dim))));
}
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const softmax = (xs) => {
  const m = Math.max(...xs);
  const e = xs.map((x) => Math.exp(100 * (x - m)));
  const sum = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / sum);
};

const dishEmb = await embedTexts(slugs.map((s) => `a photo of ${QUERIES[s]}, a plated dish`));
const qualityEmb = await embedTexts([
  "a professional, appetizing, well-lit food photograph",
  "a dull, blurry, badly lit amateur snapshot",
  "a photo of a package, a menu, a sign or text",
  "a photo of a market stall, raw ingredients or a plant",
]);

async function embedImage(src) {
  const res = await fetch(src, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(String(res.status));
  const png = await sharp(Buffer.from(await res.arrayBuffer())).resize(256, 256, { fit: "cover" }).png().toBuffer();
  const image = await RawImage.fromBlob(new Blob([png], { type: "image/png" }));
  const { image_embeds } = await visionModel(await processor(image));
  return norm(Array.from(image_embeds.data));
}

const selected = {};
const report = [];
for (const [si, slug] of slugs.entries()) {
  let best = null;
  for (const c of candidates[slug] ?? []) {
    try {
      const emb = await embedImage(c.src);
      const probs = softmax(dishEmb.map((d) => dot(emb, d)));
      const prob = probs[si];
      const rank = probs.filter((p) => p > prob).length;
      const pro = softmax(qualityEmb.map((q) => dot(emb, q)))[0];
      const ok = (rank === 0 && prob > 0.3) || (rank <= 1 && prob > 0.2);
      const score = prob * 0.6 + pro * 0.4;
      report.push(`${slug}\t${c.title}\trank=${rank}\tp=${prob.toFixed(2)}\tpro=${pro.toFixed(2)}\t${ok ? "OK" : "-"}`);
      if (ok && pro > 0.35 && (!best || score > best.score)) best = { ...c, score, rank, prob, pro };
    } catch (e) {
      report.push(`${slug}\t${c.title}\tERREUR ${e.message}`);
    }
  }
  if (best) {
    selected[slug] = {
      src: best.src,
      author: best.author.slice(0, 80),
      url: best.page,
      license: best.license,
      source: "Wikimedia Commons",
      title: best.title,
      prob: +best.prob.toFixed(2),
      pro: +best.pro.toFixed(2),
    };
  }
  console.log(slug, best ? `${best.title} p=${best.prob.toFixed(2)} pro=${best.pro.toFixed(2)}` : "AUCUNE");
}
writeFileSync(`${OUT}/selected.json`, JSON.stringify(selected, null, 1));
writeFileSync(`${OUT}/report.tsv`, report.join("\n"));
console.log("DONE", Object.keys(selected).length, "/", slugs.length);
