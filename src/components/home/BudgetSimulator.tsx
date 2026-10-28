"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { generatePlan } from "@/lib/engine/generator";
import { DEFAULT_PROFILE } from "@/lib/defaults";
import { RECIPE_BY_SLUG } from "@/lib/data/recipes";
import { STORE_BY_ID } from "@/lib/data/stores";
import type { Goal } from "@/lib/types";
import SmartImage from "../SmartImage";

const GOALS: { id: Goal; label: string }[] = [
  { id: "sain", label: "Healthy" },
  { id: "muscle", label: "Muscu" },
  { id: "equilibre", label: "Équilibré" },
  { id: "gourmand", label: "Gourmand" },
];

const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

/** Démo live : le vrai moteur Budgemy tourne dans le navigateur à chaque changement. */
export default function BudgetSimulator() {
  const [budget, setBudget] = useState(45);
  const [people, setPeople] = useState(1);
  const [goal, setGoal] = useState<Goal>("equilibre");

  const plan = useMemo(
    () => generatePlan({ ...DEFAULT_PROFILE, budget, adults: people, goal }, { seed: 7 }),
    [budget, people, goal],
  );
  const dinners = plan.meals.filter((m) => m.meal === "dinner").slice(0, 4);
  const meals = plan.meals.length * people;
  const perMeal = plan.total / Math.max(1, meals);
  const fits = plan.total <= budget;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="overflow-hidden rounded-[2.5rem] bg-ink text-cream">
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:p-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-saffron">Simulateur en direct</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Joue avec ton budget. <em className="text-saffron">On s&apos;adapte.</em>
            </h2>
            <p className="mt-4 text-cream/70">
              Ce n&apos;est pas une maquette : c&apos;est le vrai moteur Budgemy qui recompose une semaine (midi & soir) à chaque
              mouvement du curseur.
            </p>

            <div className="mt-10 space-y-8">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="sim-budget" className="text-sm text-cream/70">Budget hebdo</label>
                  <span className="font-display text-3xl">{euro(budget)}</span>
                </div>
                <input
                  id="sim-budget"
                  type="range"
                  min={20}
                  max={150}
                  step={5}
                  value={budget}
                  onChange={(e) => setBudget(+e.target.value)}
                  className="mt-3 w-full accent-tomato"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-cream/70">Adultes</span>
                <div className="flex items-center gap-3">
                  <button aria-label="Retirer une personne" onClick={() => setPeople((p) => Math.max(1, p - 1))} className="grid h-9 w-9 place-items-center rounded-full border border-cream/20 hover:bg-cream/10">
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-display text-2xl">{people}</span>
                  <button aria-label="Ajouter une personne" onClick={() => setPeople((p) => Math.min(6, p + 1))} className="grid h-9 w-9 place-items-center rounded-full border border-cream/20 hover:bg-cream/10">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${goal === g.id ? "bg-cream text-ink" : "border border-cream/20 text-cream/80 hover:bg-cream/10"}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-cream/[0.06] p-5 ring-1 ring-cream/10 sm:p-7">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Panier" value={euro(plan.total)} accent={fits ? "text-sage-light" : "text-saffron"} />
              <Stat label="Par repas" value={euro(perMeal)} />
              <Stat label="Enseigne" value={STORE_BY_ID[plan.storeId].name} />
            </div>
            <p className={`mt-3 text-sm ${fits ? "text-sage-light" : "text-saffron"}`}>
              {fits ? `✓ ${euro(budget - plan.total)} de marge sur ton budget` : `Budget serré : minimum réaliste ≈ ${euro(plan.total)}`}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {dinners.map((m, idx) => {
                  const r = RECIPE_BY_SLUG[m.slug];
                  return (
                    <motion.div
                      key={`${m.slug}-${idx}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                    >
                      <SmartImage photo={r.image} emoji={r.emoji} alt={r.title} fill sizes="(max-width: 1024px) 45vw, 22vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <p className="absolute bottom-2 left-3 right-3 text-sm font-semibold leading-tight">{r.title}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <Link href="/planifier" className="group mt-6 flex items-center justify-center gap-2 rounded-full bg-tomato py-3.5 font-semibold text-white transition hover:bg-tomato-dark">
              Personnaliser ma semaine <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, accent = "text-cream" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl bg-cream/[0.06] p-3">
      <p className="text-[11px] uppercase tracking-wider text-cream/50">{label}</p>
      <motion.p key={value} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`mt-1 truncate font-display text-xl ${accent}`}>
        {value}
      </motion.p>
    </div>
  );
}
