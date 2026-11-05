import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { ensureSchema } from "@/lib/db";
import { FUNNEL, PERIODS, getStats, type Period } from "@/lib/stats";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false, follow: false } };

/** Accès réservé aux adresses listées dans ADMIN_EMAILS (séparées par des virgules). */
const isAdmin = (email: string) =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .includes(email.toLowerCase());

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "–");
const n = (v: unknown) => Number(v ?? 0);
const LABELS: Record<string, string> = {
  page_view: "vue", scroll: "défile", cta_click: "clic accueil", signup_open: "fenêtre inscription", signup_ok: "INSCRIT",
  login_ok: "connexion", wizard_step: "étape", wizard_done: "questionnaire fini", plan_generated: "SEMAINE", plan_view: "voit sa semaine",
  locked_click: "clic verrouillé", paywall_view: "PAIEMENT VU", plan_select: "choix formule", checkout_click: "CLIC WHOP", activation_ok: "ABONNÉ",
};

export default async function Admin({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const user = await currentUser().catch(() => null);
  if (!user || !isAdmin(user.email)) notFound();
  await ensureSchema();
  const { p } = await searchParams;
  const period: Period = p && p in PERIODS ? (p as Period) : "24h";
  const s = await getStats(period);
  const top = n(s.funnel.visit);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-tomato">Privé</p>
          <h1 className="font-display text-4xl font-extrabold">Tableau de bord</h1>
        </div>
        <nav className="flex gap-1 rounded-full border border-line bg-white p-1 text-sm font-semibold" aria-label="Période">
          {(Object.keys(PERIODS) as Period[]).map((k) => (
            <Link key={k} href={`/admin?p=${k}`} className={`rounded-full px-4 py-2 ${k === period ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"}`}>
              {k}
            </Link>
          ))}
        </nav>
      </div>

      {/* Chiffres clés */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Visiteurs" value={top} />
        <Tile label="Inscriptions" value={n(s.users.new)} hint={`${n(s.users.total)} comptes au total`} />
        <Tile label="Clics vers le paiement" value={n(s.funnel.checkout)} hint={`${pct(n(s.funnel.checkout), n(s.funnel.paywall))} des paiements vus`} />
        <Tile label="Abonnés" value={n(s.users.subscribers)} hint={`${n(s.funnel.paid)} activé(s) sur la période · ${pct(n(s.funnel.paid), top)} des visiteurs`} />
      </div>

      {/* Tunnel */}
      <Card title="Tunnel de conversion" subtitle="Visiteurs uniques ayant atteint chaque étape · % par rapport à l'étape précédente">
        <ol className="space-y-2.5">
          {FUNNEL.map((step, i) => {
            const v = n(s.funnel[step.key]);
            const prev = i ? n(s.funnel[FUNNEL[i - 1].key]) : v;
            return (
              <li key={step.key} className="grid grid-cols-[minmax(9rem,16rem)_1fr_auto] items-center gap-3 text-sm" title={`${step.label} : ${v} visiteur(s)`}>
                <span className="truncate">{step.label}</span>
                <span className="h-6 overflow-hidden rounded bg-cream-2">
                  <span className="block h-full rounded-r bg-tomato" style={{ width: `${top ? Math.max(1.5, (v / top) * 100) : 0}%` }} />
                </span>
                <span className="w-28 text-right tabular-nums">
                  <b>{v}</b> <span className="text-ink-soft">{i ? pct(v, prev) : ""}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Questionnaire, étape par étape" subtitle="Où les visiteurs décrochent">
          <Table head={["Étape", "Visiteurs", "Restent"]} rows={s.wizard.map((w, i) => [`${w.step}. ${w.name}`, n(w.n), i ? pct(n(w.n), n(s.wizard[i - 1].n)) : "–"])} />
        </Card>
        <Card title="Défilement de la page d'accueil" subtitle="Part des visiteurs qui descendent jusqu'à…">
          <Table head={["Profondeur", "Visiteurs", "Part"]} rows={s.scroll.map((r) => [`${r.pct} %`, n(r.n), pct(n(r.n), top)])} />
        </Card>
      </div>

      <Card title="Sources de trafic" subtitle="Ajoute ?utm_source=tiktok (ou instagram, google…) à tes liens pour les distinguer">
        <Table
          head={["Source", "Visiteurs", "Inscrits", "Paiement vu", "Clic Whop", "Abonnés"]}
          rows={s.sources.map((r) => [String(r.source), n(r.visitors), n(r.signups), n(r.paywall), n(r.checkout), n(r.paid)])}
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Appareils">
          <Table head={["Appareil", "Visiteurs"]} rows={s.devices.map((r) => [String(r.device), n(r.n)])} />
        </Card>
        <Card title="Pays">
          <Table head={["Pays", "Visiteurs"]} rows={s.countries.map((r) => [String(r.country), n(r.n)])} />
        </Card>
        <Card title="Pages les plus vues">
          <Table head={["Page", "Vues"]} rows={s.pages.map((r) => [String(r.path), n(r.views)])} />
        </Card>
      </div>

      <Card title="Derniers parcours" subtitle="Chaque ligne = une visite, de la première page au dernier clic">
        <ul className="divide-y divide-line text-sm">
          {s.recent.map((r) => (
            <li key={String(r.sid)} className="py-3">
              <p className="text-xs text-ink-soft">
                {new Date(String(r.start)).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })} · {String(r.device)} · {String(r.source ?? "direct")}
              </p>
              <p className="mt-1 leading-relaxed">
                {String(r.path)
                  .split(" → ")
                  .map((e) => {
                    const [k, step] = e.split(" ");
                    return `${LABELS[k] ?? k}${step ? ` ${step}` : ""}`;
                  })
                  .join(" → ")}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Rapports de l'agent" subtitle="Analyse automatique toutes les 3 heures">
        {s.reports.length ? (
          <div className="space-y-4">
            {s.reports.map((r) => (
              <details key={String(r.created_at)} className="rounded-2xl border border-line bg-cream p-4" open={r === s.reports[0]}>
                <summary className="cursor-pointer font-semibold">
                  {new Date(String(r.created_at)).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })} — {String(r.summary)}
                </summary>
                <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{String(r.body)}</div>
              </details>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">Aucun rapport pour l&apos;instant.</p>
        )}
      </Card>
    </div>
  );
}

function Tile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-4xl font-extrabold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-[1.5rem] border border-line bg-white p-6">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  if (!rows.length) return <p className="text-sm text-ink-soft">Pas encore de données sur cette période.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-ink-soft">
            {head.map((h, i) => (
              <th key={h} className={`pb-2 font-semibold ${i ? "text-right" : ""}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={`py-2 ${j ? "text-right tabular-nums" : "max-w-[14rem] truncate"}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
