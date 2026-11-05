import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

/** Accès de l'agent d'analyse : en-tête « Authorization: Bearer REPORT_TOKEN ». */
function authorized(req: Request) {
  const token = process.env.REPORT_TOKEN ?? "";
  const given = req.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  return !!token && given.length === token.length && timingSafeEqual(Buffer.from(given), Buffer.from(token));
}

/** Statistiques anonymisées (aucune adresse e-mail) sur 3 h, 24 h et 7 jours, plus les derniers rapports. */
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await ensureSchema();
  const [h3, h24, d7] = await Promise.all([getStats("3h"), getStats("24h"), getStats("7j")]);
  const prev = (await sql().query(
    `SELECT count(DISTINCT vid)::int AS visitors,
       count(DISTINCT vid) FILTER (WHERE name = 'signup_ok')::int AS signups,
       count(DISTINCT vid) FILTER (WHERE name = 'paywall_view')::int AS paywall,
       count(DISTINCT vid) FILTER (WHERE name = 'checkout_click')::int AS checkout,
       count(DISTINCT vid) FILTER (WHERE name = 'activation_ok')::int AS paid
     FROM events WHERE ts BETWEEN now() - interval '6 hours' AND now() - interval '3 hours'`,
  )) as Record<string, number>[];
  const strip = ({ reports: _r, ...rest }: Awaited<ReturnType<typeof getStats>>) => rest;
  return NextResponse.json({
    generated_at: new Date().toISOString(),
    last_3h: strip(h3),
    previous_3h: prev[0] ?? {},
    last_24h: strip(h24),
    last_7d: strip(d7),
    previous_reports: h3.reports.slice(0, 3),
  });
}

/** Enregistre le rapport de l'agent : { summary, body, period? }. */
export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { summary?: string; body?: string; period?: string };
  if (!b.summary || !b.body) return NextResponse.json({ error: "summary et body requis" }, { status: 400 });
  await ensureSchema();
  await sql()`INSERT INTO agent_reports (period, summary, body) VALUES (${(b.period ?? "3h").slice(0, 20)}, ${b.summary.slice(0, 200)}, ${b.body.slice(0, 20000)})`;
  return NextResponse.json({ ok: true });
}
