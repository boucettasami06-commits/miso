/**
 * Offre spéciale de lancement : accès à vie en paiement unique.
 * Vraie date de fin (heure de Paris) : passé ce moment, l'offre disparaît du site et son lien de paiement est fermé.
 * Pour la prolonger ou l'arrêter, il suffit de changer cette date.
 */
export const LIFETIME_PRICE = "59,99 €";
export const LIFETIME_END = new Date("2026-12-31T23:59:59+01:00");
export const LIFETIME_END_LABEL = "31 décembre 2026 à 23h59";

export const lifetimeOpen = (now = Date.now()) => process.env.NEXT_PUBLIC_LIFETIME_ON === "1" && now < LIFETIME_END.getTime();
