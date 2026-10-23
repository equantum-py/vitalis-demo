"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ContenidoRuta } from "@/components/ContenidoRuta";
import { DemoBadge } from "@/components/DemoBadge";
import { MarcaVitalis } from "@/components/MarcaVitalis";
import { NavProfesional } from "@/components/profesional/NavProfesional";
import { CLASE_INPUT } from "@/components/ui";
import { PROFESIONALES_DEMO } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";

export default function LayoutProfesional({ children }: { children: React.ReactNode }) {
  const { estado, despachar } = useDemo();

  return (
    <div className="vitalis-shell mx-auto min-h-dvh w-full max-w-md md:my-6 md:min-h-[calc(100dvh-3rem)] md:overflow-hidden md:rounded-[34px] md:shadow-[12px_18px_45px_#005b8f20]">
      <header className="vitalis-header px-4 py-3 text-[#005b8f]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MarcaVitalis />

            <span className="hidden text-sm font-semibold text-[#6d6e71] sm:inline">Profesionales</span>
            <DemoBadge />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label htmlFor="profesional-activo" className="font-semibold text-azul-200">
              Profesional activo
            </label>
            <select
              id="profesional-activo"
              className={`${CLASE_INPUT} max-w-[170px] py-1.5 text-sm`}
              value={estado.profesionalActivoId}
              onChange={(e) => despachar({ tipo: "elegirProfesionalActivo", profesionalId: e.target.value })}
            >
              {PROFESIONALES_DEMO.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <Link href="/demo" className="font-semibold text-[#0b5e9c] underline underline-offset-4">
              Cambiar perfil
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 pb-28 pt-5">
        <Suspense fallback={<p className="text-ink-soft">Cargando…</p>}>
          <ContenidoRuta>{children}</ContenidoRuta>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <NavProfesional />
      </Suspense>
    </div>
  );
}
