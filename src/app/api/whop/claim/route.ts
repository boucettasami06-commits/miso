import { createHmac, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { COOKIE, billingReady, checkMembership, cookieOptions, findMembershipByEmail, sign, token } from "@/lib/billing";
import { currentUser, normEmail, validEmail } from "@/lib/auth";
import { dbReady, ensureSchema, sql } from "@/lib/db";
import { mailReady, sendClaimCode } from "@/lib/mail";

const hash = (code: string) => createHmac("sha256", process.env.SUBSCRIPTION_SECRET ?? "").update(code).digest("hex");

/**
 * Relie un abonnement Whop payé avec une autre adresse que celle du compte :
 * 1) { email } → si un abonnement actif existe à cette adresse, on y envoie un code à 6 chiffres ;
 * 2) { email, code } → le code prouve que la personne possède l'adresse : l'accès est débloqué.
 * La première étape répond toujours la même chose, que l'abonnement existe ou non.
 */
export async function POST(req: Request) {
  if (!billingReady() || !dbReady() || !mailReady()) {
    return NextResponse.json({ error: "Cette option n'est pas encore disponible." }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as { email?: string; code?: string };
  const email = normEmail(body.email);
  if (!validEmail(email)) return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  await ensureSchema();

  if (!body.code) {
    const ok = NextResponse.json({ sent: true });
    // Anti-abus : au plus un code par minute et par adresse
    const recent = (await sql()`SELECT 1 FROM whop_claims WHERE email = ${email} AND created_at > now() - interval '1 minute'`) as unknown[];
    if (recent.length) return ok;
    const membership = await findMembershipByEmail(email).catch(() => null);
    if (!membership) return ok;
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    await sql()`INSERT INTO whop_claims (email, membership, code_hash, expires_at) VALUES (${email}, ${membership}, ${hash(code)}, now() + interval '15 minutes')`;
    await sendClaimCode(email, code).catch((err) => console.error("mail code whop", err));
    return ok;
  }

  const rows = (await sql()`
    SELECT id, membership, code_hash, attempts FROM whop_claims
    WHERE email = ${email} AND used_at IS NULL AND expires_at > now()
    ORDER BY created_at DESC LIMIT 1`) as { id: string; membership: string; code_hash: string; attempts: number }[];
  const claim = rows[0];
  const invalid = NextResponse.json({ error: "Code incorrect ou expiré. Demande un nouveau code." }, { status: 400 });
  if (!claim || claim.attempts >= 5) return invalid;
  if (hash(String(body.code).trim()) !== claim.code_hash) {
    await sql()`UPDATE whop_claims SET attempts = attempts + 1 WHERE id = ${claim.id}`;
    return invalid;
  }
  await sql()`UPDATE whop_claims SET used_at = now() WHERE id = ${claim.id}`;
  if (!(await checkMembership(claim.membership))) {
    return NextResponse.json({ error: "Cet abonnement n'est plus actif." }, { status: 404 });
  }

  const user = await currentUser().catch(() => null);
  if (user) await sql()`UPDATE users SET whop_membership = ${claim.membership}, sub_active = true, sub_checked_at = now() WHERE id = ${user.id}`;
  const res = NextResponse.json({ active: true });
  res.cookies.set(COOKIE, sign(token(claim.membership)), cookieOptions);
  return res;
}
