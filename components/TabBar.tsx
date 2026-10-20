"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/paciente", etiqueta: "Inicio" },
  { href: "/paciente/solicitar", etiqueta: "Solicitar" },
  { href: "/paciente/solicitudes", etiqueta: "Mis solicitudes" },
];

export function TabBar() {
  const ruta = usePathname();
  return (
    <nav
      aria-label="Navegación de pacientes"
      className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-md -translate-x-1/2 grid-cols-3 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      {TABS.map((tab) => {
        const activa = tab.href === "/paciente" ? ruta === "/paciente" : ruta.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={activa ? "page" : undefined}
            className={`flex min-h-14 items-center justify-center px-2 text-center text-sm font-semibold ${
              activa ? "text-teal" : "text-ink-soft"
            } focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-teal-600`}
          >
            {activa && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />}
            {tab.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
