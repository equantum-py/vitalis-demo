// Datos completamente ficticios. No corresponden a personas, direcciones ni profesionales reales.
import type { EstadoDemo, PacienteFicticio, ProfesionalFicticio } from "./types";

export const PACIENTE_DEMO: PacienteFicticio = {
  id: "pac-demo-01",
  nombre: "Ana Ficticia",
  direccion: "Calle Ficticia 123 (demostración)",
  telefono: "000 000 0000",
};

export const PROFESIONALES_DEMO: ProfesionalFicticio[] = [
  { id: "prof-demo-a", nombre: "Profesional Demo A" },
  { id: "prof-demo-b", nombre: "Profesional Demo B" },
  { id: "prof-demo-c", nombre: "Profesional Demo C" },
];

export const FRANJAS_DEMO: string[] = [
  "Mañana · franja de demostración",
  "Tarde · franja de demostración",
];

export const ESTADO_INICIAL: EstadoDemo = {
  version: 1,
  perfil: "paciente",
  secuencia: 0,
  solicitudes: [],
  urgencias: [],
};
