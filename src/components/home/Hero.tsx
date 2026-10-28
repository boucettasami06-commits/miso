"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Flame, ShoppingBasket, Sparkles } from "lucide-react";
import SmartImage from "../SmartImage";

const WORDS = ["sain", "musclé", "gourmand", "équilibré"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBig = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-saffron/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/2 h-[28rem] w-[28rem] rounded-full bg-sage/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink-soft backdrop-blur"
          >
            <Sparkles size={14} className="text-tomato" /> Nouveau · menus petit-déj, midi & soir
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[clamp(2.75rem,7vw,5.75rem)] font-medium leading-[0.95] tracking-tight text-balance"
          >
            Ta semaine de repas,{" "}
            <span className="relative inline-block min-w-[5ch] italic text-tomato">
              <AnimatePresence mode="wait">
                <motion.span
                  key={WORDS[i]}
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
                  transition={{ duration: 0.45 }}
                  className="inline-block"
                >
                  {WORDS[i]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            et pile dans ton budget.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            Dis-nous ton objectif, ton budget et ton supermarché. Mijo compose tes 7 jours de repas, ajuste chaque portion à
            tes besoins et te sort la liste de courses la moins chère. En 2 minutes, gratuitement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/planifier"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-7 py-4 text-base font-semibold text-white shadow-[0_12px_30px_-10px_rgba(226,87,43,0.7)] transition hover:-translate-y-0.5 hover:bg-tomato-dark"
            >
              Générer ma semaine
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/menus"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/50 px-7 py-4 text-base font-semibold backdrop-blur transition hover:border-ink"
            >
              Voir des menus types
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft"
          >
            {["8 enseignes comparées", "Portions calculées pour toi", "Zéro inscription"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check size={16} className="text-sage" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Collage animé */}
        <div className="relative mx-auto h-[480px] w-full max-w-[560px] sm:h-[580px]">
          <motion.div
            style={{ y: yBig, rotate }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 h-[78%] w-[78%] overflow-hidden rounded-[2.5rem] shadow-2xl"
          >
            <SmartImage photo="photo-1546069901-ba9599a7e63c" emoji="🥗" alt="Bowl de légumes frais et colorés" fill priority sizes="(max-width: 1024px) 80vw, 45vw" className="object-cover" />
          </motion.div>
          <motion.div
            style={{ y: ySmall }}
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 h-[46%] w-[48%] overflow-hidden rounded-[2rem] border-[6px] border-cream shadow-2xl"
          >
            <SmartImage photo="photo-1565557623262-b51c2513a641" emoji="🍛" alt="Curry maison servi avec du riz" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
          </motion.div>

          {/* Carte budget */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="absolute -left-2 top-10 w-60 animate-float rounded-3xl bg-white/90 p-4 shadow-xl backdrop-blur sm:-left-8"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              <ShoppingBasket size={14} className="text-tomato" /> Panier Lidl
            </div>
            <p className="mt-2 font-display text-3xl font-semibold">
              47,80 €<span className="text-base font-normal text-ink-soft"> / 50 €</span>
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-2">
              <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} transition={{ delay: 1, duration: 1.4, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-sage to-saffron" />
            </div>
            <p className="mt-2 text-xs text-sage">✓ 2,20 € d&apos;économie vs. ton budget</p>
          </motion.div>

          {/* Carte macros */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{ animationDelay: "1.5s" }}
            className="absolute -right-2 bottom-24 w-56 animate-float rounded-3xl bg-ink p-4 text-cream shadow-xl sm:-right-6"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cream/60">
              <Flame size={14} className="text-saffron" /> Objectif muscle
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                ["2 950", "kcal"],
                ["152 g", "prot."],
                ["7/7", "jours"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-lg font-semibold">{v}</p>
                  <p className="text-[10px] uppercase tracking-wider text-cream/50">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
