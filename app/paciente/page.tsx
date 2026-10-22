"use client";

import Link from "next/link";
import { useState } from "react";
import { EmergencyNotice } from "@/components/EmergencyNotice";
import { Icono } from "@/components/Icono";
import { ProgresoSolicitud } from "@/components/ProgresoSolicitud";
import { StatusPill } from "@/components/StatusPill";
import { AvisoDemo } from "@/components/ui";
import { PACIENTE_DEMO, PROFESIONALES_DEMO } from "@/lib/fixtures";
import { formatearFecha } from "@/lib/formato";
import { PROXIMO_PASO } from "@/lib/estado-ui";
import { useDemo } from "@/lib/store";

const especialidades = ["Medicina general", "Cardiología", "Odontología"];

export default function InicioPaciente() {
  const { estado } = useDemo();
  const [busqueda, setBusqueda] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const reciente = estado.solicitudes[0];
  const profesionales = PROFESIONALES_DEMO.filter((p) =>
    p.nombre.toLocaleLowerCase("es").includes(busqueda.toLocaleLowerCase("es"))
  );

  return (
    <div className="flex flex-col gap-6 text-[#101b32]">
      <header className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#eaf2fc] text-sm font-semibold text-[#2869e9]" aria-hidden="true">
          {PACIENTE_DEMO.nombre.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[16px] font-semibold">Hola, {PACIENTE_DEMO.nombre.split(" ")[0]}</h1>
          <p className="truncate text-xs text-[#8795a8]">Atención domiciliaria · Demostración</p>
        </div>
      </header>

      <div className="flex gap-2.5">
        <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e3e9f1] bg-white px-3.5">
          <span className="sr-only">Buscar profesional</span>
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar profesional" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9aa6b7]" />
          <span aria-hidden="true" className="text-[#2986ee]">⌕</span>
        </label>
        <button type="button" onClick={() => setMostrarFiltros(!mostrarFiltros)} aria-expanded={mostrarFiltros} className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e3e9f1] bg-white text-[#2874ef]" aria-label="Mostrar filtros">
          <Icono nombre="solicitudes" className="size-5" />
        </button>
      </div>
      {mostrarFiltros && <p className="rounded-xl bg-[#eff5ff] p-3 text-xs text-[#3562a8]">La búsqueda filtra por nombre. Otros filtros no están disponibles en esta demostración.</p>}

      <section aria-labelledby="proxima-atencion">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="proxima-atencion" className="text-[15px] font-bold">Próxima atención</h2>
          <Link href="/paciente/solicitudes" className="text-[10px] font-semibold uppercase text-[#2b71ec]">Ver todas</Link>
        </div>
        <div className="rounded-[19px] bg-[#2c74f1] p-4 text-white shadow-[0_6px_0_#d7e5ff]">
          {reciente ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Solicitud {reciente.id}</p>
                  <p className="mt-1 text-xs text-white/85">{PROXIMO_PASO[reciente.estado]}</p>
                </div>
                <StatusPill estado={reciente.estado} />
              </div>
              <div className="mt-4 rounded-xl bg-[#2168df] px-3 py-3 text-center text-xs">
                {formatearFecha(reciente.historial[0].fecha)}
              </div>
              {reciente.estado !== "cancelada" && <div className="mt-3"><ProgresoSolicitud estado={reciente.estado} /></div>}
              <Link href={`/paciente/solicitudes/${reciente.id}`} className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-white text-sm font-semibold text-[#236be6]">Ver seguimiento</Link>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">Tu próxima atención comienza aquí</p>
              <p className="mt-1 text-xs text-white/85">Todavía no tenés una solicitud activa.</p>
              <Link href="/paciente/solicitar" className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-white text-sm font-semibold text-[#236be6]">Solicitar atención domiciliaria</Link>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="especialidades">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="especialidades" className="text-[15px] font-bold">Especialidades</h2>
          <span className="text-[10px] font-semibold uppercase text-[#2b71ec]">Servicios de ejemplo</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {especialidades.map((nombre) => (
            <span key={nombre} className="rounded-xl border border-[#eff2f8] bg-white px-3 py-3 text-xs text-[#42526a] shadow-sm">{nombre}</span>
          ))}
        </div>
      </section>

      <section aria-labelledby="profesionales">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="profesionales" className="text-[15px] font-bold">Profesionales</h2>
          <span className="text-[10px] font-semibold uppercase text-[#2b71ec]">Datos ficticios</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {profesionales.map((profesional, index) => (
            <div key={profesional.id} className="flex items-center gap-3 rounded-xl border border-[#eff2f8] bg-white p-2.5 shadow-sm">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#e8f2ff] text-[#3073e9]" aria-hidden="true"><Icono nombre="usuarios" className="size-6" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{profesional.nombre}</p>
                <p className="text-[11px] text-[#8795a8]">Perfil de demostración {index + 1}</p>
              </div>
              <Link href="/paciente/solicitar" className="flex min-h-11 items-center rounded-lg px-2 text-xs font-semibold text-[#2c74f1]">Solicitar</Link>
            </div>
          ))}
          {profesionales.length === 0 && <p className="rounded-xl bg-white p-4 text-sm text-[#65758c]">No hay coincidencias en los datos de demostración.</p>}
        </div>
      </section>

      <EmergencyNotice />
      <AvisoDemo>
        Datos y profesionales ficticios. No se ofrecen citas médicas reales.{" "}
        <Link href="/demo" className="font-semibold text-azul-600 underline underline-offset-4">Cambiar de perfil</Link>
      </AvisoDemo>
    </div>
  );
}
