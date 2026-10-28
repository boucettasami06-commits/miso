import type { Metadata } from "next";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import Reveal from "@/components/Reveal";
import { RECIPES } from "@/lib/data/recipes";
import type { Goal } from "@/lib/types";

export const metadata: Metadata = {
  title: "Recettes faciles et pas chères pour toute la semaine",
  description: `${RECIPES.length} recettes maison, rapides et économiques : petits-déjeuners, plats healthy, recettes musculation riches en protéines et comfort food.`,
  alternates: { canonical: "/recettes" },
};

const FILTERS: { id: "all" | Goal | "breakfast"; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "breakfast", label: "Petits-déj" },
  { id: "sain", label: "Healthy" },
  { id: "muscle", label: "Musculation" },
  { id: "equilibre", label: "Équilibré" },
  { id: "gourmand", label: "Gourmand" },
];

export default async function Page({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  const { f = "all", q = "" } = await searchParams;
  const term = q.trim().toLowerCase();
  const list = RECIPES.filter((r) => {
    if (f === "breakfast" && r.meal !== "breakfast") return false;
    if (["sain", "muscle", "equilibre", "gourmand"].includes(f) && r.fit[f as Goal] < 3) return false;
    if (term && !`${r.title} ${r.description} ${r.cuisine}`.toLowerCase().includes(term)) return false;
    return true;
  });

  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: RECIPES.map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `/recettes/${r.slug}`, name: r.title })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tomato">Le carnet de recettes</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-medium leading-[1.02] sm:text-7xl">
          Des recettes <em className="text-tomato">simples</em>, bonnes et pas chères.
        </h1>
      </Reveal>
      <form className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center" action="/recettes">
        <input type="hidden" name="f" value={f} />
        <input name="q" defaultValue={q} placeholder="Rechercher : curry, pâtes, saumon…" className="w-full rounded-full border border-line bg-white/70 px-5 py-3 outline-none focus:border-ink sm:max-w-sm" aria-label="Rechercher une recette" />
        <nav className="flex flex-wrap gap-2" aria-label="Filtres">
          {FILTERS.map((x) => (
            <Link key={x.id} href={`/recettes?f=${x.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${f === x.id ? "bg-ink text-cream" : "border border-line bg-white/60 hover:border-ink"}`}>
              {x.label}
            </Link>
          ))}
        </nav>
      </form>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((r, i) => (
          <Reveal key={r.slug} delay={(i % 4) * 0.06}>
            <RecipeCard r={r} priority={i < 4} />
          </Reveal>
        ))}
      </div>
      {!list.length && <p className="mt-12 text-center text-ink-soft">Aucune recette ne correspond. Essaie un autre mot-clé.</p>}
    </div>
  );
}
