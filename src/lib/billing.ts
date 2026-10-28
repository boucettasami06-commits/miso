import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export type PlanId = "monthly" | "yearly";

/**
 * Tarifs affichés (le prix réellement facturé est celui configuré dans Whop) :
 * 9,99 €/mois, ou 12 mois avec 10 % de réduction = 107,89 €/an (≈ 8,99 €/mois).
 * Les liens de paiement Whop de chaque formule sont fournis par variables d'environnement.
 */
export const PLANS: Record<PlanId, { checkoutEnv: string }> = {
  monthly: { checkoutEnv: "WHOP_CHECKOUT_URL_MONTHLY" },
  yearly: { checkoutEnv: "WHOP_CHECKOUT_URL_YEARLY" },
};

export const COOKIE = "mijo_sub";
/** On revérifie l'abonnement chez Whop au plus tard toutes les 24 h. */
const RECHECK_SECONDS = 24 * 3600;

const secret = () => process.env.SUBSCRIPTION_SECRET ?? "";

export interface SubToken {
  /** identifiant d'abonnement (membership) ou clé de licence Whop */
  membership: string;
  /** prochaine revérification (secondes epoch) */
  exp: number;
}

/** Jeton signé (HMAC) stocké en cookie httpOnly : pas besoin de base de données pour contrôler l'accès. */
export function sign(t: SubToken): string {
  const body = Buffer.from(JSON.stringify(t)).toString("base64url");
  const mac = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

export function verify(raw: string | undefined): SubToken | null {
  if (!raw || !secret()) return null;
  const [body, mac] = raw.split(".");
  if (!body || !mac) return null;
  const expected = createHmac("sha256", secret()).update(body).digest();
  const given = Buffer.from(mac, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as SubToken;
  } catch {
    return null;
  }
}

export const billingReady = () => !!(process.env.WHOP_API_KEY && secret());

/**
 * Vérifie auprès de l'API Whop qu'un abonnement (ou une clé de licence) est valide,
 * et qu'il appartient bien au produit Mijo si WHOP_PRODUCT_ID est défini.
 */
export async function checkMembership(id: string): Promise<boolean> {
  const key = process.env.WHOP_API_KEY;
  if (!key || !/^[\w-]{6,80}$/.test(id)) return false;
  const res = await fetch(`https://api.whop.com/api/v2/memberships/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) return false;
  const m = (await res.json()) as { valid?: boolean; status?: string; product?: string | { id?: string } };
  const product = typeof m.product === "string" ? m.product : m.product?.id;
  const wanted = process.env.WHOP_PRODUCT_ID;
  if (wanted && product && product !== wanted) return false;
  return m.valid === true || ["active", "trialing", "completed"].includes(m.status ?? "");
}

export function token(membership: string): SubToken {
  return { membership, exp: Math.floor(Date.now() / 1000) + RECHECK_SECONDS };
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 400 * 86400,
};
