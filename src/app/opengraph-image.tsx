import { ImageResponse } from "next/og";

export const alt = "Budgemy — Ta semaine de repas, pile dans ton budget";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#fafaf5", color: "#10231c" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 44, fontWeight: 700 }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "#ff5a1f" }} />
          BUDGEMY.
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.02, fontWeight: 700, letterSpacing: -2 }}>
          <span>Ta semaine de repas,</span>
          <span style={{ color: "#ff5a1f" }}>pile dans ton budget.</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 28, color: "#4b5b53" }}>
          <span>Healthy · Muscu · Équilibré · Gourmand</span>
          <span>—</span>
          <span>France · Belgique · Suisse · Allemagne</span>
        </div>
      </div>
    ),
    size,
  );
}
