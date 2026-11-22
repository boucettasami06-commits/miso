"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Fond de la page d'accueil : scènes de vie (cuisine à la maison, courses au supermarché) en fondu enchaîné, sans filtre.
 * Photos Unsplash servies en très haute définition (jusqu'à 3840 px de large, soit la 4K) :
 * sur mobile, un recadrage vertical dédié évite d'agrandir (et donc de flouter) une photo paysage.
 */
const SCENES = [
  { id: "photo-1556910103-1c02745aae4d", alt: "Amis qui cuisinent ensemble dans une cuisine" },
  { id: "photo-1604719312566-8912e9227c6a", alt: "Rayon d'un supermarché" },
  { id: "photo-1556909114-f6e7ad7d3136", alt: "Repas préparé à la maison" },
  { id: "photo-1583258292688-d0213dc5a3a8", alt: "Allée de supermarché" },
  { id: "photo-1556910096-6f5e72db6803", alt: "Cuisine maison en famille" },
  { id: "photo-1534723452862-4c874018d66d", alt: "Courses au supermarché" },
];

const DURATION = 7000;
const src = (id: string, params: string) => `https://images.unsplash.com/${id}?auto=format&q=85&${params}`;

function Scene({ id, eager }: { id: string; eager: boolean }) {
  return (
    <picture>
      {/* Mobile et tablette : photo recadrée en portrait, nette jusqu'aux écrans 3x */}
      <source
        media="(max-width: 1023px)"
        sizes="100vw"
        srcSet={[828, 1170, 1440].map((w) => `${src(id, `w=${w}&h=${Math.round(w * 1.4)}&fit=crop&crop=faces,center`)} ${w}w`).join(", ")}
      />
      {/* Ordinateur : jusqu'à la 4K (3840 px) */}
      <img
        src={src(id, "w=2560")}
        srcSet={[1920, 2560, 3840].map((w) => `${src(id, `w=${w}`)} ${w}w`).join(", ")}
        sizes="100vw"
        alt=""
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  );
}

export default function HeroBackdrop({ mobileHeight }: { mobileHeight?: number }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % SCENES.length), DURATION);
    return () => clearInterval(t);
  }, [reduce]);

  // Précharge la scène suivante pour un fondu sans saut
  const next = SCENES[(i + 1) % SCENES.length];
  const scene = SCENES[i];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[var(--hero-h)] overflow-hidden lg:bottom-0 lg:h-auto"
      style={{ ["--hero-h" as string]: mobileHeight ? `${mobileHeight}px` : "100%" }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={scene.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.6 }, scale: { duration: DURATION / 1000 + 2, ease: "linear" } }}
        >
          <Scene id={scene.id} eager={i === 0} />
        </motion.div>
      </AnimatePresence>
      <div className="invisible absolute h-px w-px overflow-hidden">
        <Scene id={next.id} eager={false} />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream to-transparent" />
    </div>
  );
}
