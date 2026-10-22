"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono } from "@/components/Icono";

export function TabBar() {
  const ruta = usePathname();
  const items = [
    { href: "/paciente", label: "Inicio", icon: "inicio" as const },
    { href: "/paciente/solicitudes", label: "Solicitudes", icon: "solicitudes" as const },
    { href: "/paciente/solicitar", label: "Solicitar", icon: "mas" as const, central: true },
    { href: "/paciente/urgencia", label: "Urgencia", icon: "urgencia" as const },
    { href: "/demo", label: "Perfiles", icon: "usuarios" as const },
  ];
  return (
    <nav aria-label="Navegación de pacientes" className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-md -translate-x-1/2 grid-cols-5 rounded-t-2xl border-t border-[#edf1f6] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_22px_#132b4710]">
      {items.map((item) => {
        const active = item.href === "/paciente" ? ruta === item.href : ruta.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} aria-label={item.label} aria-current={active ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-medium focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#286ef0] ${active ? "text-[#286ef0]" : "text-[#8c9aaf]"}`}>
            <span className={item.central ? "flex size-12 -translate-y-2 items-center justify-center rounded-2xl bg-[#286ef0] text-white shadow-lg" : "flex size-7 items-center justify-center"}>
              <Icono nombre={item.icon} className={item.central ? "size-7" : "size-5"} />
            </span>
            {!item.central && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
