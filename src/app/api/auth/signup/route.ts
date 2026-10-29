import { NextResponse } from "next/server";
import { cleanName, hashPassword, normEmail, publicUser, sessionCookie, validEmail, type User } from "@/lib/auth";
import { dbReady, ensureSchema, sql } from "@/lib/db";
import { sendWelcome } from "@/lib/mail";

export async function POST(req: Request) {
  if (!dbReady()) return NextResponse.json({ error: "Les comptes ne sont pas encore activés." }, { status: 503 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const firstName = cleanName(body.firstName);
  const lastName = cleanName(body.lastName);
  const email = normEmail(body.email);
  const password = String(body.password ?? "");

  if (!firstName || !lastName) return NextResponse.json({ error: "Indique ton prénom et ton nom." }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  if (password.length < 8 || password.length > 200) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
  }
  if (body.consent !== true) return NextResponse.json({ error: "Merci d'accepter la politique de confidentialité." }, { status: 400 });

  await ensureSchema();
  const hash = await hashPassword(password);
  const rows = (await sql()`
    INSERT INTO users (email, first_name, last_name, password_hash)
    VALUES (${email}, ${firstName}, ${lastName}, ${hash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email, first_name, last_name, whop_membership, sub_active, sub_checked_at`) as User[];
  if (!rows[0]) return NextResponse.json({ error: "Un compte existe déjà avec cette adresse. Connecte-toi." }, { status: 409 });

  // E-mail de bienvenue : un échec d'envoi ne doit jamais bloquer l'inscription
  await sendWelcome(email, firstName).catch((err) => console.error("mail bienvenue", err));
  const res = NextResponse.json({ user: publicUser(rows[0]) });
  res.cookies.set(...sessionCookie(rows[0].id));
  return res;
}
