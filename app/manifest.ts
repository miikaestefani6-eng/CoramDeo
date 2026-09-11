import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coram Deo",
    short_name: "Coram Deo",
    description: "Estudo bíblico, devocionais e pesquisa com Zion para uma vida diante de Deus.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#080D13",
    theme_color: "#080D13",
    lang: "pt-BR",
    categories: ["education", "lifestyle", "books"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
