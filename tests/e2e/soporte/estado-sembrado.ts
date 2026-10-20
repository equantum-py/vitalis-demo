import type { Page } from "@playwright/test";

/** Estado de demo con un caso por cada estado de solicitud. Todos los datos son ficticios. */
export const ESTADO_SEMBRADO = {
  version: 1,
  perfil: "paciente",
  secuencia: 6,
  profesionalActivoId: "prof-demo-a",
  disponibilidad: { "prof-demo-a": true, "prof-demo-b": true, "prof-demo-c": false },
  urgencias: [{ id: "URG-001", pacienteId: "pac-demo-01", fecha: "2026-10-20T10:00:00.000Z" }],
  solicitudes: [
    sol("SOL-006", "cancelada", null, null, null, ["recibida", "cancelada"]),
    sol("SOL-005", "recibida", null, null, null, ["recibida"]),
    sol("SOL-004", "asignada", "prof-demo-b", null, null, ["recibida", "asignada"]),
    sol("SOL-003", "confirmada", "prof-demo-a", "Tarde · franja de demostración", null, ["recibida", "asignada", "confirmada"]),
    sol("SOL-002", "en_visita", "prof-demo-a", "Mañana · franja de demostración",
      { observaciones: "Observación ficticia de la visita en curso.", indicaciones: "", actualizado: "2026-10-20T13:10:00.000Z", cerrado: false },
      ["recibida", "asignada", "confirmada", "en_visita"]),
    sol("SOL-001", "finalizada", "prof-demo-a", "Tarde · franja de demostración",
      { observaciones: "Observación ficticia cerrada de la visita.", indicaciones: "Indicación ficticia.", actualizado: "2026-10-20T13:40:00.000Z", cerrado: true },
      ["recibida", "asignada", "confirmada", "en_visita", "finalizada"]),
  ],
};

function sol(id: string, estado: string, profesionalId: string | null, franja: string | null, registro: unknown, pasos: string[]) {
  const base = Date.parse("2026-10-20T12:00:00.000Z");
  return {
    id,
    pacienteId: "pac-demo-01",
    motivo: `Motivo administrativo ficticio de ${id}`,
    direccion: "Calle Ficticia 123",
    telefono: "000 000 0000",
    preferencia: "sin_preferencia",
    estado,
    profesionalId,
    franja,
    registro,
    historial: pasos.map((p, i) => ({ estado: p, fecha: new Date(base + i * 60000).toISOString() })),
  };
}

/** Carga el estado sembrado antes de que la página se ejecute. */
export async function sembrarEstado(page: Page) {
  await page.addInitScript((estado) => {
    try {
      window.localStorage.setItem("vitalis-demo:estado:v1", JSON.stringify(estado));
    } catch {
      /* sin almacenamiento */
    }
  }, ESTADO_SEMBRADO);
}
