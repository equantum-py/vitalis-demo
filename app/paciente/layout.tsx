"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ContenidoRuta } from "@/components/ContenidoRuta";
import { DemoBadge } from "@/components/DemoBadge";
import { TabBar } from "@/components/TabBar";
import { PACIENTE_DEMO } from "@/lib/fixtures";

export default function LayoutPaciente({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper md:my-6 md:min-h-[calc(100dvh-3rem)] md:overflow-hidden md:rounded-3xl md:border md:border-line md:shadow-sm">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link href="/paciente" className="font-display text-lg font-semibold tracking-wide text-teal">
            VITALIS
          </Link>
          <DemoBadge />
        </div>
        <Link
          href="/paciente/urgencia"
          className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-[#E0B7A0] bg-warm-soft px-3 text-sm font-semibold text-warm-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Urgencia
        </Link>
      </header>
      <p className="px-4 pt-2 text-xs text-ink-soft">Perfil de demostración: {PACIENTE_DEMO.nombre} (ficticia)</p>
      <main className="flex-1 px-4 pb-28 pt-4">
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
