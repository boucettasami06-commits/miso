import Link from "next/link";
import { ArrowRight, ChefHat, ListChecks, Recycle, Target, Wallet } from "lucide-react";
import Hero from "@/components/home/Hero";
import BudgetSimulator from "@/components/home/BudgetSimulator";
import Reveal from "@/components/Reveal";
import SmartImage from "@/components/SmartImage";
import RecipeCard from "@/components/RecipeCard";
import { STORES } from "@/lib/data/stores";
import { RECIPES } from "@/lib/data/recipes";

const STEPS = [
  { icon: Target, title: "Ton profil", text: "Objectif, corps, foyer, régime, allergies, temps en cuisine. 6 questions, 90 secondes." },
  { icon: Wallet, title: "Ton budget", text: "Tu fixes ton enveloppe hebdo et tes enseignes. Mijo optimise chaque centime." },
  { icon: ChefHat, title: "Ta semaine", text: "7 jours de repas, des portions calculées pour toi et une liste de courses par rayon." },
];

const PROFILES = [
  { id: "sain", title: "Healthy", kicker: "Mincir & se sentir bien", text: "Déficit léger de 15 %, légumes à chaque repas, protéines maigres. Sans frustration.", photo: "photo-1512621776951-a57141f2eefd", emoji: "🥗", color: "bg-sage-light" },
  { id: "muscle", title: "Musculation", kicker: "Prise de masse & force", text: "1,9 g de protéines/kg, surplus calorique maîtrisé, portions XL calculées pour ton gabarit.", photo: "photo-1490645935967-10de6ba17061", emoji: "💪", color: "bg-saffron/30" },
  { id: "equilibre", title: "Équilibré", kicker: "Manger normalement, mais mieux", text: "Des repas variés, maison et rapides, qui plaisent à tout le foyer.", photo: "photo-1529042410759-befb1204b468", emoji: "🍽️", color: "bg-cream-2" },
  { id: "gourmand", title: "Gourmand", kicker: "Comfort food assumée", text: "Burger, tartiflette, pizza maison… Le plaisir du fast-food, le prix et la qualité du fait-maison.", photo: "photo-1568901346375-23c9450c58cd", emoji: "🍔", color: "bg-tomato/15" },
];

const FAQ = [
  { q: "Comment Mijo calcule-t-il le prix de mes courses ?", a: "Chaque ingrédient a un prix de référence par conditionnement réel (boîte, paquet, filet), ajusté selon l'indice de prix moyen de chaque enseigne. Mijo calcule ce que tu paies vraiment en caisse — des paquets entiers — et privilégie les recettes qui réutilisent les mêmes ingrédients pour limiter le gaspillage." },
  { q: "Les menus sont-ils adaptés à la musculation ?", a: "Oui. En mode Musculation, Mijo calcule ta dépense énergétique (formule de Mifflin-St Jeor), ajoute un surplus de 12 % et vise environ 1,9 g de protéines par kilo. Chaque portion est agrandie ou réduite pour coller à tes besoins." },
  { q: "Puis-je faire un menu végétarien, vegan, sans porc ou sans gluten ?", a: "Bien sûr. Tu choisis ton régime (omnivore, flexitarien, pescétarien, végétarien, vegan), tes restrictions (sans porc, sans gluten, sans lactose) et tes allergies. Les recettes incompatibles sont exclues automatiquement." },
  { q: "Est-ce que je peux remplacer une recette qui ne me plaît pas ?", a: "En un clic. Mijo te propose une alternative qui respecte ton budget, ton objectif et la variété de la semaine, et met à jour la liste de courses instantanément." },
  { q: "C'est quoi le mode « restes du midi » ?", a: "Le soir, tu cuisines une portion en plus que tu emportes le lendemain midi. Moins de temps en cuisine, moins de gaspillage, et un budget qui fond moins vite." },
  { q: "Mijo est-il gratuit ?", a: "Oui, la génération de menus et la liste de courses sont gratuites et ne demandent aucune inscription. Tes données restent sur ton appareil." },
];

