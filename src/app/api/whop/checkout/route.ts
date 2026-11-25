import { NextResponse } from "next/server";
import { PLANS, type PlanId } from "@/lib/billing";
import { lifetimeOpen } from "@/lib/offer";

/** Redirige vers la page de paiement Whop de la formule choisie. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const plan = url.searchParams.get("plan") as PlanId | null;
  // Offre à vie terminée : plus de paiement possible, même avec l'ancien lien
  if (plan === "lifetime" && !lifetimeOpen()) return NextResponse.redirect(new URL("/ma-semaine?offre=terminee", url));
  const target = plan && PLANS[plan] ? process.env[PLANS[plan].checkoutEnv] : undefined;
  if (!target) return NextResponse.redirect(new URL("/ma-semaine?paiement=indisponible", url));
  return NextResponse.redirect(target);
}
