import { NextResponse } from "next/server";
import { canonicalEmail, freeAccess, paidEmails, unsubscribeSig } from "@/lib/billing";
import { dbReady, ensureSchema, sql } from "@/lib/db";
import { money } from "@/lib/format";
import { mailReady, sendRelance } from "@/lib/mail";
import { estimateSavings } from "@/lib/savings";
import { SITE } from "@/lib/site";
import type { Profile, WeekPlan } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Agent de relance (tâche planifiée quotidienne, vercel.json) : chaque inscrit non abonné reçoit
 * au plus 3 e-mails, espacés de 72 heures : 72 h après l'inscription, puis 72 h après chaque relance.
 * Avant chaque envoi, on vérifie chez Whop qu'il n'a pas déjà payé ; il peut se désinscrire à tout moment.
 * ?dry=1 : liste ce qui serait envoyé, sans rien envoyer.
 */
/** 72 h entre deux e-mails (marge d'1 h : la tâche quotidienne ne tombe pas toujours à la même seconde). */
const GAP = "71 hours";

type Row = { id: string; email: string; first_name: string; created_at: string; relance_step: number; profile: Profile | null; plan: WeekPlan | null };

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  if (!dbReady() || (!dry && !mailReady())) return NextResponse.json({ sent: 0, reason: "mail ou base indisponible" });
  await ensureSchema();

  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const rows = (await sql()`
    SELECT u.id, u.email, u.first_name, u.created_at, u.relance_step, p.profile, p.plan
    FROM users u LEFT JOIN user_plans p ON p.user_id = u.id
    WHERE u.relance_step < 3
      AND u.unsubscribed_at IS NULL
      AND u.whop_membership IS NULL AND u.sub_active = false
      AND u.created_at < now() - ${GAP}::interval
      AND (u.relance_at IS NULL OR u.relance_at < now() - ${GAP}::interval)
    ORDER BY u.created_at LIMIT 150`) as Row[];

  // Un seul appel Whop pour toute la relance : on n'écrit jamais à quelqu'un qui a déjà payé.
  const paid = await paidEmails().catch(() => null);
  if (!paid && !dry) return NextResponse.json({ sent: 0, reason: "Whop injoignable : relance reportée" });

  const report: { email: string; step: number; status: string }[] = [];
  let sent = 0;
  for (const u of rows) {
    const email = u.email.toLowerCase();
    if (admins.includes(email) || freeAccess(email)) continue;
    if (paid?.has(canonicalEmail(email))) {
      if (!dry) await sql()`UPDATE users SET sub_active = true, sub_checked_at = now() WHERE id = ${u.id}`;
      report.push({ email, step: 0, status: "déjà abonné" });
      continue;
    }
    // Prochain e-mail de la séquence (un seul par passage, le suivant 72 h plus tard)
    const next = { step: (u.relance_step + 1) as 1 | 2 | 3 };

    let weekTotal: string | undefined;
    let yearly: string | undefined;
    if (u.plan?.total) {
      const cur = u.plan.currency ?? "EUR";
      weekTotal = money(u.plan.total, cur, 2);
      try {
        const s = estimateSavings(u.plan, { adults: u.profile?.adults ?? 1, children: u.profile?.children ?? 0 });
        if (s.yearly >= 50) yearly = money(s.yearly, cur, 0);
      } catch {}
    }
    const unsubscribe = `${SITE.url}/api/relance/stop?u=${u.id}&s=${unsubscribeSig(u.id)}`;

    if (dry) {
      report.push({ email, step: next.step, status: "à envoyer" });
      continue;
    }
    try {
      await sendRelance(next.step, u.email, u.first_name, { weekTotal, yearly, unsubscribe });
      await sql()`UPDATE users SET relance_step = ${next.step}, relance_at = now() WHERE id = ${u.id}`;
      sent++;
      report.push({ email, step: next.step, status: "envoyé" });
    } catch (err) {
      console.error("relance", u.id, err);
      report.push({ email, step: next.step, status: "échec" });
    }
  }
  return NextResponse.json({ dry, sent, candidates: rows.length, report });
}
