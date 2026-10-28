import { ingredient } from "../data/ingredients";
import type { Activity, Goal, MealType, Profile, Recipe, Targets } from "../types";

const ACTIVITY: Record<Activity, number> = { sedentaire: 1.2, leger: 1.375, actif: 1.55, "tres-actif": 1.725 };
const GOAL_KCAL: Record<Goal, number> = { sain: 0.85, muscle: 1.12, equilibre: 1, gourmand: 1.05 };
const GOAL_PROTEIN: Record<Goal, number> = { sain: 1.6, muscle: 1.9, equilibre: 1.2, gourmand: 1.0 };

/** Part de l'énergie journalière par repas (le reste = collations). */
export const MEAL_SHARE: Record<MealType, number> = { breakfast: 0.25, lunch: 0.35, dinner: 0.33 };

export function dailyTargets(p: Pick<Profile, "sex" | "age" | "weight" | "height" | "activity" | "goal">): Targets {
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "homme" ? 5 : -161);
  const kcal = Math.round((bmr * ACTIVITY[p.activity] * GOAL_KCAL[p.goal]) / 10) * 10;
  const protein = Math.round(p.weight * GOAL_PROTEIN[p.goal]);
  const fat = Math.round((kcal * (p.goal === "gourmand" ? 0.35 : 0.3)) / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { kcal, protein, carbs, fat };
}

export interface Nutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

const cache = new Map<string, Nutrition>();

/** Valeurs nutritionnelles d'une portion standard de la recette. */
export function recipeNutrition(r: Recipe): Nutrition {
  const hit = cache.get(r.slug);
  if (hit) return hit;
  const n = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  for (const ri of r.ingredients) {
    const ing = ingredient(ri.id);
    const f = ing.unit === "pc" ? ri.qty : ri.qty / 100;
    n.kcal += ing.macros[0] * f;
    n.protein += ing.macros[1] * f;
    n.carbs += ing.macros[2] * f;
    n.fat += ing.macros[3] * f;
  }
  const out = {
    kcal: Math.round(n.kcal),
    protein: Math.round(n.protein),
    carbs: Math.round(n.carbs),
    fat: Math.round(n.fat),
  };
  cache.set(r.slug, out);
  return out;
}

/** Ajuste la portion du profil principal pour coller à son besoin calorique sur ce repas. */
export function portionScale(r: Recipe, meal: MealType, targets: Targets): number {
  const want = targets.kcal * MEAL_SHARE[meal];
  const has = recipeNutrition(r).kcal || 1;
  const s = Math.min(1.7, Math.max(0.75, want / has));
  return Math.round(s * 20) / 20;
}

/** Nombre de portions cuisinées pour le foyer. Les enfants comptent pour 0,6. */
export function householdPortions(scale: number, adults: number, children: number): number {
  return scale + Math.max(0, adults - 1) + children * 0.6;
}
