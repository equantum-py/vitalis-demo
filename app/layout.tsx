import type { Metadata, Viewport } from "next";
import { DemoProvider } from "@/lib/store";
// Fuentes autoalojadas (sin llamadas a Google Fonts en tiempo de ejecución).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
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
