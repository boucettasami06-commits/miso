"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV = [
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/#profils", label: "Profils" },
  { href: "/recettes", label: "Recettes" },
  { href: "/menus", label: "Menus types" },
  { href: "/ma-semaine", label: "Ma semaine" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20">
        <Link href="/" aria-label="Mijo, accueil">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex" aria-label="Navigation principale">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="relative text-ink-soft transition-colors hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/planifier"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-tomato sm:inline-flex"
          >
            Créer mon menu
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-line bg-cream lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-xl px-3 py-3 font-medium hover:bg-cream-2">
                  {n.label}
                </Link>
              ))}
              <Link href="/planifier" className="mt-2 rounded-full bg-tomato px-5 py-3 text-center font-semibold text-white">
                Créer mon menu gratuit
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
