"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ContenidoRuta } from "@/components/ContenidoRuta";
import { DemoBadge } from "@/components/DemoBadge";
import { MarcaVitalis } from "@/components/MarcaVitalis";
import { NavAdmin } from "@/components/admin/NavAdmin";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper lg:flex">
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-60 lg:shrink-0 lg:flex-col lg:gap-8 lg:bg-navy lg:p-5 lg:text-white">
        <div className="flex items-center gap-2.5">
          <MarcaVitalis variante="clara" />
          <Link href="/admin" className="font-display text-xl font-semibold text-white">
            Vitalis
          </Link>
        </div>
        <Suspense fallback={null}>
          <NavAdmin variante="lateral" />
        </Suspense>
        <p className="mt-auto text-xs leading-relaxed text-white/75">
          Administración y coordinación.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-5 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5 font-display text-xl font-semibold text-navy lg:hidden">
              <MarcaVitalis />
              Vitalis
            </Link>
            <span className="hidden text-sm font-semibold text-ink-soft lg:inline">Panel de administración</span>
            <DemoBadge />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-ink-soft">Perfil: Coordinación</span>
            <Link href="/demo" className="font-semibold text-azul-600 underline underline-offset-4">
              Cambiar perfil
            </Link>
          </div>
        </header>

        <div
          role="note"
          className="border-b border-warm-200 bg-warm-soft px-5 py-3 text-sm text-warm-ink lg:hidden"
        >
          La administración está optimizada para escritorio. En este tamaño verá tarjetas de solo lectura.
        </div>

        <div className="px-5 pt-4 lg:hidden">
          <Suspense fallback={null}>
            <NavAdmin variante="compacta" />
          </Suspense>
        </div>

        <main className="flex-1 px-5 py-5 lg:px-8 lg:py-7">
          <Suspense fallback={<p className="text-ink-soft">Cargando…</p>}>
            <ContenidoRuta>{children}</ContenidoRuta>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
