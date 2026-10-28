"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Check, ChefHat, Clock, Copy, Flame, Printer, RefreshCw, Settings2, Shuffle, ShoppingBasket, Store, Trophy, Utensils, X,
} from "lucide-react";
import { DAYS, MEAL_LABEL, dayNutrition, generatePlan, swapMeal } from "@/lib/engine/generator";
import { recipeNutrition } from "@/lib/engine/nutrition";
import { quotes, basketFromMeals, shoppingList } from "@/lib/engine/pricing";
import { RECIPE_BY_SLUG } from "@/lib/data/recipes";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { STORE_BY_ID } from "@/lib/data/stores";
import { loadChecked, loadPlan, loadProfile, saveChecked, savePlan } from "@/lib/storage";
import { money, qty } from "@/lib/format";
import { equipmentTip } from "@/lib/engine/equipment";
import type { Aisle, PlannedMeal, Profile, WeekPlan } from "@/lib/types";
import SmartImage from "../SmartImage";
import Paywall from "../Paywall";

const AISLES: Aisle[] = [
  "Fruits & légumes", "Boulangerie", "Boucherie & volaille", "Poissonnerie", "Crèmerie & frais", "Épicerie salée", "Épicerie sucrée", "Surgelés", "Placard",
];
const GOAL_LABEL = { sain: "Healthy", muscle: "Musculation", equilibre: "Équilibré", gourmand: "Gourmand" } as const;
type Tab = "menu" | "courses" | "enseignes";

