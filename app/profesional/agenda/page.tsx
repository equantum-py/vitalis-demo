"use client";

import Link from "next/link";
import { EncabezadoPagina, Panel, Vacio } from "@/components/admin/Encabezado";
import { StatusPill } from "@/components/StatusPill";
import { FRANJAS_DEMO } from "@/lib/fixtures";
import { visitasDelProfesional } from "@/lib/profesional";
import { useDemo } from "@/lib/store";

export default function AgendaProfesional() {
  const { estado } = useDemo();
  const visitas = visitasDelProfesional(estado.solicitudes, estado.profesionalActivoId);

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPagina
        titulo="Agenda"
        descripcion="Visitas con franja confirmada, agrupadas por franja. Sin datos clínicos en la lista."
      />

      {visitas.length === 0 && (
        <Panel>
          <Vacio>No hay visitas en la agenda de este profesional.</Vacio>
        </Panel>
      )}

      {FRANJAS_DEMO.map((franja) => {
        const delDia = visitas.filter((v) => v.franja === franja);
        return (
          <Panel key={franja} titulo={franja}>
            {delDia.length === 0 ? (
              <p className="text-ink-soft">Sin visitas en esta franja.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {delDia.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/profesional/visitas/${s.id}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-paper p-4 hover:border-teal"
                    >
                      <span>
                        <span className="block font-semibold text-ink">{s.id}</span>
                        <span className="block text-sm text-ink-soft">{s.direccion}</span>
                      </span>
                      <StatusPill estado={s.estado} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        );
      })}
    </div>
  );
}
