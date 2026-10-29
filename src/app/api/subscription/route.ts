import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, checkMembership, cookieOptions, sign, token, verify } from "@/lib/billing";
import { currentUser } from "@/lib/auth";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

const DAY = 24 * 3600 * 1000;

/**
 * L'utilisateur a-t-il un abonnement actif ?
 * 1) compte connecté : abonnement rattaché au compte (revérifié chez Whop une fois par jour) ;
 * 2) sinon : jeton signé de l'appareil (accès activé avant la création des comptes).
 */
export async function GET() {
  const user = await currentUser().catch(() => null);
  if (user?.whop_membership) {
    const fresh = user.sub_checked_at && Date.now() - new Date(user.sub_checked_at).getTime() < DAY;
    if (fresh) return NextResponse.json({ active: user.sub_active });
    const active = await checkMembership(user.whop_membership).catch(() => user.sub_active);
    await sql()`UPDATE users SET sub_active = ${active}, sub_checked_at = now() WHERE id = ${user.id}`;
    return NextResponse.json({ active });
  }

  const t = verify((await cookies()).get(COOKIE)?.value);
  if (!t) return NextResponse.json({ active: false });
  if (t.exp > Date.now() / 1000) {
    // Accès d'appareil + compte connecté : on rattache l'abonnement au compte
    if (user) await sql()`UPDATE users SET whop_membership = ${t.membership}, sub_active = true, sub_checked_at = now() WHERE id = ${user.id}`;
    return NextResponse.json({ active: true });
  }
  const still = await checkMembership(t.membership).catch(() => false);
  const res = NextResponse.json({ active: still });
  if (still) res.cookies.set(COOKIE, sign(token(t.membership)), cookieOptions);
  else res.cookies.delete(COOKIE);
  return res;
}
