import "server-only";
import { neon } from "@neondatabase/serverless";

/** Base Postgres (Neon, branchée via l'intégration Vercel qui fournit DATABASE_URL). */
export const dbReady = () => !!process.env.DATABASE_URL;

let client: ReturnType<typeof neon> | null = null;
export function sql() {
  if (!client) client = neon(process.env.DATABASE_URL!);
  return client;
}

let schema: Promise<unknown> | null = null;

/** Crée les tables au premier appel (idempotent) : aucune migration manuelle à lancer. */
export function ensureSchema() {
  schema ??= (async () => {
    const q = sql();
    await q`CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text NOT NULL UNIQUE,
      first_name text NOT NULL,
      last_name text NOT NULL,
      password_hash text NOT NULL,
      whop_membership text,
      sub_active boolean NOT NULL DEFAULT false,
      sub_checked_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await q`CREATE TABLE IF NOT EXISTS user_plans (
      user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      profile jsonb NOT NULL,
      plan jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  })().catch((e) => {
    schema = null;
    throw e;
  });
  return schema;
}
