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
