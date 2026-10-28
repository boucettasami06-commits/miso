"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, X } from "lucide-react";

/** Tarifs affichés : 9,99 €/mois ou 107,89 €/an (= 12 × 9,99 € avec 10 % de réduction). */
const PLANS = [
  { id: "yearly", name: "Annuel", price: "107,89 €", per: "/ an", sub: "soit 8,99 € par mois", badge: "-10 %" },
  { id: "monthly", name: "Mensuel", price: "9,99 €", per: "/ mois", sub: "sans engagement" },
] as const;

const PERKS = [
  "Ton menu complet sur 7 jours",
  "Ta liste de courses par rayon, au meilleur prix",
  "Toutes les recettes détaillées, portions calculées",
  "Remplacements de plats illimités",
  "Une nouvelle semaine quand tu veux",
];

export default function Paywall({ onClose }: { onClose: () => void }) {
  const [plan, setPlan] = useState<"yearly" | "monthly">("yearly");

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Choisir une formule"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-cream p-6 sm:rounded-[2rem] sm:p-8"
      >
        <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-cream-2" aria-label="Fermer">
          <X size={18} />
        </button>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tomato text-white">
          <Lock size={22} />
        </span>
        <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">Ta semaine est prête 🎉</h2>
        <p className="mt-2 text-ink-soft">Pour générer ta semaine et ta liste de courses, choisis ta formule.</p>

        <div className="mt-6 grid gap-3">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlan(p.id)}
              aria-pressed={plan === p.id}
              className={`relative flex items-center justify-between rounded-2xl border-2 p-4 text-left transition ${plan === p.id ? "border-tomato bg-white shadow-lg" : "border-line bg-white/60"}`}
            >
              <span className="flex items-center gap-3">
                <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${plan === p.id ? "border-tomato bg-tomato" : "border-line"}`}>
                  {plan === p.id && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span>
                  <span className="block font-display text-lg font-bold">{p.name}</span>
                  <span className="block text-xs text-ink-soft">{p.sub}</span>
                </span>
              </span>
              <span className="text-right">
                <span className="font-display text-2xl font-extrabold">{p.price}</span>
                <span className="text-sm text-ink-soft"> {p.per}</span>
              </span>
              {"badge" in p && <span className="absolute -top-2.5 right-4 rounded-full bg-saffron px-2.5 py-0.5 text-xs font-bold">{p.badge}</span>}
            </button>
          ))}
        </div>

        <ul className="mt-6 space-y-2 text-sm">
          {PERKS.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check size={16} className="shrink-0 text-sage" /> {t}
            </li>
          ))}
        </ul>

        <a
          href={`/api/whop/checkout?plan=${plan}`}
          className="mt-7 flex items-center justify-center gap-2 rounded-full bg-tomato py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(255,90,31,0.7)] transition hover:bg-tomato-dark"
        >
          Débloquer ma semaine
        </a>
        <p className="mt-3 text-center text-xs text-ink-soft">Paiement sécurisé via Whop. Résiliable à tout moment.</p>
        <p className="mt-4 text-center text-sm">
          Déjà abonné ? <Link href="/abonnement/activer" className="font-semibold text-tomato underline-offset-2 hover:underline">Activer mon accès</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
