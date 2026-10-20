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
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper md:my-6 md:min-h-[calc(100dvh-3rem)] md:overflow-hidden md:rounded-3xl md:border md:border-line md:shadow-sm">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-surface px-5 py-3 shadow-[0_1px_0_var(--color-line)]">
        <div className="flex min-w-0 items-center gap-2">
          <MarcaVitalis />
          <Link href="/paciente" className="font-display text-xl font-semibold text-navy">
            Vitalis
          </Link>
          <DemoBadge />
        </div>
        <Link
          href="/paciente/urgencia"
          aria-label="Urgencia"
          className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-warm-soft px-3 text-sm font-semibold text-warm-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-azul-600 min-[390px]:px-3.5"
        >
          <Icono nombre="urgencia" className="size-4.5" />
          <span className="max-[389px]:sr-only">Urgencia</span>
        </Link>
      </header>
      <p className="px-5 pt-3 text-xs text-ink-soft">Perfil de demostración: {PACIENTE_DEMO.nombre} (ficticia)</p>
      <main className="flex-1 px-5 pb-28 pt-4">
        <Suspense fallback={<p className="text-ink-soft">Cargando…</p>}>
          <ContenidoRuta>{children}</ContenidoRuta>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <TabBar />
      </Suspense>
    </div>
  );
}
