import { DEFAULT_EQUIPMENT } from "./engine/equipment";
import type { Profile } from "./types";

export const DEFAULT_PROFILE: Profile = {
  goal: "equilibre",
  sex: "homme",
  age: 30,
  weight: 72,
  height: 175,
  activity: "leger",
  adults: 1,
  children: 0,
  meals: ["lunch", "dinner"],
  lunchMode: "leftovers",
  diet: "omnivore",
  restrictions: [],
  allergens: [],
  dislikes: [],
  budget: 45,
  stores: [],
  cookTime: "normal",
  hasPantry: true,
  country: "FR",
  equipment: DEFAULT_EQUIPMENT,
};
