"use client";

import { EncabezadoPagina, Panel, Vacio } from "@/components/admin/Encabezado";
import { construirAgenda } from "@/lib/admin";
import { FRANJAS_DEMO } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";
import Link from "next/link";

export default function AgendaAdmin() {
  const { estado } = useDemo();
  const { filas, pendientes } = construirAgenda(estado.solicitudes);
  const hayVisitas = filas.some((f) => f.franjas.some((c) => c.visitas.length > 0));

  return (
    <div>
      <EncabezadoPagina
        titulo="Agenda de visitas"
        descripcion="Visitas con franja confirmada, por profesional. Las asignaciones sin franja aparecen como pendientes."
      />

      {!hayVisitas && pendientes.length === 0 && (
        <Panel>
          <Vacio>Todavía no hay visitas en la agenda. Asigne profesionales y confirme franjas desde Solicitudes.</Vacio>
        </Panel>
      )}

      {/* Escritorio: cuadrícula profesional × franja */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-white lg:block">
        <table className="w-full text-left text-[15px]">
          <thead className="bg-paper text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="w-56 px-4 py-3 font-semibold">Profesional</th>
              {FRANJAS_DEMO.map((f) => (
                <th key={f} className="px-4 py-3 font-semibold">{f}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filas.map((fila) => (
              <tr key={fila.profesional.id} className="align-top">
                <td className="px-4 py-4 font-semibold text-ink">{fila.profesional.nombre}</td>
                {fila.franjas.map((celda) => (
                  <td key={celda.franja} className="px-4 py-4">
                    {celda.visitas.length === 0 ? (
                      <span className="text-ink-soft">Sin visitas</span>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {celda.visitas.map((s) => (
                          <li key={s.id}>
                            <Link href={`/admin/solicitudes/${s.id}`} className="block rounded-xl border border-mint-200 bg-mint p-3 hover:border-teal">
                              <span className="font-semibold text-teal">{s.id}</span>
                              <span className="block text-sm text-ink-soft">{s.direccion}</span>
                              <span className="block text-xs text-ink-soft">{s.estado === "confirmada" ? "Confirmada" : "En curso o finalizada"}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Móvil y tablet: lista de solo lectura */}
      <div className="flex flex-col gap-4 lg:hidden">
        {filas.map((fila) => (
          <Panel key={fila.profesional.id} titulo={fila.profesional.nombre}>
            {fila.franjas.every((c) => c.visitas.length === 0) ? (
              <p className="text-ink-soft">Sin visitas confirmadas.</p>
            ) : (
              fila.franjas.map((celda) =>
                celda.visitas.map((s) => (
                  <p key={s.id} className="mb-2 text-ink">
                    <span className="font-semibold">{s.id}</span> · {celda.franja}
                  </p>
                )),
              )
            )}
          </Panel>
        ))}
      </div>

      {pendientes.length > 0 && (
        <Panel titulo="Asignadas pendientes de confirmar franja" className="mt-6">
          <ul className="divide-y divide-line">
            {pendientes.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span>
                  <span className="font-semibold">{s.id}</span>{" "}
                  <span className="text-ink-soft">{filas.find((f) => f.profesional.id === s.profesionalId)?.profesional.nombre}</span>
                </span>
                <Link href={`/admin/solicitudes/${s.id}`} className="font-semibold text-teal underline">
                  Confirmar franja
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
