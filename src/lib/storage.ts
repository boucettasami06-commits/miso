"use client";

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

export const loadProfile = () => read<Profile>(PROFILE_KEY);
export const saveProfile = (p: Profile) => write(PROFILE_KEY, p);
export const loadPlan = () => read<WeekPlan>(PLAN_KEY);
export const savePlan = (p: WeekPlan) => write(PLAN_KEY, p);
export const loadChecked = (planId: string) => read<Record<string, string[]>>(CHECKED_KEY)?.[planId] ?? [];
export const saveChecked = (planId: string, ids: string[]) => write(CHECKED_KEY, { [planId]: ids });