export default function Home() {
  const showcase = ["poulet-curry-coco-riz-basmati", "saumon-roti-patate-douce-haricots-verts", "burger-maison-potatoes", "buddha-bowl-pois-chiches-quinoa", "pancakes-banane-avoine", "chili-con-carne", "pizza-maison-jambon-champignons", "wok-nouilles-crevettes-legumes"]
    .map((s) => RECIPES.find((r) => r.slug === s)!)
    .filter(Boolean);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Hero />

      {/* Enseignes */}
      <section aria-label="Enseignes comparées" className="border-y border-line bg-white/40 py-6">
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-14 pr-14">
            {[...STORES, ...STORES].map((s, i) => (
              <span key={i} className="whitespace-nowrap font-display text-2xl font-semibold text-ink/35 sm:text-3xl">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tomato">Comment ça marche</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-6xl">
            Trois étapes. <em>Zéro</em> prise de tête.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12} className="group relative overflow-hidden rounded-[2rem] border border-line bg-white/60 p-8 transition hover:-translate-y-1 hover:shadow-xl">
              <span className="absolute -right-2 -top-6 font-display text-[9rem] font-bold leading-none text-cream-2 transition group-hover:text-saffron/30">
                {i + 1}
              </span>
              <s.icon className="relative text-tomato" size={28} />
              <h3 className="relative mt-6 font-display text-2xl font-medium">{s.title}</h3>
              <p className="relative mt-3 text-ink-soft">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Profils */}
      <section id="profils" className="scroll-mt-24 bg-white/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tomato">Un menu qui te ressemble</p>
              <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-6xl">Quatre façons de manger. Une seule appli.</h2>
            </div>
            <p className="max-w-sm text-ink-soft">Le même budget ne donne pas le même menu selon que tu prépares une compétition ou un dimanche en famille.</p>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROFILES.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <Link href={`/planifier?objectif=${p.id}`} className={`group block h-full overflow-hidden rounded-[2rem] ${p.color} transition hover:-translate-y-1 hover:shadow-xl`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <SmartImage photo={p.photo} emoji={p.emoji} alt={`Menu ${p.title}`} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw" className="object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">{p.kicker}</p>
                    <h3 className="mt-2 flex items-center justify-between font-display text-3xl font-medium">
                      {p.title}
                      <ArrowRight className="transition group-hover:translate-x-1" size={22} />
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.text}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BudgetSimulator />

      {/* Liste de courses */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <Reveal className="relative aspect-square overflow-hidden rounded-[2.5rem]">
          <SmartImage photo="photo-1542838132-92c53300491e" emoji="🛒" alt="Rayon fruits et légumes d'un supermarché" fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
          <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-white/90 p-5 backdrop-blur">
            {[["Fruits & légumes", "7 articles", "9,40 €"], ["Crèmerie & frais", "5 articles", "11,25 €"], ["Épicerie salée", "6 articles", "8,10 €"]].map(([a, b, c]) => (
              <div key={a} className="flex items-center justify-between border-b border-line py-2 text-sm last:border-0">
                <span className="font-semibold">{a}</span>
                <span className="text-ink-soft">{b}</span>
                <span className="font-display text-base">{c}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tomato">La liste de courses intelligente</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">Tu achètes juste ce qu&apos;il faut, au bon endroit.</h2>
          <ul className="mt-8 space-y-6">
            {[
              { icon: ListChecks, t: "Rangée par rayon", d: "Ta liste suit le parcours du magasin. Tu coches, tu avances, tu sors." },
              { icon: Recycle, t: "Anti-gaspi natif", d: "Mijo choisit des recettes qui partagent leurs ingrédients : le reste du paquet de lundi sert jeudi." },
              { icon: Wallet, t: "16 enseignes comparées", d: "Lidl, Aldi, Netto, Leclerc, Auchan, Carrefour, Intermarché, Super U, Casino, Monoprix, Grand Frais, Biocoop… : tu vois où ton panier coûte le moins." },
            ].map((f) => (
              <li key={f.t} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage-light text-ink">
                  <f.icon size={22} />
                </span>
                <div>
                  <p className="font-display text-xl">{f.t}</p>
                  <p className="mt-1 text-ink-soft">{f.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Recettes */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-medium leading-tight sm:text-6xl">
              Ce qui mijote <em className="text-tomato">cette semaine</em>
            </h2>
            <Link href="/recettes" className="hidden shrink-0 items-center gap-2 font-semibold hover:text-tomato sm:flex">
              Toutes les recettes <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
        <div className="no-scrollbar mt-12 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {showcase.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.05} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[22rem]">
              <RecipeCard r={r} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Reveal>
          <h2 className="text-center font-display text-4xl font-medium sm:text-5xl">Questions fréquentes</h2>
        </Reveal>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition group-open:rotate-45 group-open:bg-ink group-open:text-cream">+</span>
              </summary>
              <p className="mt-4 leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-tomato px-6 py-20 text-center text-white sm:px-16">
          <div aria-hidden className="absolute -left-20 -top-20 h-72 w-72 animate-spin-slow rounded-full border-[40px] border-white/10" />
          <div aria-hidden className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-saffron/40 blur-2xl" />
          <h2 className="relative mx-auto max-w-3xl font-display text-4xl font-medium leading-tight sm:text-6xl">
            Ce soir, tu sais déjà ce que tu manges.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg text-white/85">Ta première semaine est prête en moins de 2 minutes. Sans compte, sans carte bancaire.</p>
          <Link href="/planifier" className="group relative mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-lg font-semibold transition hover:-translate-y-0.5 hover:bg-plum">
            Créer ma semaine <ArrowRight className="transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
