import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Butuan Tourist Spots",
    short_name: "Butuan Spots",
    description: "Explore tourist destinations in Butuan City, Agusan del Norte, Philippines.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0EB",
    theme_color: "#1C1917",
    orientation: "portrait-primary",
    categories: ["travel", "tourism"],
    icons: [
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/apple-icon", sizes: "192x192", type: "image/png", purpose: "maskable" },
    ],
  };
}
