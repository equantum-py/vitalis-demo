import { FRANJAS_DEMO, PROFESIONALES_DEMO } from "./fixtures";
import type { EstadoSolicitud, OrientacionUrgencia, Solicitud } from "./types";

export const FILTROS_ESTADO: { valor: EstadoSolicitud | "todas"; etiqueta: string }[] = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "recibida", etiqueta: "Recibidas" },
  { valor: "asignada", etiqueta: "Asignadas" },
  { valor: "confirmada", etiqueta: "Confirmadas" },
  { valor: "en_visita", etiqueta: "En visita" },
  { valor: "finalizada", etiqueta: "Finalizadas" },
  { valor: "cancelada", etiqueta: "Canceladas" },
];

export function contarPorEstado(solicitudes: Solicitud[], estado: EstadoSolicitud): number {
  return solicitudes.filter((s) => s.estado === estado).length;
}

/** Indicadores de la demostración. Son conteos sobre datos ficticios; no son métricas reales de Vitalis. */
export function indicadores(solicitudes: Solicitud[], urgencias: OrientacionUrgencia[]) {
  return {
    total: solicitudes.length,
    recibidas: contarPorEstado(solicitudes, "recibida"),
    asignadas: contarPorEstado(solicitudes, "asignada"),
    confirmadas: contarPorEstado(solicitudes, "confirmada"),
    finalizadas: contarPorEstado(solicitudes, "finalizada"),
    canceladas: contarPorEstado(solicitudes, "cancelada"),
    urgencias: urgencias.length,
  };
}

export function filtrarSolicitudes(
  solicitudes: Solicitud[],
  estado: EstadoSolicitud | "todas",
  texto: string,
): Solicitud[] {
  const t = texto.trim().toLowerCase();
  return solicitudes.filter(
    (s) =>
      (estado === "todas" || s.estado === estado) &&
      (t === "" || s.id.toLowerCase().includes(t) || s.motivo.toLowerCase().includes(t)),
  );
}

export interface CeldaAgenda {
  visitas: Solicitud[];
}

/**
 * Agenda derivada: visitas con franja confirmada, por profesional y franja.
 * Las asignadas sin franja se muestran aparte como pendientes de confirmación.
 */
export function construirAgenda(solicitudes: Solicitud[]) {
  const confirmadas = solicitudes.filter((s) => s.profesionalId && s.franja);
  const pendientes = solicitudes.filter((s) => s.estado === "asignada" && s.profesionalId && !s.franja);
  const filas = PROFESIONALES_DEMO.map((p) => ({
    profesional: p,
    franjas: FRANJAS_DEMO.map((franja) => ({
      franja,
      visitas: confirmadas.filter((s) => s.profesionalId === p.id && s.franja === franja),
    })),
  }));
  return { filas, pendientes };
}

export function nombreProfesional(id: string | null): string {
  if (!id) return "Sin asignar";
  return PROFESIONALES_DEMO.find((p) => p.id === id)?.nombre ?? "Profesional desconocido";
}
