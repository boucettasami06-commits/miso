import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mijo — Menu de la semaine",
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/ma-semaine",
    display: "standalone",
    background_color: "#fbf6ee",
    theme_color: "#e2572b",
    lang: "fr",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
