"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { EncabezadoPagina, Panel } from "@/components/admin/Encabezado";
import { StatusPill } from "@/components/StatusPill";
import { Timeline } from "@/components/Timeline";
import { CLASE_BOTON, CLASE_INPUT } from "@/components/ui";
import { ETIQUETA_PREFERENCIA, PROXIMO_PASO } from "@/lib/estado-ui";
import { formatearFecha } from "@/lib/formato";
import { PACIENTE_DEMO, PROFESIONALES_DEMO } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";
import type { Solicitud } from "@/lib/types";
import { MIN_OBSERVACIONES, validarRegistro } from "@/lib/validacion-visita";
import type { ErroresRegistro } from "@/lib/validacion-visita";

export function VistaVisita({ id }: { id: string }) {
  const { estado, despachar } = useDemo();

  if (!estado.cargado) {
    return <p className="text-ink-soft">Cargando visita…</p>;
  }

  const solicitud = estado.solicitudes.find((s) => s.id === id);
  const activo = PROFESIONALES_DEMO.find((p) => p.id === estado.profesionalActivoId);
  const visible =
    !!solicitud &&
    solicitud.profesionalId === estado.profesionalActivoId &&
    ["confirmada", "en_visita", "finalizada"].includes(solicitud.estado);

  if (!solicitud || !visible) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-[1.75rem] font-medium leading-tight text-navy">Visita no disponible</h1>
        <p className="text-ink-soft">
          Esta visita no está asignada a {activo?.nombre ?? "el profesional activo"} o todavía no tiene franja confirmada.
        </p>
        <Link href="/profesional/agenda" className="font-semibold text-azul-600 underline">
          Volver a la agenda
        </Link>
      </div>
    );
  }

  return (
    <DetalleVisita
      key={solicitud.id}
      solicitud={solicitud}
      profesionalId={estado.profesionalActivoId}
      onIniciar={() => despachar({ tipo: "iniciarVisita", solicitudId: solicitud.id, profesionalId: estado.profesionalActivoId, fecha: new Date().toISOString() })}
      onGuardar={(observaciones, indicaciones) =>
        despachar({ tipo: "guardarRegistro", solicitudId: solicitud.id, profesionalId: estado.profesionalActivoId, observaciones, indicaciones, fecha: new Date().toISOString() })
      }
      onFinalizar={() => despachar({ tipo: "finalizarVisita", solicitudId: solicitud.id, profesionalId: estado.profesionalActivoId, fecha: new Date().toISOString() })}
    />
  );
}

interface PropsDetalle {
  solicitud: Solicitud;
  profesionalId: string;
  onIniciar: () => void;
  onGuardar: (observaciones: string, indicaciones: string) => void;
  onFinalizar: () => void;
}

