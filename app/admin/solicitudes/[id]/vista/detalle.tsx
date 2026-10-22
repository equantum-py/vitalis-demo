"use client";

import Link from "next/link";
import { useState } from "react";
import { EncabezadoPagina, Panel } from "@/components/admin/Encabezado";
import { StatusPill } from "@/components/StatusPill";
import { Timeline } from "@/components/Timeline";
import { CLASE_BOTON, CLASE_INPUT } from "@/components/ui";
import { nombreProfesional } from "@/lib/admin";
import { ETIQUETA_PREFERENCIA } from "@/lib/estado-ui";
import { formatearFecha } from "@/lib/formato";
import { FRANJAS_DEMO, PACIENTE_DEMO, PROFESIONALES_DEMO } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";

export function VistaDetalleSolicitud({ id }: { id: string }) {
  const { estado, despachar } = useDemo();
  const solicitud = estado.solicitudes.find((s) => s.id === id);
  const [profesionalElegido, setProfesionalElegido] = useState("");
  const [franjaElegida, setFranjaElegida] = useState("");
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  if (!solicitud) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-[1.75rem] font-medium leading-tight text-navy">Solicitud no encontrada</h1>
        <p className="text-ink-soft">No existe una solicitud con este código.</p>
        <Link href="/admin/solicitudes" className="font-semibold text-azul-600 underline">
          Volver a solicitudes
        </Link>
      </div>
    );
  }

  const ahora = () => new Date().toISOString();
  const disponibles = PROFESIONALES_DEMO.filter((p) => estado.disponibilidad[p.id] !== false);
  const puedeAsignar = solicitud.estado === "recibida";
  const puedeConfirmar = solicitud.estado === "asignada";
  const cancelable = solicitud.estado === "recibida" || solicitud.estado === "asignada";

  return (
    <div>
      <EncabezadoPagina
        titulo={`Solicitud ${solicitud.id}`}
        descripcion={`Creada el ${formatearFecha(solicitud.historial[0].fecha)}`}
        acciones={<StatusPill estado={solicitud.estado} />}
      />

      <Link href="/admin/solicitudes" className="mb-4 inline-block text-sm font-semibold text-azul-600 underline">
        ← Volver a solicitudes
      </Link>

      {aviso && (
        <p role="status" className="mb-4 rounded-xl border border-azul-200 bg-azul-soft p-3 font-medium text-azul-600">
          {aviso}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <Panel titulo="Datos de la solicitud">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-ink-soft">Paciente</dt>
                <dd className="text-ink">{PACIENTE_DEMO.nombre}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink-soft">Teléfono de contacto</dt>
                <dd className="text-ink">{solicitud.telefono}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold text-ink-soft">Dirección de la visita</dt>
                <dd className="text-ink">{solicitud.direccion}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold text-ink-soft">Motivo</dt>
                <dd className="text-ink">{solicitud.motivo}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink-soft">Preferencia horaria</dt>
                <dd className="text-ink">{ETIQUETA_PREFERENCIA[solicitud.preferencia]}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink-soft">Profesional asignado</dt>
                <dd className="text-ink">{nombreProfesional(solicitud.profesionalId)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold text-ink-soft">Franja confirmada</dt>
                <dd className="text-ink">{solicitud.franja ?? "Pendiente de confirmación"}</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-xl bg-paper p-3 text-sm text-ink-soft">
              Administración solo visualiza la información administrativa de la solicitud.
            </p>
          </Panel>

          <Panel titulo="Historial de estados">
            <Timeline estado={solicitud.estado} historial={solicitud.historial} />
          </Panel>
        </div>

        {/* Acciones: solo en escritorio. En móvil la vista es de solo lectura. */}
        <div className="hidden flex-col gap-6 lg:flex">
          <Panel titulo="1. Asignar profesional">
            {puedeAsignar ? (
              <div className="flex flex-col gap-3">
                <label htmlFor="profesional" className="text-sm font-semibold text-ink">
                  Profesional disponible
                </label>
                <select
                  id="profesional"
                  className={CLASE_INPUT}
                  value={profesionalElegido}
                  onChange={(e) => setProfesionalElegido(e.target.value)}
                >
                  <option value="">Seleccionar profesional</option>
                  {PROFESIONALES_DEMO.map((p) => {
                    const libre = estado.disponibilidad[p.id] !== false;
                    return (
                      <option key={p.id} value={p.id} disabled={!libre}>
                        {p.nombre}
                        {libre ? "" : " (no disponible)"}
                      </option>
                    );
                  })}
                </select>
                {disponibles.length === 0 && (
                  <p className="text-sm text-warm-ink">No hay profesionales disponibles. Revise la sección Profesionales.</p>
                )}
                <button
                  type="button"
                  disabled={!profesionalElegido}
                  className={CLASE_BOTON.primario}
                  onClick={() => {
                    despachar({ tipo: "asignarProfesional", solicitudId: solicitud.id, profesionalId: profesionalElegido, fecha: ahora() });
                    setAviso(`Profesional asignado. La solicitud ${solicitud.id} quedó en estado Asignada.`);
                    setProfesionalElegido("");
                  }}
                >
                  Asignar profesional
                </button>
                <p className="text-xs text-ink-soft">La asignación no confirma la franja horaria. Eso se hace en el paso 2.</p>
              </div>
            ) : (
              <p className="text-ink-soft">
                {solicitud.profesionalId
                  ? `Asignada a ${nombreProfesional(solicitud.profesionalId)}.`
                  : "Esta solicitud no admite una nueva asignación en su estado actual."}
              </p>
            )}
          </Panel>

          <Panel titulo="2. Confirmar franja horaria">
            {puedeConfirmar ? (
              <div className="flex flex-col gap-3">
                <label htmlFor="franja" className="text-sm font-semibold text-ink">
                  Franja a confirmar
                </label>
                <select
                  id="franja"
                  className={CLASE_INPUT}
                  value={franjaElegida}
                  onChange={(e) => setFranjaElegida(e.target.value)}
                >
                  <option value="">Seleccionar franja</option>
                  {FRANJAS_DEMO.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!franjaElegida}
                  className={CLASE_BOTON.primario}
                  onClick={() => {
                    despachar({ tipo: "confirmarFranja", solicitudId: solicitud.id, franja: franjaElegida, fecha: ahora() });
                    setAviso(`Franja confirmada. La solicitud ${solicitud.id} quedó en estado Confirmada.`);
                    setFranjaElegida("");
                  }}
                >
                  Confirmar franja
                </button>
                <p className="text-xs text-ink-soft">Acción separada de la asignación. Actualiza el seguimiento del paciente.</p>
              </div>
            ) : (
              <p className="text-ink-soft">
                {solicitud.franja ? `Franja confirmada: ${solicitud.franja}.` : "Primero debe asignarse un profesional."}
              </p>
            )}
          </Panel>

          {cancelable && (
            <Panel titulo="Cancelar solicitud">
              {!confirmandoCancelacion ? (
                <button type="button" className={CLASE_BOTON.peligro} onClick={() => setConfirmandoCancelacion(true)}>
                  Cancelar solicitud
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-ink">¿Confirma la cancelación? El paciente verá el estado Cancelada.</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={CLASE_BOTON.peligro}
                      onClick={() => {
                        despachar({ tipo: "cancelarSolicitud", solicitudId: solicitud.id, fecha: ahora() });
                        setConfirmandoCancelacion(false);
                        setAviso(`La solicitud ${solicitud.id} fue cancelada.`);
                      }}
                    >
                      Sí, cancelar
                    </button>
                    <button type="button" className={CLASE_BOTON.secundario} onClick={() => setConfirmandoCancelacion(false)}>
                      No
                    </button>
                  </div>
                </div>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
