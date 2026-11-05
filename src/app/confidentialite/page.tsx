import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données Budgemy collecte, pourquoi, et comment exercer tes droits.",
  alternates: { canonical: "/confidentialite" },
};

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-28 leading-relaxed sm:px-6 md:pt-36">
      <h1 className="font-display text-5xl font-extrabold">Politique de confidentialité</h1>
      <p className="mt-4 text-ink-soft">Dernière mise à jour : {LEGAL.updated}.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Responsable du traitement</h2>
      <p className="mt-3">{LEGAL.publisher}, {LEGAL.address}. Contact : <a href={`mailto:${LEGAL.email}`} className="text-tomato underline">{LEGAL.email}</a>.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Données collectées</h2>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        <li>Ton compte : prénom, nom, adresse e-mail et mot de passe (stocké chiffré de façon irréversible, illisible par nous).</li>
        <li>Tes réponses au questionnaire (pays, magasins, foyer, équipement, régime, budget) et la semaine générée.</li>
        <li>Ton abonnement : l&apos;identifiant d&apos;abonnement transmis par notre prestataire de paiement Whop. Nous ne voyons jamais tes coordonnées bancaires.</li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold">Pourquoi</h2>
      <p className="mt-3">Pour te fournir le service (exécution du contrat) : générer ta semaine, la retrouver sur tous tes appareils, vérifier ton abonnement et t&apos;envoyer les e-mails liés à ton compte (bienvenue, mot de passe oublié). Et, sur la base de notre intérêt légitime, mesurer de façon anonyme la fréquentation du site pour l&apos;améliorer. Aucune revente, aucune publicité ciblée.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Où et combien de temps</h2>
      <p className="mt-3">Nos prestataires : hébergement du site par {LEGAL.host} ; base de données : {LEGAL.database} ; paiement : {LEGAL.payment} ; e-mails : {LEGAL.mail}. Certaines données sont donc hébergées aux États-Unis ; ces transferts sont encadrés par le cadre de protection des données UE–États-Unis (Data Privacy Framework) ou par les clauses contractuelles types de la Commission européenne. Tes données sont conservées tant que ton compte existe, puis supprimées ; tu peux demander leur suppression à tout moment. Les données de facturation sont conservées par Whop selon ses propres obligations légales.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Tes droits</h2>
      <p className="mt-3">Tu peux accéder à tes données, les corriger, les exporter ou les supprimer, et t&apos;opposer à leur traitement, en écrivant au contact indiqué ci-dessous. Tu peux aussi saisir la CNIL (cnil.fr).</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Cookies</h2>
      <p className="mt-3">Nous utilisons uniquement des cookies techniques indispensables (session de connexion, accès à l&apos;abonnement). La mesure d&apos;audience (Vercel Web Analytics et notre propre outil statistique) sert uniquement à comprendre comment le site est utilisé : pages vues, étapes du questionnaire, provenance de la visite, type d&apos;appareil et pays. Un identifiant aléatoire, conservé 13 mois au maximum dans ton navigateur, permet de compter les visiteurs sans les identifier ; il n&apos;est jamais partagé ni utilisé à des fins publicitaires. Aucun cookie publicitaire.</p>

      <h2 className="mt-10 font-display text-2xl font-bold">Contact</h2>
      <p className="mt-3">Pour toute question ou pour exercer tes droits : <a href={`mailto:${LEGAL.email}`} className="text-tomato underline">{LEGAL.email}</a>. Réponse sous 30 jours maximum.</p>
    </article>
  );
}
