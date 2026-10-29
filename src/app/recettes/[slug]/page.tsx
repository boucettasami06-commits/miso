import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChefHat, Clock, Flame, Wallet } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import RecipeCard from "@/components/RecipeCard";
import Reveal from "@/components/Reveal";
import { RECIPES, RECIPE_BY_SLUG, unsplash } from "@/lib/data/recipes";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { packPrice } from "@/lib/data/stores";
import { recipeNutrition } from "@/lib/engine/nutrition";
import { euro, qty } from "@/lib/format";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = RECIPE_BY_SLUG[slug];
  if (!r) return {};
  return {
    title: `${r.title} — recette facile en ${r.time} min`,
    description: r.description,
    alternates: { canonical: `/recettes/${r.slug}` },
    openGraph: { type: "article", title: r.title, description: r.description, images: r.image ? [{ url: unsplash(r.image, 1200), width: 1200, height: 800, alt: r.title }] : undefined },
  };
}

const LEVEL = ["", "Facile", "Intermédiaire", "Chef"];

/** Coût réel d'une portion (proratisé), au prix de l'enseigne la moins chère. */
function portionCost(slug: string) {
  const r = RECIPE_BY_SLUG[slug];
  return r.ingredients.reduce((a, ri) => a + (ri.qty / INGREDIENTS[ri.id].pack) * packPrice(ri.id, "aldi"), 0);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = RECIPE_BY_SLUG[slug];
  if (!r) notFound();
  const n = recipeNutrition(r);
  const cost = portionCost(r.slug);
  const related = RECIPES.filter((x) => x.slug !== r.slug && x.meal === r.meal && (x.cuisine === r.cuisine || x.protein === r.protein)).slice(0, 4);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.title,
    description: r.description,
    image: r.image ? [unsplash(r.image, 1200), unsplash(r.image, 1920)] : undefined,
    author: { "@type": "Organization", name: SITE.name },
    totalTime: `PT${r.time}M`,
    recipeYield: "1 portion",
    recipeCategory: r.meal === "breakfast" ? "Petit-déjeuner" : "Plat principal",
    recipeCuisine: r.cuisine,
    keywords: `${r.title}, recette facile, recette pas chère, ${r.cuisine}`,
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${n.kcal} kcal`,
      proteinContent: `${n.protein} g`,
      carbohydrateContent: `${n.carbs} g`,
      fatContent: `${n.fat} g`,
    },
    recipeIngredient: r.ingredients.map((ri) => `${qty(ri.qty, INGREDIENTS[ri.id].unit)} ${INGREDIENTS[ri.id].name}`),
    recipeInstructions: r.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Recettes", item: `${SITE.url}/recettes` },
      { "@type": "ListItem", position: 3, name: r.title, item: `${SITE.url}/recettes/${r.slug}` },
    ],
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <header className="relative h-[78vh] min-h-[520px] overflow-hidden">
        <SmartImage photo={r.image} emoji={r.emoji} alt={r.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
        {r.credit && (
          <a href={r.credit.url} target="_blank" rel="noopener nofollow" className="absolute right-4 top-24 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur hover:text-white">
            Photo : {r.credit.author} / {r.credit.source ?? "Pexels"}{r.credit.license ? ` · ${r.credit.license}` : ""}
          </a>
        )}
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-12 text-white sm:px-6">
          <nav className="text-sm text-white/70" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-white">Accueil</Link> / <Link href="/recettes" className="hover:text-white">Recettes</Link>
          </nav>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-medium leading-[1.02] sm:text-7xl">{r.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{r.description}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {[
              [Clock, `${r.time} min`],
              [ChefHat, LEVEL[r.difficulty]],
              [Flame, `${n.kcal} kcal / portion`],
              [Wallet, `≈ ${euro(cost)} / portion`],
            ].map(([Icon, t], i) => {
              const I = Icon as typeof Clock;
              return (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                  <I size={15} /> {t as string}
                </span>
              );
            })}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[22rem_1fr]">
        <aside className="h-fit space-y-6 lg:sticky lg:top-28">
          <div className="rounded-[2rem] border border-line bg-white/60 p-6">
            <h2 className="font-display text-2xl">Ingrédients <span className="text-base text-ink-soft">(1 portion)</span></h2>
            <ul className="mt-4 space-y-2">
              {r.ingredients.map((ri) => (
                <li key={ri.id} className="flex justify-between gap-3 border-b border-line pb-2 text-sm">
                  <span>{INGREDIENTS[ri.id].name}{ri.note ? ` (${ri.note})` : ""}</span>
                  <span className="shrink-0 font-semibold">{qty(ri.qty, INGREDIENTS[ri.id].unit)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-4 gap-2 rounded-[2rem] bg-ink p-5 text-center text-cream">
            {[[n.kcal, "kcal"], [`${n.protein}g`, "prot."], [`${n.carbs}g`, "gluc."], [`${n.fat}g`, "lip."]].map(([v, l]) => (
              <div key={l as string}>
                <p className="font-display text-xl">{v}</p>
                <p className="text-[10px] uppercase tracking-wider text-cream/50">{l}</p>
              </div>
            ))}
          </div>
        </aside>
        <div>
          <h2 className="font-display text-4xl">Préparation</h2>
          <ol className="mt-8 space-y-8">
            {r.steps.map((s, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <li className="flex gap-5">
                  <span className="font-display text-5xl leading-none text-tomato/80">{String(i + 1).padStart(2, "0")}</span>
                  <p className="pt-2 text-lg leading-relaxed">{s}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-14 rounded-[2rem] bg-sage-light p-8">
            <p className="font-display text-2xl">Cette recette dans ta semaine, à ton budget ?</p>
            <p className="mt-2 text-ink-soft">Budgemy ajuste les portions à ton objectif et l&apos;intègre dans un menu complet avec la liste de courses.</p>
            <Link href="/planifier" className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-cream transition hover:bg-tomato">
              Générer mon menu <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-4xl">Dans le même esprit</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((x) => <RecipeCard key={x.slug} r={x} />)}
          </div>
        </section>
      )}
    </article>
  );
}
