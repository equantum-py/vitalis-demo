"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ContenidoRuta } from "@/components/ContenidoRuta";
import { DemoBadge } from "@/components/DemoBadge";
import { Icono } from "@/components/Icono";
import { MarcaVitalis } from "@/components/MarcaVitalis";
import { TabBar } from "@/components/TabBar";
import { PACIENTE_DEMO } from "@/lib/fixtures";

export default function LayoutPaciente({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white md:my-6 md:min-h-[calc(100dvh-3rem)] md:overflow-hidden md:rounded-3xl md:border md:border-line md:shadow-sm">
      <header className="flex min-h-[60px] items-center justify-between gap-2 border-b border-[#eef1f6] bg-white px-4">
        <div className="flex min-w-0 items-center gap-2">
          <MarcaVitalis />
          <Link href="/paciente" className="font-sans text-[17px] font-bold text-[#124266]">Vitalis</Link>
          <DemoBadge />
        </div>
        <Link href="/paciente/urgencia" aria-label="Urgencia" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-warm-soft px-3 text-xs font-semibold text-warm-ink">
          <Icono nombre="urgencia" className="size-4" />
          Urgencia
        </Link>
      </header>
      <main className="flex-1 px-4 pb-28 pt-5">
        <Suspense fallback={<p className="text-ink-soft">Cargando…</p>}>
          <ContenidoRuta>{children}</ContenidoRuta>
        </Suspense>
      </main>
      <Suspense fallback={null}><TabBar /></Suspense>
      <span className="sr-only">Perfil: {PACIENTE_DEMO.nombre}</span>
    </div>
  );
}
