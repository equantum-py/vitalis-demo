"use client";

import Link from "next/link";
import { useState } from "react";
import { Icono } from "@/components/Icono";
import { EmergencyNotice } from "@/components/EmergencyNotice";
import { PACIENTE_DEMO, PROFESIONALES_DEMO } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";
import { StatusPill } from "@/components/StatusPill";
import { PROXIMO_PASO } from "@/lib/estado-ui";

const SERVICIOS = ["Medicina general", "Enfermería", "Atención domiciliaria"];

export default function InicioPaciente() {
  const { estado } = useDemo();
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState(false);
  const reciente = estado.solicitudes[0];
  const profesionales = PROFESIONALES_DEMO.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-7 pb-4 text-[#005b8f]">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e9f1fa] text-lg font-bold text-[#0b5e9c]">
            {PACIENTE_DEMO.nombre.charAt(0)}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-[17px] font-semibold leading-tight">Hola, {PACIENTE_DEMO.nombre.split(" ")[0]}</h1>
            <p className="mt-1 flex items-center gap-1 text-xs text-[#6d6e71]">
              <Icono nombre="ubicacion" className="size-3 text-[#1e88c8]" />
              Atención a domicilio
            </p>
          </div>
        </div>
        <Link href="/paciente/solicitudes" aria-label="Ver solicitudes y avisos" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0b5e9c] text-white shadow-[0_8px_18px_#0b5e9c33]">
          <Icono nombre="solicitudes" className="size-5" />
        </Link>
      </header>

      <div className="flex gap-2.5">
        <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e3e8f0] bg-white px-4">
          <span className="sr-only">Buscar profesional</span>
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar profesional" className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#a2acbc]" />
          <svg viewBox="0 0 24 24" fill="none" stroke="#1e88c8" strokeWidth="1.8" className="size-5 shrink-0" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
        </label>
        <button type="button" aria-label="Mostrar u ocultar filtros" aria-expanded={filtros} onClick={() => setFiltros(!filtros)} className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e3e8f0] bg-white text-[#1e88c8]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"/></svg>
        </button>
      </div>
      {filtros && <div className="rounded-xl border border-[#e3e8f0] bg-white p-3 text-xs text-[#64758b]">Filtrar por nombre usando el buscador. No se muestra disponibilidad médica real.</div>}

      <section aria-labelledby="proxima-atencion">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="proxima-atencion" className="text-[15px] font-bold">Próxima atención</h2>
          <Link href="/paciente/solicitudes" className="text-[10px] font-semibold uppercase text-[#0b5e9c]">Ver todas</Link>
        </div>
        <div className="rounded-[20px] bg-gradient-to-br from-[#1e88c8] to-[#0b5e9c] p-4 text-white shadow-[0_6px_0_#dbe6fb]">
          {reciente ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Solicitud {reciente.id}</p>
                  <p className="mt-1 text-xs text-white/85">{PROXIMO_PASO[reciente.estado]}</p>
                </div>
                <StatusPill estado={reciente.estado} />
              </div>
              <Link href={`/paciente/solicitudes/${reciente.id}`} className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-[#005b8f]/65 text-xs font-semibold text-white">Ver seguimiento <Icono nombre="flecha" className="ml-2 size-4" /></Link>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">Todavía no hay una atención programada</p>
              <p className="mt-2 text-xs text-white/85">Solicitá atención a domicilio. Coordinación confirmará los detalles.</p>
              <Link href="/paciente/solicitar" className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-[#005b8f]/65 text-xs font-semibold text-white">Solicitar atención <Icono nombre="flecha" className="ml-2 size-4" /></Link>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="especialidades">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="especialidades" className="text-[15px] font-bold">Especialidades</h2>
          <Link href="/paciente/solicitar" className="text-[10px] font-semibold uppercase text-[#0b5e9c]">Ver todas</Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SERVICIOS.map((servicio, i) => (
            <Link key={servicio} href="/paciente/solicitar" className="flex min-h-12 min-w-0 items-center gap-1.5 rounded-xl bg-white px-2 shadow-[0_5px_18px_#1d386008]">
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-sm ${i === 0 ? "bg-[#fff0f1] text-[#f66]" : i === 1 ? "bg-[#edf2ff] text-[#0b5e9c]" : "bg-[#eff9fa] text-[#1e88c8]"}`} aria-hidden="true">{i === 0 ? "✚" : i === 1 ? "♡" : "+"}</span>
              <span className="min-w-0 break-words text-[10px] font-medium leading-tight">{servicio}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="profesionales">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="profesionales" className="text-[15px] font-bold">Profesionales</h2>
          <span className="text-[10px] font-semibold uppercase text-[#0b5e9c]">Profesionales</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {profesionales.length ? profesionales.map((profesional) => (
            <div key={profesional.id} className="flex min-h-18 items-center gap-3 rounded-xl bg-white p-2 shadow-[0_5px_18px_#1d386008]">
              <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#e9f1fa] text-xl font-semibold text-[#0b5e9c]">{profesional.nombre.slice(-1)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold">{profesional.nombre}</p>
                <p className="mt-1 text-[11px] text-[#6d6e71]">Profesional</p>
                <p className="mt-1 text-[10px] text-[#1e88c8]">Información de atención</p>
              </div>
            </div>
          )) : <p className="rounded-xl bg-white p-4 text-sm text-[#64758b]">No se encontraron profesionales.</p>}
        </div>
      </section>

      <EmergencyNotice />

    </div>
  );
}
