"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import { useAuth } from "@/lib/useAuth";

/** Pages laissées accessibles sans compte (obligations légales, récupération d'accès). */
const OPEN_PATHS = ["/confidentialite", "/credits", "/mot-de-passe-oublie", "/reinitialiser"];

/**
 * Sur la page d'accueil, tout clic sur un lien ou un bouton d'un visiteur non connecté
 * ouvre l'inscription. Une fois inscrit, il est emmené là où il voulait aller.
 * Exception : les éléments marqués `data-no-gate` (ex. « Connexion ») et ce qui est dans une fenêtre modale.
 */
export default function SignupGate() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const next = useRef<string | null>(null);
  const active = pathname === "/" && auth.enabled && !auth.loading && !auth.user;

  useEffect(() => {
    if (!active) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button");
      if (!el || el.closest("[role=dialog], [data-no-gate]")) return;
      const href = el instanceof HTMLAnchorElement ? el.getAttribute("href") : null;
      if (href && OPEN_PATHS.some((p) => href.startsWith(p))) return;
      e.preventDefault();
      e.stopPropagation();
      next.current = href;
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <AuthModal
          title="Crée ton compte pour continuer"
          subtitle="30 secondes et c'est parti : ta semaine de repas et ta liste de courses, calculées pour ton budget."
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            const href = next.current;
            next.current = null;
            if (href) router.push(href);
          }}
        />
      )}
    </AnimatePresence>
  );
}
