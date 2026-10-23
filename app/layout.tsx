import type { Metadata, Viewport } from "next";
import { DemoProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitalis | Servicio de enfermería",
  description: "Vitalis — servicio de enfermería y atención domiciliaria.",
  robots: { index: false, follow: false },
  applicationName: "Vitalis",
  appleWebApp: { capable: true, title: "Vitalis", statusBarStyle: "default" },
  icons: { icon: "/pwa-icon.svg", apple: "/vitalis-logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b5e9c",
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
