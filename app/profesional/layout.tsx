"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ContenidoRuta } from "@/components/ContenidoRuta";
import { DemoBadge } from "@/components/DemoBadge";
import { NavProfesional } from "@/components/profesional/NavProfesional";
import { CLASE_INPUT } from "@/components/ui";
import { PROFESIONALES_DEMO } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";

export default function LayoutProfesional({ children }: { children: React.ReactNode }) {
  const { estado, despachar } = useDemo();

  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-line bg-white px-4 py-3 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/profesional" className="font-display text-lg font-semibold text-teal">
              VITALIS
            </Link>
            <span className="hidden text-sm font-semibold text-ink-soft sm:inline">Profesionales</span>
            <DemoBadge />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label htmlFor="profesional-activo" className="font-semibold text-ink-soft">
              Profesional activo
            </label>
            <select
              id="profesional-activo"
              className={`${CLASE_INPUT} w-auto py-1.5`}
              value={estado.profesionalActivoId}
              onChange={(e) => despachar({ tipo: "elegirProfesionalActivo", profesionalId: e.target.value })}
            >
              {PROFESIONALES_DEMO.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <Link href="/demo" className="font-semibold text-teal underline underline-offset-4">
              Cambiar perfil
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-4 lg:px-8">
        <Suspense fallback={null}>
          <NavProfesional />
        </Suspense>
      </div>

      <main className="mx-auto max-w-5xl p-4 lg:p-8">
        <Suspense fallback={<p className="text-ink-soft">Cargando…</p>}>
          <ContenidoRuta>{children}</ContenidoRuta>
        </Suspense>
      </main>
    </div>
  );
}
