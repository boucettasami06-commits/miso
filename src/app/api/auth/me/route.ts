import { NextResponse } from "next/server";
import { currentUser, publicUser } from "@/lib/auth";
import { dbReady } from "@/lib/db";

export const dynamic = "force-dynamic";

/** `enabled: false` tant que la base n'est pas branchée : le site fonctionne alors sans comptes. */
export async function GET() {
  if (!dbReady()) return NextResponse.json({ enabled: false, user: null });
  const u = await currentUser().catch(() => null);
  return NextResponse.json({ enabled: true, user: u ? publicUser(u) : null });
}
