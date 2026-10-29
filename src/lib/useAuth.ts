"use client";

import { useCallback, useEffect, useState } from "react";

export interface PublicUser {
  firstName: string;
  lastName: string;
  email: string;
}

/** État de connexion côté navigateur. `enabled` = la base de comptes est branchée. */
export function useAuth() {
  const [state, setState] = useState<{ loading: boolean; enabled: boolean; user: PublicUser | null }>({
    loading: true,
    enabled: false,
    user: null,
  });

  const refresh = useCallback(async () => {
    const d = (await fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .catch(() => ({ enabled: false, user: null }))) as { enabled: boolean; user: PublicUser | null };
    setState({ loading: false, enabled: d.enabled, user: d.user });
    return d;
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("budgemy:auth", onChange);
    return () => window.removeEventListener("budgemy:auth", onChange);
  }, [refresh]);

  return { ...state, refresh };
}

/** Prévient les autres composants (en-tête, semaine) qu'on vient de se connecter ou de se déconnecter. */
export const notifyAuthChange = () => window.dispatchEvent(new Event("budgemy:auth"));

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  notifyAuthChange();
}
