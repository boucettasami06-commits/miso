"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import DeviceShowcase from "./DeviceShowcase";
import { STORES } from "@/lib/data/stores";
import { RECIPES } from "@/lib/data/recipes";
import HeroBackdrop from "./HeroBackdrop";

export default function Hero() {
  // Sur mobile, la photo couvre uniquement la zone du titre et des boutons (pas l'aperçu de l'appli en dessous)
  const section = useRef<HTMLElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [photoH, setPhotoH] = useState<number>();
  useEffect(() => {
    const measure = () => {
      if (!section.current || !text.current) return;
      setPhotoH(Math.round(text.current.getBoundingClientRect().bottom - section.current.getBoundingClientRect().top + 48));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (text.current) ro.observe(text.current);
    return () => ro.disconnect();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <HeroBackdrop mobileHeight={photoH} />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.15fr]">
        <div ref={text}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur"
          >
            <Sparkles size={14} className="text-tomato" /> Ta semaine prête en 2 minutes
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-extrabold leading-[1.02] text-balance text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.45),0_4px_28px_rgba(0,0,0,0.55)]"
          >
            Tes menus de la semaine + ta liste de courses <span className="text-tomato">selon ton budget</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 max-w-lg text-lg leading-relaxed font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8),0_2px_18px_rgba(0,0,0,0.7)] sm:text-xl"
          >
            Mange mieux, dépense moins : petit-déj, midi et soir planifiés, au meilleur prix dans ton magasin. <b className="text-white">En 2 minutes.</b>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/planifier"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-8 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(250,101,76,0.7)] transition hover:-translate-y-0.5 hover:bg-tomato-dark"
            >
              Créer ma semaine
              <ArrowRight size={20} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/menus"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 bg-black/25 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/25"
            >
              Voir un exemple
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7),0_2px_12px_rgba(0,0,0,0.6)]"
          >
            {[`🇫🇷 🇧🇪 🇨🇭 🇩🇪 ${STORES.length} enseignes`, `${RECIPES.length} recettes faciles`, "Adapté à ton matériel"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check size={16} className="text-tomato" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <DeviceShowcase />
      </div>
    </section>
  );
}
