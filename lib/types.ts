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

/** Registro simulado de la visita. Ficticio: no es historia clínica real. Se cierra al finalizar la visita. */
export interface RegistroVisita {
  observaciones: string;
  indicaciones: string;
  actualizado: string; // ISO 8601
  cerrado: boolean;
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
  /** Registro de la visita. Solo lo ve el profesional asignado; administración no lo muestra. */
  registro: RegistroVisita | null;
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
  /** Profesional cuya agenda se muestra en el perfil profesional (demostración). */
  profesionalActivoId: string;
}
