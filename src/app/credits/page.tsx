import type { Metadata } from "next";
import Link from "next/link";
import { RECIPES } from "@/lib/data/recipes";

export const metadata: Metadata = {
  title: "Crédits photos",
  description: "Auteurs et licences des photographies utilisées sur le site.",
  alternates: { canonical: "/credits" },
};

/** Attribution des photos sous licence libre (exigée par les licences Creative Commons BY / BY-SA). */
export default function Page() {
  const credited = RECIPES.filter((r) => r.credit);
  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 md:pt-36">
      <h1 className="font-display text-5xl font-extrabold">Crédits photos</h1>
      <p className="mt-4 text-ink-soft">
        Merci aux photographes qui partagent leur travail sous licence libre. Les autres images proviennent d&apos;Unsplash (licence
        Unsplash).
      </p>
      <ul className="mt-10 divide-y divide-line">
        {credited.map((r) => (
          <li key={r.slug} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <Link href={`/recettes/${r.slug}`} className="font-semibold hover:text-tomato">{r.title}</Link>
            <a href={r.credit!.url} target="_blank" rel="noopener nofollow" className="text-sm text-ink-soft hover:text-ink">
              {r.credit!.author} · {r.credit!.source}{r.credit!.license ? ` · ${r.credit!.license}` : ""}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
