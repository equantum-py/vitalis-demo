"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono, type NombreIcono } from "@/components/Icono";

const TABS: { href: string; etiqueta: string; icono: NombreIcono }[] = [
  { href: "/paciente", etiqueta: "Inicio", icono: "inicio" },
  { href: "/paciente/solicitar", etiqueta: "Solicitar", icono: "solicitar" },
  { href: "/paciente/solicitudes", etiqueta: "Mis solicitudes", icono: "solicitudes" },
];

export function TabBar() {
  const ruta = usePathname();
  return (
    <nav
      aria-label="Navegación de pacientes"
      className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-md -translate-x-1/2 grid-cols-3 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      {TABS.map((tab) => {
        const activa = tab.href === "/paciente" ? ruta === "/paciente" : ruta.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={activa ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 px-2 text-center text-xs font-semibold ${
              activa ? "text-azul-600" : "text-ink-soft"
            } focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-azul-600`}
          >
            <span className={`flex h-8 w-14 items-center justify-center rounded-full ${activa ? "bg-azul-soft" : ""}`}>
              <Icono nombre={tab.icono} className="size-5.5" />
            </span>
            {tab.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
