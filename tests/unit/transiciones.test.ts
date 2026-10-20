import { describe, expect, it } from "vitest";
import { ESTADO_INICIAL, FRANJAS_DEMO } from "@/lib/fixtures";
import { reducer } from "@/lib/reducer";
import type { Accion } from "@/lib/reducer";
import type { EstadoDemo } from "@/lib/types";

const FECHA = "2026-10-20T13:00:00.000Z";
const DATOS = { motivo: "Control de seguimiento (ficticio)", direccion: "Calle Ficticia 123", telefono: "000 000 0000", preferencia: "manana" as const };
const aplicar = (e: EstadoDemo, ...a: Accion[]) => a.reduce(reducer, e);
const estadoDe = (e: EstadoDemo) => e.solicitudes[0]?.estado;

const crear: Accion = { tipo: "crearSolicitud", datos: DATOS, fecha: FECHA };
const asignar = (id = "prof-demo-a"): Accion => ({ tipo: "asignarProfesional", solicitudId: "SOL-001", profesionalId: id, fecha: FECHA });
const confirmar: Accion = { tipo: "confirmarFranja", solicitudId: "SOL-001", franja: FRANJAS_DEMO[0], fecha: FECHA };
const iniciar: Accion = { tipo: "iniciarVisita", solicitudId: "SOL-001", profesionalId: "prof-demo-a", fecha: FECHA };
const cancelar: Accion = { tipo: "cancelarSolicitud", solicitudId: "SOL-001", fecha: FECHA };

describe("transiciones válidas", () => {
  it("recibida → asignada → confirmada → en_visita → finalizada", () => {
    let e = aplicar(ESTADO_INICIAL, crear);
    expect(estadoDe(e)).toBe("recibida");
    e = aplicar(e, asignar());
    expect(estadoDe(e)).toBe("asignada");
    e = aplicar(e, confirmar);
    expect(estadoDe(e)).toBe("confirmada");
    e = aplicar(e, iniciar);
    expect(estadoDe(e)).toBe("en_visita");
  });
});

describe("transiciones inválidas", () => {
  it("no reasigna una solicitud ya asignada", () => {
    const e = aplicar(ESTADO_INICIAL, crear, asignar("prof-demo-a"), asignar("prof-demo-b"));
    expect(e.solicitudes[0].profesionalId).toBe("prof-demo-a");
  });

  it("no confirma la franja de una solicitud recibida (sin profesional)", () => {
    const e = aplicar(ESTADO_INICIAL, crear, confirmar);
    expect(estadoDe(e)).toBe("recibida");
    expect(e.solicitudes[0].franja).toBeNull();
  });

  it("no asigna a un profesional no disponible", () => {
    const e = aplicar(ESTADO_INICIAL, crear, asignar("prof-demo-c"));
    expect(estadoDe(e)).toBe("recibida");
  });

  it("no cancela una visita en curso ni una finalizada", () => {
    const enCurso = aplicar(ESTADO_INICIAL, crear, asignar(), confirmar, iniciar, cancelar);
    expect(estadoDe(enCurso)).toBe("en_visita");
    const sinRegistro = aplicar(enCurso, { tipo: "finalizarVisita", solicitudId: "SOL-001", profesionalId: "prof-demo-a", fecha: FECHA });
    expect(estadoDe(sinRegistro)).toBe("en_visita");
  });

  it("no cancela una solicitud confirmada", () => {
    const e = aplicar(ESTADO_INICIAL, crear, asignar(), confirmar, cancelar);
    expect(estadoDe(e)).toBe("confirmada");
  });

  it("no crea solicitudes con datos inválidos", () => {
    const e = aplicar(ESTADO_INICIAL, { tipo: "crearSolicitud", datos: { ...DATOS, motivo: "corto" }, fecha: FECHA });
    expect(e.solicitudes).toHaveLength(0);
    expect(e.secuencia).toBe(0);
  });

  it("nunca duplica una solicitud al crear y reasignar", () => {
    const e = aplicar(ESTADO_INICIAL, crear, asignar(), confirmar);
    expect(e.solicitudes).toHaveLength(1);
    expect(new Set(e.solicitudes.map((s) => s.id)).size).toBe(e.solicitudes.length);
  });
});
