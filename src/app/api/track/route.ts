import { NextResponse } from "next/server";
import { sessionUid } from "@/lib/auth";
import { dbReady, ensureSchema, sql } from "@/lib/db";

const NAMES = new Set([
  "page_view", "scroll", "cta_click", "signup_open", "signup_ok", "login_ok", "wizard_step", "wizard_done", "compare_view", "savings_view", "client_error",
  "plan_generated", "plan_view", "locked_click", "paywall_view", "plan_select", "checkout_click", "activation_ok",
]);
const BOTS = /bot|crawl|spider|slurp|preview|lighthouse|headless|curl|wget|python|node-fetch/i;
const id = (v: unknown) => (typeof v === "string" && /^[\w-]{6,40}$/.test(v) ? v : null);
const text = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : null);

/** Reçoit un événement du parcours visiteur (voir lib/funnel.ts). Toujours 204 : la mesure ne doit jamais gêner le site. */
export async function POST(req: Request) {
  const done = new NextResponse(null, { status: 204 });
  const ua = req.headers.get("user-agent") ?? "";
  if (!dbReady() || BOTS.test(ua)) return done;
  const raw = await req.text().catch(() => "");
  if (raw.length > 4000) return done;
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw);
  } catch {
    return done;
  }
  const vid = id(b.vid);
  const sid = id(b.sid);
  const name = typeof b.name === "string" && NAMES.has(b.name) ? b.name : null;
  if (!vid || !sid || !name) return done;
  const props = b.props && typeof b.props === "object" ? JSON.stringify(b.props).slice(0, 1500) : null;
  const device = /ipad|tablet/i.test(ua) ? "tablette" : /mobi|android|iphone/i.test(ua) ? "mobile" : "ordinateur";
  const country = req.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null;
  const uid = await sessionUid().catch(() => null);

  await ensureSchema();
  await sql()`
    INSERT INTO events (vid, sid, uid, name, path, props, source, referrer, device, country)
    VALUES (${vid}, ${sid}, ${uid}, ${name}, ${text(b.path, 200)}, ${props}::jsonb, ${text(b.source, 120)}, ${text(b.referrer, 120)}, ${device}, ${country})`.catch(
    (err) => console.error("track", err),
  );
  return done;
}
