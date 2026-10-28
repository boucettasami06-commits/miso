import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import { MENUS } from "@/lib/data/menus";

export const metadata: Metadata = {
  title: "Menus de la semaine : idées de menus types et listes de courses",
  description: "Menu pas cher, musculation, healthy, végétarien, famille, étudiant… des menus de la semaine prêts à l'emploi, avec la liste de courses.",
  alternates: { canonical: "/menus" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 md:pt-36">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tomato">Menus types</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-medium leading-[1.02] sm:text-7xl">Une semaine prête, pour chaque envie.</h1>
      </Reveal>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MENUS.map((m, i) => (
          <Reveal key={m.slug} delay={(i % 3) * 0.08}>
            <Link href={`/menus/${m.slug}`} className="group block overflow-hidden rounded-[2rem] border border-line bg-white/60 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage photo={m.image} alt={m.h1} fill sizes="(max-width: 768px) 92vw, 30vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h2 className="flex items-center justify-between gap-4 font-display text-2xl">{m.h1}<ArrowRight className="shrink-0 transition group-hover:translate-x-1" /></h2>
                <p className="mt-2 text-sm text-ink-soft">{m.description}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
