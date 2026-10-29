"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("busy");
    const res = await fetch("/api/auth/forgot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
    if (res?.ok) return setState("sent");
    const d = (await res?.json().catch(() => null)) as { error?: string } | null;
    setError(d?.error ?? "Une erreur est survenue, réessaie.");
    setState("error");
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-32 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold leading-tight">Mot de passe oublié</h1>
      {state === "sent" ? (
        <div className="mt-6 rounded-2xl bg-sage-light p-5">
          <p className="font-semibold">C&apos;est parti ✉️</p>
          <p className="mt-1 text-ink-soft">Si un compte existe avec cette adresse, tu vas recevoir un lien pour choisir un nouveau mot de passe (valable 1 heure). Pense à vérifier tes spams.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <p className="text-ink-soft">Indique l&apos;adresse e-mail de ton compte, on t&apos;envoie un lien de réinitialisation.</p>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Adresse e-mail" autoComplete="email" aria-label="Adresse e-mail" className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-ink" />
          {state === "error" && <p className="rounded-2xl bg-tomato/10 p-3 text-sm text-tomato-dark" role="alert">{error}</p>}
          <button disabled={state === "busy"} className="flex w-full items-center justify-center gap-2 rounded-full bg-tomato py-4 font-semibold text-white transition hover:bg-tomato-dark disabled:opacity-60">
            {state === "busy" && <Loader2 size={18} className="animate-spin" />} Recevoir le lien
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link href="/" className="text-ink-soft hover:text-ink">Retour à l&apos;accueil</Link></p>
    </div>
  );
}
