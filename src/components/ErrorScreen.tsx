"use client";

import { useEffect } from "react";
import { event } from "@/lib/funnel";

const isStaleBuild = (e: Error) => /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(`${e.name} ${e.message}`);

/**
 * Écran d'erreur : après une mise en ligne, une page restée ouverte peut réclamer d'anciens fichiers.
 * Dans ce cas on recharge la page une fois automatiquement ; sinon l'erreur est enregistrée et un bouton permet de réessayer.
 */
export function ErrorScreen({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    event("client_error", { message: `${error.name}: ${error.message}`.slice(0, 300), digest: error.digest ?? "", path: location.pathname });
    if (isStaleBuild(error)) {
      try {
        // Une seule tentative par minute, pour ne jamais boucler
        if (Date.now() - Number(sessionStorage.getItem("bdg:reloaded") ?? 0) > 60_000) {
          sessionStorage.setItem("bdg:reloaded", String(Date.now()));
          location.reload();
        }
      } catch {
        location.reload();
      }
    }
  }, [error]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div className="max-w-md">
        <p className="font-display text-3xl font-extrabold">Oups, un petit souci</p>
        <p className="mt-3 text-ink-soft">La page n&apos;a pas pu s&apos;afficher. Tes réponses et ta semaine sont bien enregistrées.</p>
        <button
          onClick={() => {
            try {
              sessionStorage.removeItem("bdg:reloaded");
            } catch {}
            reset();
            location.reload();
          }}
          className="mt-6 rounded-full bg-tomato px-8 py-4 font-semibold text-white transition hover:bg-tomato-dark"
        >
          Recharger la page
        </button>
      </div>
    </div>
  );
}
