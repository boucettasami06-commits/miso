import { NextResponse } from "next/server";
import { PLANS, type PlanId } from "@/lib/billing";

/** Redirige vers la page de paiement Whop de la formule choisie. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const plan = url.searchParams.get("plan") as PlanId | null;
  const target = plan && PLANS[plan] ? process.env[PLANS[plan].checkoutEnv] : undefined;
  if (!target) return NextResponse.redirect(new URL("/ma-semaine?paiement=indisponible", url));
  return NextResponse.redirect(target);
}
