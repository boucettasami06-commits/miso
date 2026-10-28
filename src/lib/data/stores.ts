import type { Aisle, Store } from "../types";
import { ingredient } from "./ingredients";

/**
 * Enseignes alimentaires françaises les plus fréquentées.
 * `index` = niveau de prix moyen (base 1 = prix de référence des ingrédients, proche d'un hyper Carrefour).
 * `aisles` = écarts propres à certains rayons (ex. Grand Frais très compétitif sur le frais).
 * Estimations calibrées sur les comparatifs publics de paniers (type UFC-Que Choisir / Familles Rurales) :
 * ordres de grandeur réalistes, à remplacer par un flux de prix réel en production (voir README).
 */
export const STORES: Store[] = [
  // Hard-discount
  { id: "aldi", name: "Aldi", kind: "discount", index: 0.86, color: "#00205b", tagline: "Hard-discount" },
  { id: "lidl", name: "Lidl", kind: "discount", index: 0.87, color: "#0050aa", tagline: "Hard-discount" },
  { id: "netto", name: "Netto", kind: "discount", index: 0.89, color: "#ffd200", tagline: "Discount Les Mousquetaires" },
  { id: "leader-price", name: "Leader Price", kind: "discount", index: 0.9, color: "#e30613", tagline: "Discount" },
  // Hypermarchés
  { id: "leclerc", name: "E.Leclerc", kind: "hyper", index: 0.92, color: "#0066b3", tagline: "Hypermarché le moins cher" },
  { id: "auchan", name: "Auchan", kind: "hyper", index: 0.95, color: "#e2001a", tagline: "Hypermarché" },
  { id: "hyper-u", name: "Hyper U", kind: "hyper", index: 0.95, color: "#e30613", tagline: "Hypermarché Coopérative U" },
  { id: "carrefour", name: "Carrefour", kind: "hyper", index: 1.0, color: "#004e9f", tagline: "Hypermarché" },
  // Supermarchés
  { id: "intermarche", name: "Intermarché", kind: "super", index: 0.96, color: "#e2231a", tagline: "Supermarché" },
  { id: "super-u", name: "Super U", kind: "super", index: 0.98, color: "#e30613", tagline: "Supermarché" },
  { id: "carrefour-market", name: "Carrefour Market", kind: "super", index: 1.04, color: "#004e9f", tagline: "Supermarché" },
  { id: "casino", name: "Casino", kind: "super", index: 1.12, color: "#c8102e", tagline: "Supermarché" },
  // Proximité / centre-ville
  { id: "franprix", name: "Franprix", kind: "proxi", index: 1.22, color: "#ea5a0c", tagline: "Proximité" },
  { id: "monoprix", name: "Monoprix", kind: "proxi", index: 1.24, color: "#111111", tagline: "Centre-ville" },
  // Spécialistes
  {
    id: "grand-frais", name: "Grand Frais", kind: "special", index: 1.02, color: "#7ab929", tagline: "Spécialiste du frais",
    aisles: { "Fruits & légumes": 0.8, "Boucherie & volaille": 0.95, Poissonnerie: 0.95, "Crèmerie & frais": 0.98 },
  },
  {
    id: "biocoop", name: "Biocoop", kind: "special", index: 1.45, color: "#5c9e31", tagline: "100 % bio",
    aisles: { "Fruits & légumes": 1.35, "Épicerie salée": 1.4 },
  },
];

export const STORE_KIND_LABEL: Record<Store["kind"], string> = {
  discount: "Hard-discount",
  hyper: "Hypermarchés",
  super: "Supermarchés",
  proxi: "Proximité",
  special: "Spécialistes",
};

export const STORE_BY_ID: Record<string, Store> = Object.fromEntries(STORES.map((s) => [s.id, s]));

/** Anciens identifiants conservés pour les profils déjà enregistrés. */
const LEGACY: Record<string, string> = { superu: "super-u" };
export const normalizeStoreId = (id: string) => LEGACY[id] ?? id;

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/** Prix d'un conditionnement dans une enseigne : indice rayon + variation produit déterministe (±7 %). */
export function packPrice(ingredientId: string, storeId: string): number {
  const store = STORE_BY_ID[normalizeStoreId(storeId)] ?? STORE_BY_ID.carrefour;
  const ing = ingredient(ingredientId);
  const aisleIndex = store.aisles?.[ing.aisle as Aisle] ?? store.index;
  const jitter = 0.93 + hash(`${store.id}:${ingredientId}`) * 0.14;
  return Math.round(ing.price * aisleIndex * jitter * 100) / 100;
}
