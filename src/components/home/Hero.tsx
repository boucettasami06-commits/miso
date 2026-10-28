"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import DeviceShowcase from "./DeviceShowcase";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-saffron/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/2 h-[28rem] w-[28rem] rounded-full bg-sage/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.15fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink-soft backdrop-blur"
          >
            <Sparkles size={14} className="text-tomato" /> Ta semaine prête en 2 minutes
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[clamp(2.9rem,5.4vw,5rem)] font-extrabold leading-[0.95] text-balance"
          >
            Mange mieux.
            <br />
            <span className="text-tomato">Dépense moins.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft sm:text-xl"
          >
            Tes repas de la semaine et ta liste de courses, calculés pour ton budget. <b className="text-ink">En 2 minutes.</b>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/planifier"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-tomato px-8 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_-10px_rgba(255,90,31,0.7)] transition hover:-translate-y-0.5 hover:bg-tomato-dark"
            >
              Créer ma semaine
              <ArrowRight size={20} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/menus"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/50 px-7 py-4 text-base font-semibold backdrop-blur transition hover:border-ink"
            >
              Voir un exemple
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft"
          >
            {["🇫🇷 🇧🇪 🇨🇭 🇩🇪 45 enseignes", "102 recettes faciles", "Adapté à ton matériel"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check size={16} className="text-sage" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <DeviceShowcase />
      </div>
    </section>
  );
}
