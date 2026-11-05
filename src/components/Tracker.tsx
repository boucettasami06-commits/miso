"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { event } from "@/lib/funnel";

/** Une vue de page à chaque navigation, et la profondeur de défilement (25/50/75/100 %) sur la page d'accueil. */
export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    event("page_view");
    if (pathname !== "/") return;
    const seen = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
      for (const step of [25, 50, 75, 100]) {
        if (pct >= step - 2 && !seen.has(step)) {
          seen.add(step);
          event("scroll", { pct: step });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
