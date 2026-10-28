import type { Metadata } from "next";
import { Suspense } from "react";
import Activate from "./Activate";

export const metadata: Metadata = { title: "Activer mon abonnement", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <Suspense>
      <Activate />
    </Suspense>
  );
}
