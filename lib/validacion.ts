import type { Preferencia } from "./types";

export interface DatosSolicitud {
  motivo: string;
  direccion: string;
  telefono: string;
  preferencia: Preferencia;
}

export type ErroresSolicitud = Partial<Record<keyof DatosSolicitud, string>>;

const PREFERENCIAS: Preferencia[] = ["manana", "tarde", "sin_preferencia"];

export function validarSolicitud(d: DatosSolicitud): ErroresSolicitud {
  const errores: ErroresSolicitud = {};
  if (d.motivo.trim().length < 10) {
    errores.motivo = "Describa el motivo con al menos 10 caracteres.";
  }
  if (d.direccion.trim().length < 5) {
    errores.direccion = "Indique la dirección de la visita.";
  }
  if (!/^[0-9+()\- ]{6,20}$/.test(d.telefono.trim())) {
    errores.telefono = "Indique un teléfono de contacto válido.";
  }
  if (!PREFERENCIAS.includes(d.preferencia)) {
    errores.preferencia = "Seleccione una preferencia horaria.";
  }
  return errores;
}
