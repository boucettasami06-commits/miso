/**
 * Récupère une photo libre de droits (licence Pexels : usage commercial gratuit) pour chaque recette.
 *
 *   PEXELS_API_KEY=xxx npm run photos            # complète les recettes sans photo
 *   PEXELS_API_KEY=xxx npm run photos -- --force # refait toutes les recettes
 *
 * Clé gratuite : https://www.pexels.com/api/ — résultat écrit dans src/lib/data/photos.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { RECIPES } from "../src/lib/data/recipes";

const KEY = process.env.PEXELS_API_KEY;
const OUT = "src/lib/data/photos.json";
const force = process.argv.includes("--force");

/** Requêtes plus parlantes pour la recherche d'images, quand le titre français est ambigu. */
const QUERY: Record<string, string> = {
  "dahl-lentilles-corail": "red lentil dal",
  "chili-con-carne": "chili con carne",
  "chili-sin-carne": "vegetarian chili bowl",
  "tartiflette": "tartiflette",
  "blanquette-de-dinde": "creamy chicken stew rice",
  "boeuf-bourguignon": "beef bourguignon",
  "hachis-parmentier": "cottage pie",
  "rougail-saucisse": "sausage tomato stew rice",
  "endives-au-jambon": "baked endives ham cheese",
  "galettes-completes": "buckwheat galette egg ham",
  "galettes-forestieres": "buckwheat crepe mushrooms",
  "tortilla-espagnole-pommes-de-terre": "spanish tortilla",
  "shakshuka-feta": "shakshuka",
  "pad-kra-pao-boeuf": "thai basil beef fried egg rice",
  "oeufs-coque-mouillettes": "soft boiled egg toast soldiers",
  "pain-perdu-brioche-miel": "french toast honey",
  "skyr-bowl-fruits-rouges-amandes": "yogurt bowl berries almonds",
  "overnight-oats-pomme-chia": "overnight oats apple",
  "cassoulet-express": "cassoulet",
  "saucisses-lentilles": "sausages lentils",
  "boeuf-carottes": "beef carrot stew",
  "mac-and-cheese": "mac and cheese",
};

type Photo = { src: string; author: string; url: string };

async function search(query: string, locale?: string): Promise<Photo | null> {
  const u = new URL("https://api.pexels.com/v1/search");
  u.searchParams.set("query", query);
  u.searchParams.set("per_page", "1");
  u.searchParams.set("orientation", "landscape");
  if (locale) u.searchParams.set("locale", locale);
  const res = await fetch(u, { headers: { Authorization: KEY! } });
  if (!res.ok) throw new Error(`Pexels ${res.status} pour « ${query} »`);
  const data = (await res.json()) as { photos: { url: string; photographer: string; src: { original: string } }[] };
  const p = data.photos[0];
  return p ? { src: `${p.src.original}?auto=compress&cs=tinysrgb&w=3840`, author: p.photographer, url: p.url } : null;
}

async function main() {
  if (!KEY) {
    console.error("PEXELS_API_KEY manquante. Crée une clé gratuite sur https://www.pexels.com/api/");
    process.exit(1);
  }
  const photos: Record<string, Photo> = JSON.parse(readFileSync(OUT, "utf8"));
  let added = 0;
  for (const r of RECIPES) {
    if (photos[r.slug] && !force) continue;
    const photo = QUERY[r.slug] ? await search(QUERY[r.slug]) : (await search(r.title, "fr-FR")) ?? (await search(r.title));
    if (photo) {
      photos[r.slug] = photo;
      added++;
      console.log(`✓ ${r.title} — ${photo.author}`);
    } else console.warn(`✗ ${r.title} : aucune photo trouvée`);
    writeFileSync(OUT, JSON.stringify(photos, null, 2) + "\n");
    await new Promise((ok) => setTimeout(ok, 400));
  }
  console.log(`\n${added} photo(s) ajoutée(s). Vérifie-les, puis commite ${OUT}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
