"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono, type NombreIcono } from "@/components/Icono";
import { contarPorEstado } from "@/lib/admin";
import { useDemo } from "@/lib/store";

const ITEMS: { href: string; etiqueta: string; icono: NombreIcono }[] = [
  { href: "/admin", etiqueta: "Dashboard", icono: "inicio" },
  { href: "/admin/pacientes", etiqueta: "Pacientes", icono: "usuarios" },
  { href: "/admin/funcionarios", etiqueta: "Funcionarios", icono: "usuarios" },
  { href: "/admin/solicitudes", etiqueta: "Solicitudes", icono: "solicitudes" },
  { href: "/admin/agenda", etiqueta: "Agenda", icono: "agenda" },
  { href: "/admin/profesionales", etiqueta: "Profesionales", icono: "usuarios" },
  { href: "/admin/urgencias", etiqueta: "Urgencias", icono: "triangulo" },
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
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold ${
              activa(ruta, item.href) ? "border-navy bg-navy text-white" : "border-line bg-surface text-ink"
            }`}
          >
            <Icono nombre={item.icono} className="size-4.5" />
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
              esActiva ? "bg-white/15 font-semibold text-white" : "text-azul-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icono nombre={item.icono} className="size-5" />
              {item.etiqueta}
            </span>
            {item.href === "/admin/solicitudes" && recibidas > 0 && (
              <span
                className="rounded-full bg-azul-soft px-2 py-0.5 text-xs font-bold text-navy"
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
