import { NextResponse } from "next/server";
import { COOKIE, billingReady, checkMembership, cookieOptions, sign, token } from "@/lib/billing";
import { currentUser } from "@/lib/auth";
import { sql } from "@/lib/db";

/** Active l'accès à partir d'un identifiant d'abonnement ou d'une clé de licence Whop, vérifié côté serveur. */
export async function POST(req: Request) {
  if (!billingReady()) return NextResponse.json({ error: "Le paiement n'est pas encore activé sur ce site." }, { status: 503 });
  const { membership } = (await req.json().catch(() => ({}))) as { membership?: string };
  const id = membership?.trim() ?? "";
  if (!(await checkMembership(id))) {
    return NextResponse.json({ error: "Abonnement introuvable ou inactif. Vérifie l'identifiant reçu par e-mail de Whop." }, { status: 404 });
  }
  // Compte connecté : l'abonnement le suit sur tous ses appareils
  const user = await currentUser().catch(() => null);
  if (user) await sql()`UPDATE users SET whop_membership = ${id}, sub_active = true, sub_checked_at = now() WHERE id = ${user.id}`;
  const res = NextResponse.json({ active: true });
  res.cookies.set(COOKIE, sign(token(id)), cookieOptions);
  return res;
}
