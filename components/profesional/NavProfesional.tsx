"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/profesional", etiqueta: "Inicio" },
  { href: "/profesional/agenda", etiqueta: "Agenda" },
];

/** Navegación del perfil profesional. Funciona igual en móvil y en escritorio. */
export function NavProfesional() {
  const ruta = usePathname();
  return (
    <nav aria-label="Navegación de profesionales" className="flex gap-2">
      {ITEMS.map((item) => {
        const activa = item.href === "/profesional" ? ruta === "/profesional" : ruta.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={activa ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-xl border px-4 text-sm font-semibold ${
              activa ? "border-teal bg-teal text-white" : "border-line bg-white text-ink"
            }`}
          >
            {item.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
