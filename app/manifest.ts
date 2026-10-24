import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vitalis — Servicio de enfermería",
    short_name: "Vitalis",
    description: "Aplicación de prueba para atención domiciliaria Vitalis.",
    id: "/demo",
    start_url: "/demo",
    scope: "/",
    display: "standalone",
    background_color: "#f8fcff",
    theme_color: "#0b5e9c",
    lang: "es",
    icons: [
      { src: "/pwa-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/vitalis-logo.png", type: "image/png", sizes: "144x58", purpose: "any" }
    ]
  };
}
