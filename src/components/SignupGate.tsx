"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import { event } from "@/lib/funnel";
import { useAuth } from "@/lib/useAuth";

/**
 * Tout bouton « Créer ma semaine » (lien vers /planifier) ouvre d'abord l'inscription ;
 * une fois le compte créé (ou la connexion faite), le questionnaire démarre directement.
 * Un visiteur déjà connecté va droit au questionnaire.
 */
export default function SignupGate() {
  const auth = useAuth();
  const router = useRouter();
  const [target, setTarget] = useState<string | null>(null);

  // Retour de « Continuer avec Google » : on mesure l'inscription ou la connexion, puis on nettoie l'adresse
  useEffect(() => {
    const url = new URL(location.href);
    const a = url.searchParams.get("auth");
    if (!a?.startsWith("google_")) return;
    if (a === "google_inscription") event("signup_ok", { via: "google" });
    else if (a === "google_connexion") event("login_ok", { via: "google" });
    else if (a === "google_erreur") alert("La connexion avec Google n'a pas abouti. Réessaie, ou inscris-toi avec ton e-mail.");
    url.searchParams.delete("auth");
    url.searchParams.delete("raison");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!auth.enabled || auth.user || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.closest("[data-no-gate]")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith("/planifier")) return;
      e.preventDefault();
      e.stopPropagation();
      setTarget(url.pathname + url.search);
      event("signup_open", { from: "creer_ma_semaine" });
    };
    // Phase de capture : on passe avant la navigation de next/link
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [auth.enabled, auth.user]);

  if (!target) return null;
  return (
    <AuthModal
      next={target}
      title="Crée ton compte gratuit"
      subtitle="Ensuite, on prépare ta semaine de repas et ta liste de courses en 2 minutes."
      onClose={() => setTarget(null)}
      onSuccess={() => {
        const to = target;
        setTarget(null);
        router.push(to);
      }}
    />
  );
}
