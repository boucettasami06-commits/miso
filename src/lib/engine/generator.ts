import { INGREDIENTS } from "../data/ingredients";
import { RECIPES, RECIPE_BY_SLUG } from "../data/recipes";
import { STORES } from "../data/stores";
import type { Flag, MealType, PlannedMeal, Profile, Recipe, Targets, WeekPlan } from "../types";
import { dailyTargets, householdPortions, MEAL_SHARE, portionScale, recipeNutrition } from "./nutrition";
import { addRecipe, basketFromMeals, bestCost, quotes, round2, type Basket } from "./pricing";

export const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner"];
export const MEAL_LABEL: Record<MealType, string> = { breakfast: "Petit-déj", lunch: "Midi", dinner: "Soir" };

const MAX_TIME = { express: 20, normal: 40, chef: 90 } as const;
const PROTEIN_WEIGHT = { muscle: 16, sain: 7, equilibre: 3, gourmand: 1 } as const;
/** Sensibilité au prix selon l'objectif : un profil gourmand accepte de payer un peu plus pour se faire plaisir. */
const PRICE_WEIGHT = { muscle: 1, sain: 1, equilibre: 1.1, gourmand: 0.8 } as const;
/** Style « le moins cher possible » : le prix pèse deux fois plus dans le choix des recettes. */
const priceWeight = (p: Profile) => PRICE_WEIGHT[p.goal] * (p.priority === "eco" ? 2 : 1);

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function recipeFlags(r: Recipe): Set<Flag> {
  const s = new Set<Flag>();
  for (const ri of r.ingredients) for (const f of INGREDIENTS[ri.id].flags ?? []) s.add(f);
  return s;
}

/** Filtre dur : régime, restrictions, allergies, aliments détestés. */
export function isAllowed(r: Recipe, p: Profile): boolean {
  const f = recipeFlags(r);
  const forbidden: Flag[] = [];
  if (p.diet === "pescetarien") forbidden.push("meat");
  if (p.diet === "vegetarien") forbidden.push("meat", "fish", "shellfish");
  if (p.diet === "vegan") forbidden.push("meat", "fish", "shellfish", "dairy", "egg", "honey");
  if (p.restrictions.includes("sans-porc")) forbidden.push("pork");
  if (p.restrictions.includes("sans-gluten")) forbidden.push("gluten");
  if (p.restrictions.includes("sans-lactose")) forbidden.push("dairy");
  for (const a of p.allergens) forbidden.push(a);
  if (forbidden.some((x) => f.has(x))) return false;
  if (r.ingredients.some((ri) => p.dislikes.includes(ri.id))) return false;
  return true;
}

export function pool(p: Profile, meal: MealType): Recipe[] {
  const kind = meal === "breakfast" ? "breakfast" : "main";
  return RECIPES.filter((r) => r.meal === kind && isAllowed(r, p));
}

interface Ctx {
  p: Profile;
  targets: Targets;
  leftovers: boolean;
  stores: string[];
  poolSize: { breakfast: number; main: number };
}

/** Score « qualité » d'une recette pour un créneau, indépendamment du prix. */
function qualityScore(r: Recipe, day: number, meal: MealType, ctx: Ctx, chosen: PlannedMeal[]): number {
  const { p, targets } = ctx;
  let s = r.fit[p.goal] * 10;
  if (r.fit[p.goal] === 0) s -= 25;

  // Adéquation protéines du repas
  const n = recipeNutrition(r);
  const scale = portionScale(r, meal, targets);
  const proteinRatio = (n.protein * scale) / (targets.protein * MEAL_SHARE[meal]);
  s += Math.min(proteinRatio, 1.2) * PROTEIN_WEIGHT[p.goal];

  // Temps de préparation (plus souple le week-end)
  const weekend = day >= 5;
  const limit = MAX_TIME[p.cookTime] * (weekend ? 1.5 : 1) * (meal === "breakfast" ? 0.5 : 1);
  if (r.time > limit) s -= (r.time - limit) * 0.6;

  // Plaisir du week-end
  if (weekend && meal === "dinner" && r.fit.gourmand === 3) s += 4;

  // Variété
  for (const m of chosen) {
    if (m.leftoverOf) continue;
    const other = RECIPE_BY_SLUG[m.slug];
    if (m.slug === r.slug) s -= Math.abs(m.day - day) <= 2 ? 60 : 35;
    if (meal !== "breakfast" && m.meal !== "breakfast") {
      if (m.day === day && other.protein === r.protein) s -= 8;
      if (Math.abs(m.day - day) === 1 && other.protein === r.protein) s -= 4;
      if (m.day === day && other.cuisine === r.cuisine) s -= 4;
    }
  }

  // Restes du midi : on privilégie les plats qui se réchauffent bien
  if (ctx.leftovers && meal === "dinner" && day < 6 && r.batchFriendly) s += 5;
  return s;
}

