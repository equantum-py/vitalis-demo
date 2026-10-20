"use client";

import Link from "next/link";
import { EmergencyNotice } from "@/components/EmergencyNotice";
import { Icono } from "@/components/Icono";
import { ProgresoSolicitud } from "@/components/ProgresoSolicitud";
import { StatusPill } from "@/components/StatusPill";
import { AvisoDemo } from "@/components/ui";
import { PACIENTE_DEMO } from "@/lib/fixtures";
import { formatearFecha } from "@/lib/formato";
import { PROXIMO_PASO } from "@/lib/estado-ui";
import { useDemo } from "@/lib/store";

export default function InicioPaciente() {
  const { estado } = useDemo();
  const reciente = estado.solicitudes[0];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-display text-[1.875rem] font-medium leading-tight text-navy">
          Hola, {PACIENTE_DEMO.nombre.split(" ")[0]}
        </h1>
        <p className="text-[15px] text-ink-soft">¿En qué le podemos ayudar hoy?</p>
      </header>

      <section aria-labelledby="accion-principal" className="flex flex-col gap-4 rounded-3xl bg-azul p-5 text-white">
        <div className="flex items-center gap-3.5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <Icono nombre="solicitar" className="size-5.5" />
          </span>
          <div className="min-w-0">
            <h2 id="accion-principal" className="text-[17px] font-semibold leading-snug">
              Solicitar atención a domicilio
            </h2>
            <p className="mt-0.5 text-sm leading-snug text-white">
              Coordinación confirma la franja y el profesional.
            </p>
          </div>
        </div>
        <Link
          href="/paciente/solicitar"
          className="flex min-h-13 items-center justify-center gap-1.5 rounded-2xl bg-white text-base font-semibold text-azul-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Solicitar atención
          <Icono nombre="flecha" className="size-4.5" />
        </Link>
      </section>

      {reciente ? (
        <section aria-labelledby="ultima-solicitud" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <h2 id="ultima-solicitud" className="text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
              Su última solicitud
            </h2>
            <span className="text-sm font-semibold text-ink">{reciente.id}</span>
          </div>
          <div className="flex flex-col gap-3.5 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <StatusPill estado={reciente.estado} />
              <span className="text-xs text-ink-soft">{formatearFecha(reciente.historial[0].fecha)}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-ink">{PROXIMO_PASO[reciente.estado]}</p>
            {reciente.estado !== "cancelada" && <ProgresoSolicitud estado={reciente.estado} />}
            <Link
              href={`/paciente/solicitudes/${reciente.id}`}
              className="inline-flex min-h-11 items-center justify-between text-[15px] font-semibold text-azul-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-azul-600"
            >
              Ver seguimiento
              <Icono nombre="flecha" className="size-4.5" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-ink-soft">Todavía no tiene solicitudes en esta demostración.</p>
        </section>
      )}

      <Link
        href="/paciente/solicitudes"
        className="flex min-h-13 items-center justify-between border-y border-line text-[15px] font-semibold text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-azul-600"
      >
        <span className="flex items-center gap-3">
          <Icono nombre="solicitudes" className="size-5 text-azul-600" />
          Mis solicitudes
        </span>
        <span className="flex items-center gap-1.5 text-ink-soft">
          {estado.solicitudes.length}
          <Icono nombre="flecha" className="size-4.5" />
        </span>
      </Link>

      <EmergencyNotice />

      <AvisoDemo>
        Demostración con datos ficticios. Las funciones son propuestas sujetas a validación con Vitalis.{" "}
        <Link href="/demo" className="font-semibold text-azul-600 underline underline-offset-4">
          Cambiar de perfil
        </Link>
      </AvisoDemo>

    </div>
  );
}
