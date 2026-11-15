import { timingSafeEqual } from "node:crypto";
import { unsubscribeSig } from "@/lib/billing";
import { dbReady, ensureSchema, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

const page = (msg: string) =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Budgemy</title></head><body style="margin:0;background:#fafaf5;font-family:Arial,sans-serif;color:#10231c;display:grid;place-items:center;min-height:100vh;padding:24px;text-align:center"><div><p style="font-size:22px;font-weight:800">${msg}</p><p><a href="/" style="color:#fa654c">Retour sur Budgemy</a></p></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

async function stop(req: Request) {
  const q = new URL(req.url).searchParams;
  const u = q.get("u") ?? "";
  const s = q.get("s") ?? "";
  const want = unsubscribeSig(u);
  const ok = /^[0-9a-f-]{36}$/.test(u) && s.length === want.length && timingSafeEqual(Buffer.from(s), Buffer.from(want));
  if (!ok || !dbReady()) return page("Ce lien n'est pas valide.");
  await ensureSchema();
  await sql()`UPDATE users SET unsubscribed_at = now() WHERE id = ${u} AND unsubscribed_at IS NULL`;
  return page("C'est noté : tu ne recevras plus de rappels.");
}

/** Lien « Ne plus recevoir ces rappels » (GET) et désinscription en un clic des messageries (POST, RFC 8058). */
export const GET = stop;
export const POST = stop;