/** Plafond de variété : un plat est cuisiné au plus N fois dans la semaine, espacé d'au moins 3 jours. */
function withinCap(r: Recipe, day: number, meal: MealType, chosen: PlannedMeal[], ctx: Ctx): boolean {
  const kind = meal === "breakfast" ? "breakfast" : "main";
  const cooks = chosen.filter((m) => m.slug === r.slug && !m.leftoverOf);
  if (kind === "breakfast") return cooks.length < Math.max(3, Math.ceil(7 / Math.max(1, ctx.poolSize.breakfast)));
  const cap = ctx.poolSize.main >= 10 ? 2 : 3;
  return cooks.length < cap && cooks.every((m) => Math.abs(m.day - day) >= 3);
}

function makeMeal(r: Recipe, day: number, meal: MealType, ctx: Ctx, feed = true): PlannedMeal {
  const scale = portionScale(r, meal, ctx.targets);
  const portions = householdPortions(scale, ctx.p.adults, ctx.p.children);
  const pm: PlannedMeal = { day, meal, slug: r.slug, scale, portions: round2(portions) };
  if (feed && ctx.leftovers && meal === "dinner" && day < 6 && r.batchFriendly) {
    const lunchScale = portionScale(r, "lunch", ctx.targets);
    pm.portions = round2(portions + householdPortions(lunchScale, ctx.p.adults, ctx.p.children));
    pm.cookedForLeftovers = true;
  }
  return pm;
}

function leftoverLunch(dinner: PlannedMeal, ctx: Ctx): PlannedMeal {
  const r = RECIPE_BY_SLUG[dinner.slug];
  const scale = portionScale(r, "lunch", ctx.targets);
  return {
    day: dinner.day + 1,
    meal: "lunch",
    slug: dinner.slug,
    scale,
    portions: round2(householdPortions(scale, ctx.p.adults, ctx.p.children)),
    leftoverOf: { day: dinner.day },
  };
}

function marginal(basket: Basket, pm: PlannedMeal, ctx: Ctx, base: number): number {
  addRecipe(basket, pm.slug, pm.portions);
  const c = bestCost(basket, ctx.stores, ctx.p.hasPantry);
  addRecipe(basket, pm.slug, pm.portions, -1);
  return c - base;
}

function slotCount(p: Profile): number {
  return p.meals.length * 7;
}

/** Repère les repas de la semaine dans l'ordre et chaîne les restes. */
function relinkLeftovers(meals: PlannedMeal[], ctx: Ctx): PlannedMeal[] {
  if (!ctx.leftovers) return meals;
  const out = meals.map((m) => ({ ...m }));
  for (const m of out) {
    if (m.meal !== "lunch" || m.day === 0) continue;
    const dinner = out.find((x) => x.meal === "dinner" && x.day === m.day - 1);
    if (dinner?.cookedForLeftovers) Object.assign(m, leftoverLunch(dinner, ctx));
  }
  return out;
}

export interface GenerateOptions {
  seed?: number;
  /** Repas imposés (créneaux verrouillés) */
  keep?: PlannedMeal[];
}

function buildCtx(p: Profile): Ctx {
  return {
    p,
    targets: dailyTargets(p),
    stores: p.stores.length ? p.stores : STORES.map((s) => s.id),
    leftovers: p.lunchMode === "leftovers" && p.meals.includes("lunch") && p.meals.includes("dinner"),
    poolSize: { breakfast: pool(p, "breakfast").length, main: pool(p, "dinner").length },
  };
}

