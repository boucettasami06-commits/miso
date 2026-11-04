"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { unsplash } from "@/lib/data/recipes";

/**
 * Fond de la page d'accueil : scènes de vie (cuisine à la maison, courses au supermarché) en fondu enchaîné.
 * Photos Unsplash vérifiées automatiquement (reconnaissance d'image) avant d'être retenues.
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

export default function HeroBackdrop() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % SCENES.length), DURATION);
    return () => clearInterval(t);
  }, [reduce]);

  const scene = SCENES[i];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={scene.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.6 }, scale: { duration: DURATION / 1000 + 2, ease: "linear" } }}
        >
          <Image src={unsplash(scene.id, 2400)} alt="" fill priority={i === 0} sizes="100vw" quality={70} className="object-cover" />
        </motion.div>
      </AnimatePresence>
      {/* Voile crème : le texte reste parfaitement lisible, la photo donne la vie en arrière-plan */}
      <div className="absolute inset-0 bg-cream/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-cream lg:via-cream/85 lg:to-cream/45" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream to-transparent" />
    </div>
  );
}
