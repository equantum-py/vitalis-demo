import type { Metadata, Viewport } from "next";
import { DemoProvider } from "@/lib/store";
// Fuentes autoalojadas (sin llamadas a Google Fonts en tiempo de ejecución).
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitalis · Demo (datos ficticios)",
  description: "Demostración navegable de una plataforma de atención domiciliaria. Datos ficticios.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-dvh">
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
