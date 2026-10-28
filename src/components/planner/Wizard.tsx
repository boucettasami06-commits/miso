"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Coffee, Moon, Sun } from "lucide-react";
import { DEFAULT_PROFILE } from "@/lib/defaults";
import { generatePlan } from "@/lib/engine/generator";
import { dailyTargets } from "@/lib/engine/nutrition";
import { STORES } from "@/lib/data/stores";
import { loadProfile, savePlan, saveProfile } from "@/lib/storage";
import type { Activity, Allergen, CookTime, Diet, Goal, MealType, Profile, Restriction } from "@/lib/types";
import SmartImage from "../SmartImage";

const GOALS: { id: Goal; title: string; text: string; photo: string; emoji: string }[] = [
  { id: "sain", title: "Manger sain", text: "Perdre un peu, se sentir léger", photo: "photo-1512621776951-a57141f2eefd", emoji: "🥗" },
  { id: "muscle", title: "Prendre du muscle", text: "Protéines & énergie", photo: "photo-1490645935967-10de6ba17061", emoji: "💪" },
  { id: "equilibre", title: "Manger équilibré", text: "Normal, varié, simple", photo: "photo-1529042410759-befb1204b468", emoji: "🍽️" },
  { id: "gourmand", title: "Me faire plaisir", text: "Comfort food maison", photo: "photo-1568901346375-23c9450c58cd", emoji: "🍔" },
];
const ACTIVITIES: { id: Activity; label: string; hint: string }[] = [
  { id: "sedentaire", label: "Sédentaire", hint: "Bureau, peu de sport" },
  { id: "leger", label: "Léger", hint: "1–2 séances/sem." },
  { id: "actif", label: "Actif", hint: "3–5 séances/sem." },
  { id: "tres-actif", label: "Très actif", hint: "Sport quotidien" },
];
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

