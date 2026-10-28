import { DEFAULT_PROFILE } from "../defaults";
import type { Profile } from "../types";

export interface MenuPreset {
  slug: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  image: string;
  profile: Profile;
}

const p = (o: Partial<Profile>): Profile => ({ ...DEFAULT_PROFILE, ...o });

/** Pages « menu type » indexables : une intention de recherche = une page. */
export const MENUS: MenuPreset[] = [
  {
    slug: "menu-semaine-pas-cher",
    h1: "Menu de la semaine pas cher",
    title: "Menu de la semaine pas cher : 14 repas pour moins de 35 €",
    description: "Un menu complet midi et soir pour une personne à moins de 35 € la semaine, avec la liste de courses chez le supermarché le moins cher.",
    intro: "Manger bien sans se ruiner, c'est possible : on cuisine le soir en double pour le midi du lendemain, on mutualise les ingrédients et on choisit l'enseigne la moins chère.",
    image: "photo-1498837167922-ddd27525d352",
    profile: p({ budget: 35, goal: "equilibre" }),
  },
  {
    slug: "menu-musculation-semaine",
    h1: "Menu musculation de la semaine",
    title: "Menu musculation semaine : riche en protéines, petit budget",
    description: "Un programme alimentaire prise de masse sur 7 jours (petit-déj, midi, soir) calculé selon tes besoins en protéines, pour moins de 60 €.",
    intro: "Pour progresser, il faut du carburant : environ 1,9 g de protéines par kilo de poids de corps et un léger surplus calorique. Voici une semaine type calibrée pour un pratiquant de 78 kg.",
    image: "photo-1490645935967-10de6ba17061",
    profile: p({ goal: "muscle", budget: 60, weight: 78, height: 180, age: 26, activity: "actif", meals: ["breakfast", "lunch", "dinner"] }),
  },
  {
    slug: "menu-healthy-semaine",
    h1: "Menu healthy de la semaine",
    title: "Menu healthy de la semaine : équilibré, léger et gourmand",
    description: "7 jours de repas sains et rassasiants, en léger déficit calorique, avec la liste de courses au meilleur prix.",
    intro: "Des légumes à chaque repas, des protéines maigres, des féculents complets et zéro frustration : la semaine idéale pour se remettre en forme.",
    image: "photo-1512621776951-a57141f2eefd",
    profile: p({ goal: "sain", budget: 50, sex: "femme", weight: 64, height: 166, meals: ["breakfast", "lunch", "dinner"] }),
  },
  {
    slug: "menu-vegetarien-semaine",
    h1: "Menu végétarien de la semaine",
    title: "Menu végétarien de la semaine : 14 repas sans viande ni poisson",
    description: "Un menu végétarien complet et riche en protéines végétales, pensé pour être économique et varié.",
    intro: "Lentilles, pois chiches, œufs, tofu et fromages : on assemble les bonnes sources de protéines pour une semaine végétarienne qui tient au corps.",
    image: "photo-1546069901-ba9599a7e63c",
    profile: p({ diet: "vegetarien", budget: 40 }),
  },
  {
    slug: "menu-famille-repas-du-soir",
    h1: "Menu de la semaine pour une famille",
    title: "Menu de la semaine famille : 7 dîners pour 4 personnes",
    description: "7 dîners familiaux qui plaisent aux enfants comme aux parents, pour 2 adultes et 2 enfants, avec la liste de courses optimisée.",
    intro: "Fini le casse-tête du « on mange quoi ce soir ? ». Des plats familiaux, faciles, et un budget maîtrisé pour toute la tribu.",
    image: "photo-1529042410759-befb1204b468",
    profile: p({ adults: 2, children: 2, meals: ["dinner"], budget: 70, goal: "equilibre" }),
  },
  {
    slug: "menu-etudiant-pas-cher",
    h1: "Menu étudiant pas cher",
    title: "Menu étudiant pas cher et rapide : moins de 20 minutes par repas",
    description: "Le menu de la semaine pour étudiant : des recettes express, économiques et rassasiantes, midi et soir.",
    intro: "Peu de temps, peu de matériel, petit budget : chaque recette se prépare en moins de 20 minutes et se garde pour le lendemain.",
    image: "photo-1543339308-43e59d6b73a6",
    profile: p({ budget: 32, cookTime: "express", age: 21 }),
  },
  {
    slug: "menu-reequilibrage-alimentaire",
    h1: "Menu rééquilibrage alimentaire",
    title: "Menu rééquilibrage alimentaire : une semaine pour perdre du poids sans frustration",
    description: "Un menu en léger déficit calorique (-15 %), riche en protéines et en légumes, calculé selon ton métabolisme.",
    intro: "Perdre du poids durablement, c'est manger mieux, pas moins. Ce menu respecte un déficit modéré et garde des repas généreux.",
    image: "photo-1540189549336-e6e99c3679fe",
    profile: p({ goal: "sain", budget: 45, sex: "femme", weight: 72, height: 165, age: 38, meals: ["breakfast", "lunch", "dinner"] }),
  },
  {
    slug: "menu-gourmand-semaine",
    h1: "Menu gourmand de la semaine",
    title: "Menu gourmand de la semaine : comfort food maison à petit prix",
    description: "Pizza maison, burger, tartiflette, carbonara… une semaine de plats réconfortants faits maison, moins chers que la livraison.",
    intro: "Se faire plaisir, oui, mais en cuisinant maison : c'est meilleur, plus sain que la livraison et bien moins cher.",
    image: "photo-1565299624946-b28f40a0ae38",
    profile: p({ goal: "gourmand", budget: 50 }),
  },
  {
    slug: "menu-sans-porc-semaine",
    h1: "Menu de la semaine sans porc",
    title: "Menu de la semaine sans porc : idées repas variées et économiques",
    description: "Un menu de la semaine 100 % sans porc, midi et soir, avec volaille, bœuf, poisson et options végétariennes.",
    intro: "Toutes nos recettes sans porc, assemblées en une semaine variée et équilibrée, pour un budget maîtrisé.",
    image: "photo-1504674900247-0877df9cc836",
    profile: p({ restrictions: ["sans-porc"], budget: 45 }),
  },
];

export const MENU_BY_SLUG: Record<string, MenuPreset> = Object.fromEntries(MENUS.map((m) => [m.slug, m]));
