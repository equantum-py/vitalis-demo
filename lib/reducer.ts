import { ESTADO_INICIAL, FRANJAS_DEMO, PACIENTE_DEMO, PROFESIONALES_DEMO } from "./fixtures";
import type { DatosSolicitud } from "./validacion";
import { validarSolicitud } from "./validacion";
import type { EstadoDemo, EstadoSolicitud, Perfil, Solicitud } from "./types";

/**
 * Acciones del estado compartido. La asignación de profesional y la confirmación
 * de la franja son acciones separadas, como exige el contrato de E03-A.
 */
export type Accion =
  | { tipo: "cargar"; estado: EstadoDemo }
  | { tipo: "restablecer" }
  | { tipo: "cambiarPerfil"; perfil: Perfil }
  | { tipo: "crearSolicitud"; datos: DatosSolicitud; fecha: string }
  | { tipo: "asignarProfesional"; solicitudId: string; profesionalId: string; fecha: string }
  | { tipo: "confirmarFranja"; solicitudId: string; franja: string; fecha: string }
  | { tipo: "cancelarSolicitud"; solicitudId: string; fecha: string }
  | { tipo: "registrarUrgencia"; fecha: string }
  | { tipo: "cambiarDisponibilidad"; profesionalId: string; disponible: boolean };

function codigo(prefijo: string, n: number): string {
  return `${prefijo}-${String(n).padStart(3, "0")}`;
}

function actualizarSolicitud(
  estado: EstadoDemo,
  id: string,
  transformar: (s: Solicitud) => Solicitud,
): EstadoDemo {
  let cambio = false;
  const solicitudes = estado.solicitudes.map((s) => {
    if (s.id !== id) return s;
    const nueva = transformar(s);
    if (nueva !== s) cambio = true;
    return nueva;
  });
  return cambio ? { ...estado, solicitudes } : estado;
}

export function reducer(estado: EstadoDemo, accion: Accion): EstadoDemo {
  switch (accion.tipo) {
    case "cargar":
      return accion.estado;

    case "restablecer":
      return ESTADO_INICIAL;

    case "cambiarPerfil":
      return { ...estado, perfil: accion.perfil };

    case "crearSolicitud": {
      if (Object.keys(validarSolicitud(accion.datos)).length > 0) return estado;
      const n = estado.secuencia + 1;
      const nueva: Solicitud = {
        id: codigo("SOL", n),
        pacienteId: PACIENTE_DEMO.id,
        motivo: accion.datos.motivo.trim(),
        direccion: accion.datos.direccion.trim(),
        telefono: accion.datos.telefono.trim(),
        preferencia: accion.datos.preferencia,
        estado: "recibida",
        profesionalId: null,
        franja: null,
        historial: [{ estado: "recibida", fecha: accion.fecha }],
      };
      return { ...estado, secuencia: n, solicitudes: [nueva, ...estado.solicitudes] };
    }

    case "cambiarDisponibilidad": {
      if (!PROFESIONALES_DEMO.some((p) => p.id === accion.profesionalId)) return estado;
      if (estado.disponibilidad[accion.profesionalId] === accion.disponible) return estado;
      return { ...estado, disponibilidad: { ...estado.disponibilidad, [accion.profesionalId]: accion.disponible } };
    }

    case "asignarProfesional":
      // Regla: solo se asignan profesionales disponibles (demo).
      if (estado.disponibilidad[accion.profesionalId] === false) return estado;
      return actualizarSolicitud(estado, accion.solicitudId, (s) => {
        if (s.estado !== "recibida") return s;
        if (!PROFESIONALES_DEMO.some((p) => p.id === accion.profesionalId)) return s;
        return {
          ...s,
          estado: "asignada",
          profesionalId: accion.profesionalId,
          historial: [...s.historial, { estado: "asignada", fecha: accion.fecha }],
        };
      });

    case "confirmarFranja":
      return actualizarSolicitud(estado, accion.solicitudId, (s) => {
        if (s.estado !== "asignada") return s;
        if (!FRANJAS_DEMO.includes(accion.franja)) return s;
        return {
          ...s,
          estado: "confirmada",
          franja: accion.franja,
          historial: [...s.historial, { estado: "confirmada", fecha: accion.fecha }],
        };
      });

    case "cancelarSolicitud":
      return actualizarSolicitud(estado, accion.solicitudId, (s) => {
        const cancelable: EstadoSolicitud[] = ["recibida", "asignada"];
        if (!cancelable.includes(s.estado)) return s;
        return {
          ...s,
          estado: "cancelada",
          historial: [...s.historial, { estado: "cancelada", fecha: accion.fecha }],
        };
      });

    case "registrarUrgencia": {
      // Las urgencias NO crean solicitudes ni entran en la cola de atención programada.
      const n = estado.urgencias.length + 1;
      return {
        ...estado,
        urgencias: [{ id: codigo("URG", n), pacienteId: PACIENTE_DEMO.id, fecha: accion.fecha }, ...estado.urgencias],
      };
    }

    default:
      return estado;
  }
}
