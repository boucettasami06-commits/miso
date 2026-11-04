import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergeur et informations légales du site Budgemy.",
  alternates: { canonical: "/mentions-legales" },
};

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-28 leading-relaxed sm:px-6 md:pt-36">
      <h1 className="font-display text-5xl font-extrabold">Mentions légales</h1>
      <p className="mt-4 text-ink-soft">Dernière mise à jour : {LEGAL.updated}.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Éditeur du site</h2>
      <ul className="mt-3 space-y-1">
        <li>{LEGAL.publisher}</li>
        <li>{LEGAL.legalForm}</li>
        <li>SIRET : {LEGAL.siret}</li>
        <li>{LEGAL.vat}</li>
        <li>Adresse : {LEGAL.address}</li>
        <li>Directeur de la publication : {LEGAL.director}</li>
        <li>Contact : <a href={`mailto:${LEGAL.email}`} className="text-tomato underline">{LEGAL.email}</a></li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold">Hébergement</h2>
      <p className="mt-3">{LEGAL.host}.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Propriété intellectuelle</h2>
      <p className="mt-3">
        La marque Budgemy, le logo, les textes, l&apos;interface et le moteur de génération de menus sont la propriété de l&apos;éditeur.
        Toute reproduction sans autorisation est interdite. Les photographies de recettes proviennent de banques d&apos;images sous licence libre ;
        leurs auteurs et licences sont indiqués sur la page <Link href="/credits" className="text-tomato underline">Crédits photos</Link>.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold">Informations affichées</h2>
      <p className="mt-3">
        Les prix sont des estimations calculées à partir de moyennes par enseigne et peuvent différer de ceux pratiqués en magasin.
        Les valeurs nutritionnelles sont indicatives et ne remplacent pas l&apos;avis d&apos;un médecin ou d&apos;un diététicien.
        Les enseignes citées sont des marques de leurs propriétaires respectifs ; Budgemy n&apos;est affilié à aucune d&apos;entre elles.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold">Données personnelles</h2>
      <p className="mt-3">
        Voir la <Link href="/confidentialite" className="text-tomato underline">politique de confidentialité</Link> et les{" "}
        <Link href="/cgv" className="text-tomato underline">conditions générales de vente</Link>.
      </p>
    </article>
  );
}
