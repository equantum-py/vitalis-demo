"use client";

import { EncabezadoPagina, Panel, Vacio } from "@/components/admin/Encabezado";
import { formatearFecha } from "@/lib/formato";
import { useDemo } from "@/lib/store";

export default function UrgenciasAdmin() {
  const { estado } = useDemo();
  const urgencias = estado.urgencias;

  return (
    <div>
      <EncabezadoPagina
        titulo="Orientaciones de urgencia"
        descripcion="Registro separado. Estas orientaciones no son solicitudes, no tienen profesional asignado ni franja y no entran en la cola de coordinación."
      />

      <p className="mb-4 rounded-xl border border-warm-soft bg-warm-soft p-4 text-warm-ink">
        Cuando una persona consulta por una urgencia, la aplicación le indica llamar al servicio de emergencias. No se crea ninguna solicitud programada.
      </p>

      {urgencias.length === 0 ? (
        <Panel>
          <Vacio>No hay orientaciones de urgencia registradas.</Vacio>
        </Panel>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {urgencias.map((u) => (
              <li key={u.id}>
                <Panel>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-ink">{u.id}</span>
                    <span className="text-sm text-ink-soft">{formatearFecha(u.fecha)}</span>
                  </div>
                  <p className="mt-2 text-ink-soft">Orientación mostrada: llamar al servicio de emergencias. Sin solicitud asociada.</p>
                </Panel>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
