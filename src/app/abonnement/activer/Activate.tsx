"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

/** Identifiant transmis par Whop au retour du paiement (selon la configuration de la redirection). */
const PARAMS = ["membership_id", "membership", "license_key", "id"];

const input = "w-full rounded-2xl border border-line bg-white px-5 py-4 outline-none focus:border-ink";
const button =
  "flex w-full items-center justify-center gap-2 rounded-full bg-tomato py-4 font-semibold text-white transition hover:bg-tomato-dark disabled:opacity-60";

async function post(url: string, body: object) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
  const data = (await res?.json().catch(() => null)) as { error?: string } | null;
  return { ok: !!res?.ok, error: data?.error ?? "Une erreur est survenue, réessaie." };
}

export default function Activate() {
  const router = useRouter();
  const params = useSearchParams();
  const auth = useAuth();
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [membership, setMembership] = useState("");

  const done = useCallback(() => router.replace("/ma-semaine?bienvenue=1"), [router]);

  const activateId = useCallback(
    async (id: string) => {
      setBusy(true);
      setError("");
      const r = await post("/api/whop/activate", { membership: id });
      setBusy(false);
      if (r.ok) done();
      else setError(r.error);
    },
    [done],
  );

  useEffect(() => {
    const fromWhop = PARAMS.map((k) => params.get(k)).find(Boolean);
    if (fromWhop) {
      setMembership(fromWhop);
      activateId(fromWhop).finally(() => setChecking(false));
      return;
    }
    // Compte connecté : l'abonnement est retrouvé automatiquement grâce à l'e-mail utilisé chez Whop
    fetch("/api/subscription", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { active?: boolean }) => (d.active ? done() : setChecking(false)))
      .catch(() => setChecking(false));
  }, [params, activateId, done]);

  const sendCode = async () => {
    setBusy(true);
    setError("");
    const r = await post("/api/whop/claim", { email });
    setBusy(false);
    if (r.ok) setCodeSent(true);
    else setError(r.error);
  };

  const confirmCode = async () => {
    setBusy(true);
    setError("");
    const r = await post("/api/whop/claim", { email, code });
    setBusy(false);
    if (r.ok) done();
    else setError(r.error);
  };

  if (checking) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 pb-24 pt-40 text-center sm:px-6">
        <Loader2 size={32} className="animate-spin text-tomato" />
        <p className="mt-4 text-ink-soft">On vérifie ton abonnement…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-32 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold leading-tight">Activer mon abonnement</h1>
      <p className="mt-3 text-ink-soft">
        {auth.user ? (
          <>
            On n&apos;a pas trouvé d&apos;abonnement payé avec <b className="text-ink">{auth.user.email}</b>. Tu as sûrement utilisé une autre
            adresse chez Whop : indique-la, on t&apos;y envoie un code pour relier ton abonnement.
          </>
        ) : (
          <>Indique l&apos;adresse e-mail utilisée lors du paiement chez Whop : on t&apos;y envoie un code pour débloquer ton accès.</>
        )}
      </p>

      {!codeSent ? (
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) sendCode();
          }}
        >
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Adresse e-mail utilisée chez Whop" aria-label="Adresse e-mail utilisée chez Whop" autoComplete="email" className={input} />
          <button disabled={busy} className={button}>
            {busy && <Loader2 size={18} className="animate-spin" />} Recevoir mon code
          </button>
        </form>
      ) : (
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) confirmCode();
          }}
        >
          <p className="flex items-start gap-3 rounded-2xl bg-sage/10 p-4 text-sm">
            <MailCheck size={20} className="mt-0.5 shrink-0 text-sage" />
            <span>
              Si un abonnement existe à <b>{email}</b>, tu viens d&apos;y recevoir un code à 6 chiffres (pense à regarder dans les indésirables).
            </span>
          </p>
          <input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="Code à 6 chiffres" aria-label="Code à 6 chiffres" className={`${input} text-center text-2xl tracking-[0.4em]`} />
          <button disabled={busy || code.length !== 6} className={button}>
            {busy && <Loader2 size={18} className="animate-spin" />} Débloquer ma semaine
          </button>
          <button
            type="button"
            onClick={() => {
              setCodeSent(false);
              setCode("");
            }}
            className="w-full text-sm font-semibold text-ink-soft hover:text-ink"
          >
            Changer d&apos;adresse ou renvoyer un code
          </button>
        </form>
      )}

      {error && <p className="mt-4 rounded-2xl bg-tomato/10 p-4 text-sm text-tomato-dark" role="alert">{error}</p>}

      <details className="mt-10 rounded-2xl border border-line bg-white/60 p-4 text-sm">
        <summary className="cursor-pointer font-semibold">J&apos;ai un identifiant d&apos;abonnement Whop</summary>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (membership.trim()) activateId(membership.trim());
          }}
        >
          <input value={membership} onChange={(e) => setMembership(e.target.value)} placeholder="mem_XXXXXXXX ou clé de licence" aria-label="Identifiant d'abonnement Whop" className={input} />
          <button disabled={busy} className={button}>
            Activer
          </button>
        </form>
      </details>
    </div>
  );
}
