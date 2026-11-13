import { COUNTRY_BY_ID } from "./data/stores";
import type { Profile, WeekPlan } from "./types";

/**
 * Hypothèses moyennes (en euros, ajustées au niveau de prix du pays), affichées à l'utilisateur :
 * - gaspillage : une partie des courses finit à la poubelle quand on achète sans menu ;
 * - achats imprévus : une liste précise limite les produits pris « en passant » ;
 * - repas extérieurs : un repas à emporter ou de fast-food remplacé chaque semaine par adulte.
 */
export const ASSUMPTIONS = {
  wastePerPerson: 2.5,
  impulseShare: 0.08,
  takeawayMeal: 12,
  takeawayPerAdult: 1,
};

export interface SavingsLine {
  label: string;
  weekly: number;
}

/** Économie hebdomadaire et annuelle estimée, poste par poste. */
export function estimateSavings(plan: WeekPlan, profile: Pick<Profile, "adults" | "children">) {
  const level = COUNTRY_BY_ID[plan.country ?? "FR"].priceLevel;
  const people = Math.max(1, profile.adults + profile.children);
  const others = plan.quotes.filter((q) => q.storeId !== plan.storeId);
  const avgOthers = others.length ? others.reduce((a, q) => a + q.total, 0) / others.length : plan.total;
  const portions = Math.max(1, plan.meals.length * people);
  const homeMeal = plan.total / portions;

  const lines: SavingsLine[] = [
    { label: "Courses au meilleur prix", weekly: Math.max(0, avgOthers - plan.total) },
    { label: "Moins de gaspillage", weekly: ASSUMPTIONS.wastePerPerson * level * people },
    { label: "Moins d'achats imprévus", weekly: ASSUMPTIONS.impulseShare * plan.total },
    {
      label: "Fast-food et plats à emporter remplacés",
      weekly: Math.max(0, ASSUMPTIONS.takeawayMeal * level - homeMeal) * ASSUMPTIONS.takeawayPerAdult * profile.adults,
    },
  ];
  const weekly = lines.reduce((a, l) => a + l.weekly, 0);
  return { lines, weekly, yearly: Math.round(weekly * 52), before: plan.total + weekly };
}