export default function PlanView() {
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");
  const [day, setDay] = useState(0);
  const [open, setOpen] = useState<PlannedMeal | null>(null);
  const [swapping, setSwapping] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  /** null = vérification en cours ; false = aperçu (un plat visible, le reste flouté) */
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [paywall, setPaywall] = useState(false);

  useEffect(() => {
    const prof = loadProfile();
    let saved = loadPlan();
    // Profil connu mais plan absent ou obsolète : on régénère directement
    if (!saved && prof) {
      saved = generatePlan(prof);
      savePlan(saved);
    }
    setPlan(saved);
    setProfile(prof);
    const today = (new Date().getDay() + 6) % 7;
    setDay(today);
    setReady(true);
    fetch("/api/subscription", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { active?: boolean }) => {
        setUnlocked(!!d.active);
        // En aperçu, on ouvre sur le jour du plat dévoilé
        const first = saved?.meals.find((m) => !m.leftoverOf);
        if (!d.active && first) setDay(first.day);
      })
      .catch(() => setUnlocked(false));
    const q = new URLSearchParams(window.location.search);
    if (q.get("paiement") === "indisponible") setToast("Le paiement n'est pas encore configuré sur ce site.");
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const update = (next: WeekPlan) => {
    setPlan(next);
    savePlan(next);
  };

  if (!ready) return <div className="min-h-screen" />;
  if (!plan || !profile) return <Empty />;

  const locked = unlocked !== true;
  // En aperçu, un seul plat est dévoilé : le premier cuisiné de la semaine
  const first = plan.meals.find((m) => !m.leftoverOf);
  const revealKey = first ? `${first.day}-${first.meal}` : "";
  const askPay = () => setPaywall(true);

  const onSwap = (m: PlannedMeal) => {
    if (locked) return askPay();
    const key = `${m.day}-${m.meal}`;
    setSwapping(key);
    setTimeout(() => {
      const next = swapMeal(plan, profile, m.day, m.meal);
      const changed = next.meals.find((x) => x.day === m.day && x.meal === m.meal)?.slug !== m.slug;
      update(next);
      setSwapping(null);
      notify(changed ? "Recette remplacée, liste de courses mise à jour ✨" : "Pas d'autre alternative compatible pour ce créneau.");
    }, 450);
  };

  const regenerate = () => {
    if (locked) return askPay();
    update(generatePlan(profile));
    notify("Nouvelle semaine générée 🎲");
  };

  const pickStore = (storeId: string) => {
    const total = plan.quotes.find((q) => q.storeId === storeId)?.total ?? plan.total;
    update({ ...plan, storeId, total });
    notify(`Liste calculée pour ${STORE_BY_ID[storeId].name}`);
  };

  const ratio = plan.total / plan.budget;
  const avg = Array.from({ length: 7 }, (_, d) => dayNutrition(plan, d));
  const avgKcal = Math.round(avg.reduce((a, b) => a + b.kcal, 0) / 7);
  const avgProt = Math.round(avg.reduce((a, b) => a + b.protein, 0) / 7);
  const mealsShare = profile.meals.length === 3 ? 0.93 : profile.meals.reduce((a, m) => a + (m === "breakfast" ? 0.25 : m === "lunch" ? 0.35 : 0.33), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tomato">
            Ma semaine · {GOAL_LABEL[profile.goal]} · {profile.adults + profile.children} pers.
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium leading-none sm:text-6xl">
            Au menu cette <em className="text-tomato">semaine</em>
          </h1>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button onClick={regenerate} className="inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-4 py-2.5 text-sm font-semibold transition hover:border-ink">
            <RefreshCw size={16} /> Tout régénérer
          </button>
          <Link href="/planifier" className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-tomato">
            <Settings2 size={16} /> Modifier mon profil
          </Link>
        </div>
      </div>

      {/* Résumé */}
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.75rem] bg-ink p-6 text-cream md:col-span-2">
          <div className="flex items-center justify-between text-sm text-cream/60">
            <span className="flex items-center gap-2"><ShoppingBasket size={16} /> Panier chez {STORE_BY_ID[plan.storeId].name}</span>
            <span>Budget {money(plan.budget, plan.currency)}</span>
          </div>
          <p className="mt-3 font-display text-5xl">{money(plan.total, plan.currency)}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ratio * 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full ${ratio <= 1 ? "bg-gradient-to-r from-sage to-saffron" : "bg-gradient-to-r from-saffron to-tomato"}`}
            />
          </div>
          <p className={`mt-3 text-sm ${ratio <= 1 ? "text-sage-light" : "text-saffron"}`}>
            {ratio <= 1 ? `✓ ${money(plan.budget - plan.total, plan.currency)} sous ton budget` : `${money(plan.total - plan.budget, plan.currency)} au-dessus de ton budget — essaie « Tout régénérer » ou une autre enseigne`}
          </p>
        </div>
        <SummaryCard icon={Flame} label="Énergie moyenne / jour" value={`${avgKcal} kcal`} hint={`Objectif sur ces repas ≈ ${Math.round(plan.targets.kcal * mealsShare)} kcal`} />
        <SummaryCard icon={Trophy} label="Protéines / jour" value={`${avgProt} g`} hint={`Objectif sur ces repas ≈ ${Math.round(plan.targets.protein * mealsShare)} g (${plan.targets.protein} g/jour)`} />
      </div>

      {plan.warnings.length > 0 && (
        <div className="mt-4 rounded-2xl border border-saffron/50 bg-saffron/10 p-4 text-sm">
          {plan.warnings.map((w) => <p key={w}>{w}</p>)}
        </div>
      )}

      {/* Onglets */}
      <div className="no-print sticky top-16 z-30 -mx-4 mt-10 bg-cream/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 md:top-20">
        <div className="inline-flex rounded-full bg-cream-2 p-1">
          {([["menu", "Menu", Utensils], ["courses", "Courses", ShoppingBasket], ["enseignes", "Enseignes", Store]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:px-6 ${tab === id ? "text-cream" : "text-ink-soft"}`}>
              {tab === id && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
              <Icon size={16} className="relative" />
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
          {tab === "menu" && (
            <MenuTab
              plan={plan}
              day={day}
              setDay={setDay}
              onOpen={(m) => (locked && `${m.day}-${m.meal}` !== revealKey ? askPay() : setOpen(m))}
              onSwap={onSwap}
              swapping={swapping}
              isLocked={(m) => locked && `${m.day}-${m.meal}` !== revealKey}
              onUnlock={askPay}
            />
          )}
          {tab === "courses" && <ShoppingTab plan={plan} profile={profile} notify={notify} locked={locked} onUnlock={askPay} />}
          {tab === "enseignes" && <StoresTab plan={plan} profile={profile} onPick={pickStore} />}
        </motion.div>
      </AnimatePresence>

      {locked && unlocked !== null && (
        <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/90 p-3 backdrop-blur-xl sm:p-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-center text-sm text-ink-soft sm:text-left">Ta semaine et ta liste de courses sont prêtes.</p>
            <button onClick={askPay} className="w-full rounded-full bg-tomato px-6 py-3.5 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(255,90,31,0.7)] transition hover:bg-tomato-dark sm:w-auto">
              🔓 Débloquer ma liste de courses et mes recettes de la semaine
            </button>
          </div>
        </div>
      )}
      <AnimatePresence>{paywall && <Paywall onClose={() => setPaywall(false)} />}</AnimatePresence>
      <AnimatePresence>{open && <RecipeModal meal={open} profile={profile} onClose={() => setOpen(null)} />}</AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream shadow-xl" role="status">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, hint }: { icon: typeof Flame; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-[1.75rem] border border-line bg-white/60 p-6">
      <p className="flex items-center gap-2 text-sm text-ink-soft"><Icon size={16} className="text-tomato" /> {label}</p>
      <p className="mt-3 font-display text-4xl">{value}</p>
      <p className="mt-2 text-xs text-ink-soft">{hint}</p>
    </div>
  );
}

