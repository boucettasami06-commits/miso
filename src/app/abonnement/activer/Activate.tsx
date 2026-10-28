"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/** Identifiant transmis par Whop au retour du paiement (selon la configuration de la redirection). */
const PARAMS = ["membership_id", "membership", "license_key", "id"];

export default function Activate() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const submit = useCallback(
    async (membership: string) => {
      setState("loading");
      const res = await fetch("/api/whop/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membership }),
      }).catch(() => null);
      if (res?.ok) {
        router.replace("/ma-semaine?bienvenue=1");
        return;
      }
      const data = (await res?.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Impossible de vérifier ton abonnement pour le moment.");
      setState("error");
    },
    [router],
  );

  useEffect(() => {
    const fromWhop = PARAMS.map((k) => params.get(k)).find(Boolean);
    if (fromWhop) {
      setValue(fromWhop);
      submit(fromWhop);
    }
  }, [params, submit]);

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-32 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold leading-tight">Activer mon abonnement</h1>
      <p className="mt-3 text-ink-soft">
        Colle l&apos;identifiant d&apos;abonnement (ou la clé de licence) reçu par e-mail de Whop après ton paiement. Ton accès est
        mémorisé sur cet appareil.
      </p>
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) submit(value.trim());
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="mem_XXXXXXXX ou clé de licence"
          aria-label="Identifiant d'abonnement Whop"
          className="w-full rounded-2xl border border-line bg-white px-5 py-4 outline-none focus:border-ink"
        />
        <button disabled={state === "loading"} className="flex w-full items-center justify-center gap-2 rounded-full bg-tomato py-4 font-semibold text-white transition hover:bg-tomato-dark disabled:opacity-60">
          {state === "loading" && <Loader2 size={18} className="animate-spin" />} Activer
        </button>
      </form>
      {state === "error" && <p className="mt-4 rounded-2xl bg-tomato/10 p-4 text-sm text-tomato-dark" role="alert">{error}</p>}
    </div>
  );
}
