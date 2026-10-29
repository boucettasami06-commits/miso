import { NextResponse } from "next/server";
import { checkPassword, normEmail, publicUser, sessionCookie, type User } from "@/lib/auth";
import { dbReady, ensureSchema, sql } from "@/lib/db";

export async function POST(req: Request) {
  if (!dbReady()) return NextResponse.json({ error: "Les comptes ne sont pas encore activés." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = normEmail(body.email);
  const password = String(body.password ?? "");
  await ensureSchema();
  const rows = (await sql()`SELECT id, email, first_name, last_name, whop_membership, sub_active, sub_checked_at, password_hash FROM users WHERE email = ${email}`) as (User & { password_hash: string })[];
  const u = rows[0];
  // Même message que l'e-mail existe ou non : on ne révèle pas quels comptes existent
  if (!u || !(await checkPassword(password, u.password_hash))) {
    return NextResponse.json({ error: "E-mail ou mot de passe incorrect." }, { status: 401 });
  }
  const res = NextResponse.json({ user: publicUser(u) });
  res.cookies.set(...sessionCookie(u.id));
  return res;
}
