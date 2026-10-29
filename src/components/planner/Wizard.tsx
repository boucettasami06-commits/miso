"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Coffee, Moon, Sun } from "lucide-react";
import { DEFAULT_PROFILE } from "@/lib/defaults";
import { generatePlan } from "@/lib/engine/generator";
import { COUNTRIES, COUNTRY_BY_ID, storesOf } from "@/lib/data/stores";
import { DEFAULT_EQUIPMENT, EQUIPMENT } from "@/lib/engine/equipment";
import { money } from "@/lib/format";
import { loadProfile, savePlan, saveProfile } from "@/lib/storage";
import type { Allergen, CookTime, Country, Diet, MealType, Profile, Restriction } from "@/lib/types";
import StoreLogo from "../StoreLogo";

interface Style {
  id: string;
  title: string;
  text: string;
  emoji: string;
  bg: string;
  apply: Partial<Profile>;
}

/** Styles proposés : chacun règle l'objectif nutritionnel et, si besoin, le régime, le temps ou la priorité prix. */
const STYLES: Style[] = [
  { id: "classique", title: "Classique", text: "Je mange de tout, simplement", emoji: "🍽️", bg: "bg-cream-2", apply: { goal: "equilibre" } },
  { id: "eco", title: "Le moins cher possible", text: "Chaque euro compte", emoji: "💰", bg: "bg-saffron/30", apply: { goal: "equilibre", priority: "eco" } },
  { id: "rapide", title: "Vite fait", text: "Prêt en 20 minutes", emoji: "⚡", bg: "bg-sage-light", apply: { goal: "equilibre", cookTime: "express" } },
  { id: "famille", title: "Familial", text: "Des plats que les enfants adorent", emoji: "👨‍👩‍👧", bg: "bg-tomato/15", apply: { goal: "gourmand" } },
  { id: "gourmand", title: "Gourmand", text: "Comfort food maison", emoji: "🍔", bg: "bg-tomato/15", apply: { goal: "gourmand" } },
  { id: "sain", title: "Healthy", text: "Léger, plein de légumes", emoji: "🥗", bg: "bg-sage-light", apply: { goal: "sain" } },
  { id: "muscle", title: "Sportif", text: "Riche en protéines", emoji: "💪", bg: "bg-saffron/30", apply: { goal: "muscle" } },
  { id: "veggie", title: "Végétarien", text: "Sans viande ni poisson", emoji: "🌱", bg: "bg-sage-light", apply: { goal: "equilibre", diet: "vegetarien" } },
];

/** Applique un style en annulant les effets du style précédent (priorité prix, temps express, régime végétarien). */
function applyStyle(p: Profile, st: Style): Profile {
  const prev = STYLES.find((x) => x.id === p.style);
  const next: Profile = { ...p, priority: undefined, style: st.id };
  if (prev?.apply.cookTime && !st.apply.cookTime) next.cookTime = "normal";
  if (prev?.apply.diet && !st.apply.diet) next.diet = "omnivore";
  return { ...next, ...st.apply };
}

const MEALS: { id: MealType; label: string; icon: typeof Sun }[] = [
  { id: "breakfast", label: "Petit-déjeuner", icon: Coffee },
  { id: "lunch", label: "Déjeuner", icon: Sun },
  { id: "dinner", label: "Dîner", icon: Moon },
];
const DIETS: { id: Diet; label: string }[] = [
  { id: "omnivore", label: "Je mange de tout" },
  { id: "flexitarien", label: "Flexitarien" },
  { id: "pescetarien", label: "Pescétarien" },
  { id: "vegetarien", label: "Végétarien" },
  { id: "vegan", label: "Vegan" },
];
const RESTRICTIONS: { id: Restriction; label: string }[] = [
  { id: "sans-porc", label: "Sans porc" },
  { id: "sans-gluten", label: "Sans gluten" },
  { id: "sans-lactose", label: "Sans lactose" },
];
const ALLERGENS: { id: Allergen; label: string }[] = [
  { id: "egg", label: "Œufs" },
  { id: "peanut", label: "Arachides" },
  { id: "nuts", label: "Fruits à coque" },
  { id: "fish", label: "Poisson" },
  { id: "shellfish", label: "Crustacés" },
];
const DISLIKES = [
  ["champignons", "Champignons"], ["poivron", "Poivron"], ["courgette", "Courgette"], ["brocoli", "Brocoli"], ["epinards", "Épinards"],
  ["tofu", "Tofu"], ["avocat", "Avocat"], ["lait-coco", "Lait de coco"], ["saumon", "Saumon"], ["feta", "Feta"],
] as const;
const COOK: { id: CookTime; label: string; hint: string; emoji: string }[] = [
  { id: "express", label: "Express", hint: "≤ 20 min en semaine", emoji: "⚡" },
  { id: "normal", label: "Normal", hint: "≤ 40 min", emoji: "🍳" },
  { id: "chef", label: "J'adore cuisiner", hint: "Pas de limite", emoji: "👨‍🍳" },
];

