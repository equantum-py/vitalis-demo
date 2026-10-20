"use client";

import { EnlaceBoton, PageTitle, Tarjeta } from "@/components/ui";
import { StatusPill } from "@/components/StatusPill";
import { useDemo } from "@/lib/store";
import { formatearFecha } from "@/lib/formato";

export function VistaConfirmacion({ id }: { id: string }) {
  const { estado } = useDemo();
  const solicitud = estado.solicitudes.find((s) => s.id === id);

  if (!solicitud) {
    return (
      <div className="flex flex-col gap-4">
        <PageTitle title="Solicitud no encontrada" />
        <EnlaceBoton href="/paciente/solicitudes" variante="secundario">
          Ver mis solicitudes
        </EnlaceBoton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div role="status">
      <Tarjeta className="flex flex-col gap-3 border-teal/30 bg-mint">
        <p className="text-sm font-bold uppercase tracking-wider text-teal">Solicitud recibida</p>
        <h1 className="font-display text-2xl font-semibold text-ink">Gracias. Su solicitud quedó registrada.</h1>
        <p className="text-ink">
          Código <span className="font-semibold">{solicitud.id}</span> · {formatearFecha(solicitud.historial[0].fecha)}
        </p>
        <div>
          <StatusPill estado={solicitud.estado} />
        </div>
      </Tarjeta>
      </div>

      <Tarjeta className="flex flex-col gap-2">
        <h2 className="font-semibold text-ink">¿Qué sigue?</h2>
        <p className="text-ink-soft">
          Coordinación revisará la solicitud, le asignará un profesional y le confirmará la franja horaria. Lo verá
          reflejado en el seguimiento.
        </p>
      </Tarjeta>

      <div className="flex flex-col gap-3">
        <EnlaceBoton href={`/paciente/solicitudes/${solicitud.id}`}>Ver seguimiento</EnlaceBoton>
        <EnlaceBoton href="/paciente" variante="secundario">
          Volver al inicio
        </EnlaceBoton>
      </div>
    </div>
  );
}
