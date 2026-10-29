import { NextResponse } from "next/server";
import { checkPassword, normEmail, publicUser, sessionCookie, type User } from "@/lib/auth";
import { dbReady, ensureSchema, sql } from "@/lib/db";

export async function POST(req: Request) {
  if (!dbReady()) return NextResponse.json({ error: "Les comptes ne sont pas encore activés." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = normEmail(body.email);
  const password = String(body.password ?? "");
  await ensureSchema();
  const rows = (await sql()`SELECT id, email, first_name, last_name, whop_membership, sub_active, sub_checked_at, password_hash, failed_logins, locked_until FROM users WHERE email = ${email}`) as (User & { password_hash: string; failed_logins: number; locked_until: string | null })[];
  const u = rows[0];
  if (u?.locked_until && new Date(u.locked_until) > new Date()) {
    return NextResponse.json({ error: "Trop de tentatives. Réessaie dans quelques minutes ou réinitialise ton mot de passe." }, { status: 429 });
  }
  // Même message que l'e-mail existe ou non : on ne révèle pas quels comptes existent
  if (!u || !(await checkPassword(password, u.password_hash))) {
    // 5 échecs d'affilée : compte bloqué 15 minutes (protection contre les robots)
    if (u) await sql()`UPDATE users SET failed_logins = failed_logins + 1,
      locked_until = CASE WHEN failed_logins + 1 >= 5 THEN now() + interval '15 minutes' ELSE NULL END WHERE id = ${u.id}`;
    return NextResponse.json({ error: "E-mail ou mot de passe incorrect." }, { status: 401 });
  }
  if (u.failed_logins) await sql()`UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = ${u.id}`;
  const res = NextResponse.json({ user: publicUser(u) });
  res.cookies.set(...sessionCookie(u.id));
  return res;
}
