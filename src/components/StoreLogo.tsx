"use client";

/* eslint-disable @next/next/no-img-element -- logos SVG statiques, aucune optimisation nécessaire */
import { useState } from "react";
import type { Store } from "@/lib/types";

/** Les couleurs trop claires (ex. jaune Netto) passent en encre pour rester lisibles sur fond crème. */
function readable(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.7 ? "var(--color-ink)" : hex;
}

/**
 * Logo officiel de l'enseigne (fichiers issus de Wikimedia, voir public/brand/stores/SOURCES.md),
 * ou son nom à ses couleurs quand aucun logo libre n'existe.
 */
/** Logos pas encore copiés sur le site : servis directement depuis Wikimedia Commons. */
const REMOTE: Record<string, string> = {
  auchan: "https://upload.wikimedia.org/wikipedia/commons/6/67/Auchan_wordmark.svg",
  colruyt: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Colruyt_logo.svg",
  delhaize: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Delhaize_wordmark.svg",
  denner: "https://upload.wikimedia.org/wikipedia/commons/2/23/Denner-Logo.svg",
  franprix: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Logo_Franprix_-_2015.svg",
  globus: "https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_of_Globus_%282009%29.svg",
  manor: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Logo_Manor_2017.svg",
  spar: "https://upload.wikimedia.org/wikipedia/commons/7/71/SPAR_Logo.svg",
  volg: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Volg-Logo.svg",
};

export default function StoreLogo({ store, height = 40 }: { store: Store; height?: number }) {
  const [failed, setFailed] = useState(false);
  if (store.brand && !failed) {
    const src = REMOTE[store.brand] ?? `/brand/stores/${store.brand}.svg`;
    return (
      <img
        src={src}
        alt={store.name}
        height={height}
        onError={() => setFailed(true)}
        style={{ height, width: "auto", maxWidth: "100%", objectFit: "contain" }}
        loading="lazy"
      />
    );
  }
  return (
    <span className="whitespace-nowrap font-display font-extrabold" style={{ color: readable(store.color), fontSize: Math.round(height * 0.55) }}>
      {store.name}
    </span>
  );
}
