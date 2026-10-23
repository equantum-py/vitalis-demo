"use client";

import Link from "next/link";
import { EncabezadoPagina, Panel, Vacio } from "@/components/admin/Encabezado";
import { Kpi } from "@/components/admin/Kpi";
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
    <div className="flex flex-col gap-6 text-[#005b8f]">
      <EncabezadoPagina
        titulo={`Hola, ${activo?.nombre ?? "profesional"}`}
        descripcion="Resumen de visitas asignadas. Solo se muestran visitas de este profesional."
      />

      <div className="grid grid-cols-2 gap-3">
        <Kpi etiqueta="Por iniciar" valor={resumen.confirmadas} nota="Franja confirmada" />
        <Kpi etiqueta="En curso" valor={resumen.enCurso} nota="Visita iniciada" />
        <Kpi etiqueta="Finalizadas" valor={resumen.finalizadas} nota="Registro cerrado" />
        <Kpi etiqueta="Pendientes de franja" valor={resumen.pendientesFranja} nota="Sin confirmar por coordinación" />
      </div>

      <div className="vitalis-card p-4"><Panel titulo="Próximas visitas">
        {proximas.length === 0 ? (
          <Vacio>No hay visitas confirmadas para este profesional. Las visitas aparecen cuando coordinación confirma la franja.</Vacio>
        ) : (
          <ul className="divide-y divide-line">
            {proximas.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-semibold text-ink">{s.id}</p>
                  <p className="text-sm text-ink-soft">{s.franja}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill estado={s.estado} />
                  <Link href={`/profesional/visitas/${s.id}`} className="font-semibold text-azul-600 underline underline-offset-4">
                    Abrir visita
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel></div>

      <p className="text-sm text-ink-soft">
        Franjas disponibles: {FRANJAS_DEMO.join(" · ")}.
      </p>
    </div>
  );
}

