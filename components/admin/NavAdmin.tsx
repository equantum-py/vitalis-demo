"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contarPorEstado } from "@/lib/admin";
import { useDemo } from "@/lib/store";

const ITEMS = [
  { href: "/admin", etiqueta: "Dashboard" },
  { href: "/admin/solicitudes", etiqueta: "Solicitudes" },
  { href: "/admin/agenda", etiqueta: "Agenda" },
  { href: "/admin/profesionales", etiqueta: "Profesionales" },
  { href: "/admin/urgencias", etiqueta: "Urgencias" },
];

function activa(ruta: string, href: string) {
  return href === "/admin" ? ruta === "/admin" : ruta.startsWith(href);
}

/** Menú lateral (escritorio) y de navegación compacta (móvil). */
export function NavAdmin({ variante }: { variante: "lateral" | "compacta" }) {
  const ruta = usePathname();
  const { estado } = useDemo();
  const recibidas = contarPorEstado(estado.solicitudes, "recibida");

  if (variante === "compacta") {
    return (
      <nav aria-label="Navegación de administración" className="flex flex-wrap gap-2 lg:hidden">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={activa(ruta, item.href) ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-xl border px-3.5 text-sm font-semibold ${
              activa(ruta, item.href) ? "border-teal bg-teal text-white" : "border-line bg-white text-ink"
            }`}
          >
            {item.etiqueta}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Menú de administración" className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const esActiva = activa(ruta, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={esActiva ? "page" : undefined}
            className={`flex min-h-11 items-center justify-between rounded-xl px-3.5 text-[15px] font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white ${
              esActiva ? "bg-white text-teal" : "text-white/90 hover:bg-white/10"
            }`}
          >
            <span>{item.etiqueta}</span>
            {item.href === "/admin/solicitudes" && recibidas > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${esActiva ? "bg-mint text-teal" : "bg-white/20 text-white"}`}
                aria-label={`${recibidas} solicitudes recibidas por asignar`}
              >
                {recibidas}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
