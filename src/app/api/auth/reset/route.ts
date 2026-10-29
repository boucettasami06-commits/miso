import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { hashPassword, sessionCookie } from "@/lib/auth";
import { dbReady, ensureSchema, sql } from "@/lib/db";

/** Change le mot de passe avec un lien valide (usage unique, 1 heure), puis connecte l'utilisateur. */
export async function POST(req: Request) {
  if (!dbReady()) return NextResponse.json({ error: "Indisponible." }, { status: 503 });
  const { token, password } = (await req.json().catch(() => ({}))) as { token?: string; password?: string };
  if (!token || !password || password.length < 8 || password.length > 200) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
  }
  await ensureSchema();
  const hash = createHash("sha256").update(token).digest("hex");
  const rows = (await sql()`
    UPDATE password_resets SET used_at = now()
    WHERE token_hash = ${hash} AND used_at IS NULL AND expires_at > now()
    RETURNING user_id`) as { user_id: string }[];
  const uid = rows[0]?.user_id;
  if (!uid) return NextResponse.json({ error: "Ce lien a expiré ou a déjà été utilisé. Refais une demande." }, { status: 400 });

  await sql()`UPDATE users SET password_hash = ${await hashPassword(password)}, failed_logins = 0, locked_until = NULL WHERE id = ${uid}`;
  const res = NextResponse.json({ ok: true });
  res.cookies.set(...sessionCookie(uid));
  return res;
}
