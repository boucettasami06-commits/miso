import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { GOOGLE_STATE_COOKIE, authUrl, googleReady, safeNext } from "@/lib/google";

export const dynamic = "force-dynamic";

/** Démarre « Continuer avec Google » : ?next= indique la page où revenir une fois connecté. */
export async function GET(req: Request) {
  const next = safeNext(new URL(req.url).searchParams.get("next"));
  if (!googleReady()) return NextResponse.redirect(new URL("/?auth=google_indisponible", req.url));
  const state = randomBytes(24).toString("base64url");
  const res = NextResponse.redirect(authUrl(state));
  res.cookies.set(GOOGLE_STATE_COOKIE, JSON.stringify({ state, next }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
