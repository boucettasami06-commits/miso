import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { normEmail, validEmail } from "@/lib/auth";
import { dbReady, ensureSchema, sql } from "@/lib/db";
import { mailReady, sendPasswordReset } from "@/lib/mail";
import { SITE } from "@/lib/site";

/** Envoie un lien de réinitialisation. Réponse identique que le compte existe ou non (pas de fuite d'information). */
export async function POST(req: Request) {
  if (!dbReady() || !mailReady()) return NextResponse.json({ error: "La réinitialisation n'est pas encore disponible." }, { status: 503 });
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  const e = normEmail(email);
  const ok = NextResponse.json({ ok: true });
  if (!validEmail(e)) return ok;

  await ensureSchema();
  const users = (await sql()`SELECT id, first_name FROM users WHERE email = ${e}`) as { id: string; first_name: string }[];
  const u = users[0];
  if (!u) return ok;

  // Anti-abus : au plus un e-mail toutes les 2 minutes par compte
  const recent = (await sql()`SELECT 1 FROM password_resets WHERE user_id = ${u.id} AND created_at > now() - interval '2 minutes'`) as unknown[];
  if (recent.length) return ok;

  const token = randomBytes(32).toString("base64url");
  const hash = createHash("sha256").update(token).digest("hex");
  await sql()`INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (${hash}, ${u.id}, now() + interval '1 hour')`;
  await sendPasswordReset(e, u.first_name, `${SITE.url}/reinitialiser?token=${token}`).catch((err) => console.error("mail reset", err));
  return ok;
}
