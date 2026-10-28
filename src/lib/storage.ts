"use client";

import { STORE_BY_ID, normalizeStoreId } from "./data/stores";
import type { Profile, WeekPlan } from "./types";

const PROFILE_KEY = "mijo:profile:v1";
const PLAN_KEY = "mijo:plan:v1";
const CHECKED_KEY = "mijo:checked:v1";

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible (navigation privée) : on reste en mémoire */
  }
}

export function loadProfile(): Profile | null {
  const p = read<Profile>(PROFILE_KEY);
  return p && { ...p, stores: p.stores.map(normalizeStoreId).filter((id) => STORE_BY_ID[id]) };
}
export const saveProfile = (p: Profile) => write(PROFILE_KEY, p);
/** Un plan enregistré avec une ancienne liste d'enseignes est ignoré : il sera régénéré. */
export function loadPlan(): WeekPlan | null {
  const plan = read<WeekPlan>(PLAN_KEY);
  if (!plan || !STORE_BY_ID[plan.storeId] || plan.quotes.some((q) => !STORE_BY_ID[q.storeId] || STORE_BY_ID[q.storeId].country !== (plan.country ?? "FR"))) return null;
  return plan;
}
export const savePlan = (p: WeekPlan) => write(PLAN_KEY, p);
export const loadChecked = (planId: string) => read<Record<string, string[]>>(CHECKED_KEY)?.[planId] ?? [];
export const saveChecked = (planId: string, ids: string[]) => write(CHECKED_KEY, { [planId]: ids });
