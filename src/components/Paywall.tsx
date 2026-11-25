"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Lock, ShieldCheck, X } from "lucide-react";
import { money } from "@/lib/format";
import { event } from "@/lib/funnel";
import { useAuth } from "@/lib/useAuth";
import { LIFETIME_END, LIFETIME_END_LABEL, LIFETIME_PRICE, lifetimeOpen } from "@/lib/offer";

/** Tarifs : 9,99 €/mois, ou 107,89 €/an (= 12 × 9,99 € avec 10 % de réduction, soit 8,99 €/mois). */

/** Ce que l'abonnement change concrètement (uniquement des fonctions réellement disponibles). */
const PERKS = [
  ["Fini le « on mange quoi ce soir ? »", "tes 7 jours de repas sont prêts, du petit-déj au dîner"],
  ["Un seul passage en magasin", "avec ta liste de courses triée par rayon"],
  ["Tes courses restent dans ton budget", "semaine après semaine, au centime près"],
  ["Moins de gaspillage", "les ingrédients sont réutilisés d'un repas à l'autre, en paquets entiers"],
  ["Un plat ne te dit rien ?", "tu le remplaces en un clic, ta liste suit automatiquement"],
  ["L'enseigne la moins chère pour ta liste", "comparée en un coup d'œil"],
  ["Recettes détaillées, portions calculées", "pour ton foyer, ton objectif et ton matériel"],
  ["Une nouvelle semaine quand tu veux", "avec de nouvelles recettes à chaque fois"],
] as const;


/** Prix ramené à la semaine : 9,99 € × 12 / 52 ≈ 2,30 €. */
const WEEKLY = 2.3;

