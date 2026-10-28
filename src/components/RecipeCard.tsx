import Link from "next/link";
import { Clock, Flame } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { recipeNutrition } from "@/lib/engine/nutrition";
import SmartImage from "./SmartImage";

export default function RecipeCard({ r, priority = false }: { r: Recipe; priority?: boolean }) {
  const n = recipeNutrition(r);
  return (
    <Link href={`/recettes/${r.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream-2">
        <SmartImage
          photo={r.image}
          emoji={r.emoji}
          alt={r.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
            <Clock size={12} className="mr-1 inline" />
            {r.time} min
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
            <Flame size={12} className="mr-1 inline text-tomato" />
            {n.kcal} kcal
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 text-white">
          <p className="text-xs uppercase tracking-widest text-white/70">{r.meal === "breakfast" ? "Petit-déj" : r.cuisine}</p>
          <h3 className="mt-1 font-display text-xl font-medium leading-tight">{r.title}</h3>
        </div>
      </div>
    </Link>
  );
}
