import type { Metadata } from "next";
import { Suspense } from "react";
import ResetForm from "./ResetForm";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
