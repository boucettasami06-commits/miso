import type { Metadata } from "next";
import PlanView from "@/components/planner/PlanView";

export const metadata: Metadata = {
  title: "Ma semaine",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PlanView />;
}
