import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions de l'abonnement Budgemy : prix, paiement, résiliation, droit de rétractation.",
  alternates: { canonical: "/cgv" },
};

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="mt-10 font-display text-2xl font-bold">{children}</h2>;

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-28 leading-relaxed sm:px-6 md:pt-36">
      <h1 className="font-display text-5xl font-extrabold">Conditions générales de vente</h1>
      <p className="mt-4 text-ink-soft">Dernière mise à jour : {LEGAL.updated}.</p>

      <H2>1. Objet</H2>
      <p className="mt-3">
        Les présentes conditions régissent l&apos;abonnement au service Budgemy, édité par {LEGAL.publisher} (SIRET {LEGAL.siret}, {LEGAL.address}),
        ci-après « l&apos;éditeur ». Budgemy génère des menus de la semaine (petit-déjeuner, déjeuner, dîner), les recettes associées et une liste de
        courses estimée selon le budget, le foyer, l&apos;équipement et les magasins choisis par l&apos;utilisateur.
      </p>

      <H2>2. Compte</H2>
      <p className="mt-3">
        L&apos;utilisation du service nécessite un compte (prénom, nom, adresse e-mail, mot de passe). L&apos;utilisateur s&apos;engage à fournir des
        informations exactes et à garder son mot de passe confidentiel. Le service est réservé aux personnes majeures ou autorisées par leur représentant légal.
      </p>

      <H2>3. Offres et prix</H2>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        <li>Abonnement mensuel : 9,99 € TTC par mois.</li>
        <li>Abonnement annuel : 107,89 € TTC par an (soit 10 % de réduction par rapport au mensuel).</li>
      </ul>
      <p className="mt-3">
        Les prix sont indiqués en euros, toutes taxes comprises. L&apos;éditeur peut faire évoluer ses prix ; tout changement est annoncé par e-mail au
        moins 30 jours à l&apos;avance et ne s&apos;applique qu&apos;à la période suivante. L&apos;abonné peut alors résilier avant cette échéance.
      </p>

      <H2>4. Paiement et renouvellement</H2>
      <p className="mt-3">
        Le paiement est effectué par carte bancaire ou tout autre moyen proposé, via notre prestataire {LEGAL.payment}. L&apos;éditeur n&apos;a jamais
        accès aux coordonnées bancaires. L&apos;abonnement est payable d&apos;avance et se renouvelle automatiquement à la fin de chaque période
        (mois ou année) tant qu&apos;il n&apos;est pas résilié.
      </p>

      <H2>5. Résiliation</H2>
      <p className="mt-3">
        L&apos;abonné peut résilier à tout moment, sans frais, depuis son espace Whop ou en écrivant à{" "}
        <a href={`mailto:${LEGAL.email}`} className="text-tomato underline">{LEGAL.email}</a>. La résiliation prend effet à la fin de la période
        en cours : l&apos;accès reste ouvert jusqu&apos;à cette date et aucun nouveau prélèvement n&apos;a lieu.
      </p>

      <H2>6. Droit de rétractation</H2>
      <p className="mt-3">
        Conformément au Code de la consommation, le consommateur dispose d&apos;un délai de 14 jours à compter de la souscription pour se rétracter,
        sans avoir à se justifier. Il suffit d&apos;en faire la demande à{" "}
        <a href={`mailto:${LEGAL.email}`} className="text-tomato underline">{LEGAL.email}</a> (par exemple : « Je me rétracte de mon abonnement
        Budgemy souscrit le … avec l&apos;adresse … »). Le remboursement intégral est effectué sous 14 jours par le même moyen de paiement.
      </p>

      <H2>7. Fonctionnement du service</H2>
      <p className="mt-3">
        Les prix des courses sont des estimations fondées sur des moyennes par enseigne : ils peuvent différer des prix réels en magasin, qui varient
        selon le lieu, les promotions et la disponibilité. Les informations nutritionnelles sont indicatives et ne constituent pas un avis médical.
        L&apos;utilisateur reste seul responsable de vérifier la compatibilité des recettes avec ses allergies et intolérances, notamment en lisant les
        étiquettes des produits. L&apos;éditeur s&apos;efforce d&apos;assurer la disponibilité du service sans pouvoir la garantir en permanence
        (maintenance, panne d&apos;un prestataire).
      </p>

      <H2>8. Données personnelles</H2>
      <p className="mt-3">
        Les données sont traitées conformément à notre{" "}
        <Link href="/confidentialite" className="text-tomato underline">politique de confidentialité</Link>.
      </p>

      <H2>9. Réclamations et médiation</H2>
      <p className="mt-3">
        Toute réclamation peut être adressée à <a href={`mailto:${LEGAL.email}`} className="text-tomato underline">{LEGAL.email}</a>. En cas de
        litige non résolu, le consommateur peut recourir gratuitement au médiateur de la consommation suivant : [À compléter : nom et site du médiateur].
      </p>

      <H2>10. Droit applicable</H2>
      <p className="mt-3">
        Les présentes conditions sont soumises au droit français. Le consommateur conserve la protection des règles impératives de son pays de résidence
        (Belgique, Suisse, Allemagne notamment).
      </p>
    </article>
  );
}
