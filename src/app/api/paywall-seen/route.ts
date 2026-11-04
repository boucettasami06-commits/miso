import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { dbReady, ensureSchema, sql } from "@/lib/db";

/** Note que le compte connecté a vu la page de paiement (sert à l'e-mail de relance). */
export async function POST() {
  if (!dbReady()) return NextResponse.json({ ok: false });
  await ensureSchema();
  const user = await currentUser().catch(() => null);
  if (user) await sql()`UPDATE users SET paywall_seen_at = now() WHERE id = ${user.id}`;
  return NextResponse.json({ ok: true });
}
