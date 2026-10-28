export type Goal = "sain" | "muscle" | "equilibre" | "gourmand";
export type MealType = "breakfast" | "lunch" | "dinner";
export type Diet = "omnivore" | "flexitarien" | "pescetarien" | "vegetarien" | "vegan";
export type Restriction = "sans-porc" | "sans-gluten" | "sans-lactose";
export type Allergen = "egg" | "peanut" | "nuts" | "fish" | "shellfish";
export type Sex = "homme" | "femme";
export type Activity = "sedentaire" | "leger" | "actif" | "tres-actif";
export type CookTime = "express" | "normal" | "chef";
export type LunchMode = "leftovers" | "fresh";

export type Flag =
  | "meat"
  | "pork"
  | "fish"
  | "shellfish"
  | "dairy"
  | "egg"
  | "gluten"
  | "nuts"
  | "peanut"
  | "honey";

export type Aisle =
  | "Fruits & légumes"
  | "Boucherie & volaille"
  | "Poissonnerie"
  | "Crèmerie & frais"
  | "Épicerie salée"
  | "Épicerie sucrée"
  | "Boulangerie"
  | "Surgelés"
  | "Placard";

/** kcal, protéines, glucides, lipides — pour 100 g/ml, ou pour 1 pièce */
export type Macros = [number, number, number, number];

export interface Ingredient {
  id: string;
  name: string;
  aisle: Aisle;
  unit: "g" | "ml" | "pc";
  /** quantité contenue dans un conditionnement vendu en magasin */
  pack: number;
  packLabel?: string;
  /** prix de référence d'un conditionnement (€) */
  price: number;
  macros: Macros;
  flags?: Flag[];
  /** produit de placard : coût proratisé si l'utilisateur l'a déjà */
  pantry?: boolean;
}

export interface RecipeIngredient {
  id: string;
  /** quantité pour UNE portion adulte standard */
  qty: number;
  note?: string;
}

export interface Recipe {
  slug: string;
  title: string;
  meal: "breakfast" | "main";
  description: string;
  time: number;
  difficulty: 1 | 2 | 3;
  /** adéquation à chaque objectif, de 0 (à éviter) à 3 (idéal) */
  fit: Record<Goal, 0 | 1 | 2 | 3>;
  protein: "volaille" | "boeuf" | "porc" | "poisson" | "oeuf" | "vegetal" | "laitier";
  cuisine: string;
  image: string;
  emoji: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  /** se réchauffe bien : éligible aux restes du midi */
  batchFriendly?: boolean;
}

export interface Profile {
  goal: Goal;
  sex: Sex;
  age: number;
  weight: number;
  height: number;
  activity: Activity;
  adults: number;
  children: number;
  meals: MealType[];
  lunchMode: LunchMode;
  diet: Diet;
  restrictions: Restriction[];
  allergens: Allergen[];
  dislikes: string[];
  budget: number;
  stores: string[];
  cookTime: CookTime;
  hasPantry: boolean;
}

export interface Store {
  id: string;
  name: string;
  index: number;
  color: string;
  tagline: string;
}

export interface PlannedMeal {
  day: number;
  meal: MealType;
  slug: string;
  /** nombre de portions cuisinées (foyer + éventuels restes) */
  portions: number;
  /** multiplicateur appliqué à la portion du profil principal */
  scale: number;
  /** ce repas est constitué des restes de la veille */
  leftoverOf?: { day: number };
  /** ce repas est cuisiné en double pour le midi suivant */
  cookedForLeftovers?: boolean;
}

export interface ShoppingLine {
  id: string;
  name: string;
  aisle: Aisle;
  unit: Ingredient["unit"];
  needed: number;
  packs: number;
  packSize: number;
  packLabel?: string;
  cost: number;
  pantry: boolean;
  leftover: number;
}

export interface StoreQuote {
  storeId: string;
  total: number;
}

export interface Targets {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeekPlan {
  id: string;
  createdAt: string;
  seed: number;
  meals: PlannedMeal[];
  storeId: string;
  quotes: StoreQuote[];
  total: number;
  budget: number;
  minAchievable?: number;
  targets: Targets;
  warnings: string[];
}
