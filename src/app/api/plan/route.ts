import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Semaine et profil de l'utilisateur connecté, pour les retrouver sur tous ses appareils. */
export async function GET() {
  const u = await currentUser().catch(() => null);
  if (!u) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  const rows = (await sql()`SELECT profile, plan FROM user_plans WHERE user_id = ${u.id}`) as { profile: unknown; plan: unknown }[];
  return NextResponse.json(rows[0] ?? { profile: null, plan: null });
}

export async function PUT(req: Request) {
  const u = await currentUser().catch(() => null);
  if (!u) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  const { profile, plan } = (await req.json().catch(() => ({}))) as { profile?: unknown; plan?: unknown };
  const raw = JSON.stringify({ profile, plan });
  if (!profile || !plan || raw.length > 200_000) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  await sql()`
    INSERT INTO user_plans (user_id, profile, plan, updated_at)
    VALUES (${u.id}, ${JSON.stringify(profile)}::jsonb, ${JSON.stringify(plan)}::jsonb, now())
    ON CONFLICT (user_id) DO UPDATE SET profile = EXCLUDED.profile, plan = EXCLUDED.plan, updated_at = now()`;
  return NextResponse.json({ ok: true });
}
