import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "#1C1917",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "40px",
        gap: "4px",
      }}
    >
      <div
        style={{
          fontSize: 90,
          fontWeight: 800,
          color: "#F5F0EB",
          fontFamily: "Georgia, serif",
          letterSpacing: "-4px",
          lineHeight: 1,
        }}
      >
        B
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#78716C",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        BUTUAN
      </div>
    </div>,
    { ...size },
  );
}
