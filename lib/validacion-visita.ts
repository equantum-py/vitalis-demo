export const MIN_OBSERVACIONES = 10;

export interface DatosRegistro {
  observaciones: string;
  indicaciones: string;
}

export type ErroresRegistro = Partial<Record<keyof DatosRegistro, string>>;

/** Validación del registro simulado de visita. Solo exige observaciones mínimas para poder finalizar. */
export function validarRegistro(d: DatosRegistro): ErroresRegistro {
  const errores: ErroresRegistro = {};
  if (d.observaciones.trim().length < MIN_OBSERVACIONES) {
    errores.observaciones = `Escriba al menos ${MIN_OBSERVACIONES} caracteres de observaciones para poder finalizar la visita.`;
  }
  return errores;
}
