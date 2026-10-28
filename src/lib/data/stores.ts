import type { Aisle, Country, Store } from "../types";
import { ingredient } from "./ingredients";

export interface CountryInfo {
  id: Country;
  name: string;
  flag: string;
  currency: "EUR" | "CHF";
  /** niveau de prix alimentaire, exprimé dans la devise locale, pour un panier qui coûte 1 € en France */
  priceLevel: number;
  budget: { min: number; max: number; step: number; default: number };
}

/** Écarts de prix alimentaires entre pays : ordres de grandeur Eurostat / OFS, CHF converti au taux ≈ 0,94 CHF pour 1 €. */
export const COUNTRIES: CountryInfo[] = [
  { id: "FR", name: "France", flag: "🇫🇷", currency: "EUR", priceLevel: 1, budget: { min: 15, max: 250, step: 5, default: 45 } },
  { id: "BE", name: "Belgique", flag: "🇧🇪", currency: "EUR", priceLevel: 1.08, budget: { min: 15, max: 270, step: 5, default: 50 } },
  { id: "CH", name: "Suisse", flag: "🇨🇭", currency: "CHF", priceLevel: 1.46, budget: { min: 25, max: 400, step: 5, default: 70 } },
  { id: "DE", name: "Allemagne", flag: "🇩🇪", currency: "EUR", priceLevel: 0.97, budget: { min: 15, max: 250, step: 5, default: 45 } },
];
export const COUNTRY_BY_ID = Object.fromEntries(COUNTRIES.map((c) => [c.id, c])) as Record<Country, CountryInfo>;

/**
 * Enseignes alimentaires les plus fréquentées par pays.
 * `index` = niveau de prix de l'enseigne par rapport à un hyper de référence du pays ; `aisles` = écarts propres à un rayon.
 * `logo` = identifiant du logo dans `store-logos.ts` quand il est disponible.
 * Estimations calibrées sur les comparatifs publics de paniers, à remplacer par un flux de prix réel en production.
 */
