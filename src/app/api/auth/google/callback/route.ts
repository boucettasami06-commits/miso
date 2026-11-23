import { randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionCookie, type User } from "@/lib/auth";
import { dbReady, ensureSchema, sql } from "@/lib/db";
import { GOOGLE_STATE_COOKIE, googleProfile, safeNext } from "@/lib/google";
import { sendWelcome } from "@/lib/mail";

export const dynamic = "force-dynamic";

const clean = (v: string | undefined, fallback: string) => (v ?? "").replace(/[<>"]/g, "").trim().slice(0, 60) || fallback;

/** Retour de Google : crée le compte s'il n'existe pas (inscription) ou connecte le compte existant. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fail = (why: string) => {
    const res = NextResponse.redirect(new URL(`/?auth=google_erreur&raison=${why}`, url));
    res.cookies.set(GOOGLE_STATE_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  };

  const raw = (await cookies()).get(GOOGLE_STATE_COOKIE)?.value;
  let saved: { state: string; next: string } | null = null;
  try {
    saved = raw ? JSON.parse(raw) : null;
  } catch {}
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code");
  if (url.searchParams.get("error")) return fail("annule");
  if (!saved?.state || !code || saved.state.length !== state.length || !timingSafeEqual(Buffer.from(saved.state), Buffer.from(state))) {
    return fail("session");
  }
  if (!dbReady()) return fail("indisponible");

  const g = await googleProfile(code).catch(() => null);
  if (!g?.email || !g.email_verified) return fail("email");
  const email = g.email.trim().toLowerCase();

  await ensureSchema();
  let created = false;
  let rows = (await sql()`
    SELECT id, email, first_name, last_name, whop_membership, sub_active, sub_checked_at FROM users WHERE email = ${email}`) as User[];
  if (rows[0]) {
    await sql()`UPDATE users SET google_sub = COALESCE(google_sub, ${g.sub}), failed_logins = 0, locked_until = NULL WHERE id = ${rows[0].id}`;
  } else {
    // Compte créé avec Google : pas de mot de passe (il pourra en choisir un via « Mot de passe oublié »)
    rows = (await sql()`
      INSERT INTO users (email, first_name, last_name, password_hash, google_sub)
      VALUES (${email}, ${clean(g.given_name, "Ami")}, ${clean(g.family_name, "-")}, ${`google$${randomBytes(8).toString("hex")}`}, ${g.sub})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, first_name, last_name, whop_membership, sub_active, sub_checked_at`) as User[];
    if (!rows[0]) return fail("compte");
    created = true;
    await sendWelcome(email, rows[0].first_name).catch((err) => console.error("mail bienvenue", err));
  }

  const dest = new URL(safeNext(saved.next), url);
  dest.searchParams.set("auth", created ? "google_inscription" : "google_connexion");
  const res = NextResponse.redirect(dest);
  res.cookies.set(...sessionCookie(rows[0].id));
  res.cookies.set(GOOGLE_STATE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