const STEPS = ["Objectif", "Toi & ton foyer", "Repas", "Régime", "Budget", "Cuisine"];

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export default function Wizard() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [p, setP] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = loadProfile();
    const goal = params.get("objectif") as Goal | null;
    const base = saved ? { ...DEFAULT_PROFILE, ...saved } : DEFAULT_PROFILE;
    setP(goal && GOALS.some((g) => g.id === goal) ? { ...base, goal } : base);
  }, [params]);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((x) => ({ ...x, [k]: v }));
  const targets = useMemo(() => dailyTargets(p), [p]);
  const minBudget = useMemo(() => (step === 4 ? generatePlan({ ...p, budget: 1 }, { seed: 1 }).total : 0), [p, step]);
  const canNext = step !== 2 || p.meals.length > 0;

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
              <H>Quel est ton objectif ?</H>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => set("goal", g.id)}
                    className={`group relative h-48 overflow-hidden rounded-[1.75rem] text-left ring-4 transition ${p.goal === g.id ? "ring-tomato" : "ring-transparent hover:ring-line"}`}
                  >
                    <SmartImage photo={g.photo} emoji={g.emoji} alt="" fill sizes="(max-width: 640px) 90vw, 400px" className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-5 text-white">
                      <p className="font-display text-2xl">{g.title}</p>
                      <p className="text-sm text-white/80">{g.text}</p>
                    </div>
                    {p.goal === g.id && (
                      <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-tomato text-white">
                        <Check size={18} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <H>Parle-nous un peu de toi.</H>
              <p className="mt-3 text-ink-soft">On calcule tes besoins pour ajuster chaque portion. Rien ne quitte ton appareil.</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field label="Sexe">
                  <Segmented value={p.sex} onChange={(v) => set("sex", v)} options={[["femme", "Femme"], ["homme", "Homme"]]} />
                </Field>
                <Field label={`Âge · ${p.age} ans`}>
                  <input type="range" min={14} max={85} value={p.age} onChange={(e) => set("age", +e.target.value)} className="w-full accent-tomato" />
                </Field>
                <Field label={`Poids · ${p.weight} kg`}>
                  <input type="range" min={40} max={150} value={p.weight} onChange={(e) => set("weight", +e.target.value)} className="w-full accent-tomato" />
                </Field>
                <Field label={`Taille · ${p.height} cm`}>
                  <input type="range" min={140} max={210} value={p.height} onChange={(e) => set("height", +e.target.value)} className="w-full accent-tomato" />
                </Field>
              </div>
              <Field label="Activité physique" className="mt-6">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ACTIVITIES.map((a) => (
                    <Chip key={a.id} active={p.activity === a.id} onClick={() => set("activity", a.id)}>
                      <span className="block font-semibold">{a.label}</span>
                      <span className="block text-xs opacity-70">{a.hint}</span>
                    </Chip>
                  ))}
                </div>
              </Field>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Field label="Adultes dans le foyer">
                  <Stepper value={p.adults} min={1} max={8} onChange={(v) => set("adults", v)} />
                </Field>
                <Field label="Enfants">
                  <Stepper value={p.children} min={0} max={8} onChange={(v) => set("children", v)} />
                </Field>
              </div>
              <div className="mt-8 rounded-3xl bg-ink p-5 text-cream">
                <p className="text-xs uppercase tracking-widest text-cream/60">Tes besoins estimés / jour</p>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {[
                    [targets.kcal, "kcal"],
                    [`${targets.protein} g`, "protéines"],
                    [`${targets.carbs} g`, "glucides"],
                    [`${targets.fat} g`, "lipides"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <motion.p key={String(v)} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="font-display text-xl sm:text-2xl">
                        {v}
                      </motion.p>
                      <p className="text-[11px] uppercase tracking-wider text-cream/50">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
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
            </>
          )}

          {step === 3 && (
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

          {step === 4 && (
            <>
              <H>Ton budget courses par semaine</H>
              <div className="mt-8 rounded-[2rem] border border-line bg-white/60 p-6 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="text-ink-soft">Pour tout le foyer</span>
                  <motion.span key={p.budget} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="font-display text-5xl text-tomato">
                    {euro(p.budget)}
                  </motion.span>
                </div>
                <input type="range" min={15} max={250} step={5} value={p.budget} onChange={(e) => set("budget", +e.target.value)} className="mt-5 w-full accent-tomato" aria-label="Budget hebdomadaire" />
                <p className={`mt-4 text-sm ${p.budget >= minBudget ? "text-sage" : "text-tomato"}`}>
                  {p.budget >= minBudget
                    ? `✓ Budget réaliste pour ton profil (minimum estimé ≈ ${euro(Math.ceil(minBudget))}).`
                    : `⚠ En dessous du minimum réaliste pour ton profil (≈ ${euro(Math.ceil(minBudget))}). On fera au mieux.`}
                </p>
              </div>
              <Field label="Tes enseignes (laisse vide pour toutes les comparer)" className="mt-8">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {STORES.map((s) => (
                    <Chip key={s.id} active={p.stores.includes(s.id)} onClick={() => set("stores", toggle(p.stores, s.id))}>
                      <span className="block font-semibold">{s.name}</span>
                      <span className="block text-xs opacity-70">{s.tagline}</span>
                    </Chip>
                  ))}
                </div>
              </Field>
              <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl bg-cream-2 p-4">
                <input type="checkbox" checked={p.hasPantry} onChange={(e) => set("hasPantry", e.target.checked)} className="h-5 w-5 accent-tomato" />
                <span>
                  <span className="font-semibold">J&apos;ai déjà les basiques du placard</span>
                  <span className="block text-sm text-ink-soft">Huile, épices, sel, sucre, sauce soja… On ne compte que ce que tu utilises.</span>
                </span>
              </label>
            </>
          )}

          {step === 5 && (
            <>
              <H>Combien de temps en cuisine ?</H>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {COOK.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => set("cookTime", c.id)}
                    className={`rounded-[1.75rem] border-2 p-6 text-left transition ${p.cookTime === c.id ? "border-tomato bg-tomato/5" : "border-line bg-white/60 hover:border-ink/30"}`}
                  >
                    <span className="text-4xl">{c.emoji}</span>
                    <p className="mt-4 font-display text-2xl">{c.label}</p>
                    <p className="text-sm text-ink-soft">{c.hint}</p>
                  </button>
                ))}
              </div>
              <p className="mt-6 text-sm text-ink-soft">Le week-end, on s&apos;autorise des recettes un peu plus longues.</p>
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
          <button onClick={finish} className="group inline-flex items-center gap-2 rounded-full bg-tomato px-8 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(226,87,43,0.7)] transition hover:bg-tomato-dark">
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

function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="inline-flex rounded-full bg-cream-2 p-1">
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} className={`relative rounded-full px-5 py-2 text-sm font-semibold ${value === v ? "text-cream" : "text-ink-soft"}`}>
          {value === v && <motion.span layoutId="seg" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
          <span className="relative">{l}</span>
        </button>
      ))}
    </div>
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
  const lines = ["On calcule tes besoins…", "On compare 8 enseignes…", "On mutualise les ingrédients…", "On dresse les assiettes…"];
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
