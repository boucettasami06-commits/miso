import type { Ingredient } from "../types";

/**
 * Catalogue d'ingrédients. Prix de référence = prix moyen constaté en hypermarché
 * (base indice 100). Les écarts entre enseignes sont appliqués dans `stores.ts`.
 * Valeurs nutritionnelles : CIQUAL / Open Food Facts, arrondies.
 */
const list: Ingredient[] = [
  // Boucherie & volaille
  { id: "poulet", name: "Filets de poulet", aisle: "Boucherie & volaille", unit: "g", pack: 500, price: 6.2, macros: [121, 23, 0, 3], flags: ["meat"] },
  { id: "dinde", name: "Escalopes de dinde", aisle: "Boucherie & volaille", unit: "g", pack: 500, price: 5.4, macros: [109, 24, 0, 1.5], flags: ["meat"] },
  { id: "boeuf", name: "Bœuf haché 5 % MG", aisle: "Boucherie & volaille", unit: "g", pack: 500, price: 6.8, macros: [125, 21, 0, 5], flags: ["meat"] },
  { id: "lardons", name: "Lardons fumés", aisle: "Boucherie & volaille", unit: "g", pack: 200, price: 2.1, macros: [270, 15, 1, 23], flags: ["meat", "pork"] },
  { id: "jambon", name: "Jambon blanc", aisle: "Boucherie & volaille", unit: "g", pack: 160, packLabel: "4 tranches", price: 2.3, macros: [115, 20, 1, 3.5], flags: ["meat", "pork"] },

  // Poissonnerie
  { id: "saumon", name: "Pavés de saumon", aisle: "Poissonnerie", unit: "g", pack: 250, packLabel: "2 pavés", price: 5.9, macros: [200, 20, 0, 13], flags: ["fish"] },
  { id: "thon", name: "Thon au naturel", aisle: "Épicerie salée", unit: "g", pack: 140, packLabel: "boîte", price: 1.65, macros: [116, 26, 0, 1], flags: ["fish"] },

  // Surgelés
  { id: "cabillaud", name: "Dos de cabillaud", aisle: "Surgelés", unit: "g", pack: 400, price: 5.2, macros: [80, 18, 0, 0.7], flags: ["fish"] },
  { id: "crevettes", name: "Crevettes décortiquées", aisle: "Surgelés", unit: "g", pack: 300, price: 5.5, macros: [85, 19, 0, 1], flags: ["shellfish"] },
  { id: "epinards", name: "Épinards hachés", aisle: "Surgelés", unit: "g", pack: 1000, price: 2.2, macros: [23, 2.9, 3.6, 0.4] },
  { id: "haricots-verts", name: "Haricots verts extra-fins", aisle: "Surgelés", unit: "g", pack: 1000, price: 2.2, macros: [31, 1.8, 7, 0.1] },
  { id: "fruits-rouges", name: "Fruits rouges", aisle: "Surgelés", unit: "g", pack: 500, price: 3.4, macros: [45, 1, 10, 0.3] },

  // Crèmerie & frais
  { id: "oeuf", name: "Œufs plein air", aisle: "Crèmerie & frais", unit: "pc", pack: 12, packLabel: "boîte de 12", price: 3.7, macros: [75, 6.5, 0.4, 5.2], flags: ["egg"] },
  { id: "tofu", name: "Tofu nature", aisle: "Crèmerie & frais", unit: "g", pack: 400, price: 2.6, macros: [125, 13, 2, 7] },
  { id: "skyr", name: "Skyr nature", aisle: "Crèmerie & frais", unit: "g", pack: 500, price: 2.4, macros: [60, 10, 4, 0.2], flags: ["dairy"] },
  { id: "yaourt-soja", name: "Yaourt soja nature", aisle: "Crèmerie & frais", unit: "g", pack: 400, price: 1.8, macros: [50, 4, 2, 2.3] },
  { id: "lait", name: "Lait demi-écrémé", aisle: "Crèmerie & frais", unit: "ml", pack: 1000, packLabel: "1 L", price: 1.05, macros: [46, 3.2, 4.8, 1.6], flags: ["dairy"] },
  { id: "beurre", name: "Beurre doux", aisle: "Crèmerie & frais", unit: "g", pack: 250, price: 2.7, macros: [745, 0.7, 0.6, 82], flags: ["dairy"] },
  { id: "creme", name: "Crème fraîche épaisse", aisle: "Crèmerie & frais", unit: "g", pack: 200, price: 1.35, macros: [300, 2.4, 3, 30], flags: ["dairy"] },
  { id: "emmental", name: "Emmental râpé", aisle: "Crèmerie & frais", unit: "g", pack: 200, price: 2.1, macros: [380, 28, 0, 30], flags: ["dairy"] },
  { id: "mozzarella", name: "Mozzarella", aisle: "Crèmerie & frais", unit: "g", pack: 125, price: 0.99, macros: [250, 18, 1, 19], flags: ["dairy"] },
  { id: "feta", name: "Feta AOP", aisle: "Crèmerie & frais", unit: "g", pack: 200, price: 2.4, macros: [265, 15, 1, 22], flags: ["dairy"] },
  { id: "parmesan", name: "Parmigiano Reggiano", aisle: "Crèmerie & frais", unit: "g", pack: 100, price: 2.5, macros: [400, 33, 0, 29], flags: ["dairy"] },
  { id: "cheddar", name: "Cheddar en tranches", aisle: "Crèmerie & frais", unit: "g", pack: 200, price: 2.1, macros: [400, 24, 1, 33], flags: ["dairy"] },
  { id: "reblochon", name: "Reblochon", aisle: "Crèmerie & frais", unit: "g", pack: 450, price: 5.2, macros: [330, 20, 0, 28], flags: ["dairy"] },
  { id: "gnocchi", name: "Gnocchi frais", aisle: "Crèmerie & frais", unit: "g", pack: 500, price: 1.65, macros: [150, 4, 32, 0.5], flags: ["gluten"] },
  { id: "pate-pizza", name: "Pâte à pizza", aisle: "Crèmerie & frais", unit: "pc", pack: 1, packLabel: "rouleau", price: 1.45, macros: [850, 22, 150, 18], flags: ["gluten"] },
  { id: "pesto", name: "Pesto alla genovese", aisle: "Épicerie salée", unit: "g", pack: 190, packLabel: "pot", price: 2.2, macros: [480, 5, 6, 48], flags: ["dairy", "nuts"] },

  // Épicerie salée
  { id: "riz", name: "Riz basmati", aisle: "Épicerie salée", unit: "g", pack: 1000, price: 2.4, macros: [355, 8, 78, 1] },
  { id: "arborio", name: "Riz arborio", aisle: "Épicerie salée", unit: "g", pack: 1000, price: 2.9, macros: [350, 7, 79, 0.6] },
  { id: "pates", name: "Pâtes (penne, spaghetti)", aisle: "Épicerie salée", unit: "g", pack: 500, price: 0.95, macros: [355, 12, 71, 1.5], flags: ["gluten"] },
  { id: "nouilles", name: "Nouilles de blé", aisle: "Épicerie salée", unit: "g", pack: 250, price: 1.5, macros: [360, 11, 73, 2], flags: ["gluten"] },
  { id: "quinoa", name: "Quinoa", aisle: "Épicerie salée", unit: "g", pack: 500, price: 3.1, macros: [360, 14, 64, 6] },
  { id: "semoule", name: "Semoule moyenne", aisle: "Épicerie salée", unit: "g", pack: 1000, price: 1.5, macros: [355, 12, 72, 1.5], flags: ["gluten"] },
  { id: "lentilles-corail", name: "Lentilles corail", aisle: "Épicerie salée", unit: "g", pack: 500, price: 1.95, macros: [340, 24, 52, 2] },
  { id: "lentilles-vertes", name: "Lentilles vertes", aisle: "Épicerie salée", unit: "g", pack: 500, price: 1.85, macros: [330, 24, 50, 1.5] },
  { id: "pois-chiches", name: "Pois chiches (égouttés)", aisle: "Épicerie salée", unit: "g", pack: 265, packLabel: "boîte", price: 0.95, macros: [130, 7, 15, 2.5] },
  { id: "haricots-rouges", name: "Haricots rouges (égouttés)", aisle: "Épicerie salée", unit: "g", pack: 250, packLabel: "boîte", price: 0.95, macros: [110, 8, 14, 0.5] },
  { id: "mais", name: "Maïs doux", aisle: "Épicerie salée", unit: "g", pack: 285, packLabel: "boîte", price: 1.1, macros: [80, 2.5, 15, 1] },
  { id: "tomates-concassees", name: "Tomates concassées", aisle: "Épicerie salée", unit: "g", pack: 400, packLabel: "boîte", price: 0.89, macros: [24, 1.2, 3.5, 0.2] },
  { id: "lait-coco", name: "Lait de coco", aisle: "Épicerie salée", unit: "ml", pack: 400, packLabel: "boîte", price: 1.65, macros: [180, 1.6, 3, 18] },

  // Épicerie sucrée
  { id: "avoine", name: "Flocons d'avoine", aisle: "Épicerie sucrée", unit: "g", pack: 500, price: 1.2, macros: [370, 13, 59, 7], flags: ["gluten"] },
  { id: "farine", name: "Farine de blé T55", aisle: "Épicerie sucrée", unit: "g", pack: 1000, price: 0.95, macros: [350, 10, 73, 1.2], flags: ["gluten"] },
  { id: "boisson-avoine", name: "Boisson à l'avoine", aisle: "Épicerie sucrée", unit: "ml", pack: 1000, packLabel: "1 L", price: 1.7, macros: [45, 0.6, 7, 1.5], flags: ["gluten"] },
  { id: "amandes", name: "Amandes", aisle: "Épicerie sucrée", unit: "g", pack: 200, price: 2.9, macros: [600, 21, 9, 52], flags: ["nuts"] },
  { id: "beurre-cacahuete", name: "Beurre de cacahuète", aisle: "Épicerie sucrée", unit: "g", pack: 350, packLabel: "pot", price: 2.9, macros: [600, 25, 16, 50], flags: ["peanut"] },
  { id: "chocolat", name: "Chocolat noir 70 %", aisle: "Épicerie sucrée", unit: "g", pack: 100, packLabel: "tablette", price: 1.35, macros: [580, 9, 33, 43] },
  { id: "chia", name: "Graines de chia", aisle: "Épicerie sucrée", unit: "g", pack: 200, price: 2.9, macros: [490, 17, 42, 31] },

  // Boulangerie
  { id: "pain-complet", name: "Pain complet tranché", aisle: "Boulangerie", unit: "g", pack: 500, price: 1.9, macros: [240, 9, 41, 3.5], flags: ["gluten"] },
  { id: "pain-de-mie", name: "Pain de mie", aisle: "Boulangerie", unit: "g", pack: 500, price: 1.6, macros: [270, 8.5, 49, 4.5], flags: ["gluten"] },
  { id: "tortillas", name: "Tortillas de blé", aisle: "Boulangerie", unit: "pc", pack: 8, packLabel: "paquet de 8", price: 1.85, macros: [150, 4, 25, 3.5], flags: ["gluten"] },
  { id: "pain-burger", name: "Pains à burger", aisle: "Boulangerie", unit: "pc", pack: 4, packLabel: "paquet de 4", price: 1.6, macros: [210, 7, 38, 3.5], flags: ["gluten"] },

  // Fruits & légumes
  { id: "pomme-de-terre", name: "Pommes de terre", aisle: "Fruits & légumes", unit: "g", pack: 2500, packLabel: "filet 2,5 kg", price: 3.2, macros: [80, 2, 17, 0.1] },
  { id: "patate-douce", name: "Patates douces", aisle: "Fruits & légumes", unit: "g", pack: 1000, price: 2.9, macros: [86, 1.6, 20, 0.1] },
  { id: "oignon", name: "Oignons jaunes", aisle: "Fruits & légumes", unit: "g", pack: 1000, packLabel: "filet 1 kg", price: 1.7, macros: [40, 1.1, 9, 0.1] },
  { id: "ail", name: "Ail", aisle: "Fruits & légumes", unit: "pc", pack: 20, packLabel: "2 têtes", price: 1.3, macros: [4, 0.2, 1, 0] },
  { id: "tomate", name: "Tomates", aisle: "Fruits & légumes", unit: "g", pack: 1000, price: 2.9, macros: [18, 0.9, 3.9, 0.2] },
  { id: "courgette", name: "Courgettes", aisle: "Fruits & légumes", unit: "g", pack: 1000, price: 2.4, macros: [17, 1.2, 3, 0.3] },
  { id: "poivron", name: "Poivrons tricolores", aisle: "Fruits & légumes", unit: "pc", pack: 3, packLabel: "lot de 3", price: 2.4, macros: [30, 1.2, 6, 0.3] },
  { id: "brocoli", name: "Brocoli", aisle: "Fruits & légumes", unit: "g", pack: 500, price: 1.99, macros: [34, 2.8, 7, 0.4] },
  { id: "carotte", name: "Carottes", aisle: "Fruits & légumes", unit: "g", pack: 1000, price: 1.3, macros: [41, 0.9, 10, 0.2] },
  { id: "champignons", name: "Champignons de Paris", aisle: "Fruits & légumes", unit: "g", pack: 500, price: 2.3, macros: [22, 3.1, 3.3, 0.3] },
  { id: "salade", name: "Jeunes pousses", aisle: "Fruits & légumes", unit: "g", pack: 150, packLabel: "sachet", price: 1.5, macros: [15, 1.4, 2.9, 0.2] },
  { id: "concombre", name: "Concombre", aisle: "Fruits & légumes", unit: "pc", pack: 1, price: 0.89, macros: [45, 2, 10, 0.3] },
  { id: "avocat", name: "Avocats", aisle: "Fruits & légumes", unit: "pc", pack: 2, packLabel: "lot de 2", price: 2.2, macros: [240, 3, 12, 22] },
  { id: "citron", name: "Citrons jaunes", aisle: "Fruits & légumes", unit: "pc", pack: 4, packLabel: "filet de 4", price: 1.6, macros: [17, 0.6, 5, 0.2] },
  { id: "banane", name: "Bananes", aisle: "Fruits & légumes", unit: "pc", pack: 6, packLabel: "régime de 6", price: 1.9, macros: [105, 1.3, 27, 0.4] },
  { id: "pomme", name: "Pommes", aisle: "Fruits & légumes", unit: "pc", pack: 6, packLabel: "sachet de 6", price: 2.4, macros: [95, 0.5, 25, 0.3] },

  // Placard
  { id: "huile", name: "Huile d'olive", aisle: "Placard", unit: "ml", pack: 1000, packLabel: "1 L", price: 8.9, macros: [900, 0, 0, 100], pantry: true },
  { id: "sauce-soja", name: "Sauce soja", aisle: "Placard", unit: "ml", pack: 250, price: 1.9, macros: [60, 8, 6, 0], flags: ["gluten"], pantry: true },
  { id: "miel", name: "Miel", aisle: "Placard", unit: "g", pack: 250, price: 3.1, macros: [320, 0.3, 82, 0], flags: ["honey"], pantry: true },
  { id: "sucre", name: "Sucre", aisle: "Placard", unit: "g", pack: 1000, price: 1.1, macros: [400, 0, 100, 0], pantry: true },
  { id: "epices", name: "Épices & herbes", aisle: "Placard", unit: "g", pack: 50, packLabel: "pot", price: 1.9, macros: [300, 12, 50, 8], pantry: true },
  { id: "bouillon", name: "Bouillon de légumes", aisle: "Placard", unit: "pc", pack: 10, packLabel: "boîte de 10", price: 1.2, macros: [10, 0.5, 1, 0.5], pantry: true },
];

export const INGREDIENTS: Record<string, Ingredient> = Object.fromEntries(list.map((i) => [i.id, i]));

export function ingredient(id: string): Ingredient {
  const found = INGREDIENTS[id];
  if (!found) throw new Error(`Ingrédient inconnu : ${id}`);
  return found;
}
