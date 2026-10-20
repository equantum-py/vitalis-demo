import type { EstadoSolicitud, Preferencia } from "./types";

export const ETIQUETA_ESTADO: Record<EstadoSolicitud, string> = {
  recibida: "Recibida",
  asignada: "Asignada",
  confirmada: "Confirmada",
  en_visita: "En visita",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

export type Tono = "neutro" | "info" | "ok" | "cerrado";

export const TONO_ESTADO: Record<EstadoSolicitud, Tono> = {
  recibida: "info",
  asignada: "info",
  confirmada: "ok",
  en_visita: "ok",
  finalizada: "cerrado",
  cancelada: "neutro",
};

export const PROXIMO_PASO: Record<EstadoSolicitud, string> = {
  recibida: "Esperar confirmación. Coordinación revisará la solicitud.",
  asignada: "Esperar confirmación de la franja horaria.",
  confirmada: "La visita está programada en la franja confirmada.",
  en_visita: "La visita está en curso.",
  finalizada: "La visita fue finalizada. Gracias por usar la demostración.",
  cancelada: "La solicitud fue cancelada.",
};

export const PASOS_SOLICITUD: EstadoSolicitud[] = ["recibida", "asignada", "confirmada", "en_visita", "finalizada"];

export const ETIQUETA_PREFERENCIA: Record<Preferencia, string> = {
  manana: "Mañana",
  tarde: "Tarde",
  sin_preferencia: "Sin preferencia",
};
