import "server-only";
import { sql } from "./db";

export type Period = "3h" | "24h" | "7j" | "30j";
export const PERIODS: Record<Period, string> = { "3h": "3 hours", "24h": "24 hours", "7j": "7 days", "30j": "30 days" };

/** Étapes du tunnel, dans l'ordre du parcours (visiteurs uniques ayant atteint chaque étape). */
export const FUNNEL = [
  { key: "visit", label: "Visite du site", where: "name = 'page_view'" },
  { key: "cta", label: "Clic sur un bouton de l'accueil", where: "name = 'cta_click'" },
  { key: "signup", label: "Inscription", where: "name = 'signup_ok'" },
  { key: "wizard", label: "Questionnaire commencé", where: "name = 'wizard_step' AND props->>'step' = '1'" },
  { key: "wizard_done", label: "Questionnaire terminé", where: "name = 'wizard_done'" },
  { key: "plan", label: "Semaine générée", where: "name = 'plan_generated'" },
  { key: "paywall", label: "Page de paiement vue", where: "name = 'paywall_view'" },
  { key: "checkout", label: "Clic « Débloquer » (vers Whop)", where: "name = 'checkout_click'" },
  { key: "paid", label: "Abonnement activé", where: "name = 'activation_ok'" },
] as const;

type Row = Record<string, string | number | null>;
const q = (text: string, params: unknown[] = []) => sql().query(text, params) as Promise<Row[]>;

export async function getStats(period: Period) {
  const since = `now() - interval '${PERIODS[period]}'`;
  const funnelSql = FUNNEL.map((s) => `count(DISTINCT vid) FILTER (WHERE ${s.where}) AS "${s.key}"`).join(", ");

  const [funnel, wizard, sources, devices, countries, scroll, users, recent, reports, pages] = await Promise.all([
    q(`SELECT ${funnelSql} FROM events WHERE ts > ${since}`),
    q(`SELECT (props->>'step')::int AS step, max(props->>'name') AS name, count(DISTINCT vid)::int AS n
       FROM events WHERE ts > ${since} AND name = 'wizard_step' GROUP BY 1 ORDER BY 1`),
    q(`SELECT coalesce(source, 'direct') AS source, count(DISTINCT vid)::int AS visitors,
         count(DISTINCT vid) FILTER (WHERE name = 'signup_ok')::int AS signups,
         count(DISTINCT vid) FILTER (WHERE name = 'paywall_view')::int AS paywall,
         count(DISTINCT vid) FILTER (WHERE name = 'checkout_click')::int AS checkout,
         count(DISTINCT vid) FILTER (WHERE name = 'activation_ok')::int AS paid
       FROM events WHERE ts > ${since} GROUP BY 1 ORDER BY visitors DESC LIMIT 15`),
    q(`SELECT device, count(DISTINCT vid)::int AS n FROM events WHERE ts > ${since} GROUP BY 1 ORDER BY n DESC`),
    q(`SELECT coalesce(country, '?') AS country, count(DISTINCT vid)::int AS n FROM events WHERE ts > ${since} GROUP BY 1 ORDER BY n DESC LIMIT 8`),
    q(`SELECT (props->>'pct')::int AS pct, count(DISTINCT vid)::int AS n FROM events WHERE ts > ${since} AND name = 'scroll' GROUP BY 1 ORDER BY 1`),
    q(`SELECT count(*)::int AS total,
         count(*) FILTER (WHERE created_at > ${since})::int AS new,
         count(*) FILTER (WHERE whop_membership IS NOT NULL)::int AS subscribers,
         count(*) FILTER (WHERE reminder_sent_at > ${since})::int AS reminders
       FROM users WHERE email NOT LIKE '%@example.com'`),
    q(`SELECT sid, min(ts) AS start, max(ts) AS "end", max(device) AS device, max(source) AS source,
         string_agg(name || coalesce(' ' || (props->>'step'), ''), ' → ' ORDER BY ts) AS path
       FROM events WHERE ts > ${since} GROUP BY sid ORDER BY max(ts) DESC LIMIT 25`),
    q(`SELECT created_at, period, summary, body FROM agent_reports ORDER BY created_at DESC LIMIT 5`),
    q(`SELECT path, count(*)::int AS views, count(DISTINCT vid)::int AS visitors FROM events
       WHERE ts > ${since} AND name = 'page_view' GROUP BY 1 ORDER BY views DESC LIMIT 10`),
  ]);

  return { funnel: funnel[0] ?? {}, wizard, sources, devices, countries, scroll, users: users[0] ?? {}, recent, reports, pages };
}
