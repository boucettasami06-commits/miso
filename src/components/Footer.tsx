import Link from "next/link";
import Logo from "./Logo";
import { MENUS } from "@/lib/data/menus";

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-plum text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo className="text-cream" />
          <p className="mt-4 max-w-xs text-sm text-cream/70">
            Des menus de la semaine pensés pour ton corps, ton budget et ton supermarché. Fait avec appétit en France.
          </p>
        </div>
        <div>
          <p className="font-display text-lg">Produit</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li><Link href="/planifier" className="hover:text-saffron">Créer mon menu</Link></li>
            <li><Link href="/ma-semaine" className="hover:text-saffron">Ma semaine</Link></li>
            <li><Link href="/recettes" className="hover:text-saffron">Toutes les recettes</Link></li>
            <li><Link href="/credits" className="hover:text-saffron">Crédits photos</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="font-display text-lg">Menus de la semaine</p>
          <ul className="mt-4 grid gap-2 text-sm text-cream/70 sm:grid-cols-2">
            {MENUS.map((m) => (
              <li key={m.slug}>
                <Link href={`/menus/${m.slug}`} className="hover:text-saffron">{m.h1}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-cream/50 sm:px-6">
          © {new Date().getFullYear()} Budgemy · Prix indicatifs basés sur des moyennes par enseigne, susceptibles de varier selon le magasin. Les informations nutritionnelles ne remplacent pas l&apos;avis d&apos;un professionnel de santé.
        </p>
      </div>
      <p aria-hidden className="pointer-events-none select-none px-4 pb-2 text-center font-display text-[22vw] font-bold leading-none text-cream/[0.04]">
        budgemy.
      </p>
    </footer>
  );
}
