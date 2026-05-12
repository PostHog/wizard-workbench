import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "hogkilla",
    short_name: "hogkilla",
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
