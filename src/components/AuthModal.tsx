"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { event } from "@/lib/funnel";
import { notifyAuthChange, useAuth, type PublicUser } from "@/lib/useAuth";

type Mode = "signup" | "login";

export default function AuthModal({
  initialMode = "signup",
  title,
  subtitle,
  onClose,
  onSuccess,
  dismissible = true,
  next,
}: {
  initialMode?: Mode;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onSuccess: (u: PublicUser) => void;
  /** false : inscription obligatoire, la fenêtre ne peut pas être fermée. */
  dismissible?: boolean;
  /** page où revenir après « Continuer avec Google » (par défaut : la page actuelle) */
  next?: string;
}) {
  const { google } = useAuth();
  const startGoogle = () => {
    const to = next ?? location.pathname + location.search;
    location.href = `/api/auth/google?next=${encodeURIComponent(to)}`;
  };
  const [mode, setMode] = useState<Mode>(initialMode);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", consent: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => dismissible && e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, dismissible]);

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
      event(mode === "signup" ? "signup_ok" : "login_ok");
      notifyAuthChange();
      onSuccess(data.user);
    } else setError(data?.error ?? "Une erreur est survenue, réessaie.");
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const input = "w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-ink";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6" onClick={dismissible ? onClose : undefined}>
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
        {dismissible && (
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-cream-2" aria-label="Fermer">
            <X size={18} />
          </button>
        )}
        <h2 className="pr-8 font-display text-3xl font-extrabold leading-tight">
          {mode === "signup" ? title ?? "Crée ton compte" : "Content de te revoir"}
        </h2>
        <p className="mt-2 text-ink-soft">
          {mode === "signup" ? subtitle ?? "Ta semaine et ta liste de courses seront enregistrées dans ton compte." : "Connecte-toi pour retrouver ta semaine."}
        </p>

        {google && (
          <>
            <button
              type="button"
              onClick={startGoogle}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-line bg-white py-3.5 font-semibold transition hover:border-ink"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
              </svg>
              {mode === "signup" ? "S'inscrire avec Google" : "Se connecter avec Google"}
            </button>
            {mode === "signup" && (
              <p className="mt-2 text-center text-xs text-ink-soft">
                En continuant avec Google, tu acceptes la{" "}
                <Link href="/confidentialite" target="_blank" className="underline underline-offset-2">
                  politique de confidentialité
                </Link>
                .
              </p>
            )}
            <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              <span className="h-px flex-1 bg-line" /> ou avec ton e-mail <span className="h-px flex-1 bg-line" />
            </div>
          </>
        )}

        <form onSubmit={submit} className={google ? "space-y-3" : "mt-6 space-y-3"}>
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
