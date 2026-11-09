"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { money } from "@/lib/format";
import type { WeekPlan } from "@/lib/types";

const ROWS = [
  { before: "😩", beforeText: "« On mange quoi ce soir ? »", after: "📅", afterText: "Tes 7 jours déjà planifiés" },
  { before: "🧾", beforeText: "Le ticket de caisse qui grimpe", after: "🎯", afterText: "Ton total connu avant d'entrer en magasin" },
  { before: "🗑️", beforeText: "Des produits qui finissent à la poubelle", after: "♻️", afterText: "Chaque ingrédient utilisé jusqu'au bout" },
  { before: "🍝", beforeText: "Toujours les mêmes plats", after: "🍲", afterText: "Des recettes variées, à ton goût" },
];

/** Écran intermédiaire du questionnaire : ce que Budgemy change au quotidien. */
export function CompareScreen({ people, onContinue }: { people: number; onContinue: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      <h1 className="text-center font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        Fini le casse-tête
        <br />
        <span className="text-tomato">des repas{people > 1 ? " en famille" : ""}</span>
      </h1>
      <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-4 sm:gap-x-5">
        <p className="text-center text-sm font-bold uppercase tracking-wider text-ink-soft">Sans Budgemy</p>
        <span />
        <p className="text-center text-sm font-bold uppercase tracking-wider text-sage">Avec Budgemy</p>
        {ROWS.map((r, i) => (
          <Row key={r.afterText} row={r} delay={0.15 + i * 0.12} />
        ))}
      </div>
      <button onClick={onContinue} className="group mx-auto mt-10 flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-ink py-4 text-lg font-semibold text-cream transition hover:bg-tomato">
        Continuer <ArrowRight size={20} className="transition group-hover:translate-x-1" />
      </button>
    </motion.div>
  );
}

function Row({ row, delay }: { row: (typeof ROWS)[number]; delay: number }) {
  return (
    <>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }} className="h-full rounded-2xl bg-cream-2 p-4">
        <span className="text-2xl">{row.before}</span>
        <p className="mt-2 text-sm text-ink-soft sm:text-base">{row.beforeText}</p>
      </motion.div>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.1 }} className="text-sage">
        <ArrowRight size={20} />
      </motion.span>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + 0.15 }} className="h-full rounded-2xl border-2 border-sage/50 bg-white p-4 shadow-sm">
        <span className="text-2xl">{row.after}</span>
        <p className="mt-2 text-sm font-semibold sm:text-base">{row.afterText}</p>
      </motion.div>
    </>
  );
}

/**
 * Fin du questionnaire : l'économie annuelle estimée.
 * Base de comparaison : le même panier au prix moyen des enseignes du pays, sans optimisation.
 */
export function SavingsScreen({ plan, onContinue }: { plan: WeekPlan; onContinue: () => void }) {
  const currency = plan.currency ?? "EUR";
  const others = plan.quotes.filter((q) => q.storeId !== plan.storeId);
  const before = others.length ? others.reduce((a, q) => a + q.total, 0) / others.length : plan.total;
  const weekly = Math.max(0, before - plan.total);
  const yearly = Math.round(weekly * 52);
  const hasSavings = weekly >= 1;

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-24">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{ background: "repeating-conic-gradient(from 0deg, var(--color-saffron) 0deg 8deg, transparent 8deg 22deg)" }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_0%,var(--color-cream)_65%)]" />

      <div className="relative w-full max-w-md text-center">
        <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="inline-flex rounded-full bg-sage px-6 py-3 font-display text-xl font-bold text-white shadow-lg">
          🎉 Bonne nouvelle
        </motion.span>

        {hasSavings ? (
          <>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 font-display text-2xl font-bold">
              Avec Budgemy, tu économises
            </motion.p>
            <motion.p initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring", bounce: 0.4 }} className="relative mx-auto mt-2 inline-block font-display text-7xl font-extrabold text-sage sm:text-8xl">
              <span aria-hidden className="absolute inset-x-0 bottom-2 -z-10 h-1/3 bg-saffron" />
              {money(yearly, currency, 0)}
            </motion.p>
            <p className="mt-2 font-display text-2xl font-bold">par an.</p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-8 flex items-center justify-center gap-3">
              <div className="rounded-2xl border-2 border-line bg-white px-5 py-3">
                <p className="text-sm font-semibold text-ink-soft">Sans Budgemy</p>
                <p className="font-display text-2xl font-extrabold text-tomato line-through">{money(before, currency, 2)}</p>
              </div>
              <ArrowRight className="shrink-0 text-sage" />
              <div className="rounded-2xl border-2 border-sage bg-white px-5 py-3">
                <p className="text-sm font-semibold text-sage">Avec Budgemy</p>
                <p className="font-display text-2xl font-extrabold text-sage">{money(plan.total, currency, 2)}</p>
              </div>
            </motion.div>
            <p className="mt-2 text-sm font-semibold text-ink-soft">par semaine</p>
          </>
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 font-display text-3xl font-bold">
            Ta semaine tient dans ton budget : {money(plan.total, currency, 2)} pour 7 jours.
          </motion.p>
        )}

        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mx-auto mt-8 max-w-xs space-y-2 text-left text-sm">
          <li>✅ Tes repas de la semaine décidés en 2 minutes</li>
          <li>✅ Une seule liste de courses, rangée par rayon</li>
          <li>✅ Les ingrédients réutilisés d&apos;un repas à l&apos;autre</li>
        </motion.ul>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          onClick={onContinue}
          className="group mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-sage py-4 text-lg font-semibold text-white shadow-lg transition hover:brightness-110"
        >
          Découvrir ma semaine <ArrowRight size={20} className="transition group-hover:translate-x-1" />
        </motion.button>
        {hasSavings && (
          <p className="mt-4 text-xs text-ink-soft">
            Estimation : ton panier optimisé comparé au même panier au prix moyen des autres enseignes, sur 52 semaines.
          </p>
        )}
      </div>
    </div>
  );
}
