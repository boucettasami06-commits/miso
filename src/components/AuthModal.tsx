"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { notifyAuthChange, type PublicUser } from "@/lib/useAuth";

type Mode = "signup" | "login";

export default function AuthModal({
  initialMode = "signup",
  title,
  subtitle,
  onClose,
  onSuccess,
}: {
  initialMode?: Mode;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onSuccess: (u: PublicUser) => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", consent: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => null);
    const data = (await res?.json().catch(() => null)) as { user?: PublicUser; error?: string } | null;
    setBusy(false);
    if (res?.ok && data?.user) {
      notifyAuthChange();
      onSuccess(data.user);
    } else setError(data?.error ?? "Une erreur est survenue, réessaie.");
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const input = "w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-ink";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "signup" ? "Créer un compte" : "Se connecter"}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-cream p-6 sm:rounded-[2rem] sm:p-8"
      >
        <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-cream-2" aria-label="Fermer">
          <X size={18} />
        </button>
        <h2 className="pr-8 font-display text-3xl font-extrabold leading-tight">
          {mode === "signup" ? title ?? "Crée ton compte" : "Content de te revoir"}
        </h2>
        <p className="mt-2 text-ink-soft">
          {mode === "signup" ? subtitle ?? "Ta semaine et ta liste de courses seront enregistrées dans ton compte." : "Connecte-toi pour retrouver ta semaine."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <input className={input} placeholder="Prénom" autoComplete="given-name" required value={form.firstName} onChange={set("firstName")} aria-label="Prénom" />
              <input className={input} placeholder="Nom" autoComplete="family-name" required value={form.lastName} onChange={set("lastName")} aria-label="Nom" />
            </div>
          )}
          <input className={input} type="email" placeholder="Adresse e-mail" autoComplete="email" required value={form.email} onChange={set("email")} aria-label="Adresse e-mail" />
          <input
            className={input}
            type="password"
            placeholder={mode === "signup" ? "Mot de passe (8 caractères min.)" : "Mot de passe"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={mode === "signup" ? 8 : undefined}
            value={form.password}
            onChange={set("password")}
            aria-label="Mot de passe"
          />
          {mode === "signup" && (
            <label className="flex items-start gap-3 pt-1 text-sm text-ink-soft">
              <input type="checkbox" checked={form.consent} onChange={set("consent")} required className="mt-0.5 h-4 w-4 accent-tomato" />
              <span>
                J&apos;accepte la{" "}
                <Link href="/confidentialite" target="_blank" className="font-semibold text-ink underline underline-offset-2">
                  politique de confidentialité
                </Link>
                .
              </span>
            </label>
          )}
          {mode === "login" && (
            <p className="text-right text-sm">
              <Link href="/mot-de-passe-oublie" onClick={onClose} className="text-ink-soft underline-offset-2 hover:text-ink hover:underline">
                Mot de passe oublié ?
              </Link>
            </p>
          )}
          {error && <p className="rounded-2xl bg-tomato/10 p-3 text-sm text-tomato-dark" role="alert">{error}</p>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-tomato py-4 text-lg font-semibold text-white transition hover:bg-tomato-dark disabled:opacity-60">
            {busy && <Loader2 size={18} className="animate-spin" />}
            {mode === "signup" ? "Créer mon compte" : "Me connecter"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-soft">
          {mode === "signup" ? "Déjà un compte ? " : "Pas encore de compte ? "}
          <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} className="font-semibold text-tomato">
            {mode === "signup" ? "Se connecter" : "Créer un compte"}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
