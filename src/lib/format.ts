import type { Ingredient } from "./types";

export const euro = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const FRACTIONS: [number, string][] = [
  [0.25, "¼"],
  [0.33, "⅓"],
  [0.5, "½"],
  [0.67, "⅔"],
  [0.75, "¾"],
];

function pieces(q: number): string {
  const whole = Math.floor(q);
  const rest = q - whole;
  if (rest < 0.12) return String(whole || 1);
  if (rest > 0.88) return String(whole + 1);
  const [, sym] = FRACTIONS.reduce((a, b) => (Math.abs(b[0] - rest) < Math.abs(a[0] - rest) ? b : a));
  return whole ? `${whole} ${sym}` : sym;
}

export function qty(q: number, unit: Ingredient["unit"]): string {
  if (unit === "pc") return pieces(q);
  const big = unit === "g" ? "kg" : "L";
  if (q >= 1000) return `${(Math.round(q / 100) / 10).toLocaleString("fr-FR")} ${big}`;
  const r = q < 20 ? Math.round(q) : Math.round(q / 5) * 5;
  return `${Math.max(1, r)} ${unit}`;
}