const STEPS = ["Pays & magasins", "Style", "Foyer", "Équipement", "Repas", "Régime", "Budget"];

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function Wizard() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [p, setP] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = loadProfile();
    const wanted = STYLES.find((x) => x.id === params.get("objectif"));
    const base = saved ? { ...DEFAULT_PROFILE, ...saved } : DEFAULT_PROFILE;
    setP(wanted ? applyStyle(base, wanted) : base);
  }, [params]);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((x) => ({ ...x, [k]: v }));
  const minBudget = useMemo(() => (step === 6 ? generatePlan({ ...p, budget: 1 }, { seed: 1 }).total : 0), [p, step]);
  const canNext = step !== 4 || p.meals.length > 0;
  const people = p.adults + p.children;
  const country = COUNTRY_BY_ID[p.country ?? "FR"];
  const stores = storesOf(country.id);
  const euro = (n: number) => money(n, country.currency, 0);
  const equipment = p.equipment ?? DEFAULT_EQUIPMENT;
  const setCountry = (c: Country) =>
    setP((x) => (x.country === c ? x : { ...x, country: c, stores: [], budget: COUNTRY_BY_ID[c].budget.default }));

  const go = (d: number) => {
    setDir(d);
    setStep((s) => Math.min(STEPS.length - 1, Math.max(0, s + d)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finish = () => {
    setLoading(true);
    saveProfile(p);
    const plan = generatePlan(p);
    savePlan(plan);
    setTimeout(() => router.push("/ma-semaine"), 1900);
  };

  if (loading) return <Cooking />;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      {/* Progression */}
      <div className="flex items-center gap-2" aria-label={`Étape ${step + 1} sur ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <div key={s} className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-2">
            <motion.div className="h-full bg-tomato" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-ink-soft">
        Étape {step + 1}/{STEPS.length} · {STEPS[step]}
      </p>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          initial={{ opacity: 0, x: dir * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -60 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          {step === 0 && (
            <>
              <H>Où fais-tu tes courses ?</H>
              <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Pays">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.id}
                    role="radio"
                    aria-checked={country.id === c.id}
                    onClick={() => setCountry(c.id)}
                    className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-semibold transition ${country.id === c.id ? "border-tomato bg-tomato/5" : "border-line bg-white/60 hover:border-ink/30"}`}
                  >
                    <span className="text-2xl">{c.flag}</span>
                    {c.name}
                  </button>
                ))}
              </div>
              <p className="mt-8 text-ink-soft">Choisis tes magasins (un ou plusieurs) :</p>
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {stores.map((s) => {
                  const on = p.stores.includes(s.id);
                  return (
                    <motion.button
                      key={s.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => set("stores", toggle(p.stores, s.id))}
                      aria-pressed={on}
                      aria-label={s.name}
                      title={s.name}
                      className={`relative grid aspect-[4/3] place-items-center rounded-2xl border-2 bg-white p-3 transition ${on ? "border-tomato shadow-lg" : "border-line hover:border-ink/30"}`}
                    >
                      <StoreLogo store={s} size={44} logoOnly />
                      {on && (
                        <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-tomato text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <button
                onClick={() => set("stores", [])}
                className={`mt-4 w-full rounded-2xl border-2 p-4 text-left transition ${p.stores.length === 0 ? "border-tomato bg-tomato/5" : "border-line bg-white/60 hover:border-ink/30"}`}
              >
                <span className="font-semibold">🔎 Peu importe, compare les {stores.length} enseignes</span>
                <span className="block text-sm text-ink-soft">On te dira où ton panier coûte le moins cher.</span>
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <H>Tu veux manger comment ?</H>
              <p className="mt-3 text-ink-soft">Pas de prise de tête : choisis ce qui te ressemble le plus.</p>
              <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                {STYLES.map((st) => {
                  const on = (p.style ?? "classique") === st.id;
                  return (
                    <motion.button
                      key={st.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setP((x) => applyStyle(x, st))}
                      aria-pressed={on}
                      className={`relative rounded-[1.5rem] p-5 text-left ring-2 transition ${st.bg} ${on ? "ring-tomato" : "ring-transparent hover:ring-line"}`}
                    >
                      <span className="text-4xl">{st.emoji}</span>
                      <p className="mt-3 font-display text-lg font-bold leading-tight">{st.title}</p>
                      <p className="mt-1 text-xs text-ink-soft">{st.text}</p>
                      {on && (
                        <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-tomato text-white">
                          <Check size={14} />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <H>Vous êtes combien à table ?</H>
              <p className="mt-3 text-ink-soft">On ajuste les quantités : un enfant compte pour un peu plus d&apos;une demi-portion.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-line bg-white/60 p-6">
                  <p className="text-4xl">🧑</p>
                  <p className="mt-3 font-display text-xl font-bold">Adultes & ados</p>
                  <div className="mt-4"><Stepper value={p.adults} min={1} max={10} onChange={(v) => set("adults", v)} /></div>
                </div>
                <div className="rounded-[1.75rem] border border-line bg-white/60 p-6">
                  <p className="text-4xl">🧒</p>
                  <p className="mt-3 font-display text-xl font-bold">Enfants (moins de 12 ans)</p>
                  <div className="mt-4"><Stepper value={p.children} min={0} max={10} onChange={(v) => set("children", v)} /></div>
                </div>
              </div>
              <motion.p key={people} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center font-display text-2xl" aria-live="polite">
                {"🍽️".repeat(Math.min(people, 10))} <span className="text-tomato">{people}</span> personne{people > 1 ? "s" : ""} au foyer
              </motion.p>
            </>
          )}

          {step === 3 && (
            <>
              <H>Ton équipement de cuisine</H>
              <p className="mt-3 text-ink-soft">On ne te proposera que des recettes faisables chez toi, avec des astuces pour ton air fryer ou ton robot.</p>
              {(["Cuisson", "Appareils", "Pâtisserie"] as const).map((group) => (
                <Field key={group} label={group} className="mt-8">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {EQUIPMENT.filter((e) => e.group === group).map((e) => (
                      <Chip key={e.id} active={equipment.includes(e.id)} onClick={() => set("equipment", toggle(equipment, e.id))}>
                        <span className="flex items-center gap-2 font-semibold">
                          <span className="text-xl">{e.emoji}</span>
                          {e.label}
                        </span>
                      </Chip>
                    ))}
                  </div>
                </Field>
              ))}
            </>
          )}

          {step === 4 && (
            <>
              <H>Quels repas on prépare ?</H>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {MEALS.map((m) => {
                  const on = p.meals.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => set("meals", toggle(p.meals, m.id))}
                      className={`flex items-center gap-4 rounded-3xl border-2 p-5 text-left transition ${on ? "border-tomato bg-tomato/5" : "border-line bg-white/60 hover:border-ink/30"}`}
                    >
                      <span className={`grid h-12 w-12 place-items-center rounded-2xl ${on ? "bg-tomato text-white" : "bg-cream-2"}`}>
                        <m.icon size={22} />
                      </span>
                      <span className="font-display text-xl">{m.label}</span>
                    </button>
                  );
                })}
              </div>
              {p.meals.includes("lunch") && p.meals.includes("dinner") && (
                <Field label="Le midi, tu préfères…" className="mt-8">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Chip active={p.lunchMode === "leftovers"} onClick={() => set("lunchMode", "leftovers")}>
                      <span className="block font-semibold">♻️ Les restes du dîner</span>
                      <span className="block text-xs opacity-70">On cuisine en double le soir. Économique & rapide.</span>
                    </Chip>
                    <Chip active={p.lunchMode === "fresh"} onClick={() => set("lunchMode", "fresh")}>
                      <span className="block font-semibold">✨ Un plat différent</span>
                      <span className="block text-xs opacity-70">Plus de variété, un peu plus de cuisine.</span>
                    </Chip>
                  </div>
                </Field>
              )}
              {!p.meals.length && <p className="mt-4 text-sm text-tomato">Choisis au moins un repas.</p>}
              <Field label="Combien de temps en cuisine ? (le week-end, on s'autorise un peu plus)" className="mt-10">
              <div className="grid gap-3 sm:grid-cols-3">
                {COOK.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => set("cookTime", c.id)}
                    className={`rounded-[1.75rem] border-2 p-5 text-left transition ${p.cookTime === c.id ? "border-tomato bg-tomato/5" : "border-line bg-white/60 hover:border-ink/30"}`}
                  >
                    <span className="text-3xl">{c.emoji}</span>
                    <p className="mt-2 font-display text-xl">{c.label}</p>
                    <p className="text-sm text-ink-soft">{c.hint}</p>
                  </button>
                ))}
              </div>
              </Field>
            </>
          )}

          {step === 5 && (
            <>
              <H>Ton régime alimentaire</H>
              <div className="mt-8 flex flex-wrap gap-2">
                {DIETS.map((d) => (
                  <Pill key={d.id} active={p.diet === d.id} onClick={() => set("diet", d.id)}>{d.label}</Pill>
                ))}
              </div>
              <Field label="Restrictions" className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {RESTRICTIONS.map((r) => (
                    <Pill key={r.id} active={p.restrictions.includes(r.id)} onClick={() => set("restrictions", toggle(p.restrictions, r.id))}>{r.label}</Pill>
                  ))}
                </div>
              </Field>
              <Field label="Allergies" className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {ALLERGENS.map((a) => (
                    <Pill key={a.id} active={p.allergens.includes(a.id)} onClick={() => set("allergens", toggle(p.allergens, a.id))}>{a.label}</Pill>
                  ))}
                </div>
              </Field>
              <Field label="Je n'aime pas…" className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {DISLIKES.map(([id, label]) => (
                    <Pill key={id} active={p.dislikes.includes(id)} onClick={() => set("dislikes", toggle(p.dislikes, id))} tone="dark">{label}</Pill>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 6 && (
            <>
              <H>Ton budget courses par semaine</H>
              <div className="mt-8 rounded-[2rem] border border-line bg-white/60 p-6 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="text-ink-soft">Pour {people} personne{people > 1 ? "s" : ""}</span>
                  <motion.span key={p.budget} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="font-display text-5xl text-tomato">
                    {euro(p.budget)}
                  </motion.span>
                </div>
                <input type="range" min={country.budget.min} max={country.budget.max} step={country.budget.step} value={p.budget} onChange={(e) => set("budget", +e.target.value)} className="mt-5 w-full accent-tomato" aria-label="Budget hebdomadaire" />
                <p className={`mt-4 text-sm ${p.budget >= minBudget ? "text-sage" : "text-tomato"}`}>
                  {p.budget >= minBudget
                    ? `✓ Budget réaliste pour ton foyer (minimum estimé ≈ ${euro(Math.ceil(minBudget))}).`
                    : `⚠ En dessous du minimum réaliste pour ton foyer (≈ ${euro(Math.ceil(minBudget))}). On fera au mieux.`}
                </p>
              </div>
              <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl bg-cream-2 p-4">
                <input type="checkbox" checked={p.hasPantry} onChange={(e) => set("hasPantry", e.target.checked)} className="h-5 w-5 accent-tomato" />
                <span>
                  <span className="font-semibold">J&apos;ai déjà les basiques du placard</span>
                  <span className="block text-sm text-ink-soft">Huile, épices, sel, sucre, sauce soja… On ne compte que ce que tu utilises.</span>
                </span>
              </label>
            </>
          )}

        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex items-center justify-between">
        <button onClick={() => go(-1)} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-ink-soft transition hover:text-ink disabled:opacity-0">
          <ArrowLeft size={18} /> Retour
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => go(1)} disabled={!canNext} className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-cream transition hover:bg-tomato disabled:opacity-40">
            Continuer <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </button>
        ) : (
          <button onClick={finish} className="group inline-flex items-center gap-2 rounded-full bg-tomato px-8 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(250,101,76,0.7)] transition hover:bg-tomato-dark">
            Générer ma semaine <ArrowRight size={20} className="transition group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h1 className="font-display text-4xl font-medium leading-tight sm:text-5xl">{children}</h1>;
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-3 text-sm font-semibold text-ink-soft">{label}</p>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={active} className={`rounded-2xl border-2 px-4 py-3 text-left text-sm transition ${active ? "border-tomato bg-tomato/5" : "border-line bg-white/60 hover:border-ink/30"}`}>
      {children}
    </button>
  );
}

function Pill({ active, onClick, children, tone = "tomato" }: { active: boolean; onClick: () => void; children: React.ReactNode; tone?: "tomato" | "dark" }) {
  const on = tone === "dark" ? "bg-ink text-cream border-ink" : "bg-tomato text-white border-tomato";
  return (
    <button onClick={onClick} aria-pressed={active} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? on : "border-line bg-white/60 hover:border-ink/40"}`}>
      {children}
    </button>
  );
}

function Stepper({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex items-center gap-4 rounded-full bg-cream-2 p-1">
      <button onClick={() => onChange(Math.max(min, value - 1))} className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl" aria-label="Moins">−</button>
      <span className="w-6 text-center font-display text-2xl">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl" aria-label="Plus">+</button>
    </div>
  );
}

function Cooking() {
  const lines = ["On calcule tes besoins…", "On compare les enseignes…", "On mutualise les ingrédients…", "On dresse les assiettes…"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => Math.min(lines.length - 1, x + 1)), 450);
    return () => clearInterval(t);
  }, [lines.length]);
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <div className="relative mx-auto h-40 w-40">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-0 rounded-full border-[10px] border-cream-2 border-t-tomato" />
          <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="absolute inset-0 grid place-items-center text-6xl">
            🍲
          </motion.span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-10 font-display text-3xl">
            {lines[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
