import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e2572b", borderRadius: 112 }}>
        <div style={{ fontSize: 300, color: "#fbf6ee", fontWeight: 700, marginTop: -30 }}>m</div>
        <div style={{ position: "absolute", right: 120, bottom: 150, width: 56, height: 56, borderRadius: 28, background: "#f2b33d" }} />
      </div>
    ),
    size,
  );
}
