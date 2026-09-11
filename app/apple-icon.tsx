import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#080D13", borderRadius: 40 }}>
      <div style={{ position: "relative", width: 96, height: 118, display: "flex", alignItems: "center", justifyContent: "center", border: "9px solid #D5B579", borderBottom: "none", borderRadius: "48px 48px 0 0" }}>
        <div style={{ position: "absolute", top: 20, width: 7, height: 54, borderRadius: 4, background: "#D5B579" }} />
        <div style={{ position: "absolute", top: 36, width: 26, height: 7, borderRadius: 4, background: "#D5B579" }} />
        <div style={{ position: "absolute", bottom: 0, width: 84, height: 26, borderRadius: "5px 5px 12px 12px", background: "#F8F2E8" }} />
      </div>
    </div>,
    size,
  );
}
