"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EncabezadoPagina, Panel, Vacio } from "@/components/admin/Encabezado";
import { StatusPill } from "@/components/StatusPill";
import { CLASE_INPUT } from "@/components/ui";
import { FILTROS_ESTADO, filtrarSolicitudes, nombreProfesional } from "@/lib/admin";
import { ETIQUETA_PREFERENCIA } from "@/lib/estado-ui";
import { formatearFecha } from "@/lib/formato";
import { PACIENTE_DEMO } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";
import type { EstadoSolicitud } from "@/lib/types";

function ListaSolicitudes() {
  const { estado } = useDemo();
  const params = useSearchParams();
  const estadoInicial = params.get("estado") as EstadoSolicitud | null;
  const [filtro, setFiltro] = useState<EstadoSolicitud | "todas">(
    FILTROS_ESTADO.some((f) => f.valor === estadoInicial) ? (estadoInicial as EstadoSolicitud) : "todas",
  );
  const [texto, setTexto] = useState("");
  const filas = filtrarSolicitudes(estado.solicitudes, filtro, texto);

  return (
    <div>
      <EncabezadoPagina
        titulo="Solicitudes"
        descripcion="Solicitudes creadas por pacientes en la demostración. Seleccione una para asignar profesional o confirmar la franja."
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="flex flex-col gap-1.5 lg:w-64">
          <label htmlFor="filtro-estado" className="text-sm font-semibold text-ink">
            Estado
          </label>
          <select
            id="filtro-estado"
            className={CLASE_INPUT}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as EstadoSolicitud | "todas")}
          >
            {FILTROS_ESTADO.map((f) => (
              <option key={f.valor} value={f.valor}>
                {f.etiqueta}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5 lg:w-80">
          <label htmlFor="busqueda" className="text-sm font-semibold text-ink">
            Buscar por código o motivo
          </label>
          <input
            id="busqueda"
            type="search"
            className={CLASE_INPUT}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej.: SOL-001"
          />
        </div>
        <p role="status" className="text-sm text-ink-soft lg:ml-auto">
          {filas.length} de {estado.solicitudes.length} solicitudes
        </p>
      </div>

      {filas.length === 0 ? (
        <Panel>
          <Vacio>
            {estado.solicitudes.length === 0
              ? "No hay solicitudes todavía. Las solicitudes creadas por el paciente aparecerán aquí."
              : "Ninguna solicitud coincide con el filtro seleccionado."}
          </Vacio>
        </Panel>
      ) : (
        <>
          {/* Escritorio amplio (xl): tabla. Por debajo, tarjetas de solo lectura. */}
          <div className="hidden overflow-x-auto rounded-2xl border border-line bg-surface xl:block">
            <table className="w-full text-left text-[15px]">
              <thead className="bg-paper text-xs uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold">Código</th>
                  <th className="px-4 py-3 font-semibold">Paciente (ficticio)</th>
                  <th className="px-4 py-3 font-semibold">Motivo</th>
                  <th className="hidden px-4 py-3 font-semibold xl:table-cell">Preferencia</th>
                  <th className="px-4 py-3 font-semibold">Profesional</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold"><span className="sr-only">Acción</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filas.map((s) => (
                  <tr key={s.id} className="hover:bg-paper/60">
                    <td className="px-4 py-3 font-semibold text-ink">{s.id}</td>
                    <td className="px-4 py-3">{PACIENTE_DEMO.nombre}</td>
                    <td className="max-w-[16rem] truncate px-4 py-3 text-ink-soft">{s.motivo}</td>
                    <td className="hidden px-4 py-3 text-ink-soft xl:table-cell">{ETIQUETA_PREFERENCIA[s.preferencia]}</td>
                    <td className="px-4 py-3">{nombreProfesional(s.profesionalId)}</td>
                    <td className="px-4 py-3"><StatusPill estado={s.estado} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/solicitudes/${s.id}`} className="font-semibold text-azul-600 underline underline-offset-4">
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
          <ul className="flex flex-col gap-3 xl:hidden">
            {filas.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/solicitudes/${s.id}`} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink">{s.id}</span>
                    <StatusPill estado={s.estado} />
                  </div>
                  <p className="text-ink">{s.motivo}</p>
                  <p className="text-sm text-ink-soft">
                    {PACIENTE_DEMO.nombre} · {nombreProfesional(s.profesionalId)}
                  </p>
                  <p className="text-xs text-ink-soft">{formatearFecha(s.historial[0].fecha)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function PaginaSolicitudes() {
  return (
    <Suspense fallback={<p className="text-ink-soft">Cargando solicitudes…</p>}>
      <ListaSolicitudes />
    </Suspense>
  );
}