function MenuTab({ plan, day, setDay, onOpen, onSwap, swapping, isLocked, onUnlock }: {
  plan: WeekPlan; day: number; setDay: (d: number) => void; onOpen: (m: PlannedMeal) => void; onSwap: (m: PlannedMeal) => void; swapping: string | null;
  isLocked: (m: PlannedMeal) => boolean; onUnlock: () => void;
}) {
  const meals = plan.meals.filter((m) => m.day === day);
  const n = dayNutrition(plan, day);
  return (
    <div className="mt-6">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {DAYS.map((d, i) => (
          <button key={d} onClick={() => setDay(i)} className={`relative shrink-0 rounded-2xl px-5 py-3 text-left transition ${day === i ? "text-cream" : "bg-white/60 hover:bg-white"}`}>
            {day === i && <motion.span layoutId="day" className="absolute inset-0 rounded-2xl bg-tomato" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
            <span className="relative block text-xs uppercase tracking-widest opacity-70">J{i + 1}</span>
            <span className="relative block font-display text-lg">{d}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
        <span><b className="text-ink">{n.kcal}</b> kcal</span>
        <span><b className="text-ink">{n.protein} g</b> protéines</span>
        <span><b className="text-ink">{n.carbs} g</b> glucides</span>
        <span><b className="text-ink">{n.fat} g</b> lipides</span>
        <span className="text-xs">(ta portion)</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={day} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }} className="mt-6 grid gap-5 md:grid-cols-3">
          {meals.map((m, idx) => {
            const r = RECIPE_BY_SLUG[m.slug];
            const nut = recipeNutrition(r);
            const key = `${m.day}-${m.meal}`;
            if (isLocked(m)) return <LockedMeal key={key} label={MEAL_LABEL[m.meal]} photo={r.image} emoji={r.emoji} onUnlock={onUnlock} delay={idx * 0.08} />;
            return (
              <motion.article key={key + m.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="group flex flex-col overflow-hidden rounded-[2rem] border border-line bg-white/70">
                <button onClick={() => onOpen(m)} className="relative aspect-[4/3] overflow-hidden text-left" aria-label={`Voir la recette ${r.title}`}>
                  <SmartImage photo={r.image} emoji={r.emoji} alt={r.title} fill sizes="(max-width: 768px) 92vw, 30vw" className={`object-cover transition duration-700 group-hover:scale-105 ${swapping === key ? "scale-110 blur-md" : ""}`} />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">{MEAL_LABEL[m.meal]}</span>
                  {m.leftoverOf && <span className="absolute right-4 top-4 rounded-full bg-sage px-3 py-1 text-xs font-bold text-white">♻️ Restes d&apos;hier</span>}
                  {m.cookedForLeftovers && <span className="absolute right-4 top-4 rounded-full bg-saffron px-3 py-1 text-xs font-bold text-ink">×2 pour demain midi</span>}
                </button>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-2xl leading-tight">{r.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                    <span className="flex items-center gap-1"><Clock size={14} /> {m.leftoverOf ? "2 min (réchauffer)" : `${r.time} min`}</span>
                    <span className="flex items-center gap-1"><Flame size={14} /> {Math.round(nut.kcal * m.scale)} kcal</span>
                    <span>{Math.round(nut.protein * m.scale)} g prot.</span>
                  </div>
                  <div className="mt-auto flex gap-2 pt-5">
                    <button onClick={() => onOpen(m)} className="flex-1 rounded-full bg-ink py-2.5 text-sm font-semibold text-cream transition hover:bg-tomato">Recette</button>
                    {!m.leftoverOf && (
                      <button onClick={() => onSwap(m)} disabled={!!swapping} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-semibold transition hover:border-ink disabled:opacity-50" aria-label={`Remplacer ${r.title}`}>
                        <Shuffle size={15} className={swapping === key ? "animate-spin" : ""} /> Changer
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LockedMeal({ label, photo, emoji, onUnlock, delay }: { label: string; photo: string; emoji: string; onUnlock: () => void; delay: number }) {
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="relative flex flex-col overflow-hidden rounded-[2rem] border border-line bg-white/70">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage photo={photo} emoji={emoji} alt="" fill sizes="(max-width: 768px) 92vw, 30vw" className="scale-110 object-cover blur-xl" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider">{label}</span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-2xl shadow-lg">🔒</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p aria-hidden className="select-none font-display text-2xl leading-tight blur-[7px]">Recette de la semaine</p>
        <p aria-hidden className="mt-3 select-none text-sm text-ink-soft blur-[5px]">25 min · 640 kcal · 38 g prot.</p>
        <button onClick={onUnlock} className="mt-auto rounded-full bg-ink py-2.5 text-sm font-semibold text-cream transition hover:bg-tomato">
          Débloquer
        </button>
      </div>
    </motion.article>
  );
}

/** Nombre d'articles de la liste visibles en aperçu. */
const PREVIEW_LINES = 3;

function ShoppingTab({ plan, profile, notify, locked, onUnlock }: { plan: WeekPlan; profile: Profile; notify: (s: string) => void; locked: boolean; onUnlock: () => void }) {
  const lines = useMemo(() => shoppingList(plan.meals, plan.storeId, profile.hasPantry), [plan, profile.hasPantry]);
  const [checked, setChecked] = useState<string[]>([]);
  useEffect(() => setChecked(loadChecked(plan.id)), [plan.id]);
  const toggle = (id: string) => {
    const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id];
    setChecked(next);
    saveChecked(plan.id, next);
  };
  const total = lines.reduce((a, l) => a + l.cost, 0);
  const done = lines.filter((l) => checked.includes(l.id)).length;

  const copy = async () => {
    if (locked) return onUnlock();
    const txt = AISLES.map((a) => {
      const ls = lines.filter((l) => l.aisle === a);
      if (!ls.length) return "";
      return `${a.toUpperCase()}\n${ls.map((l) => `☐ ${l.name} — ${l.packs} × ${l.packLabel ?? qty(l.packSize, l.unit)}`).join("\n")}`;
    }).filter(Boolean).join("\n\n");
    try {
      await navigator.clipboard.writeText(`Mes courses Budgemy (${STORE_BY_ID[plan.storeId].name}, ${money(total, plan.currency)})\n\n${txt}`);
      notify("Liste copiée dans le presse-papier 📋");
    } catch {
      notify("Impossible de copier sur cet appareil.");
    }
  };

  if (locked) {
    const preview = lines.filter((l) => !l.pantry).slice(0, PREVIEW_LINES);
    const hidden = lines.length - preview.length;
    return (
      <div className="mx-auto mt-6 max-w-2xl">
        <h2 className="font-display text-3xl">Ta liste de courses · {lines.length} articles</h2>
        <ul className="mt-4 divide-y divide-line rounded-[1.75rem] border border-line bg-white/70 px-4">
          {preview.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-4 py-3">
              <span>
                <span className="font-semibold">{l.name}</span>
                <span className="block text-xs text-ink-soft">{l.packs} × {l.packLabel ?? qty(l.packSize, l.unit)}</span>
              </span>
              <span className="font-display text-lg">{money(l.cost, plan.currency)}</span>
            </li>
          ))}
          {Array.from({ length: Math.min(hidden, 7) }, (_, i) => (
            <li key={i} aria-hidden className="flex select-none items-center justify-between gap-4 py-3 blur-[6px]">
              <span>
                <span className="font-semibold">{["Ingrédient secret", "Produit frais", "Légumes de saison", "Épicerie"][i % 4]}</span>
                <span className="block text-xs text-ink-soft">1 × paquet</span>
              </span>
              <span className="font-display text-lg">{money(1 + ((i * 7) % 5) + 0.49, plan.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="relative -mt-24 flex flex-col items-center rounded-b-[1.75rem] bg-gradient-to-t from-cream via-cream/95 to-transparent px-4 pb-2 pt-16 text-center">
          <p className="font-semibold">+ {hidden} articles, rangés par rayon, au prix de {STORE_BY_ID[plan.storeId].name}</p>
          <button onClick={onUnlock} className="mt-4 rounded-full bg-tomato px-6 py-3.5 font-semibold text-white transition hover:bg-tomato-dark">
            🔓 Débloquer ma liste de courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-8">
        {AISLES.map((a) => {
          const ls = lines.filter((l) => l.aisle === a);
          if (!ls.length) return null;
          return (
            <section key={a}>
              <h2 className="flex items-baseline justify-between border-b border-line pb-2 font-display text-2xl">
                {a}
                <span className="text-sm text-ink-soft">{money(ls.reduce((x, l) => x + l.cost, 0), plan.currency)}</span>
              </h2>
              {a === "Placard" && profile.hasPantry && <p className="mt-2 text-xs text-ink-soft">Tu as indiqué avoir ces basiques : seul ce que tu consommes est compté.</p>}
              <ul className="mt-2">
                {ls.map((l) => {
                  const on = checked.includes(l.id);
                  return (
                    <li key={l.id}>
                      <button onClick={() => toggle(l.id)} className="flex w-full items-center gap-4 rounded-2xl px-2 py-3 text-left transition hover:bg-white/60">
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition ${on ? "border-sage bg-sage text-white" : "border-line"}`}>
                          {on && <Check size={14} />}
                        </span>
                        <span className={`flex-1 ${on ? "text-ink-soft line-through" : ""}`}>
                          <span className="font-semibold">{l.name}</span>
                          <span className="block text-xs text-ink-soft">
                            {l.pantry && profile.hasPantry ? `Utilisé : ${qty(l.needed, l.unit)}` : `${l.packs} × ${l.packLabel ?? qty(l.packSize, l.unit)} · besoin ${qty(l.needed, l.unit)}`}
                            {!l.pantry && l.leftover / l.packSize > 0.25 && ` · reste ${qty(l.leftover, l.unit)}`}
                          </span>
                        </span>
                        <span className="font-display text-lg">{money(l.cost, plan.currency)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      <aside className="h-fit rounded-[2rem] bg-ink p-6 text-cream lg:sticky lg:top-40">
        <p className="text-sm text-cream/60">Total chez {STORE_BY_ID[plan.storeId].name}</p>
        <p className="mt-2 font-display text-5xl">{money(total, plan.currency)}</p>
        <p className="mt-2 text-sm text-cream/60">{lines.length} articles · {done} cochés</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-cream/10">
          <motion.div animate={{ width: `${(done / Math.max(1, lines.length)) * 100}%` }} className="h-full bg-sage" />
        </div>
        <div className="no-print mt-6 grid gap-2">
          <button onClick={copy} className="flex items-center justify-center gap-2 rounded-full bg-cream py-3 font-semibold text-ink transition hover:bg-saffron"><Copy size={16} /> Copier la liste</button>
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 rounded-full border border-cream/20 py-3 font-semibold transition hover:bg-cream/10"><Printer size={16} /> Imprimer</button>
        </div>
        <p className="mt-6 text-xs text-cream/50">Prix indicatifs moyens. Les quantités sont arrondies aux conditionnements vendus en magasin.</p>
      </aside>
    </div>
  );
}

function StoresTab({ plan, profile, onPick }: { plan: WeekPlan; profile: Profile; onPick: (id: string) => void }) {
  const all = useMemo(() => quotes(basketFromMeals(plan.meals), profile.hasPantry, plan.country), [plan.meals, profile.hasPantry, plan.country]);
  const max = Math.max(...all.map((q) => q.total));
  const cheapest = all[0];
  return (
    <div className="mt-6 rounded-[2rem] border border-line bg-white/60 p-6 sm:p-8">
      <h2 className="font-display text-3xl">Ton panier dans chaque enseigne</h2>
      <p className="mt-2 text-ink-soft">
        Même liste, même quantités. Écart entre la moins chère et la plus chère : <b className="text-ink">{money(max - cheapest.total, plan.currency)}</b> par semaine, soit{" "}
        <b className="text-tomato">{money((max - cheapest.total) * 52, plan.currency)}</b> par an.
      </p>
      <ul className="mt-8 space-y-3">
        {all.map((q, i) => {
          const s = STORE_BY_ID[q.storeId];
          const active = q.storeId === plan.storeId;
          const allowed = !profile.stores.length || profile.stores.includes(q.storeId);
          return (
            <li key={q.storeId}>
              <button onClick={() => onPick(q.storeId)} className={`w-full rounded-2xl p-3 text-left transition ${active ? "bg-ink text-cream" : "hover:bg-cream-2"}`}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2 font-semibold">
                    {i === 0 && "🏆"} {s.name}
                    {!allowed && <span className="rounded-full bg-cream-2 px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-soft">hors sélection</span>}
                  </span>
                  <span className="font-display text-lg">{money(q.total, plan.currency)}</span>
                </div>
                <div className={`mt-2 h-2.5 overflow-hidden rounded-full ${active ? "bg-cream/15" : "bg-cream-2"}`}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(q.total / max) * 100}%` }} transition={{ duration: 0.9, delay: i * 0.06 }} className="h-full rounded-full" style={{ background: i === 0 ? "var(--color-sage)" : active ? "var(--color-saffron)" : s.color }} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RecipeModal({ meal, profile, onClose }: { meal: PlannedMeal; profile: Profile; onClose: () => void }) {
  const r = RECIPE_BY_SLUG[meal.slug];
  const n = recipeNutrition(r);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={r.title}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] bg-cream sm:rounded-[2rem]"
      >
        <div className="relative aspect-[16/9]">
          <SmartImage photo={r.image} emoji={r.emoji} alt={r.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
          <button onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90" aria-label="Fermer"><X size={18} /></button>
        </div>
        <div className="p-6 sm:p-8">
          <h2 className="font-display text-3xl sm:text-4xl">{r.title}</h2>
          <p className="mt-2 text-ink-soft">{r.description}</p>
          {equipmentTip(r, profile.equipment) && <p className="mt-4 rounded-2xl bg-saffron/25 p-3 text-sm">{equipmentTip(r, profile.equipment)}</p>}
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Badge><Clock size={14} /> {r.time} min</Badge>
            <Badge><ChefHat size={14} /> {meal.leftoverOf ? "Restes : réchauffer" : `${meal.portions.toLocaleString("fr-FR")} portions à cuisiner`}</Badge>
            <Badge><Flame size={14} /> {Math.round(n.kcal * meal.scale)} kcal · {Math.round(n.protein * meal.scale)} g prot. (ta part)</Badge>
          </div>
          {!meal.leftoverOf && (
            <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_1.4fr]">
              <div>
                <h3 className="font-display text-xl">Ingrédients</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {r.ingredients.map((ri) => {
                    const ing = INGREDIENTS[ri.id];
                    return (
                      <li key={ri.id} className="flex justify-between gap-3 border-b border-line pb-2">
                        <span>{ing.name}{ri.note ? ` (${ri.note})` : ""}</span>
                        <span className="shrink-0 font-semibold">{qty(ri.qty * meal.portions, ing.unit)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-xl">Préparation</h3>
                <ol className="mt-3 space-y-4">
                  {r.steps.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-tomato text-sm font-bold text-white">{i + 1}</span>
                      <span className="pt-0.5 text-sm leading-relaxed">{s}</span>
                    </li>
                  ))}
                  {meal.cookedForLeftovers && (
                    <li className="rounded-2xl bg-saffron/20 p-3 text-sm">♻️ Mets de côté une part dans une boîte hermétique pour demain midi.</li>
                  )}
                </ol>
              </div>
            </div>
          )}
          <Link href={`/recettes/${r.slug}`} className="mt-8 inline-flex items-center gap-2 font-semibold text-tomato">
            Voir la fiche complète <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-2 px-3 py-1.5">{children}</span>;
}

function Empty() {
  return (
    <div className="mx-auto grid min-h-[80vh] max-w-2xl place-items-center px-4 pt-24 text-center">
      <div>
        <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl">🍽️</motion.p>
        <h1 className="mt-6 font-display text-5xl">Ta semaine est encore vide.</h1>
        <p className="mt-4 text-lg text-ink-soft">Réponds à 6 petites questions et on te prépare 7 jours de repas à ton budget.</p>
        <Link href="/planifier" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-tomato px-8 py-4 text-lg font-semibold text-white">
          Créer ma semaine <ArrowRight className="transition group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
