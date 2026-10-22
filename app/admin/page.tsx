"use client";

import Link from "next/link";
import { Kpi } from "@/components/admin/Kpi";
import { EncabezadoPagina, Panel, Vacio } from "@/components/admin/Encabezado";
import { StatusPill } from "@/components/StatusPill";
import { indicadores, nombreProfesional } from "@/lib/admin";
import { formatearFecha } from "@/lib/formato";
import { useDemo } from "@/lib/store";
import { PACIENTE_DEMO } from "@/lib/fixtures";

export default function DashboardAdmin() {
  const { estado } = useDemo();
  const i = indicadores(estado.solicitudes, estado.urgencias);
  const recientes = estado.solicitudes.slice(0, 5);

  return (
    <div>
      <EncabezadoPagina
        titulo="Dashboard"
        descripcion="Resumen de solicitudes y actividad registrada."
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi etiqueta="Solicitudes" valor={i.total} nota="Registradas" />
        <Kpi etiqueta="Por asignar" valor={i.recibidas} nota="Estado: recibida" />
        <Kpi etiqueta="Por confirmar franja" valor={i.asignadas} nota="Estado: asignada" />
        <Kpi etiqueta="Confirmadas" valor={i.confirmadas} nota="Estado: confirmada" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi etiqueta="Finalizadas" valor={i.finalizadas} />
        <Kpi etiqueta="Canceladas" valor={i.canceladas} />
        <Kpi className="col-span-2" etiqueta="Orientaciones de urgencia" valor={i.urgencias} nota="Registro separado. No son solicitudes." />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <Panel titulo="Solicitudes recientes">
          {recientes.length === 0 ? (
            <Vacio>
              Todavía no hay solicitudes. Cree una desde el perfil de pacientes en{" "}
              <Link href="/paciente/solicitar" className="font-semibold text-azul-600 underline">
                Solicitar atención
              </Link>
              .
            </Vacio>
          ) : (
            <ul className="divide-y divide-line">
              {recientes.map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/solicitudes/${s.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-paper/60">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">
                        {s.id} · <span className="font-normal text-ink-soft">{PACIENTE_DEMO.nombre}</span>
                      </p>
                      <p className="truncate text-sm text-ink-soft">{s.motivo}</p>
                      <p className="text-xs text-ink-soft">
                        {formatearFecha(s.historial[0].fecha)} · {nombreProfesional(s.profesionalId)}
                      </p>
                    </div>
                    <StatusPill estado={s.estado} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel titulo="Acciones pendientes">
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center justify-between gap-3 rounded-xl bg-paper p-3">
              <span>Solicitudes para asignar profesional</span>
              <Link href="/admin/solicitudes?estado=recibida" className="font-semibold text-azul-600 underline">
                {i.recibidas}
              </Link>
            </li>
            <li className="flex items-center justify-between gap-3 rounded-xl bg-paper p-3">
              <span>Asignadas sin franja confirmada</span>
              <Link href="/admin/solicitudes?estado=asignada" className="font-semibold text-azul-600 underline">
                {i.asignadas}
              </Link>
            </li>
            <li className="flex items-center justify-between gap-3 rounded-xl bg-paper p-3">
              <span>Orientaciones de urgencia registradas</span>
              <Link href="/admin/urgencias" className="font-semibold text-azul-600 underline">
                {i.urgencias}
              </Link>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
