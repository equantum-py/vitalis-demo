"use client";

import Link from "next/link";
import { EncabezadoPagina, Panel, Vacio } from "@/components/admin/Encabezado";
import { StatusPill } from "@/components/StatusPill";
import { FRANJAS_DEMO, PROFESIONALES_DEMO } from "@/lib/fixtures";
import { resumenProfesional, visitasDelProfesional } from "@/lib/profesional";
import { useDemo } from "@/lib/store";

export default function InicioProfesional() {
  const { estado } = useDemo();
  const activo = PROFESIONALES_DEMO.find((p) => p.id === estado.profesionalActivoId);
  const resumen = resumenProfesional(estado.solicitudes, estado.profesionalActivoId);
  const proximas = visitasDelProfesional(estado.solicitudes, estado.profesionalActivoId).filter(
    (s) => s.estado === "confirmada" || s.estado === "en_visita",
  );

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPagina
        titulo={`Hola, ${activo?.nombre ?? "profesional"}`}
        descripcion="Resumen de visitas asignadas. Solo se muestran visitas de este profesional."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Indicador etiqueta="Por iniciar" valor={resumen.confirmadas} nota="Franja confirmada" />
        <Indicador etiqueta="En curso" valor={resumen.enCurso} nota="Visita iniciada" />
        <Indicador etiqueta="Finalizadas" valor={resumen.finalizadas} nota="Registro cerrado" />
        <Indicador etiqueta="Pendientes de franja" valor={resumen.pendientesFranja} nota="Sin confirmar por coordinación" />
      </div>

      <Panel titulo="Próximas visitas">
        {proximas.length === 0 ? (
          <Vacio>No hay visitas confirmadas para este profesional. Las visitas aparecen cuando coordinación confirma la franja.</Vacio>
        ) : (
          <ul className="divide-y divide-line">
            {proximas.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-ink">{s.id}</p>
                  <p className="text-sm text-ink-soft">{s.franja}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill estado={s.estado} />
                  <Link href={`/profesional/visitas/${s.id}`} className="font-semibold text-teal underline underline-offset-4">
                    Abrir visita
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <p className="text-sm text-ink-soft">
        Franjas de demostración: {FRANJAS_DEMO.join(" · ")}. Datos ficticios; no representan agenda real.
      </p>
    </div>
  );
}

function Indicador({ etiqueta, valor, nota }: { etiqueta: string; valor: number; nota: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm font-semibold text-ink-soft">{etiqueta}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink">{valor}</p>
      <p className="mt-1 text-xs text-ink-soft">{nota}</p>
    </div>
  );
}
