import type { EstadoDemo } from "./types";

export const CLAVE_ESTADO = "vitalis-demo:estado:v1";

/** Lee el estado guardado. Cualquier error (almacenamiento bloqueado, JSON inválido) devuelve null. */
export function leerEstado(): EstadoDemo | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE_ESTADO);
    if (!crudo) return null;
    const dato = JSON.parse(crudo) as Partial<EstadoDemo>;
    if (dato.version !== 1 || !Array.isArray(dato.solicitudes) || !Array.isArray(dato.urgencias)) {
      return null;
    }
    return dato as EstadoDemo;
  } catch {
    return null;
  }
}

export function guardarEstado(estado: EstadoDemo): void {
  try {
    window.localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado));
  } catch {
    // Sin almacenamiento disponible, la demo sigue funcionando en memoria.
  }
}

export function borrarEstado(): void {
  try {
    window.localStorage.removeItem(CLAVE_ESTADO);
  } catch {
    // Ignorado: no hay nada que limpiar si el almacenamiento no está disponible.
  }
}