export function generatePlan(p: Profile, opts: GenerateOptions = {}): WeekPlan {
  const seed = opts.seed ?? Math.floor(Math.random() * 1e9);
  const rng = mulberry32(seed);
  const meals = MEAL_ORDER.filter((m) => p.meals.includes(m));
  const pools: Record<MealType, Recipe[]> = {
    breakfast: pool(p, "breakfast"),
    lunch: pool(p, "lunch"),
    dinner: pool(p, "dinner"),
  };
  const ctx = buildCtx(p);
  const stores = ctx.stores;
  const warnings: string[] = [];
  for (const m of meals) {
    if (!pools[m].length) {
      warnings.push(`Aucune recette compatible pour le repas « ${MEAL_LABEL[m]} » avec tes restrictions.`);
    }
  }

  const chosen: PlannedMeal[] = [];
  const basket: Basket = new Float64Array(Object.keys(INGREDIENTS).length);
  const perSlot = p.budget / Math.max(1, slotCount(p));
  const lambda = (9 * priceWeight(p)) / Math.max(0.5, perSlot);

  for (let day = 0; day < 7; day++) {
    for (const meal of meals) {
      const kept = opts.keep?.find((k) => k.day === day && k.meal === meal);
      if (kept) {
        const pm = kept.leftoverOf ? kept : makeMeal(RECIPE_BY_SLUG[kept.slug], day, meal, ctx);
        chosen.push(pm);
        if (!pm.leftoverOf) addRecipe(basket, pm.slug, pm.portions);
        continue;
      }
      if (ctx.leftovers && meal === "lunch" && day > 0) {
        const prev = chosen.find((c) => c.meal === "dinner" && c.day === day - 1);
        if (prev?.cookedForLeftovers) {
          chosen.push(leftoverLunch(prev, ctx));
          continue;
        }
      }
      const capped = pools[meal].filter((r) => withinCap(r, day, meal, chosen, ctx));
      const candidates = capped.length ? capped : pools[meal];
      if (!candidates.length) continue;
      const base = bestCost(basket, stores, p.hasPantry);
      let best: { pm: PlannedMeal; score: number } | null = null;
      for (const r of candidates) {
        const pm = makeMeal(r, day, meal, ctx);
        const cost = marginal(basket, pm, ctx, base);
        const score = qualityScore(r, day, meal, ctx, chosen) - cost * lambda + rng() * 7;
        if (!best || score > best.score) best = { pm, score };
      }
      chosen.push(best!.pm);
      addRecipe(basket, best!.pm.slug, best!.pm.portions);
    }
  }

  let plan = repairBudget(chosen, ctx, pools, opts.keep ?? []);
  plan = relinkLeftovers(plan, ctx);
  return finalize(plan, p, ctx, seed, warnings);
}

/** Remplace itérativement le repas au meilleur ratio économie / perte de qualité jusqu'à tenir le budget. */
function repairBudget(meals: PlannedMeal[], ctx: Ctx, pools: Record<MealType, Recipe[]>, keep: PlannedMeal[]) {
  let current = meals.map((m) => ({ ...m }));
  const costOf = (ms: PlannedMeal[]) => bestCost(basketFromMeals(ms), ctx.stores, ctx.p.hasPantry);
  let cost = costOf(current);

  for (let iter = 0; iter < 80 && cost > ctx.p.budget; iter++) {
    let best: { idx: number; pm: PlannedMeal; ratio: number; newCost: number } | null = null;
    const basket = basketFromMeals(current);

    current.forEach((m, idx) => {
      if (m.leftoverOf || keep.some((k) => k.day === m.day && k.meal === m.meal)) return;
      const others = current.filter((_, i) => i !== idx);
      const q0 = qualityScore(RECIPE_BY_SLUG[m.slug], m.day, m.meal, ctx, others);
      addRecipe(basket, m.slug, m.portions, -1);
      for (const r of pools[m.meal]) {
        if (r.slug === m.slug || !withinCap(r, m.day, m.meal, others, ctx)) continue;
        const pm = makeMeal(r, m.day, m.meal, ctx);
        if (!!pm.cookedForLeftovers !== !!m.cookedForLeftovers) continue;
        addRecipe(basket, pm.slug, pm.portions);
        const newCost = bestCost(basket, ctx.stores, ctx.p.hasPantry);
        addRecipe(basket, pm.slug, pm.portions, -1);
        const saving = cost - newCost;
        if (saving < 0.05) continue;
        const loss = Math.max(0.5, q0 - qualityScore(r, m.day, m.meal, ctx, others));
        const ratio = saving / loss;
        if (!best || ratio > best.ratio) best = { idx, pm, ratio, newCost };
      }
      addRecipe(basket, m.slug, m.portions);
    });

    if (!best) break;
    const b = best as { idx: number; pm: PlannedMeal; newCost: number };
    current[b.idx] = b.pm;
    current = relinkLeftovers(current, ctx);
    cost = costOf(current);
  }
  return current;
}

