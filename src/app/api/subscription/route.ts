import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, checkMembership, cookieOptions, sign, token, verify } from "@/lib/billing";

export const dynamic = "force-dynamic";

/** L'utilisateur a-t-il un abonnement actif ? Revérifie chez Whop une fois par jour. */
export async function GET() {
  const t = verify((await cookies()).get(COOKIE)?.value);
  if (!t) return NextResponse.json({ active: false });
  if (t.exp > Date.now() / 1000) return NextResponse.json({ active: true });

  const still = await checkMembership(t.membership).catch(() => false);
  const res = NextResponse.json({ active: still });
  if (still) res.cookies.set(COOKIE, sign(token(t.membership)), cookieOptions);
  else res.cookies.delete(COOKIE);
  return res;
}
