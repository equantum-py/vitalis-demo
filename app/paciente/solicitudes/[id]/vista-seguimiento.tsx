"use client";

import Link from "next/link";
import { useState } from "react";
import { EmergencyNotice } from "@/components/EmergencyNotice";
import { StatusPill } from "@/components/StatusPill";
import { Timeline } from "@/components/Timeline";
import { CLASE_BOTON, PageTitle, Tarjeta } from "@/components/ui";
import { PROFESIONALES_DEMO } from "@/lib/fixtures";
import { PROXIMO_PASO } from "@/lib/estado-ui";
import { formatearFecha } from "@/lib/formato";
import { ETIQUETA_PREFERENCIA } from "@/lib/estado-ui";
import { useDemo } from "@/lib/store";

export function VistaSeguimiento({ id }: { id: string }) {
  const { estado, despachar } = useDemo();
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false);

  const solicitud = estado.solicitudes.find((s) => s.id === id);

  if (!solicitud) {
    return (
      <div className="flex flex-col gap-4">
        <PageTitle title="Solicitud no encontrada" />
        <p className="text-ink-soft">
          No hay una solicitud con este código en la demostración. Puede haberse restablecido la demo.
        </p>
        <Link href="/paciente/solicitudes" className="font-semibold text-teal underline underline-offset-4">
          Volver a mis solicitudes
        </Link>
      </div>
    );
  }

  const profesional = PROFESIONALES_DEMO.find((p) => p.id === solicitud.profesionalId);
  const cancelable = solicitud.estado === "recibida" || solicitud.estado === "asignada";

  return (
    <div className="flex flex-col gap-5">
      <PageTitle eyebrow="Seguimiento" title={`Solicitud ${solicitud.id}`}>
        <div className="flex items-center gap-3">
          <StatusPill estado={solicitud.estado} />
          <span className="text-sm">Creada el {formatearFecha(solicitud.historial[0].fecha)}</span>
        </div>
      </PageTitle>

      <Tarjeta className="flex flex-col gap-2 border-teal/30 bg-mint">
        <h2 className="text-sm font-bold uppercase tracking-wider text-teal">Próximo paso</h2>
        <p className="text-ink">{PROXIMO_PASO[solicitud.estado]}</p>
      </Tarjeta>

      <Tarjeta className="flex flex-col gap-3">
        <h2 className="font-semibold text-ink">Estado de la solicitud</h2>
        <Timeline estado={solicitud.estado} historial={solicitud.historial} />
      </Tarjeta>

      <div className="grid gap-3">
        <Tarjeta className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ink-soft">Franja horaria</p>
          <p className="text-ink">{solicitud.franja ?? "A confirmar por coordinación"}</p>
        </Tarjeta>
        <Tarjeta className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ink-soft">Profesional asignado</p>
          <p className="text-ink">{profesional ? profesional.nombre : "Pendiente"}</p>
          {!profesional && <p className="text-sm text-ink-soft">Se informará cuando corresponda.</p>}
        </Tarjeta>
        <Tarjeta className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ink-soft">Datos de la solicitud</p>
          <p className="text-ink">{solicitud.motivo}</p>
          <p className="text-sm text-ink-soft">
            {solicitud.direccion} · Preferencia: {ETIQUETA_PREFERENCIA[solicitud.preferencia]}
          </p>
        </Tarjeta>
      </div>

      {cancelable && (
        <Tarjeta className="flex flex-col gap-3">
          <p className="text-sm text-ink-soft">Si ya no necesita la atención, puede cancelar la solicitud.</p>
          {!confirmandoCancelacion ? (
            <button type="button" className={CLASE_BOTON.peligro} onClick={() => setConfirmandoCancelacion(true)}>
              Cancelar solicitud
            </button>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className={CLASE_BOTON.peligro}
                onClick={() =>
                  despachar({ tipo: "cancelarSolicitud", solicitudId: solicitud.id, fecha: new Date().toISOString() })
                }
              >
                Sí, cancelar
              </button>
              <button type="button" className={CLASE_BOTON.secundario} onClick={() => setConfirmandoCancelacion(false)}>
                No, mantener
              </button>
            </div>
          )}
        </Tarjeta>
      )}

      <EmergencyNotice />
    </div>
  );
}
