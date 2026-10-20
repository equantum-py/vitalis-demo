"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono, type NombreIcono } from "@/components/Icono";

const ITEMS: { href: string; etiqueta: string; icono: NombreIcono }[] = [
  { href: "/profesional", etiqueta: "Inicio", icono: "inicio" },
  { href: "/profesional/agenda", etiqueta: "Agenda", icono: "agenda" },
];

/** Navegación del perfil profesional: barra inferior en móvil, pestañas en escritorio. */
export function NavProfesional() {
  const ruta = usePathname();
  return (
    <nav
      aria-label="Navegación de profesionales"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:static lg:flex lg:gap-1 lg:border-0 lg:bg-transparent lg:pb-0"
    >
      {ITEMS.map((item) => {
        const activa = item.href === "/profesional" ? ruta === "/profesional" : ruta.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={activa ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold lg:min-h-11 lg:flex-row lg:gap-2 lg:rounded-xl lg:px-4 lg:text-sm ${
              activa ? "text-azul-600 lg:bg-azul-soft" : "text-ink-soft lg:hover:bg-surface"
            } focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-azul-600`}
          >
            <Icono nombre={item.icono} />
            {item.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
