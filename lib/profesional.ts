import type { EstadoSolicitud, Solicitud } from "./types";

/** Visitas del profesional con franja confirmada o en curso/finalizada. Excluye asignadas sin franja y canceladas. */
export function visitasDelProfesional(solicitudes: Solicitud[], profesionalId: string): Solicitud[] {
  const visibles: EstadoSolicitud[] = ["confirmada", "en_visita", "finalizada"];
  return solicitudes
    .filter((s) => s.profesionalId === profesionalId && visibles.includes(s.estado))
    .sort((a, b) => (a.franja ?? "").localeCompare(b.franja ?? "") || a.id.localeCompare(b.id));
}

export function resumenProfesional(solicitudes: Solicitud[], profesionalId: string) {
  const propias = solicitudes.filter((s) => s.profesionalId === profesionalId);
  return {
    confirmadas: propias.filter((s) => s.estado === "confirmada").length,
    enCurso: propias.filter((s) => s.estado === "en_visita").length,
    finalizadas: propias.filter((s) => s.estado === "finalizada").length,
    pendientesFranja: propias.filter((s) => s.estado === "asignada").length,
  };
}