export const STORES: Store[] = [
  // ───── France ─────
  { id: "aldi", country: "FR", name: "Aldi", kind: "discount", index: 0.86, color: "#00205b", tagline: "Hard-discount", logo: "aldinord" },
  { id: "lidl", country: "FR", name: "Lidl", kind: "discount", index: 0.87, color: "#0050aa", tagline: "Hard-discount", logo: "lidl" },
  { id: "netto", country: "FR", name: "Netto", kind: "discount", index: 0.89, color: "#ffd200", tagline: "Discount Les Mousquetaires" },
  { id: "leader-price", country: "FR", name: "Leader Price", kind: "discount", index: 0.9, color: "#e30613", tagline: "Discount", logo: "leaderprice" },
  { id: "leclerc", country: "FR", name: "E.Leclerc", kind: "hyper", index: 0.92, color: "#0066b3", tagline: "Hypermarché le moins cher", logo: "edotleclerc" },
  { id: "auchan", country: "FR", name: "Auchan", kind: "hyper", index: 0.95, color: "#e2001a", tagline: "Hypermarché", logo: "auchan" },
  { id: "hyper-u", country: "FR", name: "Hyper U", kind: "hyper", index: 0.95, color: "#e30613", tagline: "Hypermarché Coopérative U" },
  { id: "carrefour", country: "FR", name: "Carrefour", kind: "hyper", index: 1.0, color: "#004e9f", tagline: "Hypermarché", logo: "carrefour" },
  { id: "intermarche", country: "FR", name: "Intermarché", kind: "super", index: 0.96, color: "#e2231a", tagline: "Supermarché", logo: "intermarche" },
  { id: "super-u", country: "FR", name: "Super U", kind: "super", index: 0.98, color: "#e30613", tagline: "Supermarché" },
  { id: "carrefour-market", country: "FR", name: "Carrefour Market", kind: "super", index: 1.04, color: "#004e9f", tagline: "Supermarché", logo: "carrefour" },
  { id: "casino", country: "FR", name: "Casino", kind: "super", index: 1.12, color: "#c8102e", tagline: "Supermarché" },
  { id: "franprix", country: "FR", name: "Franprix", kind: "proxi", index: 1.22, color: "#ea5a0c", tagline: "Proximité", logo: "franprix" },
  { id: "monoprix", country: "FR", name: "Monoprix", kind: "proxi", index: 1.24, color: "#111111", tagline: "Centre-ville", logo: "monoprix" },
  {
    id: "grand-frais", country: "FR", name: "Grand Frais", kind: "special", index: 1.02, color: "#7ab929", tagline: "Spécialiste du frais", logo: "grandfrais",
    aisles: { "Fruits & légumes": 0.8, "Boucherie & volaille": 0.95, Poissonnerie: 0.95, "Crèmerie & frais": 0.98 },
  },
  {
    id: "biocoop", country: "FR", name: "Biocoop", kind: "special", index: 1.45, color: "#5c9e31", tagline: "100 % bio",
    aisles: { "Fruits & légumes": 1.35, "Épicerie salée": 1.4 },
  },

  // ───── Belgique ─────
  { id: "be-aldi", country: "BE", name: "Aldi", kind: "discount", index: 0.86, color: "#00205b", tagline: "Hard-discount", logo: "aldinord" },
  { id: "be-lidl", country: "BE", name: "Lidl", kind: "discount", index: 0.87, color: "#0050aa", tagline: "Hard-discount", logo: "lidl" },
  { id: "be-colruyt", country: "BE", name: "Colruyt", kind: "super", index: 0.9, color: "#e5530f", tagline: "Meilleurs prix" },
  { id: "be-cora", country: "BE", name: "Cora", kind: "hyper", index: 0.97, color: "#e61845", tagline: "Hypermarché", logo: "cora" },
  { id: "be-carrefour", country: "BE", name: "Carrefour", kind: "hyper", index: 1.0, color: "#004e9f", tagline: "Hypermarché", logo: "carrefour" },
  { id: "be-intermarche", country: "BE", name: "Intermarché", kind: "super", index: 0.98, color: "#e2231a", tagline: "Supermarché", logo: "intermarche" },
  { id: "be-albert-heijn", country: "BE", name: "Albert Heijn", kind: "super", index: 1.02, color: "#04ace6", tagline: "Supermarché", logo: "albertheijn" },
  { id: "be-carrefour-market", country: "BE", name: "Carrefour Market", kind: "super", index: 1.03, color: "#004e9f", tagline: "Supermarché", logo: "carrefour" },
  { id: "be-delhaize", country: "BE", name: "Delhaize", kind: "super", index: 1.06, color: "#d6001c", tagline: "Supermarché" },
  { id: "be-okay", country: "BE", name: "Okay", kind: "proxi", index: 0.95, color: "#e30613", tagline: "Proximité (Colruyt)" },
  { id: "be-spar", country: "BE", name: "Spar", kind: "proxi", index: 1.1, color: "#00843d", tagline: "Proximité" },

  // ───── Suisse ─────
  { id: "ch-aldi", country: "CH", name: "Aldi Suisse", kind: "discount", index: 0.84, color: "#00005f", tagline: "Hard-discount", logo: "aldisud" },
  { id: "ch-lidl", country: "CH", name: "Lidl", kind: "discount", index: 0.85, color: "#0050aa", tagline: "Hard-discount", logo: "lidl" },
  { id: "ch-denner", country: "CH", name: "Denner", kind: "discount", index: 0.88, color: "#e30613", tagline: "Discount" },
  { id: "ch-migros", country: "CH", name: "Migros", kind: "super", index: 1.0, color: "#ff6600", tagline: "Supermarché" },
  { id: "ch-coop", country: "CH", name: "Coop", kind: "super", index: 1.04, color: "#e2001a", tagline: "Supermarché" },
  { id: "ch-manor", country: "CH", name: "Manor Food", kind: "hyper", index: 1.12, color: "#c8102e", tagline: "Grand magasin" },
  { id: "ch-volg", country: "CH", name: "Volg", kind: "proxi", index: 1.1, color: "#d10019", tagline: "Proximité" },
  { id: "ch-spar", country: "CH", name: "Spar", kind: "proxi", index: 1.1, color: "#00843d", tagline: "Proximité" },

  // ───── Allemagne ─────
  { id: "de-aldi-nord", country: "DE", name: "Aldi Nord", kind: "discount", index: 0.82, color: "#2490d7", tagline: "Discounter", logo: "aldinord" },
  { id: "de-aldi-sued", country: "DE", name: "Aldi Süd", kind: "discount", index: 0.82, color: "#00005f", tagline: "Discounter", logo: "aldisud" },
  { id: "de-lidl", country: "DE", name: "Lidl", kind: "discount", index: 0.83, color: "#0050aa", tagline: "Discounter", logo: "lidl" },
  { id: "de-netto", country: "DE", name: "Netto", kind: "discount", index: 0.84, color: "#ffe500", tagline: "Marken-Discount", logo: "netto" },
  { id: "de-norma", country: "DE", name: "Norma", kind: "discount", index: 0.84, color: "#e30613", tagline: "Discounter" },
  { id: "de-penny", country: "DE", name: "Penny", kind: "discount", index: 0.85, color: "#cd1414", tagline: "Discounter", logo: "penny" },
  { id: "de-kaufland", country: "DE", name: "Kaufland", kind: "hyper", index: 0.9, color: "#e10915", tagline: "Hypermarché", logo: "kaufland" },
  { id: "de-globus", country: "DE", name: "Globus", kind: "hyper", index: 0.92, color: "#ca6201", tagline: "Hypermarché", logo: "globus" },
  { id: "de-rewe", country: "DE", name: "REWE", kind: "super", index: 1.0, color: "#cc071e", tagline: "Supermarché", logo: "rewe" },
  { id: "de-edeka", country: "DE", name: "EDEKA", kind: "super", index: 1.02, color: "#1b66b3", tagline: "Supermarché", logo: "edeka" },
];

export const STORE_KIND_LABEL: Record<Store["kind"], string> = {
  discount: "Hard-discount",
  hyper: "Hypermarchés",
  super: "Supermarchés",
  proxi: "Proximité",
  special: "Spécialistes",
};

export const STORE_BY_ID: Record<string, Store> = Object.fromEntries(STORES.map((s) => [s.id, s]));

export const storesOf = (country: Country = "FR") => STORES.filter((s) => s.country === country);

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

/** Prix d'un conditionnement dans une enseigne, en devise locale : niveau du pays × indice rayon × variation produit (±7 %). */
export function packPrice(ingredientId: string, storeId: string): number {
  const store = STORE_BY_ID[normalizeStoreId(storeId)] ?? STORE_BY_ID.carrefour;
  const ing = ingredient(ingredientId);
  const aisleIndex = store.aisles?.[ing.aisle as Aisle] ?? store.index;
  const jitter = 0.93 + hash(`${store.id}:${ingredientId}`) * 0.14;
  return Math.round(ing.price * COUNTRY_BY_ID[store.country].priceLevel * aisleIndex * jitter * 100) / 100;
}
