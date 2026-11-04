import { NextResponse } from "next/server";
import { dbReady, ensureSchema, sql } from "@/lib/db";
import { mailReady, sendPaywallReminder } from "@/lib/mail";

export const dynamic = "force-dynamic";

/**
 * Tâche planifiée (vercel.json) : relance une seule fois, par e-mail, les comptes arrivés
 * à la page de paiement il y a plus d'une heure sans s'abonner.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  if (!dbReady() || !mailReady()) return NextResponse.json({ sent: 0, reason: "mail ou base indisponible" });
  await ensureSchema();

  const users = (await sql()`
    SELECT id, email, first_name FROM users
    WHERE paywall_seen_at < now() - interval '1 hour'
      AND reminder_sent_at IS NULL
      AND whop_membership IS NULL AND sub_active = false
    ORDER BY paywall_seen_at LIMIT 200`) as { id: string; email: string; first_name: string }[];

  let sent = 0;
  for (const u of users) {
    try {
      await sendPaywallReminder(u.email, u.first_name);
      await sql()`UPDATE users SET reminder_sent_at = now() WHERE id = ${u.id}`;
      sent++;
    } catch (err) {
      console.error("relance paiement", u.id, err);
    }
  }
  return NextResponse.json({ sent, pending: users.length - sent });
}
