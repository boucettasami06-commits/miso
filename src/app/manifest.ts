import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Budgemy — Menu de la semaine",
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/ma-semaine",
    display: "standalone",
    background_color: "#fafaf5",
    theme_color: "#ff5a1f",
    lang: "fr",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
