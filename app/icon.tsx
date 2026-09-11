import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#080D13", borderRadius: 112 }}>
      <div style={{ position: "relative", width: 270, height: 330, display: "flex", alignItems: "center", justifyContent: "center", border: "24px solid #D5B579", borderBottom: "none", borderRadius: "135px 135px 0 0" }}>
        <div style={{ position: "absolute", top: 62, width: 18, height: 150, borderRadius: 9, background: "#D5B579" }} />
        <div style={{ position: "absolute", top: 105, width: 72, height: 18, borderRadius: 9, background: "#D5B579" }} />
        <div style={{ position: "absolute", bottom: 0, width: 230, height: 68, borderRadius: "12px 12px 32px 32px", background: "#F8F2E8" }} />
      </div>
    </div>,
    size,
  );
}
