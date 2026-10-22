"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono } from "@/components/Icono";

export function TabBar() {
  const ruta = usePathname();
  const items = [
    { href: "/paciente", label: "Inicio", icon: "inicio" as const },
    { href: "/paciente/solicitudes", label: "Citas", icon: "agenda" as const },
    { href: "/paciente/solicitar", label: "Solicitar", icon: "mas" as const, primary: true },
    { href: "/paciente/urgencia", label: "Urgencia", icon: "urgencia" as const },
    { href: "/demo", label: "Perfil", icon: "usuarios" as const },
  ];
  return (
    <nav aria-label="Navegación de pacientes" className="fixed bottom-0 left-1/2 z-20 grid w-full max-w-md -translate-x-1/2 grid-cols-5 rounded-t-[22px] border-t border-[#edf0f6] bg-white px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_#1c3e6710]">
      {items.map((item) => {
        const activa = item.href === "/paciente" ? ruta === item.href : ruta.startsWith(item.href);
        return (
          <Link key={item.label} href={item.href} aria-current={activa ? "page" : undefined} className={`flex min-h-[68px] min-w-0 flex-col items-center justify-center gap-1 text-center text-[10px] font-medium focus-visible:outline-2 focus-visible:outline-[#0b5e9c] ${activa ? "text-[#0b5e9c]" : "text-[#94a1b3]"}`} aria-label={item.label}>
            <span className={`flex items-center justify-center ${item.primary ? "size-12 -translate-y-2 rounded-2xl bg-[#0b5e9c] text-white shadow-[0_6px_18px_#0b5e9c4d]" : "size-6"}`}>
              <Icono nombre={item.icon} className={item.primary ? "size-7" : "size-5"} />
            </span>
            {!item.primary && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
