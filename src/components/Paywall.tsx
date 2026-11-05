"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, ShieldCheck, X } from "lucide-react";
import { money } from "@/lib/format";
import { event } from "@/lib/funnel";
import { useAuth } from "@/lib/useAuth";

/** Tarifs affichés : 9,99 €/mois ou 107,89 €/an (= 12 × 9,99 € avec 10 % de réduction). */
const PLANS = [
  { id: "yearly", name: "Annuel", price: "107,89 €", per: "/ an", sub: "soit 8,99 €/mois · 2,07 € par semaine", badge: "-10 %" },
  { id: "monthly", name: "Mensuel", price: "9,99 €", per: "/ mois", sub: "≈ 2,30 € par semaine · sans engagement" },
] as const;

const PERKS = [
  "Ton menu complet sur 7 jours",
  "Ta liste de courses par rayon, au meilleur prix",
  "Toutes les recettes détaillées, portions calculées",
  "Remplacements de plats illimités",
  "Une nouvelle semaine quand tu veux",
];

/** Prix ramené à la semaine : 9,99 € × 12 / 52 ≈ 2,30 €. */
const WEEKLY = 2.3;

export default function Paywall({ onClose, savings = 0, currency = "EUR" }: { onClose: () => void; savings?: number; currency?: "EUR" | "CHF" }) {
  const [plan, setPlan] = useState<"yearly" | "monthly">("yearly");
  const auth = useAuth();

  useEffect(() => {
    fetch("/api/paywall-seen", { method: "POST" }).catch(() => {});
    event("paywall_view");
  }, []);

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

        <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-sage/40 bg-sage/10 p-4">
          <ShieldCheck size={28} className="shrink-0 text-sage" />
          <p className="text-sm">
            <b className="block text-base">Sans engagement, annulable en 1 clic</b>
            Tu arrêtes quand tu veux depuis ton espace Whop, sans frais ni justification.
          </p>
        </div>

        <div className="mt-3 rounded-2xl bg-ink p-4 text-cream">
          <p className="font-display text-2xl font-extrabold">≈ 2,30 € par semaine</p>
          <p className="mt-1 text-sm text-cream/80">
            {savings >= WEEKLY + 0.5 ? (
              <>
                Ta semaine coûte <b className="text-saffron">{money(savings, currency)} de moins</b> que la moyenne des autres enseignes : Budgemy se
                rembourse dès tes premières courses.
              </>
            ) : (
              <>Moins qu&apos;un café par semaine, pour des courses calculées au centime et zéro gaspillage.</>
            )}
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPlan(p.id);
                event("plan_select", { formule: p.id });
              }}
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
              <span className="shrink-0 whitespace-nowrap text-right">
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

        {auth.user && (
          <div className="mt-6 rounded-2xl border-2 border-saffron bg-saffron/15 p-4 text-sm">
            <p className="font-semibold">Important : au paiement, utilise exactement cette adresse e-mail</p>
            <p className="mt-1 break-all font-display text-lg font-bold">{auth.user.email}</p>
            <p className="mt-1 text-ink-soft">C&apos;est grâce à elle que ta semaine se débloque automatiquement.</p>
          </div>
        )}

        <a
          href={`/api/whop/checkout?plan=${plan}`}
          onClick={() => event("checkout_click", { formule: plan })}
          className="mt-7 flex items-center justify-center gap-2 rounded-full bg-tomato py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(250,101,76,0.7)] transition hover:bg-tomato-dark"
        >
          Débloquer ma semaine
        </a>
        <p className="mt-3 text-center text-xs text-ink-soft">Paiement sécurisé via Whop. Sans engagement, annulable en 1 clic. En t&apos;abonnant, tu acceptes nos{" "}
          <Link href="/cgv" className="underline">CGV</Link>.
        </p>
        <p className="mt-4 text-center text-sm">
          Déjà abonné ? <Link href="/abonnement/activer" className="font-semibold text-tomato underline-offset-2 hover:underline">Activer mon accès</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
