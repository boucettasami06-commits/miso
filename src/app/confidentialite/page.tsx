import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données Budgemy collecte, pourquoi, et comment exercer tes droits.",
  alternates: { canonical: "/confidentialite" },
};

/** Base RGPD à faire relire et compléter (identité légale de l'éditeur, contact) avant le lancement commercial. */
export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-28 leading-relaxed sm:px-6 md:pt-36">
      <h1 className="font-display text-5xl font-extrabold">Politique de confidentialité</h1>
      <p className="mt-4 text-ink-soft">Dernière mise à jour : octobre 2026.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Données collectées</h2>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        <li>Ton compte : prénom, nom, adresse e-mail et mot de passe (stocké chiffré de façon irréversible, illisible par nous).</li>
        <li>Tes réponses au questionnaire (pays, magasins, foyer, équipement, régime, budget) et la semaine générée.</li>
        <li>Ton abonnement : l&apos;identifiant d&apos;abonnement transmis par notre prestataire de paiement Whop. Nous ne voyons jamais tes coordonnées bancaires.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold">Pourquoi</h2>
      <p className="mt-3">Uniquement pour te fournir le service : générer ta semaine, la retrouver sur tous tes appareils et vérifier ton abonnement. Aucune revente, aucune publicité ciblée.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Où et combien de temps</h2>
      <p className="mt-3">Les données sont hébergées dans l&apos;Union européenne (base de données à Francfort) et conservées tant que ton compte existe. Elles sont supprimées sur simple demande.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Tes droits</h2>
      <p className="mt-3">Tu peux accéder à tes données, les corriger, les exporter ou les supprimer, et t&apos;opposer à leur traitement, en écrivant au contact indiqué ci-dessous. Tu peux aussi saisir la CNIL (cnil.fr).</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Cookies</h2>
      <p className="mt-3">Nous utilisons uniquement des cookies techniques indispensables (session de connexion, accès à l&apos;abonnement). Aucun cookie publicitaire ni de mesure d&apos;audience tierce.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Contact</h2>
      <p className="mt-3">Éditeur et contact : à compléter avant le lancement (nom ou raison sociale, adresse, e-mail de contact).</p>
    </article>
  );
}
