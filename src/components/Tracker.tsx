"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { event } from "@/lib/funnel";

/** Une vue de page à chaque navigation ; sur la page d'accueil, la profondeur de défilement (25/50/75/100 %) et les clics sur les boutons et liens. */
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
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button");
      if (!el || el.closest("[role=dialog]")) return;
      event("cta_click", { label: (el.textContent ?? "").trim().slice(0, 60), href: el.getAttribute("href") ?? "" });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
    };
  }, [pathname]);

  return null;
}
