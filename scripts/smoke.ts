import { generatePlan, swapMeal, dayNutrition, DAYS } from "../src/lib/engine/generator";
import { shoppingList } from "../src/lib/engine/pricing";
import type { Profile } from "../src/lib/types";
const base: Profile = { goal: "muscle", sex: "homme", age: 27, weight: 78, height: 180, activity: "actif", adults: 1, children: 0,
  meals: ["breakfast","lunch","dinner"], lunchMode: "leftovers", diet: "omnivore", restrictions: [], allergens: [], dislikes: [],
  budget: 55, stores: [], cookTime: "normal", hasPantry: true };
const cases: Partial<Profile>[] = [{}, {goal:"sain", sex:"femme", weight:62, height:165, budget:40}, {goal:"gourmand", adults:2, children:2, budget:110, meals:["dinner"]},
 {diet:"vegan", budget:35}, {goal:"equilibre", budget:20}, {lunchMode:"fresh", stores:["monoprix"], budget:80}, {restrictions:["sans-porc","sans-gluten"], budget:50}];
for (const c of cases) {
  const p = { ...base, ...c } as Profile;
  const t0 = performance.now();
  const plan = generatePlan(p, { seed: 42 });
  const ms = (performance.now()-t0).toFixed(0);
  console.log(`\n== ${JSON.stringify(c)} -> ${plan.total}€ / ${plan.budget}€ at ${plan.storeId} (${ms}ms) kcal target ${plan.targets.kcal} P${plan.targets.protein}`);
  for (let d=0; d<7; d++) console.log(DAYS[d].padEnd(9), plan.meals.filter(m=>m.day===d).map(m=>`${m.meal[0]}:${m.slug.slice(0,26)}${m.leftoverOf?"(R)":""}x${m.portions}`).join(" | "), JSON.stringify(dayNutrition(plan,d)));
  plan.warnings.forEach(w=>console.log("! "+w));
  const sl = shoppingList(plan.meals, plan.storeId, p.hasPantry);
  console.log("lines", sl.length, "sum", sl.reduce((a,b)=>a+b.cost,0).toFixed(2));
  const sw = swapMeal(plan, p, 2, p.meals.includes("dinner")?"dinner":"lunch");
  console.log("swap ->", sw.meals.find(m=>m.day===2&&m.meal==="dinner")?.slug, sw.total);
}
