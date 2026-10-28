import type { Metadata } from "next";
import { Suspense } from "react";
import Wizard from "@/components/planner/Wizard";

export const metadata: Metadata = {
  title: "Créer mon menu de la semaine",
  description: "Réponds à 6 questions (objectif, foyer, repas, régime, budget, temps) et obtiens ton menu de la semaine personnalisé avec la liste de courses la moins chère.",
  alternates: { canonical: "/planifier" },
};

export default function Page() {
  return (
    <Suspense>
      <Wizard />
    </Suspense>
  );
}
