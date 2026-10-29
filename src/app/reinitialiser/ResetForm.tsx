"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { notifyAuthChange } from "@/lib/useAuth";

export default function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      notifyAuthChange();
      router.replace("/ma-semaine");
      return;
    }
    const d = (await res?.json().catch(() => null)) as { error?: string } | null;
    setError(d?.error ?? "Une erreur est survenue, réessaie.");
  };

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-32 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold leading-tight">Nouveau mot de passe</h1>
      {!token ? (
        <p className="mt-6 text-ink-soft">Lien incomplet. Ouvre directement le lien reçu par e-mail.</p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nouveau mot de passe (8 caractères min.)" autoComplete="new-password" aria-label="Nouveau mot de passe" className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-ink" />
          {error && <p className="rounded-2xl bg-tomato/10 p-3 text-sm text-tomato-dark" role="alert">{error}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-tomato py-4 font-semibold text-white transition hover:bg-tomato-dark disabled:opacity-60">
            {busy && <Loader2 size={18} className="animate-spin" />} Enregistrer et me connecter
          </button>
        </form>
      )}
    </div>
  );
}
