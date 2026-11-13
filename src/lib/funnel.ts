"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Mesure du parcours (de la première visite au paiement), enregistrée dans notre propre base.
 * Visiteur anonyme : identifiant aléatoire conservé 13 mois au maximum, aucune donnée personnelle
 * ni cookie publicitaire. La session expire après 30 minutes d'inactivité.
 */
export type FunnelEvent =
  | "page_view"
  | "scroll"
  | "cta_click"
  | "signup_open"
  | "signup_ok"
  | "login_ok"
  | "wizard_step"
  | "wizard_done"
  | "compare_view"
  | "savings_view"
  | "client_error"
  | "plan_generated"
  | "plan_view"
  | "locked_click"
  | "paywall_view"
  | "plan_select"
  | "checkout_click"
  | "activation_ok";

/** Équivalents lisibles envoyés aussi à Vercel Analytics. */
const VERCEL_NAMES: Partial<Record<FunnelEvent, string>> = {
  signup_ok: "Inscription",
  login_ok: "Connexion",
  plan_generated: "Semaine générée",
  checkout_click: "Clic paiement",
  activation_ok: "Abonnement activé",
};

const VID_KEY = "bdg:vid";
const SID_KEY = "bdg:sid";
const SRC_KEY = "bdg:src";
const YEAR = 395 * 86400 * 1000;
const SESSION = 30 * 60 * 1000;

const rid = () => (crypto.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`).replace(/-/g, "").slice(0, 20);

function store<T>(key: string, fresh: () => T, ttl: number): T {
  try {
    const raw = localStorage.getItem(key);
    const saved = raw ? (JSON.parse(raw) as { v: T; t: number }) : null;
    const v = saved && Date.now() - saved.t < ttl ? saved.v : fresh();
    localStorage.setItem(key, JSON.stringify({ v, t: Date.now() }));
    return v;
  } catch {
    return fresh();
  }
}

/** Provenance de la visite : paramètres utm_* (ou ?ref=), sinon site d'origine ; mémorisée pour la session. */
function source(): { source: string; referrer: string } {
  const q = new URLSearchParams(location.search);
  const utm = [q.get("utm_source"), q.get("utm_medium"), q.get("utm_campaign")].filter(Boolean).join(" / ") || q.get("ref") || "";
  const ref = document.referrer && !document.referrer.includes(location.host) ? new URL(document.referrer).host : "";
  const current = { source: utm || ref || "direct", referrer: ref };
  try {
    const raw = sessionStorage.getItem(SRC_KEY);
    if (raw && !utm && !ref) return JSON.parse(raw);
    sessionStorage.setItem(SRC_KEY, JSON.stringify(current));
  } catch {
    /* stockage indisponible */
  }
  return current;
}

export function event(name: FunnelEvent, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  if (VERCEL_NAMES[name]) vercelTrack(VERCEL_NAMES[name]!, props);
  const body = JSON.stringify({
    name,
    props,
    path: location.pathname,
    vid: store(VID_KEY, rid, YEAR),
    sid: store(SID_KEY, rid, SESSION),
    ...source(),
  });
  try {
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) return;
  } catch {
    /* on retente avec fetch */
  }
  fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
}
