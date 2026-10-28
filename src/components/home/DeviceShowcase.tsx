"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Flame, ShoppingBasket } from "lucide-react";
import SmartImage from "../SmartImage";
import { RECIPE_BY_SLUG } from "@/lib/data/recipes";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const WEEK = [
  ["porridge-banane-beurre-de-cacahuete", "bowl-poulet-teriyaki-brocoli", "saumon-roti-patate-douce-haricots-verts"],
  ["skyr-bowl-fruits-rouges-amandes", "saumon-roti-patate-douce-haricots-verts", "poulet-curry-coco-riz-basmati"],
  ["pancakes-banane-avoine", "poulet-curry-coco-riz-basmati", "lasagnes-bolognaise"],
  ["omelette-epinards-feta", "lasagnes-bolognaise", "wok-nouilles-crevettes-legumes"],
  ["tartines-avocat-oeuf-mollet", "buddha-bowl-pois-chiches-quinoa", "pizza-maison-jambon-champignons"],
  ["crepes-maison-chocolat", "burger-maison-potatoes", "poke-bowl-saumon"],
  ["pain-perdu-brioche-miel", "poulet-roti-pommes-de-terre", "tartiflette"],
];
const LIST = [
  ["Filets de poulet", "5,14 €"],
  ["Pavés de saumon", "5,25 €"],
  ["Riz basmati", "2,09 €"],
  ["Brocoli", "1,79 €"],
  ["Patates douces", "2,61 €"],
  ["Œufs plein air", "3,21 €"],
  ["Skyr nature", "2,15 €"],
];
const MEALS = ["Petit-déj", "Midi", "Soir"];


