import type { Recipe } from "../types";
import { EXTRA } from "./recipes-extra";
import PHOTOS from "./photos.json";

/** Identifiants de photos Unsplash (licence libre). Servies en haute définition via next/image. */
export const IMG = {
  porridge: "photo-1517673132405-a56a62b18caf",
  yogurtBowl: "photo-1488477181946-6428a0291777",
  eggsBreakfast: "photo-1525351484163-7529414344d8",
  avocadoToast: "photo-1482049016688-2d3e1b311543",
  pancakes: "photo-1528207776546-365bb710ee93",
  pancakes2: "photo-1567620905732-2d1ec7ab7445",
  frenchToast: "photo-1484723091739-30a097e8f929",
  smoothieBowl: "photo-1505576399279-565b52d4ac71",
  breakfast: "photo-1495214783159-3503fd1b572d",
  curry: "photo-1565557623262-b51c2513a641",
  curry2: "photo-1585937421612-70a008356fbe",
  dahl: "photo-1455619452474-d2be8b1e70cd",
  bowl: "photo-1546069901-ba9599a7e63c",
  bowl2: "photo-1512621776951-a57141f2eefd",
  bowl3: "photo-1490645935967-10de6ba17061",
  salmon: "photo-1467003909585-2f8a72700288",
  salmon2: "photo-1519708227418-c8fd9a32b7a2",
  chili: "photo-1455619452474-d2be8b1e70cd",
  pasta: "photo-1473093295043-cdd812d0e601",
  pasta2: "photo-1551183053-bf91a1d81141",
  carbonara: "photo-1621996346565-e3dbc646d9a9",
  burger: "photo-1568901346375-23c9450c58cd",
  burger2: "photo-1551782450-a2132b4ba21d",
  pizza: "photo-1565299624946-b28f40a0ae38",
  pizza2: "photo-1513104890138-7c749659a591",
  noodles: "photo-1569718212165-3a8278d5f624",
  friedRice: "photo-1512058564366-18510be2db19",
  salad: "photo-1540189549336-e6e99c3679fe",
  salad2: "photo-1546549032-9571cd6b27df",
  shakshuka: "photo-1590412200988-a436970781fa",
  soup: "photo-1547592180-85f173990554",
  soup2: "photo-1476718406336-bb5a9690ee2a",
  meat: "photo-1504674900247-0877df9cc836",
  steak: "photo-1600891964092-4316c288032e",
  skewers: "photo-1555939594-58d7cb561ad1",
  plate: "photo-1529042410759-befb1204b468",
  plate2: "photo-1543339308-43e59d6b73a6",
  plate3: "photo-1484980972926-edee96e0960d",
  dessert: "photo-1565958011703-44f9829ba187",
} as const;

