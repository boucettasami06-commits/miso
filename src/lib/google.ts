import "server-only";
import { SITE } from "./site";

/**
 * Connexion « Continuer avec Google » (OAuth 2.0 / OpenID Connect, flux avec code d'autorisation).
 * Réglages : GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET (console Google Cloud, identifiants OAuth « Application Web »).
 */
export const googleReady = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export const GOOGLE_STATE_COOKIE = "budgemy_g_state";
export const redirectUri = () => `${SITE.url}/api/auth/google/callback`;

export function authUrl(state: string) {
  const q = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

export interface GoogleProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  given_name?: string;
  family_name?: string;
}

/** Échange le code contre un jeton, puis lit le profil (e-mail vérifié, prénom, nom). */
export async function googleProfile(code: string): Promise<GoogleProfile | null> {
  const tok = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri(),
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  if (!tok.ok) return null;
  const { access_token } = (await tok.json()) as { access_token?: string };
  if (!access_token) return null;
  const me = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
    cache: "no-store",
  });
  if (!me.ok) return null;
  return (await me.json()) as GoogleProfile;
}

/** N'autorise que les retours vers une page du site (jamais vers un autre domaine). */
export const safeNext = (v: string | null | undefined) => (v && /^\/(?!\/)[\w\-./?=&%]*$/.test(v) ? v : "/planifier");
