import type { Equipment, Recipe } from "../types";

export const EQUIPMENT: { id: Equipment; label: string; emoji: string; group: "Cuisson" | "Appareils" | "Pâtisserie" }[] = [
  { id: "plaques", label: "Plaques de cuisson", emoji: "🔥", group: "Cuisson" },
  { id: "four", label: "Four", emoji: "♨️", group: "Cuisson" },
  { id: "micro-ondes", label: "Micro-ondes", emoji: "📡", group: "Cuisson" },
  { id: "air-fryer", label: "Air fryer", emoji: "🍟", group: "Cuisson" },
  { id: "plancha", label: "Plancha / barbecue", emoji: "🥩", group: "Cuisson" },
  { id: "wok", label: "Wok", emoji: "🥢", group: "Cuisson" },
  { id: "mixeur", label: "Mixeur / blender", emoji: "🥤", group: "Appareils" },
  { id: "robot-cuiseur", label: "Robot cuiseur (Thermomix, Monsieur Cuisine…)", emoji: "🤖", group: "Appareils" },
  { id: "multicuiseur", label: "Multicuiseur / Cookeo", emoji: "🍲", group: "Appareils" },
  { id: "cuiseur-vapeur", label: "Cuiseur vapeur", emoji: "♨", group: "Appareils" },
  { id: "cuiseur-riz", label: "Cuiseur à riz", emoji: "🍚", group: "Appareils" },
  { id: "raclette", label: "Appareil à raclette", emoji: "🧀", group: "Appareils" },
  { id: "grille-pain", label: "Grille-pain", emoji: "🍞", group: "Appareils" },
  { id: "robot-patissier", label: "Robot pâtissier", emoji: "🎂", group: "Pâtisserie" },
  { id: "batteur", label: "Batteur électrique", emoji: "🥄", group: "Pâtisserie" },
  { id: "moules", label: "Moules à gâteau / à tarte", emoji: "🥧", group: "Pâtisserie" },
  { id: "crepiere", label: "Crêpière", emoji: "🥞", group: "Pâtisserie" },
  { id: "gaufrier", label: "Gaufrier", emoji: "🧇", group: "Pâtisserie" },
];

export const DEFAULT_EQUIPMENT: Equipment[] = ["plaques", "four", "micro-ondes"];

/** Recettes « au four » qui se réussissent aussi très bien à l'air fryer (rôtis, frites, petites portions). */
const AIR_FRYER_OK = new Set([
  "burger-maison-potatoes", "saumon-roti-patate-douce-haricots-verts", "poulet-roti-pommes-de-terre", "steak-frites-salade",
  "kebab-poulet-maison", "falafels-pita-crudites", "chou-fleur-roti-semoule", "cabillaud-papillote-riz-courgettes",
  "croque-monsieur-salade", "pizza-maison-jambon-champignons", "pizza-margherita-legumes", "banana-bread",
  "frittata-courgette-feta", "feuillete-saumon-epinards", "veloute-legumes-tartines-fromage",
]);

type Need = "four" | "plaques" | "mixeur";

const cache = new Map<string, Need[]>();

/** Matériel indispensable, déduit des étapes de la recette. */
export function recipeNeeds(r: Recipe): Need[] {
  const hit = cache.get(r.slug);
  if (hit) return hit;
  const text = r.steps.join(" ").toLowerCase();
  const needs: Need[] = [];
  if (/four|enfourne|gratine|rôtis/.test(text)) needs.push("four");
  if (/poêle|casserole|revenir|saisis|mijote|frémissement|bouillante|à l'eau|vapeur|dore|saute|fais fondre|fais suer|cuis |cuis-|cuire|béchamel|omelette|crêpes|pochez|gonfler/.test(text)) needs.push("plaques");
  if (/mixe|blender/.test(text)) needs.push("mixeur");
  cache.set(r.slug, needs);
  return needs;
}

/** La recette est-elle faisable avec ce matériel ? Les robots et multicuiseurs remplacent les plaques. */
export function canCook(r: Recipe, eq: Equipment[] | undefined): boolean {
  if (!eq || !eq.length) return true;
  const has = (x: Equipment) => eq.includes(x);
  return recipeNeeds(r).every((n) => {
    if (n === "four") return has("four") || (has("air-fryer") && AIR_FRYER_OK.has(r.slug));
    if (n === "plaques") return has("plaques") || has("robot-cuiseur") || has("multicuiseur");
    return has("mixeur") || has("robot-cuiseur");
  });
}

/** Astuce affichée sur la recette quand on la fait avec un autre appareil que celui prévu. */
export function equipmentTip(r: Recipe, eq: Equipment[] | undefined): string | null {
  if (!eq?.length) return null;
  const needs = recipeNeeds(r);
  if (needs.includes("four") && !eq.includes("four") && eq.includes("air-fryer")) {
    return "🍟 À l'air fryer : 180–200 °C, en réduisant le temps de cuisson d'environ 20 %. Secoue ou retourne à mi-cuisson.";
  }
  if (needs.includes("plaques") && !eq.includes("plaques") && eq.includes("robot-cuiseur")) {
    return "🤖 Au robot cuiseur : mode rissolage puis mijotage, sens inverse pour ne pas écraser les morceaux.";
  }
  if (needs.includes("plaques") && !eq.includes("plaques") && eq.includes("multicuiseur")) {
    return "🍲 Au multicuiseur : mode dorer, puis cuisson sous pression (temps divisé par 2 à 3).";
  }
  if (eq.includes("air-fryer") && AIR_FRYER_OK.has(r.slug)) {
    return "🍟 Astuce : cette recette se fait aussi à l'air fryer (180–200 °C, temps réduit d'environ 20 %).";
  }
  return null;
}
