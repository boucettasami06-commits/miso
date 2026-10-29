import "server-only";
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { ensureSchema, sql } from "./db";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = "budgemy_session";
const SESSION_DAYS = 30;
const secret = () => process.env.AUTH_SECRET ?? process.env.SUBSCRIPTION_SECRET ?? "";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  whop_membership: string | null;
  sub_active: boolean;
  sub_checked_at: string | null;
}

/** Mot de passe haché avec scrypt et un sel aléatoire : jamais stocké en clair. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function checkPassword(password: string, stored: string): Promise<boolean> {
  const [, salt, hash] = stored.split("$");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const got = await scrypt(password, Buffer.from(salt, "base64"), expected.length);
  return timingSafeEqual(got, expected);
}

/** Session : identifiant utilisateur + expiration, signés HMAC, en cookie httpOnly. */
function signSession(uid: string): string {
  const body = Buffer.from(JSON.stringify({ uid, exp: Date.now() + SESSION_DAYS * 86400_000 })).toString("base64url");
  return `${body}.${createHmac("sha256", secret()).update(body).digest("base64url")}`;
}

function readSession(raw: string | undefined): string | null {
  if (!raw || !secret()) return null;
  const [body, mac] = raw.split(".");
  if (!body || !mac) return null;
  const expected = createHmac("sha256", secret()).update(body).digest();
  const given = Buffer.from(mac, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(body, "base64url").toString()) as { uid: string; exp: number };
    return exp > Date.now() ? uid : null;
  } catch {
    return null;
  }
}

export const sessionCookie = (uid: string) =>
  [
    SESSION_COOKIE,
    signSession(uid),
    { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: SESSION_DAYS * 86400 },
  ] as const;

export async function currentUser(): Promise<User | null> {
  const uid = readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!uid) return null;
  await ensureSchema();
  const rows = (await sql()`SELECT id, email, first_name, last_name, whop_membership, sub_active, sub_checked_at FROM users WHERE id = ${uid}`) as User[];
  return rows[0] ?? null;
}

export const publicUser = (u: User) => ({ firstName: u.first_name, lastName: u.last_name, email: u.email });

export const normEmail = (e: unknown) => String(e ?? "").trim().toLowerCase();
export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;
export const cleanName = (n: unknown) => String(n ?? "").trim().replace(/\s+/g, " ").slice(0, 60);