function DetalleVisita({ solicitud, onIniciar, onGuardar, onFinalizar }: PropsDetalle) {
  const registro = solicitud.registro;
  const cerrada = solicitud.estado === "finalizada";
  const enCurso = solicitud.estado === "en_visita";
  const [observaciones, setObservaciones] = useState(registro?.observaciones ?? "");
  const [indicaciones, setIndicaciones] = useState(registro?.indicaciones ?? "");
  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [aviso, setAviso] = useState<string | null>(null);
  const [errorFinal, setErrorFinal] = useState<string | null>(null);

  const sinGuardar =
    observaciones.trim() !== (registro?.observaciones ?? "") || indicaciones.trim() !== (registro?.indicaciones ?? "");
  const registroGuardado = !!registro && registro.observaciones.length >= MIN_OBSERVACIONES;

  function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nuevos = validarRegistro({ observaciones, indicaciones });
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    onGuardar(observaciones, indicaciones);
    setAviso("Registro guardado (simulado). Puede seguir editándolo hasta finalizar la visita.");
    setErrorFinal(null);
  }

  function finalizar() {
    if (sinGuardar || !registroGuardado) {
      setErrorFinal("Guarde el registro antes de finalizar la visita.");
      return;
    }
    onFinalizar();
    setAviso("Visita finalizada. El registro quedó cerrado y ya no puede modificarse.");
    setErrorFinal(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPagina
        titulo={`Visita ${solicitud.id}`}
        descripcion={solicitud.franja ?? undefined}
        acciones={<StatusPill estado={solicitud.estado} />}
      />

      <Link href="/profesional/agenda" className="inline-block text-sm font-semibold text-azul-600 underline">
        ← Volver a la agenda
      </Link>

      {aviso && (
        <p role="status" className="rounded-xl border border-azul-200 bg-azul-soft p-3 font-medium text-azul-600">
          {aviso}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <Panel titulo="Datos de la visita (ficticios)">
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
                <dt className="text-sm font-semibold text-ink-soft">Dirección</dt>
                <dd className="text-ink">{solicitud.direccion}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold text-ink-soft">Motivo administrativo</dt>
                <dd className="text-ink">{solicitud.motivo}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink-soft">Franja</dt>
                <dd className="text-ink">{solicitud.franja ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-ink-soft">Preferencia original</dt>
                <dd className="text-ink">{ETIQUETA_PREFERENCIA[solicitud.preferencia]}</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-xl bg-paper p-3 text-sm text-ink-soft">{PROXIMO_PASO[solicitud.estado]}</p>
          </Panel>

          <Panel titulo="Registro de la visita (simulado)">
            {cerrada && registro ? (
              <div className="flex flex-col gap-4">
                <p className="rounded-xl bg-paper p-3 text-sm text-ink-soft">
                  Registro cerrado el {formatearFecha(registro.actualizado)}, no se puede modificar.
                </p>
                <div>
                  <p className="text-sm font-semibold text-ink-soft">Observaciones</p>
                  <p className="whitespace-pre-line text-ink">{registro.observaciones}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-soft">Indicaciones</p>
                  <p className="whitespace-pre-line text-ink">{registro.indicaciones || "Sin indicaciones registradas."}</p>
                </div>
              </div>
            ) : !enCurso ? (
              <p className="text-ink-soft">
                El registro se habilita cuando la visita está en curso. Primero inicie la visita con la franja confirmada.
              </p>
            ) : (
              <form onSubmit={guardar} noValidate className="flex flex-col gap-4" aria-label="Registro de la visita">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="observaciones" className="text-sm font-semibold text-ink">
                    Observaciones (texto ficticio)
                  </label>
                  <textarea
                    id="observaciones"
                    rows={4}
                    className={CLASE_INPUT}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    aria-invalid={!!errores.observaciones}
                    aria-describedby={errores.observaciones ? "error-observaciones" : undefined}
                  />
                  {errores.observaciones && (
                    <p id="error-observaciones" className="text-sm font-medium text-warm-ink">
                      {errores.observaciones}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="indicaciones" className="text-sm font-semibold text-ink">
                    Indicaciones (texto ficticio, opcional)
                  </label>
                  <textarea
                    id="indicaciones"
                    rows={3}
                    className={CLASE_INPUT}
                    value={indicaciones}
                    onChange={(e) => setIndicaciones(e.target.value)}
                  />
                </div>
                <button type="submit" className={CLASE_BOTON.primario}>
                  Guardar registro
                </button>
                {sinGuardar && <p className="text-sm text-ink-soft">Hay cambios sin guardar.</p>}
              </form>
            )}
          </Panel>

          <Panel titulo="Firma del registro">
            <div className="flex flex-col gap-3">
              <p className="rounded-xl border border-dashed border-line p-4 text-sm text-ink-soft">
                Firma digital: función futura. No está implementada en esta demostración y no tiene validez.
              </p>
              <button type="button" disabled className={CLASE_BOTON.secundario}>
                Firmar registro (próximamente)
              </button>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel titulo="Acciones de la visita">
            {solicitud.estado === "confirmada" && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-ink-soft">La franja está confirmada. Puede iniciar la visita.</p>
                <button
                  type="button"
                  className={CLASE_BOTON.primario}
                  onClick={() => {
                    onIniciar();
                    setAviso("Visita iniciada. Complete el registro durante la visita.");
                  }}
                >
                  Iniciar visita
                </button>
              </div>
            )}
            {enCurso && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-ink-soft">
                  {registroGuardado ? "Registro guardado. Puede finalizar la visita." : `Guarde al menos ${MIN_OBSERVACIONES} caracteres de observaciones para poder finalizar.`}
                </p>
                <button type="button" className={CLASE_BOTON.primario} onClick={finalizar} disabled={sinGuardar || !registroGuardado}>
                  Finalizar visita
                </button>
                {errorFinal && (
                  <p role="alert" className="text-sm font-medium text-warm-ink">
                    {errorFinal}
                  </p>
                )}
              </div>
            )}
            {cerrada && <p className="text-ink-soft">Visita finalizada. No hay acciones pendientes.</p>}
          </Panel>

          <Panel titulo="Historial de estados">
            <Timeline estado={solicitud.estado} historial={solicitud.historial} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
