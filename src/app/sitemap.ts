import type { MetadataRoute } from "next";
import { RECIPES } from "@/lib/data/recipes";
import { MENUS } from "@/lib/data/menus";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/planifier`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/menus`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/recettes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...MENUS.map((m) => ({ url: `${SITE.url}/menus/${m.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...RECIPES.map((r) => ({ url: `${SITE.url}/recettes/${r.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