const BASE: Recipe[] = [
  // ───────────────────────── PETITS-DÉJEUNERS ─────────────────────────
  {
    slug: "porridge-banane-beurre-de-cacahuete",
    title: "Porridge banane & beurre de cacahuète",
    meal: "breakfast",
    description: "Le petit-déj qui cale jusqu'à midi : flocons d'avoine crémeux, banane caramélisée et cuillère de beurre de cacahuète.",
    time: 8, difficulty: 1,
    fit: { sain: 2, muscle: 3, equilibre: 3, gourmand: 2 },
    protein: "vegetal", cuisine: "brunch", image: IMG.porridge, emoji: "🥣",
    ingredients: [
      { id: "avoine", qty: 60 }, { id: "lait", qty: 220 }, { id: "banane", qty: 1 }, { id: "beurre-cacahuete", qty: 15 },
    ],
    steps: [
      "Porte le lait à frémissement, ajoute les flocons d'avoine et une pincée de sel.",
      "Laisse cuire 4 à 5 minutes en remuant jusqu'à texture crémeuse.",
      "Coupe la banane en rondelles, verse le porridge dans un bol et termine avec la banane et le beurre de cacahuète.",
    ],
  },
  {
    slug: "skyr-bowl-fruits-rouges-amandes",
    title: "Skyr bowl fruits rouges & amandes",
    meal: "breakfast",
    description: "20 g de protéines en 3 minutes chrono : skyr onctueux, fruits rouges acidulés et amandes croquantes.",
    time: 3, difficulty: 1,
    fit: { sain: 3, muscle: 3, equilibre: 2, gourmand: 1 },
    protein: "laitier", cuisine: "brunch", image: IMG.yogurtBowl, emoji: "🫐",
    ingredients: [
      { id: "skyr", qty: 200 }, { id: "fruits-rouges", qty: 80 }, { id: "amandes", qty: 15 }, { id: "miel", qty: 8 },
    ],
    steps: [
      "Sors les fruits rouges 10 min avant ou passe-les 30 s au micro-ondes.",
      "Verse le skyr dans un bol, ajoute les fruits, les amandes concassées et un filet de miel.",
    ],
  },
  {
    slug: "omelette-epinards-feta",
    title: "Omelette épinards & feta",
    meal: "breakfast",
    description: "Une omelette baveuse aux épinards et à la feta, servie avec une tartine de pain complet.",
    time: 10, difficulty: 1,
    fit: { sain: 3, muscle: 3, equilibre: 2, gourmand: 1 },
    protein: "oeuf", cuisine: "brunch", image: IMG.eggsBreakfast, emoji: "🍳",
    ingredients: [
      { id: "oeuf", qty: 3 }, { id: "epinards", qty: 70 }, { id: "feta", qty: 30 }, { id: "pain-complet", qty: 50 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Fais revenir les épinards 2 min dans une poêle huilée.",
      "Bats les œufs, verse-les sur les épinards, émiette la feta.",
      "Cuis 3 min à feu moyen, plie l'omelette et sers avec le pain grillé.",
    ],
  },
  {
    slug: "tartines-avocat-oeuf-mollet",
    title: "Tartines avocat & œuf mollet",
    meal: "breakfast",
    description: "Le classique du brunch, version maison : avocat écrasé au citron, œuf mollet et pain complet grillé.",
    time: 10, difficulty: 1,
    fit: { sain: 3, muscle: 2, equilibre: 3, gourmand: 2 },
    protein: "oeuf", cuisine: "brunch", image: IMG.avocadoToast, emoji: "🥑",
    ingredients: [
      { id: "pain-complet", qty: 70 }, { id: "avocat", qty: 0.5 }, { id: "oeuf", qty: 1 }, { id: "citron", qty: 0.15 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Plonge l'œuf 6 minutes dans l'eau bouillante puis dans l'eau froide.",
      "Écrase l'avocat avec le jus de citron, sel, poivre et piment.",
      "Grille le pain, tartine d'avocat et dépose l'œuf écalé coupé en deux.",
    ],
  },
  {
    slug: "pancakes-banane-avoine",
    title: "Pancakes banane-avoine",
    meal: "breakfast",
    description: "Sans farine ni sucre ajouté : des pancakes moelleux à la banane, parfaits pour le dimanche (et le reste de la semaine).",
    time: 15, difficulty: 1,
    fit: { sain: 2, muscle: 2, equilibre: 3, gourmand: 3 },
    protein: "oeuf", cuisine: "brunch", image: IMG.pancakes, emoji: "🥞",
    ingredients: [
      { id: "avoine", qty: 50 }, { id: "oeuf", qty: 2 }, { id: "banane", qty: 1 }, { id: "miel", qty: 10 }, { id: "huile", qty: 3 },
    ],
    steps: [
      "Mixe les flocons d'avoine, les œufs et la banane jusqu'à obtenir une pâte lisse.",
      "Cuis des petits disques 2 minutes de chaque côté dans une poêle légèrement huilée.",
      "Sers avec un filet de miel.",
    ],
  },
  {
    slug: "crepes-maison-chocolat",
    title: "Crêpes maison & chocolat fondu",
    meal: "breakfast",
    description: "La recette de grand-mère, avec du chocolat noir fondu. Pour les matins qui méritent du réconfort.",
    time: 20, difficulty: 2,
    fit: { sain: 0, muscle: 1, equilibre: 1, gourmand: 3 },
    protein: "oeuf", cuisine: "française", image: IMG.pancakes2, emoji: "🫓",
    ingredients: [
      { id: "farine", qty: 60 }, { id: "lait", qty: 130 }, { id: "oeuf", qty: 1 }, { id: "beurre", qty: 8 }, { id: "chocolat", qty: 15 }, { id: "sucre", qty: 5 },
    ],
    steps: [
      "Fouette la farine, le sucre, l'œuf puis le lait progressivement. Ajoute le beurre fondu.",
      "Laisse reposer 10 minutes si tu peux.",
      "Cuis les crêpes dans une poêle bien chaude et garnis de chocolat fondu.",
    ],
  },
  {
    slug: "pain-perdu-brioche-miel",
    title: "Pain perdu doré au miel",
    meal: "breakfast",
    description: "Anti-gaspi et ultra-gourmand : le pain perdu doré au beurre, nappé de miel.",
    time: 12, difficulty: 1,
    fit: { sain: 0, muscle: 1, equilibre: 1, gourmand: 3 },
    protein: "oeuf", cuisine: "française", image: IMG.frenchToast, emoji: "🍞",
    ingredients: [
      { id: "pain-de-mie", qty: 80 }, { id: "oeuf", qty: 1 }, { id: "lait", qty: 80 }, { id: "beurre", qty: 10 }, { id: "miel", qty: 12 },
    ],
    steps: [
      "Bats l'œuf avec le lait.",
      "Trempe les tranches de pain des deux côtés.",
      "Dore-les au beurre 2 minutes par face et arrose de miel.",
    ],
  },
  {
    slug: "overnight-oats-pomme-chia",
    title: "Overnight oats pomme & chia",
    meal: "breakfast",
    description: "Préparé la veille en 2 minutes : avoine, chia et pomme râpée. Tu te réveilles, c'est prêt.",
    time: 5, difficulty: 1,
    fit: { sain: 3, muscle: 2, equilibre: 3, gourmand: 1 },
    protein: "vegetal", cuisine: "brunch", image: IMG.breakfast, emoji: "🍎",
    ingredients: [
      { id: "avoine", qty: 50 }, { id: "lait", qty: 160 }, { id: "chia", qty: 10 }, { id: "pomme", qty: 1 }, { id: "miel", qty: 5 },
    ],
    steps: [
      "Dans un bocal, mélange l'avoine, le chia, le lait et le miel.",
      "Râpe la moitié de la pomme dedans, mélange et ferme.",
      "Laisse la nuit au frais. Le matin, ajoute le reste de pomme en dés.",
    ],
  },
  {
    slug: "toast-oeufs-brouilles-jambon",
    title: "Toast œufs brouillés & jambon",
    meal: "breakfast",
    description: "Le petit-déj salé à la française : œufs brouillés crémeux, jambon et pain complet.",
    time: 8, difficulty: 1,
    fit: { sain: 2, muscle: 3, equilibre: 2, gourmand: 2 },
    protein: "porc", cuisine: "française", image: IMG.eggsBreakfast, emoji: "🥓",
    ingredients: [
      { id: "pain-complet", qty: 70 }, { id: "oeuf", qty: 2 }, { id: "jambon", qty: 40 }, { id: "beurre", qty: 5 },
    ],
    steps: [
      "Fais fondre le beurre à feu doux, ajoute les œufs battus.",
      "Remue sans arrêt avec une spatule jusqu'à texture crémeuse.",
      "Sers sur le pain grillé avec le jambon.",
    ],
  },
  {
    slug: "smoothie-bowl-banane-fruits-rouges",
    title: "Smoothie bowl banane & fruits rouges",
    meal: "breakfast",
    description: "Frais, coloré et vitaminé : une base banane-fruits rouges épaisse, toppée d'avoine.",
    time: 5, difficulty: 1,
    fit: { sain: 3, muscle: 1, equilibre: 2, gourmand: 2 },
    protein: "laitier", cuisine: "brunch", image: IMG.smoothieBowl, emoji: "🍓",
    ingredients: [
      { id: "banane", qty: 1 }, { id: "fruits-rouges", qty: 100 }, { id: "skyr", qty: 100 }, { id: "avoine", qty: 25 },
    ],
    steps: [
      "Mixe la banane, les fruits rouges surgelés et le skyr jusqu'à texture épaisse.",
      "Verse dans un bol et parsème de flocons d'avoine.",
    ],
  },
  {
    slug: "porridge-vegan-fruits-rouges",
    title: "Porridge végétal aux fruits rouges",
    meal: "breakfast",
    description: "100 % végétal : flocons d'avoine, boisson d'avoine, fruits rouges et graines de chia.",
    time: 8, difficulty: 1,
    fit: { sain: 3, muscle: 1, equilibre: 3, gourmand: 2 },
    protein: "vegetal", cuisine: "brunch", image: IMG.porridge, emoji: "🌱",
    ingredients: [
      { id: "avoine", qty: 60 }, { id: "boisson-avoine", qty: 220 }, { id: "fruits-rouges", qty: 80 }, { id: "chia", qty: 10 }, { id: "sucre", qty: 5 },
    ],
    steps: [
      "Fais cuire l'avoine dans la boisson d'avoine 5 minutes.",
      "Ajoute le chia hors du feu et laisse épaissir 2 minutes.",
      "Termine avec les fruits rouges réchauffés.",
    ],
  },
  {
    slug: "tartines-beurre-cacahuete-banane",
    title: "Tartines beurre de cacahuète & banane",
    meal: "breakfast",
    description: "Simple, végétal et ultra-énergisant : la tartine préférée des sportifs.",
    time: 4, difficulty: 1,
    fit: { sain: 1, muscle: 3, equilibre: 2, gourmand: 3 },
    protein: "vegetal", cuisine: "brunch", image: IMG.avocadoToast, emoji: "🥜",
    ingredients: [
      { id: "pain-complet", qty: 80 }, { id: "beurre-cacahuete", qty: 25 }, { id: "banane", qty: 1 },
    ],
    steps: ["Grille le pain.", "Tartine de beurre de cacahuète et recouvre de rondelles de banane."],
  },
  {
    slug: "yaourt-soja-granola-pomme",
    title: "Bol yaourt soja, pomme & avoine grillée",
    meal: "breakfast",
    description: "Un bol végétal croquant : yaourt soja, pomme poêlée à la cannelle et avoine torréfiée.",
    time: 8, difficulty: 1,
    fit: { sain: 3, muscle: 1, equilibre: 2, gourmand: 2 },
    protein: "vegetal", cuisine: "brunch", image: IMG.yogurtBowl, emoji: "🥄",
    ingredients: [
      { id: "yaourt-soja", qty: 200 }, { id: "pomme", qty: 1 }, { id: "avoine", qty: 30 }, { id: "sucre", qty: 5 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Fais griller l'avoine à sec 3 minutes avec le sucre.",
      "Poêle la pomme en dés 3 minutes avec la cannelle.",
      "Assemble sur le yaourt.",
    ],
  },

  // ───────────────────────── PLATS (MIDI & SOIR) ─────────────────────────
  {
    slug: "poulet-curry-coco-riz-basmati",
    title: "Poulet curry coco & riz basmati",
    meal: "main",
    description: "Un curry doux et parfumé, prêt en 25 minutes, qui embaume toute la cuisine.",
    time: 25, difficulty: 1,
    fit: { sain: 1, muscle: 3, equilibre: 3, gourmand: 3 },
    protein: "volaille", cuisine: "indienne", image: IMG.curry, emoji: "🍛", batchFriendly: true,
    ingredients: [
      { id: "poulet", qty: 140 }, { id: "lait-coco", qty: 80 }, { id: "tomates-concassees", qty: 80 }, { id: "oignon", qty: 50 },
      { id: "ail", qty: 1 }, { id: "epices", qty: 3, note: "curry" }, { id: "riz", qty: 75 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Lance la cuisson du riz.",
      "Fais revenir l'oignon et l'ail émincés dans l'huile, ajoute le curry 30 secondes.",
      "Ajoute le poulet en dés, saisis 4 minutes.",
      "Verse tomates et lait de coco, laisse mijoter 12 minutes. Sers avec le riz.",
    ],
  },
  {
    slug: "bowl-poulet-teriyaki-brocoli",
    title: "Bowl poulet teriyaki & brocoli",
    meal: "main",
    description: "Le bowl préféré des sportifs : poulet laqué maison, brocoli croquant et riz.",
    time: 20, difficulty: 1,
    fit: { sain: 3, muscle: 3, equilibre: 3, gourmand: 2 },
    protein: "volaille", cuisine: "japonaise", image: IMG.bowl3, emoji: "🥢", batchFriendly: true,
    ingredients: [
      { id: "poulet", qty: 150 }, { id: "riz", qty: 75 }, { id: "brocoli", qty: 130 }, { id: "sauce-soja", qty: 15 },
      { id: "miel", qty: 8 }, { id: "ail", qty: 1 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Cuis le riz. Fais cuire le brocoli 4 minutes à la vapeur.",
      "Saisis le poulet en lamelles dans l'huile.",
      "Ajoute sauce soja, miel et ail râpé : laisse caraméliser 2 minutes.",
      "Dresse en bol.",
    ],
  },
  {
    slug: "saumon-roti-patate-douce-haricots-verts",
    title: "Saumon rôti, patate douce & haricots verts",
    meal: "main",
    description: "Une assiette complète riche en oméga-3, tout cuit au four sur une seule plaque.",
    time: 30, difficulty: 1,
    fit: { sain: 3, muscle: 3, equilibre: 3, gourmand: 2 },
    protein: "poisson", cuisine: "française", image: IMG.salmon, emoji: "🐟",
    ingredients: [
      { id: "saumon", qty: 125 }, { id: "patate-douce", qty: 200 }, { id: "haricots-verts", qty: 120 },
      { id: "citron", qty: 0.25 }, { id: "huile", qty: 8 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Préchauffe le four à 200 °C. Coupe la patate douce en cubes, huile, sale et enfourne 15 minutes.",
      "Ajoute les haricots verts et le saumon sur la plaque, arrose de citron.",
      "Prolonge 12 minutes de cuisson.",
    ],
  },
  {
    slug: "chili-con-carne",
    title: "Chili con carne",
    meal: "main",
    description: "Le chili généreux qui se bonifie le lendemain. Idéal en batch cooking.",
    time: 35, difficulty: 1,
    fit: { sain: 2, muscle: 3, equilibre: 3, gourmand: 3 },
    protein: "boeuf", cuisine: "tex-mex", image: IMG.chili, emoji: "🌶️", batchFriendly: true,
    ingredients: [
      { id: "boeuf", qty: 120 }, { id: "haricots-rouges", qty: 80 }, { id: "tomates-concassees", qty: 150 }, { id: "oignon", qty: 50 },
      { id: "poivron", qty: 0.4 }, { id: "riz", qty: 65 }, { id: "epices", qty: 3, note: "cumin, paprika" }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Fais revenir oignon et poivron dans l'huile.",
      "Ajoute le bœuf haché et les épices, fais dorer.",
      "Verse tomates et haricots rouges, laisse mijoter 20 minutes.",
      "Sers avec le riz.",
    ],
  },
  {
    slug: "chili-sin-carne",
    title: "Chili sin carne",
    meal: "main",
    description: "Toute la gourmandise du chili, 100 % végétal et ultra-économique.",
    time: 30, difficulty: 1,
    fit: { sain: 3, muscle: 2, equilibre: 3, gourmand: 2 },
    protein: "vegetal", cuisine: "tex-mex", image: IMG.bowl2, emoji: "🫘", batchFriendly: true,
    ingredients: [
      { id: "haricots-rouges", qty: 120 }, { id: "lentilles-corail", qty: 30 }, { id: "mais", qty: 50 }, { id: "tomates-concassees", qty: 150 },
      { id: "poivron", qty: 0.4 }, { id: "oignon", qty: 50 }, { id: "riz", qty: 65 }, { id: "epices", qty: 3 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Fais revenir oignon et poivron.",
      "Ajoute épices, lentilles, tomates et un verre d'eau : 15 minutes de cuisson.",
      "Ajoute haricots rouges et maïs, réchauffe 5 minutes. Sers avec le riz.",
    ],
  },
  {
    slug: "dahl-lentilles-corail",
    title: "Dahl de lentilles corail",
    meal: "main",
    description: "Réconfortant, épicé juste ce qu'il faut et redoutablement bon marché.",
    time: 25, difficulty: 1,
    fit: { sain: 3, muscle: 2, equilibre: 3, gourmand: 2 },
    protein: "vegetal", cuisine: "indienne", image: IMG.dahl, emoji: "🥘", batchFriendly: true,
    ingredients: [
      { id: "lentilles-corail", qty: 80 }, { id: "lait-coco", qty: 80 }, { id: "tomates-concassees", qty: 100 }, { id: "oignon", qty: 50 },
      { id: "ail", qty: 1 }, { id: "epices", qty: 3 }, { id: "riz", qty: 55 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Fais revenir oignon, ail et épices dans l'huile.",
      "Ajoute les lentilles rincées, les tomates, le lait de coco et 200 ml d'eau.",
      "Laisse mijoter 18 minutes en remuant. Sers avec le riz.",
    ],
  },
  {
    slug: "pates-bolognaise-maison",
    title: "Pâtes à la bolognaise maison",
    meal: "main",
    description: "La vraie sauce mijotée avec carottes et oignons. Un incontournable qui plaît à tout le foyer.",
    time: 35, difficulty: 1,
    fit: { sain: 1, muscle: 3, equilibre: 3, gourmand: 3 },
    protein: "boeuf", cuisine: "italienne", image: IMG.pasta2, emoji: "🍝", batchFriendly: true,
    ingredients: [
      { id: "pates", qty: 100 }, { id: "boeuf", qty: 100 }, { id: "tomates-concassees", qty: 150 }, { id: "oignon", qty: 40 },
      { id: "carotte", qty: 40 }, { id: "parmesan", qty: 10 }, { id: "huile", qty: 5 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Fais revenir oignon et carotte finement hachés 5 minutes.",
      "Ajoute le bœuf, fais dorer, puis les tomates et les herbes. Mijote 20 minutes.",
      "Cuis les pâtes, mélange et sers avec le parmesan.",
    ],
  },
  {
    slug: "pates-carbonara",
    title: "Spaghetti carbonara",
    meal: "main",
    description: "La recette romaine sans crème : jaunes d'œufs, parmesan et lardons croustillants.",
    time: 15, difficulty: 2,
    fit: { sain: 0, muscle: 2, equilibre: 1, gourmand: 3 },
    protein: "porc", cuisine: "italienne", image: IMG.carbonara, emoji: "🍝",
    ingredients: [
      { id: "pates", qty: 110 }, { id: "lardons", qty: 60 }, { id: "oeuf", qty: 1 }, { id: "parmesan", qty: 20 },
    ],
    steps: [
      "Cuis les pâtes al dente. Fais dorer les lardons à sec.",
      "Mélange œuf et parmesan avec du poivre.",
      "Hors du feu, mélange pâtes, lardons et appareil avec une louche d'eau de cuisson.",
    ],
  },
  {
    slug: "tartiflette",
    title: "Tartiflette savoyarde",
    meal: "main",
    description: "Pommes de terre fondantes, lardons et reblochon gratiné. Le plat-doudou par excellence.",
    time: 50, difficulty: 2,
    fit: { sain: 0, muscle: 1, equilibre: 1, gourmand: 3 },
    protein: "porc", cuisine: "française", image: IMG.plate3, emoji: "🧀", batchFriendly: true,
    ingredients: [
      { id: "pomme-de-terre", qty: 280 }, { id: "lardons", qty: 50 }, { id: "oignon", qty: 50 }, { id: "creme", qty: 40 },
      { id: "reblochon", qty: 90 }, { id: "salade", qty: 30 },
    ],
    steps: [
      "Cuis les pommes de terre 15 minutes à l'eau, coupe-les en rondelles.",
      "Fais revenir lardons et oignons.",
      "Mélange le tout avec la crème dans un plat, recouvre de reblochon.",
      "Gratine 20 minutes à 210 °C. Sers avec la salade.",
    ],
  },
  {
    slug: "burger-maison-potatoes",
    title: "Burger maison & potatoes au four",
    meal: "main",
    description: "Steak juteux, cheddar fondu et potatoes croustillantes — sans friteuse.",
    time: 35, difficulty: 2,
    fit: { sain: 0, muscle: 2, equilibre: 1, gourmand: 3 },
    protein: "boeuf", cuisine: "américaine", image: IMG.burger, emoji: "🍔",
    ingredients: [
      { id: "pain-burger", qty: 1 }, { id: "boeuf", qty: 125 }, { id: "cheddar", qty: 20 }, { id: "tomate", qty: 40 },
      { id: "salade", qty: 15 }, { id: "oignon", qty: 20 }, { id: "pomme-de-terre", qty: 220 }, { id: "huile", qty: 8 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Coupe les pommes de terre en quartiers, mélange avec huile et paprika, enfourne 30 minutes à 210 °C.",
      "Forme les steaks, cuis-les 3 minutes par face, ajoute le cheddar.",
      "Monte les burgers avec tomate, salade et oignon.",
    ],
  },
  {
    slug: "pizza-maison-jambon-champignons",
    title: "Pizza maison jambon-champignons",
    meal: "main",
    description: "La pizza du vendredi soir, moins chère et meilleure que la livraison.",
    time: 25, difficulty: 1,
    fit: { sain: 0, muscle: 1, equilibre: 2, gourmand: 3 },
    protein: "porc", cuisine: "italienne", image: IMG.pizza, emoji: "🍕",
    ingredients: [
      { id: "pate-pizza", qty: 0.5 }, { id: "tomates-concassees", qty: 60 }, { id: "mozzarella", qty: 60 }, { id: "jambon", qty: 40 },
      { id: "champignons", qty: 60 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Préchauffe le four à 240 °C.",
      "Étale la pâte, nappe de tomates concassées assaisonnées d'origan.",
      "Ajoute jambon, champignons émincés et mozzarella. Enfourne 12 minutes.",
    ],
  },
  {
    slug: "pizza-margherita-legumes",
    title: "Pizza margherita aux légumes grillés",
    meal: "main",
    description: "Tomate, mozzarella fondante et courgettes grillées : la pizza végétarienne qui fait l'unanimité.",
    time: 25, difficulty: 1,
    fit: { sain: 1, muscle: 1, equilibre: 2, gourmand: 3 },
    protein: "laitier", cuisine: "italienne", image: IMG.pizza2, emoji: "🍕",
    ingredients: [
      { id: "pate-pizza", qty: 0.5 }, { id: "tomates-concassees", qty: 60 }, { id: "mozzarella", qty: 70 }, { id: "courgette", qty: 80 },
      { id: "poivron", qty: 0.3 }, { id: "epices", qty: 1 }, { id: "huile", qty: 3 },
    ],
    steps: [
      "Préchauffe le four à 240 °C.",
      "Étale la pâte, nappe de tomates, ajoute courgette en fines rondelles et poivron.",
      "Termine avec la mozzarella et un filet d'huile. Enfourne 12 minutes.",
    ],
  },
  {
    slug: "wok-nouilles-crevettes-legumes",
    title: "Wok de nouilles aux crevettes",
    meal: "main",
    description: "Sauté minute de nouilles, crevettes et légumes croquants, sauce soja-ail.",
    time: 15, difficulty: 1,
    fit: { sain: 3, muscle: 2, equilibre: 3, gourmand: 2 },
    protein: "poisson", cuisine: "asiatique", image: IMG.noodles, emoji: "🍜",
    ingredients: [
      { id: "nouilles", qty: 80 }, { id: "crevettes", qty: 100 }, { id: "poivron", qty: 0.5 }, { id: "carotte", qty: 50 },
      { id: "sauce-soja", qty: 15 }, { id: "ail", qty: 1 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Cuis les nouilles 3 minutes, égoutte.",
      "Saute carotte et poivron en julienne 3 minutes à feu vif.",
      "Ajoute crevettes et ail 2 minutes, puis nouilles et sauce soja.",
    ],
  },
  {
    slug: "tofu-saute-brocoli-riz",
    title: "Tofu croustillant, brocoli & riz",
    meal: "main",
    description: "Le tofu qui convertit les sceptiques : doré, croustillant, laqué à la sauce soja.",
    time: 20, difficulty: 1,
    fit: { sain: 3, muscle: 3, equilibre: 3, gourmand: 1 },
    protein: "vegetal", cuisine: "asiatique", image: IMG.friedRice, emoji: "🥦", batchFriendly: true,
    ingredients: [
      { id: "tofu", qty: 150 }, { id: "brocoli", qty: 150 }, { id: "riz", qty: 70 }, { id: "sauce-soja", qty: 15 },
      { id: "ail", qty: 1 }, { id: "huile", qty: 8 }, { id: "sucre", qty: 4 },
    ],
    steps: [
      "Presse le tofu dans un torchon, coupe-le en cubes.",
      "Dore-le 8 minutes à la poêle. Cuis riz et brocoli.",
      "Laque le tofu avec sauce soja, ail et sucre. Assemble.",
    ],
  },
  {
    slug: "buddha-bowl-pois-chiches-quinoa",
    title: "Buddha bowl pois chiches & quinoa",
    meal: "main",
    description: "Coloré, rassasiant et 100 % végétal : quinoa, pois chiches rôtis, avocat et crudités.",
    time: 20, difficulty: 1,
    fit: { sain: 3, muscle: 2, equilibre: 3, gourmand: 1 },
    protein: "vegetal", cuisine: "healthy", image: IMG.bowl2, emoji: "🥗",
    ingredients: [
      { id: "quinoa", qty: 65 }, { id: "pois-chiches", qty: 100 }, { id: "avocat", qty: 0.5 }, { id: "carotte", qty: 50 },
      { id: "concombre", qty: 0.3 }, { id: "citron", qty: 0.25 }, { id: "huile", qty: 8 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Cuis le quinoa 12 minutes.",
      "Rôtis les pois chiches à la poêle avec huile et paprika.",
      "Dresse avec carotte râpée, concombre, avocat et un trait de citron.",
    ],
  },
  {
    slug: "salade-cesar-poulet",
    title: "Salade César au poulet",
    meal: "main",
    description: "Poulet doré, croûtons maison et parmesan, avec une sauce César allégée au skyr.",
    time: 20, difficulty: 1,
    fit: { sain: 3, muscle: 3, equilibre: 2, gourmand: 2 },
    protein: "volaille", cuisine: "américaine", image: IMG.salad, emoji: "🥗",
    ingredients: [
      { id: "poulet", qty: 130 }, { id: "salade", qty: 60 }, { id: "parmesan", qty: 15 }, { id: "pain-complet", qty: 40 },
      { id: "tomate", qty: 80 }, { id: "skyr", qty: 40 }, { id: "citron", qty: 0.25 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Saisis le poulet assaisonné 6 minutes par face, tranche-le.",
      "Toaste le pain en cubes à la poêle.",
      "Mélange skyr, citron, parmesan râpé et poivre pour la sauce. Assemble.",
    ],
  },
  {
    slug: "wraps-poulet-croquants",
    title: "Wraps poulet croquants",
    meal: "main",
    description: "Faciles à emporter, parfaits pour le midi : poulet épicé, crudités et sauce au skyr.",
    time: 15, difficulty: 1,
    fit: { sain: 2, muscle: 3, equilibre: 3, gourmand: 2 },
    protein: "volaille", cuisine: "tex-mex", image: IMG.skewers, emoji: "🌯",
    ingredients: [
      { id: "tortillas", qty: 2 }, { id: "poulet", qty: 120 }, { id: "salade", qty: 25 }, { id: "tomate", qty: 60 },
      { id: "skyr", qty: 40 }, { id: "emmental", qty: 20 }, { id: "epices", qty: 1 }, { id: "huile", qty: 3 },
    ],
    steps: [
      "Saisis le poulet en lanières avec les épices.",
      "Tartine les tortillas de skyr assaisonné.",
      "Garnis de poulet, salade, tomate et fromage. Roule serré.",
    ],
  },
  {
    slug: "quesadillas-haricots-rouges-fromage",
    title: "Quesadillas haricots rouges & fromage",
    meal: "main",
    description: "Croustillantes dehors, fondantes dedans. Le repas végétarien express que tout le monde adore.",
    time: 15, difficulty: 1,
    fit: { sain: 1, muscle: 2, equilibre: 2, gourmand: 3 },
    protein: "vegetal", cuisine: "tex-mex", image: IMG.plate2, emoji: "🫓",
    ingredients: [
      { id: "tortillas", qty: 2 }, { id: "haricots-rouges", qty: 80 }, { id: "mais", qty: 40 }, { id: "emmental", qty: 40 },
      { id: "poivron", qty: 0.3 }, { id: "salade", qty: 25 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Écrase grossièrement les haricots avec les épices.",
      "Garnis une tortilla de haricots, maïs, poivron et fromage. Recouvre d'une seconde tortilla.",
      "Dore 3 minutes par face à la poêle. Sers avec la salade.",
    ],
  },
  {
    slug: "cabillaud-papillote-riz-courgettes",
    title: "Cabillaud en papillote, riz & courgettes",
    meal: "main",
    description: "Léger, fondant et parfumé au citron : le poisson cuit dans son jus, sans odeur dans la cuisine.",
    time: 25, difficulty: 1,
    fit: { sain: 3, muscle: 3, equilibre: 3, gourmand: 1 },
    protein: "poisson", cuisine: "méditerranéenne", image: IMG.salmon2, emoji: "🐟",
    ingredients: [
      { id: "cabillaud", qty: 150 }, { id: "courgette", qty: 150 }, { id: "tomate", qty: 60 }, { id: "citron", qty: 0.25 },
      { id: "riz", qty: 65 }, { id: "huile", qty: 5 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Préchauffe le four à 200 °C. Cuis le riz.",
      "Dépose courgette, tomate et cabillaud sur du papier cuisson. Citron, huile, herbes.",
      "Ferme la papillote et enfourne 18 minutes.",
    ],
  },
  {
    slug: "shakshuka-feta",
    title: "Shakshuka à la feta",
    meal: "main",
    description: "Œufs pochés dans une sauce tomate-poivron épicée. Se sauce avec du bon pain.",
    time: 25, difficulty: 1,
    fit: { sain: 3, muscle: 2, equilibre: 3, gourmand: 2 },
    protein: "oeuf", cuisine: "méditerranéenne", image: IMG.shakshuka, emoji: "🍳",
    ingredients: [
      { id: "oeuf", qty: 2 }, { id: "tomates-concassees", qty: 200 }, { id: "poivron", qty: 0.5 }, { id: "oignon", qty: 50 },
      { id: "feta", qty: 30 }, { id: "pain-complet", qty: 60 }, { id: "epices", qty: 2 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Fais revenir oignon et poivron avec cumin et paprika.",
      "Ajoute les tomates, laisse réduire 10 minutes.",
      "Creuse des puits, casse les œufs, couvre 6 minutes. Émiette la feta et sers avec le pain.",
    ],
  },
  {
    slug: "gnocchi-poeles-pesto-tomates-mozza",
    title: "Gnocchi poêlés, pesto & mozzarella",
    meal: "main",
    description: "Gnocchi dorés à la poêle, pesto, tomates fondantes et mozzarella filante. 15 minutes, zéro vaisselle.",
    time: 15, difficulty: 1,
    fit: { sain: 1, muscle: 1, equilibre: 2, gourmand: 3 },
    protein: "laitier", cuisine: "italienne", image: IMG.pasta, emoji: "🥟",
    ingredients: [
      { id: "gnocchi", qty: 200 }, { id: "pesto", qty: 30 }, { id: "tomate", qty: 100 }, { id: "mozzarella", qty: 50 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Dore les gnocchi 6 minutes à la poêle dans l'huile.",
      "Ajoute les tomates en dés 2 minutes, puis le pesto.",
      "Parsème de mozzarella, couvre 1 minute et sers.",
    ],
  },
  {
    slug: "hachis-parmentier",
    title: "Hachis parmentier gratiné",
    meal: "main",
    description: "Purée maison onctueuse et viande mijotée : le gratin familial qui fait l'unanimité.",
    time: 50, difficulty: 2,
    fit: { sain: 1, muscle: 2, equilibre: 3, gourmand: 3 },
    protein: "boeuf", cuisine: "française", image: IMG.meat, emoji: "🥔", batchFriendly: true,
    ingredients: [
      { id: "pomme-de-terre", qty: 250 }, { id: "boeuf", qty: 110 }, { id: "lait", qty: 50 }, { id: "beurre", qty: 10 },
      { id: "emmental", qty: 20 }, { id: "oignon", qty: 40 }, { id: "tomates-concassees", qty: 50 },
    ],
    steps: [
      "Cuis les pommes de terre et écrase-les avec le lait et le beurre.",
      "Fais revenir oignon et bœuf, ajoute les tomates, mijote 10 minutes.",
      "Viande au fond du plat, purée par-dessus, emmental. Gratine 20 minutes à 200 °C.",
    ],
  },
  {
    slug: "escalope-dinde-puree-patate-douce-epinards",
    title: "Dinde, purée de patate douce & épinards",
    meal: "main",
    description: "Une assiette maigre et rassasiante, idéale en sèche comme en prise de muscle.",
    time: 25, difficulty: 1,
    fit: { sain: 3, muscle: 3, equilibre: 2, gourmand: 1 },
    protein: "volaille", cuisine: "française", image: IMG.plate, emoji: "🍠",
    ingredients: [
      { id: "dinde", qty: 150 }, { id: "patate-douce", qty: 220 }, { id: "epinards", qty: 120 }, { id: "lait", qty: 30 },
      { id: "ail", qty: 1 }, { id: "huile", qty: 5 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Cuis la patate douce à l'eau 15 minutes, écrase-la avec le lait.",
      "Fais revenir les épinards avec l'ail.",
      "Saisis l'escalope 3 minutes par face et dresse.",
    ],
  },
  {
    slug: "tortilla-espagnole-pommes-de-terre",
    title: "Tortilla espagnole & salade",
    meal: "main",
    description: "L'omelette épaisse aux pommes de terre fondantes. Délicieuse chaude ou froide le lendemain.",
    time: 35, difficulty: 2,
    fit: { sain: 2, muscle: 2, equilibre: 3, gourmand: 2 },
    protein: "oeuf", cuisine: "espagnole", image: IMG.plate3, emoji: "🥚", batchFriendly: true,
    ingredients: [
      { id: "oeuf", qty: 3 }, { id: "pomme-de-terre", qty: 200 }, { id: "oignon", qty: 50 }, { id: "salade", qty: 40 }, { id: "huile", qty: 12 },
    ],
    steps: [
      "Coupe pommes de terre et oignon en fines lamelles, fais-les confire 15 minutes dans l'huile.",
      "Mélange aux œufs battus et salés.",
      "Cuis 6 minutes à feu doux, retourne à l'aide d'une assiette, cuis encore 4 minutes.",
    ],
  },
  {
    slug: "couscous-poulet-legumes",
    title: "Couscous poulet & légumes",
    meal: "main",
    description: "Bouillon épicé, légumes fondants et graine légère : un voyage à petit prix.",
    time: 40, difficulty: 2,
    fit: { sain: 2, muscle: 3, equilibre: 3, gourmand: 2 },
    protein: "volaille", cuisine: "maghrébine", image: IMG.curry2, emoji: "🍲", batchFriendly: true,
    ingredients: [
      { id: "semoule", qty: 75 }, { id: "poulet", qty: 120 }, { id: "carotte", qty: 70 }, { id: "courgette", qty: 100 },
      { id: "pois-chiches", qty: 60 }, { id: "oignon", qty: 40 }, { id: "tomates-concassees", qty: 60 }, { id: "epices", qty: 3, note: "ras el hanout" },
      { id: "bouillon", qty: 0.5 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Fais dorer le poulet et l'oignon avec les épices.",
      "Ajoute carottes, tomates, bouillon et 400 ml d'eau : 15 minutes.",
      "Ajoute courgettes et pois chiches, 10 minutes encore.",
      "Fais gonfler la semoule et sers avec le bouillon.",
    ],
  },
  {
    slug: "risotto-champignons-parmesan",
    title: "Risotto crémeux aux champignons",
    meal: "main",
    description: "Riz nacré, champignons poêlés et parmesan : le confort à l'italienne.",
    time: 30, difficulty: 2,
    fit: { sain: 1, muscle: 1, equilibre: 2, gourmand: 3 },
    protein: "laitier", cuisine: "italienne", image: IMG.plate2, emoji: "🍄",
    ingredients: [
      { id: "arborio", qty: 80 }, { id: "champignons", qty: 130 }, { id: "oignon", qty: 40 }, { id: "parmesan", qty: 20 },
      { id: "beurre", qty: 10 }, { id: "bouillon", qty: 0.5 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Fais suer l'oignon, nacre le riz 2 minutes.",
      "Ajoute le bouillon chaud louche par louche pendant 18 minutes.",
      "Poêle les champignons à part. Hors du feu, ajoute beurre, parmesan et champignons.",
    ],
  },
  {
    slug: "pates-thon-tomate",
    title: "Pâtes au thon & à la tomate",
    meal: "main",
    description: "Le repas étudiant revisité : riche en protéines, prêt en 12 minutes, pour moins de 1,50 € la part.",
    time: 12, difficulty: 1,
    fit: { sain: 2, muscle: 3, equilibre: 3, gourmand: 2 },
    protein: "poisson", cuisine: "italienne", image: IMG.pasta, emoji: "🍝", batchFriendly: true,
    ingredients: [
      { id: "pates", qty: 100 }, { id: "thon", qty: 70 }, { id: "tomates-concassees", qty: 120 }, { id: "oignon", qty: 30 },
      { id: "ail", qty: 1 }, { id: "huile", qty: 5 }, { id: "epices", qty: 1 },
    ],
    steps: [
      "Cuis les pâtes.",
      "Fais revenir oignon et ail, ajoute tomates et herbes, 8 minutes.",
      "Ajoute le thon émietté, mélange aux pâtes.",
    ],
  },
  {
    slug: "veloute-legumes-tartines-fromage",
    title: "Soupe de légumes & tartines gratinées",
    meal: "main",
    description: "Une soupe maison veloutée et des tartines au fromage fondu : le dîner cocooning par excellence.",
    time: 30, difficulty: 1,
    fit: { sain: 3, muscle: 1, equilibre: 3, gourmand: 2 },
    protein: "laitier", cuisine: "française", image: IMG.soup, emoji: "🥕", batchFriendly: true,
    ingredients: [
      { id: "carotte", qty: 120 }, { id: "pomme-de-terre", qty: 120 }, { id: "courgette", qty: 120 }, { id: "oignon", qty: 40 },
      { id: "bouillon", qty: 0.5 }, { id: "pain-complet", qty: 60 }, { id: "emmental", qty: 25 },
    ],
    steps: [
      "Coupe les légumes, couvre d'eau avec le bouillon et cuis 20 minutes.",
      "Mixe jusqu'à texture veloutée.",
      "Gratine les tartines d'emmental 5 minutes au four.",
    ],
  },
  {
    slug: "salade-tiede-lentilles-feta-oeuf",
    title: "Salade tiède lentilles, feta & œuf",
    meal: "main",
    description: "Lentilles vertes tièdes, carottes, feta et œuf mollet : la salade-repas qui tient au corps.",
    time: 25, difficulty: 1,
    fit: { sain: 3, muscle: 3, equilibre: 3, gourmand: 1 },
    protein: "vegetal", cuisine: "française", image: IMG.salad2, emoji: "🥗", batchFriendly: true,
    ingredients: [
      { id: "lentilles-vertes", qty: 70 }, { id: "oeuf", qty: 1 }, { id: "feta", qty: 30 }, { id: "carotte", qty: 50 },
      { id: "salade", qty: 30 }, { id: "oignon", qty: 15 }, { id: "huile", qty: 8 },
    ],
    steps: [
      "Cuis les lentilles 20 minutes avec une carotte coupée en dés.",
      "Cuis l'œuf 6 minutes.",
      "Assaisonne les lentilles tièdes d'huile et d'oignon ciselé, ajoute salade, feta et œuf.",
    ],
  },
  {
    slug: "assiette-boeuf-riz-haricots-verts",
    title: "Bœuf haché, riz & haricots verts",
    meal: "main",
    description: "L'assiette de la prise de masse : simple, efficace, riche en protéines et en fer.",
    time: 20, difficulty: 1,
    fit: { sain: 2, muscle: 3, equilibre: 2, gourmand: 1 },
    protein: "boeuf", cuisine: "française", image: IMG.steak, emoji: "🥩",
    ingredients: [
      { id: "boeuf", qty: 150 }, { id: "riz", qty: 85 }, { id: "haricots-verts", qty: 150 }, { id: "huile", qty: 5 }, { id: "ail", qty: 1 },
    ],
    steps: [
      "Cuis le riz et les haricots verts.",
      "Façonne le steak et saisis-le 3 minutes par face.",
      "Poêle les haricots avec l'ail et dresse.",
    ],
  },
  {
    slug: "croque-monsieur-salade",
    title: "Croque-monsieur & salade",
    meal: "main",
    description: "Le bistrot à la maison : pain de mie doré, jambon et emmental fondant.",
    time: 15, difficulty: 1,
    fit: { sain: 0, muscle: 2, equilibre: 1, gourmand: 3 },
    protein: "porc", cuisine: "française", image: IMG.plate, emoji: "🥪",
    ingredients: [
      { id: "pain-de-mie", qty: 100 }, { id: "jambon", qty: 40 }, { id: "emmental", qty: 40 }, { id: "beurre", qty: 10 }, { id: "salade", qty: 40 },
    ],
    steps: [
      "Beurre l'extérieur des tranches, garnis de jambon et d'emmental.",
      "Dore 4 minutes par face à la poêle ou 10 minutes au four.",
      "Sers avec la salade.",
    ],
  },
  {
    slug: "mac-and-cheese",
    title: "Mac & cheese gratiné",
    meal: "main",
    description: "Pâtes nappées d'une béchamel au fromage, gratinées au four. Gourmandise absolue.",
    time: 30, difficulty: 2,
    fit: { sain: 0, muscle: 1, equilibre: 1, gourmand: 3 },
    protein: "laitier", cuisine: "américaine", image: IMG.pasta2, emoji: "🧀", batchFriendly: true,
    ingredients: [
      { id: "pates", qty: 100 }, { id: "lait", qty: 130 }, { id: "emmental", qty: 50 }, { id: "beurre", qty: 10 }, { id: "farine", qty: 10 },
    ],
    steps: [
      "Cuis les pâtes.",
      "Prépare une béchamel : beurre, farine puis lait, 5 minutes. Ajoute les 2/3 du fromage.",
      "Mélange, verse dans un plat, parsème le reste du fromage et gratine 10 minutes.",
    ],
  },
  {
    slug: "saumon-teriyaki-nouilles-sautees",
    title: "Saumon laqué & nouilles sautées",
    meal: "main",
    description: "Saumon caramélisé soja-miel sur des nouilles sautées aux légumes. Digne d'un restaurant.",
    time: 20, difficulty: 2,
    fit: { sain: 2, muscle: 3, equilibre: 3, gourmand: 3 },
    protein: "poisson", cuisine: "japonaise", image: IMG.salmon2, emoji: "🍣",
    ingredients: [
      { id: "saumon", qty: 125 }, { id: "nouilles", qty: 70 }, { id: "brocoli", qty: 100 }, { id: "carotte", qty: 40 },
      { id: "sauce-soja", qty: 15 }, { id: "miel", qty: 8 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Cuis les nouilles et le brocoli.",
      "Saisis le saumon côté peau 4 minutes, retourne, laque avec soja et miel 2 minutes.",
      "Saute nouilles et légumes, dresse avec le saumon.",
    ],
  },
  {
    slug: "curry-pois-chiches-epinards",
    title: "Curry de pois chiches aux épinards",
    meal: "main",
    description: "Un curry végétal onctueux au lait de coco, prêt en 20 minutes avec des produits du placard.",
    time: 20, difficulty: 1,
    fit: { sain: 3, muscle: 2, equilibre: 3, gourmand: 2 },
    protein: "vegetal", cuisine: "indienne", image: IMG.curry2, emoji: "🍛", batchFriendly: true,
    ingredients: [
      { id: "pois-chiches", qty: 130 }, { id: "epinards", qty: 100 }, { id: "lait-coco", qty: 70 }, { id: "tomates-concassees", qty: 100 },
      { id: "oignon", qty: 40 }, { id: "ail", qty: 1 }, { id: "epices", qty: 3 }, { id: "riz", qty: 60 }, { id: "huile", qty: 5 },
    ],
    steps: [
      "Fais revenir oignon, ail et épices.",
      "Ajoute tomates, lait de coco et pois chiches : 10 minutes.",
      "Incorpore les épinards 3 minutes. Sers avec le riz.",
    ],
  },
];

const FROM_EXTRA: Recipe[] = EXTRA.map(([slug, title, meal, description, time, difficulty, fit, protein, cuisine, img, emoji, ings, steps, batch]) => {
  const [sain, muscle, equilibre, gourmand] = fit.split("").map(Number) as Recipe["fit"][keyof Recipe["fit"]][];
  return {
    slug, title, description, time, difficulty, protein, cuisine, emoji, steps,
    meal: meal === "b" ? "breakfast" : "main",
    fit: { sain, muscle, equilibre, gourmand },
    image: IMG[img],
    batchFriendly: batch,
    ingredients: ings.split(" ").map((pair) => {
      const [id, qty] = pair.split(":");
      return { id, qty: Number(qty) };
    }),
  };
});

type Photo = { src: string; author: string; url: string };

/** Photos dédiées (récupérées par `npm run photos`) prioritaires sur les photos d'illustration. */
/**
 * Recettes dont la photo d'illustration représente vraiment ce plat (burger → burger, curry → curry…).
 * Pour toutes les autres, on préfère une vignette illustrée à une photo trompeuse,
 * jusqu'à ce qu'une photo dédiée soit ajoutée dans photos.json (`npm run photos`).
 */
const ILLUSTRATION_MATCHES = new Set([
  "porridge-banane-beurre-de-cacahuete", "porridge-vegan-fruits-rouges", "muesli-maison-lait",
  "skyr-bowl-fruits-rouges-amandes", "fromage-blanc-banane-flocons", "yaourt-soja-granola-pomme",
  "toast-oeufs-brouilles-jambon", "tartines-avocat-oeuf-mollet", "pancakes-banane-avoine", "pain-perdu-brioche-miel",
  "smoothie-bowl-banane-fruits-rouges",
  "poulet-curry-coco-riz-basmati", "poulet-tikka-masala", "curry-vert-crevettes", "curry-pois-chiches-epinards",
  "curry-patate-douce-pois-chiches", "buddha-bowl-pois-chiches-quinoa", "saumon-roti-patate-douce-haricots-verts",
  "saumon-teriyaki-nouilles-sautees", "cabillaud-papillote-riz-courgettes", "pates-thon-tomate", "one-pot-pasta-tomate-mozzarella",
  "pates-bolognaise-maison", "pates-carbonara", "burger-maison-potatoes", "pizza-maison-jambon-champignons",
  "pizza-margherita-legumes", "ramen-poulet-express", "wok-nouilles-crevettes-legumes", "riz-cantonais",
  "salade-cesar-poulet", "shakshuka-feta", "veloute-legumes-tartines-fromage", "minestrone",
  "soupe-poireaux-pommes-de-terre", "assiette-boeuf-riz-haricots-verts", "steak-frites-salade", "kebab-poulet-maison",
]);

export const RECIPES: Recipe[] = [...BASE, ...FROM_EXTRA].map((r) => {
  const photo = (PHOTOS as Record<string, Photo>)[r.slug];
  if (photo) return { ...r, image: photo.src, credit: { author: photo.author, url: photo.url } };
  return ILLUSTRATION_MATCHES.has(r.slug) ? r : { ...r, image: "" };
});

export const RECIPE_BY_SLUG: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.slug, r]));

/** Accepte un identifiant Unsplash ou une URL complète (ex. photo Pexels). */
export function unsplash(id: string, width = 1600) {
  if (!id) return "";
  if (id.startsWith("http")) return id;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}
