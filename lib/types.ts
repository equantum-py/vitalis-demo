export type Perfil = "paciente" | "profesional" | "administracion";

export type EstadoSolicitud =
  | "recibida"
  | "asignada"
  | "confirmada"
  | "en_visita"
  | "finalizada"
  | "cancelada";

export type Preferencia = "manana" | "tarde" | "sin_preferencia";

export interface PacienteFicticio {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface ProfesionalFicticio {
  id: string;
  nombre: string;
}

export interface EntradaHistorial {
  estado: EstadoSolicitud;
  fecha: string; // ISO 8601
}

export interface Solicitud {
  id: string;
  pacienteId: string;
  motivo: string;
  direccion: string;
  telefono: string;
  preferencia: Preferencia;
  estado: EstadoSolicitud;
  profesionalId: string | null;
  franja: string | null;
  historial: EntradaHistorial[];
}

export interface OrientacionUrgencia {
  id: string;
  pacienteId: string;
  fecha: string;
}

export interface EstadoDemo {
  version: 1;
  perfil: Perfil;
  secuencia: number;
  solicitudes: Solicitud[];
  urgencias: OrientacionUrgencia[];
  /** Disponibilidad ficticia por profesional (id → disponible). */
  disponibilidad: Record<string, boolean>;
}