export default function Paywall({
  onClose,
  savings = 0,
  totalSavings = savings,
  currency = "EUR",
}: {
  onClose: () => void;
  /** économie de la semaine due au choix de l'enseigne */
  savings?: number;
  /** économie totale estimée (enseigne, gaspillage, achats imprévus, repas à emporter) */
  totalSavings?: number;
  currency?: "EUR" | "CHF";
}) {
  /** Gain annuel net : économie hebdomadaire moins le prix de l'abonnement ramené à la semaine. */
  const yearlyGain = Math.round((totalSavings - WEEKLY) * 52);
  const [yearlyBox, setYearlyBox] = useState(false);
  const [lifetime, setLifetime] = useState(false);
  // Vérifié après l'affichage (l'heure du serveur et du navigateur peuvent différer)
  const [showLifetime, setShowLifetime] = useState(false);
  useEffect(() => setShowLifetime(lifetimeOpen()), []);
  const plan = lifetime ? "lifetime" : yearlyBox ? "yearly" : "monthly";
  const yearly = plan === "yearly";
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
        <p className="mt-2 text-ink-soft">Pour débloquer ta semaine et ta liste de courses.</p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-tomato/30 bg-tomato/5 p-4">
          <ShieldCheck size={28} className="shrink-0 text-tomato" />
          <p className="text-sm">
            <b className="block text-base">Sans engagement, annulable en 1 clic</b>
            Tu arrêtes quand tu veux depuis ton espace Whop, sans frais ni justification.
          </p>
        </div>

        <div className="mt-3 rounded-2xl bg-ink p-4 text-cream">
          <p className="font-display text-2xl font-extrabold">≈ {yearly ? "2,07" : "2,30"} € par semaine</p>
          <p className="mt-1 text-sm text-cream/80">
            {savings >= WEEKLY + 0.5 ? (
              <>
                Ta semaine coûte <b className="text-tomato">{money(savings, currency)} de moins</b> que la moyenne des autres enseignes : Budgemy se
                rembourse dès tes premières courses.
              </>
            ) : (
              <>Moins qu&apos;un café par semaine, pour des courses calculées au centime et zéro gaspillage.</>
            )}
          </p>
          {yearlyGain >= 20 && (
            <p className="mt-3 border-t border-cream/15 pt-3 text-sm">
              Soit environ <b className="font-display text-xl text-tomato">{money(yearlyGain, currency, 0)} gagnés par an</b>, abonnement déduit (courses, gaspillage, achats imprévus et repas à emporter compris).
            </p>
          )}
        </div>

        {/* Une seule formule affichée au mois ; l'option annuelle est une case à cocher (même prix mensuel, réduit) */}
        <div
          onClick={() => lifetime && (setLifetime(false), event("plan_select", { formule: yearlyBox ? "yearly" : "monthly" }))}
          className={`mt-6 rounded-2xl border-2 bg-white p-5 transition ${lifetime ? "cursor-pointer border-line opacity-70" : "border-tomato shadow-lg"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-bold">Accès complet Budgemy</p>
              <p className="text-xs text-ink-soft">{yearly ? "≈ 2,07 € par semaine" : "≈ 2,30 € par semaine · sans engagement"}</p>
            </div>
            <p className="shrink-0 whitespace-nowrap text-right">
              {yearly && <span className="mr-1.5 text-sm text-ink-soft line-through">9,99 €</span>}
              <span className="font-display text-3xl font-extrabold">{yearly ? "8,99 €" : "9,99 €"}</span>
              <span className="text-sm text-ink-soft"> / mois</span>
            </p>
          </div>
          <label className={`mt-4 flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition ${yearly ? "border-tomato bg-tomato/5" : "border-dashed border-line"}`}>
            <input
              type="checkbox"
              checked={yearlyBox}
              onChange={(e) => {
                setYearlyBox(e.target.checked);
                setLifetime(false);
                event("plan_select", { formule: e.target.checked ? "yearly" : "monthly" });
              }}
              className="h-5 w-5 shrink-0 accent-tomato"
            />
            <span className="text-sm">
              <span className="font-semibold">Payer à l&apos;année et économiser 10&nbsp;%</span>
              <span className="ml-2 rounded-full bg-tomato px-2 py-0.5 text-xs font-bold text-white">-10 %</span>
              <span className="block text-xs text-ink-soft">8,99 €/mois au lieu de 9,99 €, réglés en une fois : 107,89 € pour 12 mois.</span>
            </span>
          </label>
        </div>

        {showLifetime && (
          <LifetimeOffer
            selected={lifetime}
            onSelect={() => {
              setLifetime(true);
              event("plan_select", { formule: "lifetime" });
            }}
          />
        )}

        {auth.user && (
          <div className="mt-6 rounded-2xl border-2 border-tomato/40 bg-cream-2 p-4 text-sm">
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
        <h3 className="mt-8 text-center font-display text-xl font-extrabold">Ce qui change pour toi dès cette semaine</h3>
        <ul className="mt-4 space-y-3 rounded-2xl border border-line bg-white/70 p-4">
          {PERKS.map(([title, text]) => (
            <li key={title} className="flex gap-3 text-sm">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-tomato text-white">
                <Check size={13} strokeWidth={3} />
              </span>
              <span>
                <b>{title}</b> : {text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <span className="rounded-xl bg-cream-2 p-3"><b className="block text-base">🔓</b>Accès immédiat</span>
          <span className="rounded-xl bg-cream-2 p-3"><b className="block text-base">↩️</b>Annulable à tout moment</span>
          <span className="rounded-xl bg-cream-2 p-3"><b className="block text-base">🔒</b>Paiement sécurisé</span>
        </div>

        <a
          href={`/api/whop/checkout?plan=${plan}`}
          onClick={() => event("checkout_click", { formule: plan, position: "bas" })}
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-tomato py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(250,101,76,0.7)] transition hover:bg-tomato-dark"
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

/** Compte à rebours jusqu'à la vraie date de fin de l'offre. */
function useCountdown(end: Date) {
  const [left, setLeft] = useState(() => Math.max(0, end.getTime() - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, end.getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, [end]);
  const s = Math.floor(left / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, over: left <= 0 };
}

function LifetimeOffer({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  const c = useCountdown(LIFETIME_END);
  if (c.over) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative mt-5 w-full overflow-hidden rounded-2xl bg-ink p-5 pt-9 text-left text-cream transition ${selected ? "ring-4 ring-tomato" : "ring-2 ring-tomato/40 hover:ring-tomato"}`}
    >
      <span className="absolute inset-x-0 top-0 flex items-center justify-center gap-1.5 bg-tomato py-1.5 text-xs font-extrabold uppercase tracking-widest text-white">
        <Flame size={14} /> Offre spéciale de lancement
      </span>
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block font-display text-2xl font-extrabold leading-tight">Paye une fois.<br />Profite à vie.</span>
          <span className="mt-1 block text-sm text-cream/75">Le prix de 6 mois d&apos;abonnement, pour toujours.</span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block font-display text-3xl font-extrabold text-tomato">{LIFETIME_PRICE}</span>
          <span className="block text-xs font-semibold text-cream/75">une seule fois</span>
        </span>
      </span>
      <span className="mt-4 grid gap-1.5 text-sm">
        {["Accès illimité à toutes les fonctions", "Aucun abonnement, aucun prélèvement mensuel", "Toutes les nouveautés incluses"].map((t) => (
          <span key={t} className="flex items-center gap-2">
            <Check size={15} strokeWidth={3} className="shrink-0 text-tomato" /> {t}
          </span>
        ))}
      </span>
      <span className="mt-4 block rounded-xl bg-white/10 p-3 text-center">
        <span className="block text-xs font-semibold uppercase tracking-wider text-cream/75">L&apos;offre se termine dans</span>
        <span className="mt-1 flex justify-center gap-2 font-display text-xl font-extrabold tabular-nums">
          {[
            [c.d, "j"],
            [pad(c.h), "h"],
            [pad(c.m), "min"],
            [pad(c.s), "s"],
          ].map(([v, u]) => (
            <span key={u as string}>
              {v}
              <span className="ml-0.5 text-xs font-semibold text-cream/75">{u}</span>
            </span>
          ))}
        </span>
        <span className="mt-1 block text-xs text-cream/75">Jusqu&apos;au {LIFETIME_END_LABEL}. Ensuite, Budgemy sera uniquement disponible en abonnement.</span>
      </span>
      <span className={`mt-4 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold ${selected ? "bg-tomato text-white" : "bg-white/15"}`}>
        {selected ? <><Check size={16} strokeWidth={3} /> Offre sélectionnée</> : "Choisir l'accès à vie"}
      </span>
    </button>
  );
}