/** Ordinateur + smartphone qui « jouent » l'application en boucle. */
export default function DeviceShowcase() {
  const [day, setDay] = useState(0);
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setDay((d) => (d + 1) % 7), 2600);
    const u = setInterval(() => setChecked((c) => (c >= LIST.length ? 0 : c + 1)), 900);
    return () => {
      clearInterval(t);
      clearInterval(u);
    };
  }, []);

  const spent = 47.8;
  const budget = 50;

  return (
    <div className="relative mx-auto w-full max-w-[620px] pb-10 pr-6 sm:pr-10">
      {/* Ordinateur */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: 1200 }}
      >
        <div className="rounded-t-[1.4rem] border-[10px] border-b-0 border-ink bg-ink shadow-2xl">
          <div className="flex items-center gap-1.5 bg-ink px-2 pb-2">
            <span className="h-2 w-2 rounded-full bg-tomato" />
            <span className="h-2 w-2 rounded-full bg-saffron" />
            <span className="h-2 w-2 rounded-full bg-sage" />
            <span className="ml-3 flex-1 truncate rounded-md bg-white/10 px-2 py-0.5 text-[9px] text-white/50">mijo.app/ma-semaine</span>
          </div>
          <div className="aspect-[16/10] overflow-hidden rounded-t-md bg-cream p-3 pr-[30%] sm:p-4 sm:pr-[30%]">
            {/* Barre budget */}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-ink px-3 py-2 text-cream">
              <div className="flex items-center gap-2 text-[10px] text-cream/60 sm:text-xs">
                <ShoppingBasket size={12} /> Panier Lidl
              </div>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sage to-saffron"
                  animate={{ width: ["0%", `${(spent / budget) * 100}%`] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3, ease: "easeOut" }}
                />
              </div>
              <span className="font-display text-xs font-bold sm:text-sm">47,80 € <span className="font-normal text-cream/50">/ 50 €</span></span>
            </div>
            {/* Jours */}
            <div className="mt-2.5 flex gap-1">
              {DAYS.map((d, i) => (
                <div key={d} className="relative flex-1 rounded-lg py-1 text-center text-[9px] font-semibold sm:text-[11px]">
                  {day === i && <motion.span layoutId="device-day" className="absolute inset-0 rounded-lg bg-tomato" transition={{ type: "spring", bounce: 0.25 }} />}
                  <span className={`relative ${day === i ? "text-white" : "text-ink-soft"}`}>{d}</span>
                </div>
              ))}
            </div>
            {/* Repas du jour */}
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <AnimatePresence mode="popLayout">
                {WEEK[day].slice(1).map((slug, j) => {
                  const i = j + 1;
                  const r = RECIPE_BY_SLUG[slug];
                  return (
                    <motion.div
                      key={`${day}-${slug}`}
                      initial={{ opacity: 0, y: 14, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45, delay: j * 0.08 }}
                      className="overflow-hidden rounded-xl bg-white shadow-sm"
                    >
                      <div className="relative aspect-[4/3]">
                        <SmartImage photo={r.image} emoji={r.emoji} alt="" fill sizes="160px" className="object-cover" />
                        <span className="absolute left-1 top-1 rounded-full bg-white/90 px-1.5 text-[7px] font-bold uppercase sm:text-[8px]">{MEALS[i]}</span>
                      </div>
                      <p className="truncate px-1.5 py-1 text-[8px] font-semibold sm:text-[10px]">{r.title}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {[
                ["2 950", "kcal / jour"],
                ["152 g", "protéines"],
                ["2,28 €", "par repas"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl bg-white px-2 py-1.5 shadow-sm">
                  <p className="font-display text-[11px] font-extrabold sm:text-sm">{v}</p>
                  <p className="text-[7px] text-ink-soft sm:text-[9px]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Socle */}
        <div className="relative mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-2xl bg-gradient-to-b from-[#d9ddd0] to-[#b9bfae] shadow-lg">
          <div className="absolute left-1/2 top-0 h-1.5 w-20 -translate-x-1/2 rounded-b-lg bg-[#a9af9e]" />
        </div>
      </motion.div>

      {/* Smartphone */}
      <motion.div
        initial={{ opacity: 0, y: 60, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-2 right-0 w-[34%] min-w-[150px] max-w-[200px]"
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <div className="rounded-[2rem] border-[7px] border-ink bg-ink shadow-2xl">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[1.5rem] bg-cream">
              <div className="absolute left-1/2 top-1.5 h-3.5 w-14 -translate-x-1/2 rounded-full bg-ink" />
              <div className="px-2.5 pt-7">
                <p className="font-display text-[13px] font-extrabold leading-tight">Mes courses</p>
                <p className="text-[8px] text-ink-soft">Lidl · 23 articles</p>
                <ul className="mt-2 space-y-1">
                  {LIST.map(([name, price], i) => {
                    const done = i < checked;
                    return (
                      <li key={name} className="flex items-center gap-1.5 rounded-lg bg-white px-1.5 py-1 shadow-sm">
                        <motion.span
                          animate={{ backgroundColor: done ? "#1f9d55" : "#ffffff", borderColor: done ? "#1f9d55" : "#e2e7d8" }}
                          className="grid h-3 w-3 shrink-0 place-items-center rounded border"
                        >
                          {done && <Check size={8} className="text-white" strokeWidth={4} />}
                        </motion.span>
                        <span className={`flex-1 truncate text-[8px] font-semibold transition ${done ? "text-ink-soft line-through" : ""}`}>{name}</span>
                        <span className="text-[8px] font-bold">{price}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-2 rounded-xl bg-tomato px-2 py-1.5 text-center text-[9px] font-bold text-white">Total 47,80 €</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Pastille macros */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring" }}
        className="absolute -left-2 top-1/2 hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl sm:flex"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-saffron/40"><Flame size={16} className="text-tomato" /></span>
        <span>
          <span className="block font-display text-sm font-extrabold leading-none">152 g</span>
          <span className="text-[10px] text-ink-soft">protéines / jour</span>
        </span>
      </motion.div>
    </div>
  );
}
