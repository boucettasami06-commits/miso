/**
 * Vérifie un lot de recettes au format compact (tableau JSON de RawRecipe, voir recipes-extra.ts).
 * Usage : npx tsx scripts/validate-raw.ts lot.json [lot2.json …]
 */
import { readFileSync } from "node:fs";
import { INGREDIENTS } from "../src/lib/data/ingredients";
import { IMG, RECIPES } from "../src/lib/data/recipes";

const PROTEINS = ["volaille", "boeuf", "porc", "poisson", "oeuf", "vegetal", "laitier"];
const MEAT_IDS = new Set(Object.values(INGREDIENTS).filter((i) => i.flags?.includes("meat")).map((i) => i.id));
const FISH_IDS = new Set(Object.values(INGREDIENTS).filter((i) => i.flags?.some((f) => f === "fish" || f === "shellfish")).map((i) => i.id));
const seen = new Set(RECIPES.map((r) => r.slug));
let errors = 0;
let count = 0;
const err = (slug: string, msg: string) => {
  errors++;
  console.log(`ERREUR ${slug} : ${msg}`);
};

for (const file of process.argv.slice(2)) {
  const list = JSON.parse(readFileSync(file, "utf8")) as unknown[];
  for (const r of list) {
    count++;
    if (!Array.isArray(r) || r.length < 13) {
      err(String(r), "format (13 ou 14 éléments attendus)");
      continue;
    }
    const [slug, title, meal, desc, time, diff, fit, protein, cuisine, img, emoji, ings, steps, batch] = r as [string, string, string, string, number, number, string, string, string, string, string, string, string[], boolean?];
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(slug, "slug invalide");
    if (seen.has(slug)) err(slug, "slug déjà utilisé");
    seen.add(slug);
    if (!title || title.length > 70) err(slug, "titre vide ou trop long");
    if (meal !== "b" && meal !== "m") err(slug, "repas doit être b ou m");
    if (!desc || desc.length < 20 || desc.length > 220) err(slug, "description de 20 à 220 caractères");
    if (!Number.isInteger(time) || time < 2 || time > 240) err(slug, "temps invalide");
    if (![1, 2, 3].includes(diff)) err(slug, "difficulté 1, 2 ou 3");
    if (!/^[0-3]{4}$/.test(fit)) err(slug, "adéquation : 4 chiffres de 0 à 3");
    if (!PROTEINS.includes(protein)) err(slug, `protéine inconnue ${protein}`);
    if (!cuisine) err(slug, "cuisine vide");
    if (!(img in IMG)) err(slug, `clé photo inconnue ${img}`);
    if (!emoji) err(slug, "emoji manquant");
    if (!Array.isArray(steps) || steps.length < 2 || steps.length > 7) err(slug, "2 à 7 étapes");
    if (batch !== undefined && typeof batch !== "boolean") err(slug, "dernier champ : booléen");
    const ids: string[] = [];
    for (const pair of String(ings).split(" ")) {
      const [id, q] = pair.split(":");
      const qty = Number(q);
      ids.push(id);
      const ing = INGREDIENTS[id];
      if (!ing) {
        err(slug, `ingrédient inconnu ${id}`);
        continue;
      }
      if (!(qty > 0)) err(slug, `quantité invalide ${pair}`);
      if (ing.unit === "pc" && qty > 6) err(slug, `quantité en pièces suspecte ${pair}`);
      if (ing.unit !== "pc" && qty > 600) err(slug, `quantité suspecte ${pair}`);
    }
    if (ids.length < 2) err(slug, "au moins 2 ingrédients");
    const hasMeat = ids.some((i) => MEAT_IDS.has(i));
    const hasFish = ids.some((i) => FISH_IDS.has(i));
    if (["volaille", "boeuf", "porc"].includes(protein) && !hasMeat) err(slug, "protéine viande sans ingrédient viande");
    if (protein === "poisson" && !hasFish) err(slug, "protéine poisson sans poisson");
    if (["vegetal", "laitier", "oeuf"].includes(protein) && (hasMeat || hasFish)) err(slug, "catégorie végétarienne avec viande ou poisson");
  }
}
console.log(`${count} recettes vérifiées, ${errors} erreur(s)`);
process.exit(errors ? 1 : 0);
