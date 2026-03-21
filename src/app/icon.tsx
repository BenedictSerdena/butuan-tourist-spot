import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#1C1917",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "7px",
        fontSize: 18,
        fontWeight: 800,
        color: "#F5F0EB",
        fontFamily: "Georgia, serif",
        letterSpacing: "-1px",
      }}
    >
      B
    </div>,
    { ...size },
  );
}