function finalize(meals: PlannedMeal[], p: Profile, ctx: Ctx, seed: number, warnings: string[]): WeekPlan {
  const basket = basketFromMeals(meals);
  const all = quotes(basket, p.hasPantry);
  const eligible = all.filter((q) => ctx.stores.includes(q.storeId));
  const pick = eligible[0] ?? all[0];
  const total = pick.total;
  const plan: WeekPlan = {
    id: `${Date.now().toString(36)}-${seed.toString(36)}`,
    createdAt: new Date().toISOString(),
    seed,
    meals,
    storeId: pick.storeId,
    quotes: all,
    total,
    budget: p.budget,
    targets: ctx.targets,
    warnings,
  };
  if (total > p.budget) {
    plan.minAchievable = total;
    warnings.push(
      `Ton budget est très serré : le minimum atteignable avec tes préférences est de ${total.toFixed(2)} €. ` +
        `Essaie d'élargir les enseignes, de passer au mode « restes du midi » ou de retirer un repas.`,
    );
  }
  return plan;
}

/** Remplace un seul repas en gardant le reste de la semaine intact. */
export function swapMeal(plan: WeekPlan, p: Profile, day: number, meal: MealType): WeekPlan {
  const target = plan.meals.find((m) => m.day === day && m.meal === meal);
  if (!target || target.leftoverOf) return plan;
  const ctx = buildCtx(p);
  const rng = mulberry32(Date.now() % 1e9);
  const nextLunch = plan.meals.find((m) => m.meal === "lunch" && m.day === day + 1);
  const others = plan.meals.filter((m) => m !== target && !(m === nextLunch && m.leftoverOf));
  const canFeedLunch = ctx.leftovers && meal === "dinner" && (!nextLunch || !!nextLunch.leftoverOf);

  const pick = (slot: MealType, d: number, exclude: string[], feed: boolean, current: PlannedMeal[]) => {
    const basket = basketFromMeals(current);
    const base = bestCost(basket, ctx.stores, p.hasPantry);
    const lambda = (9 * priceWeight(p)) / Math.max(0.5, p.budget / Math.max(1, slotCount(p)));
    const scored = pool(p, slot)
      .filter((r) => !exclude.includes(r.slug) && withinCap(r, d, slot, current, ctx))
      .map((r) => {
        const pm = makeMeal(r, d, slot, ctx, feed);
        return { pm, score: qualityScore(r, d, slot, ctx, current) - marginal(basket, pm, ctx, base) * lambda };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    return scored.length ? scored[Math.floor(rng() * scored.length)].pm : null;
  };

  const replacement = pick(meal, day, [target.slug], canFeedLunch, others);
  if (!replacement) return plan;
  const meals = [...others, replacement];
  if (canFeedLunch && day < 6) {
    if (replacement.cookedForLeftovers) meals.push(leftoverLunch(replacement, ctx));
    else {
      const fresh = pick("lunch", day + 1, [], false, meals);
      if (fresh) meals.push(fresh);
    }
  }
  meals.sort((a, b) => a.day - b.day || MEAL_ORDER.indexOf(a.meal) - MEAL_ORDER.indexOf(b.meal));
  const next = finalize(meals, p, ctx, plan.seed, []);
  return { ...next, id: plan.id, createdAt: plan.createdAt };
}

export function dayNutrition(plan: WeekPlan, day: number) {
  const n = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  for (const m of plan.meals.filter((x) => x.day === day)) {
    const r = recipeNutrition(RECIPE_BY_SLUG[m.slug]);
    n.kcal += r.kcal * m.scale;
    n.protein += r.protein * m.scale;
    n.carbs += r.carbs * m.scale;
    n.fat += r.fat * m.scale;
  }
  return { kcal: Math.round(n.kcal), protein: Math.round(n.protein), carbs: Math.round(n.carbs), fat: Math.round(n.fat) };
}
