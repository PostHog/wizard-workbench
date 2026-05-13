import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "posthog-migrate",
    short_name: "posthog-migrate",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    theme_color: "#09090b",
    background_color: "#09090b",
    display: "standalone",
  };
}
