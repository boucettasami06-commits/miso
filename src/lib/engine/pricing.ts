import { INGREDIENTS } from "../data/ingredients";
import { RECIPE_BY_SLUG } from "../data/recipes";
import { STORES, packPrice, storesOf } from "../data/stores";
import type { Country, PlannedMeal, ShoppingLine, StoreQuote } from "../types";

/** Index dense des ingrédients pour des calculs de panier rapides. */
export const ING_IDS = Object.keys(INGREDIENTS);
const ING_INDEX: Record<string, number> = Object.fromEntries(ING_IDS.map((id, i) => [id, i]));
const PACK = ING_IDS.map((id) => INGREDIENTS[id].pack);
const PANTRY = ING_IDS.map((id) => !!INGREDIENTS[id].pantry);

/** Matrice de prix [enseigne][ingrédient] précalculée. */
const PRICE: Record<string, Float64Array> = Object.fromEntries(
  STORES.map((s) => [s.id, Float64Array.from(ING_IDS.map((id) => packPrice(id, s.id)))]),
);

export type Basket = Float64Array;

export function emptyBasket(): Basket {
  return new Float64Array(ING_IDS.length);
}

export function addRecipe(basket: Basket, slug: string, portions: number, sign = 1) {
  const r = RECIPE_BY_SLUG[slug];
  for (const ri of r.ingredients) basket[ING_INDEX[ri.id]] += sign * ri.qty * portions;
}

export function basketFromMeals(meals: PlannedMeal[]): Basket {
  const b = emptyBasket();
  for (const m of meals) if (!m.leftoverOf) addRecipe(b, m.slug, m.portions);
  return b;
}

/**
 * Coût d'un panier dans une enseigne. On achète des conditionnements entiers
 * (c'est ce qui sort réellement du porte-monnaie) ; les produits de placard
 * sont proratisés si l'utilisateur les possède déjà.
 */
export function storeCost(basket: Basket, storeId: string, hasPantry: boolean): number {
  const prices = PRICE[storeId];
  let total = 0;
  for (let i = 0; i < basket.length; i++) {
    const q = basket[i];
    if (q <= 1e-6) continue;
    const packs = q / PACK[i];
    total += (PANTRY[i] && hasPantry ? packs : Math.ceil(packs - 1e-6)) * prices[i];
  }
  return total;
}

export function bestCost(basket: Basket, storeIds: string[], hasPantry: boolean): number {
  let best = Infinity;
  for (const s of storeIds) best = Math.min(best, storeCost(basket, s, hasPantry));
  return best;
}

/** Coût du panier dans chaque enseigne du pays, de la moins chère à la plus chère. */
export function quotes(basket: Basket, hasPantry: boolean, country: Country = "FR"): StoreQuote[] {
  return storesOf(country).map((s) => ({ storeId: s.id, total: round2(storeCost(basket, s.id, hasPantry)) })).sort(
    (a, b) => a.total - b.total,
  );
}

export function shoppingList(meals: PlannedMeal[], storeId: string, hasPantry: boolean): ShoppingLine[] {
  const basket = basketFromMeals(meals);
  const lines: ShoppingLine[] = [];
  basket.forEach((q, i) => {
    if (q <= 1e-6) return;
    const ing = INGREDIENTS[ING_IDS[i]];
    const packs = Math.ceil(q / ing.pack - 1e-6);
    const prorated = ing.pantry && hasPantry;
    lines.push({
      id: ing.id,
      name: ing.name,
      aisle: ing.aisle,
      unit: ing.unit,
      needed: q,
      packs,
      packSize: ing.pack,
      packLabel: ing.packLabel,
      cost: round2((prorated ? q / ing.pack : packs) * PRICE[storeId][i]),
      pantry: !!ing.pantry,
      leftover: packs * ing.pack - q,
    });
  });
  return lines;
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
