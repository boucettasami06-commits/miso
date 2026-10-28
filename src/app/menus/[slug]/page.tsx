import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import { MENUS, MENU_BY_SLUG } from "@/lib/data/menus";
import { RECIPE_BY_SLUG, unsplash } from "@/lib/data/recipes";
import { STORE_BY_ID } from "@/lib/data/stores";
import { DAYS, MEAL_LABEL, dayNutrition, generatePlan } from "@/lib/engine/generator";
import { shoppingList } from "@/lib/engine/pricing";
import { euro, qty } from "@/lib/format";

export function generateStaticParams() {
  return MENUS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = MENU_BY_SLUG[slug];
  if (!m) return {};
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/menus/${m.slug}` },
    openGraph: { title: m.title, description: m.description, images: [{ url: unsplash(m.image, 1200), width: 1200, height: 800 }] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = MENU_BY_SLUG[slug];
  if (!m) notFound();
  // Semaine générée au build par le vrai moteur (graine fixe = page stable pour Google)
  const plan = generatePlan(m.profile, { seed: 2026 });
  const lines = shoppingList(plan.meals, plan.storeId, m.profile.hasPantry);
  const people = m.profile.adults + m.profile.children;

  return (
    <div>
      <header className="relative h-[62vh] min-h-[460px] overflow-hidden">
        <SmartImage photo={m.image} alt={m.h1} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-12 text-white sm:px-6">
          <nav className="text-sm text-white/70"><Link href="/menus">Menus types</Link></nav>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-medium leading-[1.02] sm:text-7xl">{m.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{m.intro}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">{euro(plan.total)} la semaine</span>
            <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">{people} personne{people > 1 ? "s" : ""}</span>
            <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">Le moins cher : {STORE_BY_ID[plan.storeId].name}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-4xl">Le menu jour par jour</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {DAYS.map((d, i) => {
            const meals = plan.meals.filter((x) => x.day === i);
            const n = dayNutrition(plan, i);
            return (
              <Reveal key={d} delay={(i % 4) * 0.06} className="rounded-[1.75rem] border border-line bg-white/60 p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{d}</h3>
                  <span className="text-xs text-ink-soft">{n.kcal} kcal · {n.protein} g prot.</span>
                </div>
                <ul className="mt-4 space-y-3">
                  {meals.map((x) => {
                    const r = RECIPE_BY_SLUG[x.slug];
                    return (
                      <li key={x.meal} className="flex items-center gap-3">
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                          <SmartImage photo={r.image} emoji={r.emoji} alt="" fill sizes="48px" className="object-cover" />
                        </span>
                        <span className="text-sm">
                          <span className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">{MEAL_LABEL[x.meal]}{x.leftoverOf ? " · restes" : ""}</span>
                          <Link href={`/recettes/${r.slug}`} className="font-semibold hover:text-tomato">{r.title}</Link>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <section>
            <h2 className="font-display text-4xl">La liste de courses</h2>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {lines.filter((l) => !l.pantry).map((l) => (
                <li key={l.id} className="flex justify-between gap-3 border-b border-line py-2.5 text-sm">
                  <span>{l.name}</span>
                  <span className="shrink-0 text-ink-soft">{l.packs} × {l.packLabel ?? qty(l.packSize, l.unit)}</span>
                </li>
              ))}
            </ul>
          </section>
          <aside className="h-fit rounded-[2rem] bg-tomato p-8 text-white">
            <p className="font-display text-3xl leading-tight">Adapte ce menu à ton corps et ton budget.</p>
            <p className="mt-3 text-white/85">Portions ajustées à tes besoins, recettes remplaçables en un clic.</p>
            <Link href="/planifier" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold">
              Personnaliser <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
