/**
 * Génère avec l'IA d'OpenAI la photo des recettes qui n'en ont pas.
 * Usage : npx tsx scripts/gen-photos.mts [nombre max] [slug1,slug2…]
 * Les images sont enregistrées dans public/recipes/<slug>.webp et listées dans src/lib/data/ai-photos.json.
 * Reprend là où il s'est arrêté (les images déjà présentes ne sont pas refaites).
 */
import fs from "node:fs";
import sharp from "sharp";

const { RECIPES } = await import("../src/lib/data/recipes.ts");
const { INGREDIENTS: INGREDIENT_BY_ID } = await import("../src/lib/data/ingredients.ts");
const MAP = "src/lib/data/ai-photos.json";
const done: Record<string, string> = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, "utf8")) : {};
const max = Number(process.argv[2] ?? 1e9);
const only = process.argv[3]?.split(",");
const MODEL = process.env.IMAGE_MODEL ?? "gpt-image-2";
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 4);

const todo = RECIPES.filter((r) => (only ? only.includes(r.slug) : !r.image && !done[r.slug])).slice(0, max);
console.log(`${todo.length} photos à générer avec ${MODEL}`);

function prompt(r: (typeof RECIPES)[number]) {
  const ings = r.ingredients
    .map((i) => INGREDIENT_BY_ID[i.id]?.name)
    .filter(Boolean)
    .slice(0, 8)
    .join(", ");
  return [
    `Photo culinaire réaliste et appétissante du plat « ${r.title} ».`,
    r.description,
    `Ingrédients visibles : ${ings}.`,
    r.meal === "breakfast" ? "Petit-déjeuner fait maison." : "Plat fait maison, portion généreuse.",
    "Servi dans une assiette ou un bol simple, sur une table de cuisine familiale en bois clair, lumière naturelle douce venant d'une fenêtre, vue en plongée à 45 degrés, faible profondeur de champ.",
    "Style photo de magazine de cuisine, couleurs naturelles. Aucun texte, aucun logo, aucune main, aucune personne.",
  ].join(" ");
}

async function one(r: (typeof RECIPES)[number]) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer proxy-injected" },
      body: JSON.stringify({ model: MODEL, prompt: prompt(r), size: "1536x1024", quality: process.env.QUALITY ?? "medium", n: 1 }),
    });
    const j = (await res.json()) as { data?: { b64_json?: string }[]; error?: { message: string } };
    const b64 = j.data?.[0]?.b64_json;
    if (b64) {
      await sharp(Buffer.from(b64, "base64")).resize(1200).webp({ quality: 78 }).toFile(`public/recipes/${r.slug}.webp`);
      done[r.slug] = `/recipes/${r.slug}.webp`;
      return true;
    }
    console.error(r.slug, "essai", attempt, res.status, j.error?.message);
    if (res.status === 400 || res.status === 401) return false;
    await new Promise((ok) => setTimeout(ok, 5000 * attempt));
  }
  return false;
}

let i = 0, ok = 0;
async function worker() {
  while (i < todo.length) {
    const r = todo[i++];
    if (await one(r)) ok++;
    fs.writeFileSync(MAP, JSON.stringify(done, null, 0));
    if ((ok % 10) === 0) console.log(`${ok}/${todo.length}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`terminé : ${ok}/${todo.length}`);
