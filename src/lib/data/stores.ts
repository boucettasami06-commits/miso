import type { Store } from "../types";
import { ingredient } from "./ingredients";

/**
 * Indice prix moyen par enseigne (base 100 = prix de référence des ingrédients).
 * Calibré sur les comparatifs publics de paniers. À remplacer par un flux de prix
 * réel (partenariats drive / relevés) en production — voir README.
 */
export const STORES: Store[] = [
  { id: "aldi", name: "Aldi", index: 0.86, color: "#1d4f91", tagline: "Hard-discount" },
  { id: "lidl", name: "Lidl", index: 0.87, color: "#0050aa", tagline: "Hard-discount" },
  { id: "leclerc", name: "E.Leclerc", index: 0.92, color: "#0066b3", tagline: "Le moins cher des hypers" },
  { id: "auchan", name: "Auchan", index: 0.94, color: "#e2001a", tagline: "Hypermarché" },
  { id: "superu", name: "Super U", index: 0.95, color: "#e30613", tagline: "Supermarché" },
  { id: "intermarche", name: "Intermarché", index: 0.97, color: "#e2231a", tagline: "Supermarché" },
  { id: "carrefour", name: "Carrefour", index: 1.0, color: "#004e9f", tagline: "Hypermarché" },
  { id: "monoprix", name: "Monoprix", index: 1.24, color: "#111111", tagline: "Centre-ville" },
];

export const STORE_BY_ID: Record<string, Store> = Object.fromEntries(STORES.map((s) => [s.id, s]));

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/** Prix d'un conditionnement dans une enseigne : indice + variation produit déterministe (±7 %). */
export function packPrice(ingredientId: string, storeId: string): number {
  const store = STORE_BY_ID[storeId] ?? STORE_BY_ID.carrefour;
  const jitter = 0.93 + hash(`${storeId}:${ingredientId}`) * 0.14;
  return Math.round(ingredient(ingredientId).price * store.index * jitter * 100) / 100;
}
