import { describe, expect, it } from "vitest";
import { ESTADO_INICIAL, FRANJAS_DEMO } from "@/lib/fixtures";
import { reducer } from "@/lib/reducer";
import type { Accion } from "@/lib/reducer";
import { resumenProfesional, visitasDelProfesional } from "@/lib/profesional";
import type { EstadoDemo } from "@/lib/types";
import { validarRegistro } from "@/lib/validacion-visita";

const FECHA = "2026-10-20T13:00:00.000Z";
const DATOS = {
  motivo: "Control de seguimiento (ficticio)",
  direccion: "Calle Ficticia 123",
  telefono: "000 000 0000",
  preferencia: "tarde" as const,
};
const A = "prof-demo-a";
const B = "prof-demo-b";
const OBS = "Observación ficticia de prueba";

function aplicar(estado: EstadoDemo, ...acciones: Accion[]): EstadoDemo {
  return acciones.reduce(reducer, estado);
}

/** Solicitud SOL-001 asignada a A y confirmada para la tarde. */
function confirmada(): EstadoDemo {
  return aplicar(
    ESTADO_INICIAL,
    { tipo: "crearSolicitud", datos: DATOS, fecha: FECHA },
    { tipo: "asignarProfesional", solicitudId: "SOL-001", profesionalId: A, fecha: FECHA },
    { tipo: "confirmarFranja", solicitudId: "SOL-001", franja: FRANJAS_DEMO[1], fecha: FECHA },
  );
}

const iniciar = (profesionalId = A): Accion => ({ tipo: "iniciarVisita", solicitudId: "SOL-001", profesionalId, fecha: FECHA });
const guardar = (observaciones = OBS, profesionalId = A): Accion => ({
  tipo: "guardarRegistro",
  solicitudId: "SOL-001",
  profesionalId,
  observaciones,
  indicaciones: "Indicación ficticia",
  fecha: FECHA,
});
const finalizar = (profesionalId = A): Accion => ({ tipo: "finalizarVisita", solicitudId: "SOL-001", profesionalId, fecha: FECHA });

describe("iniciarVisita", () => {
  it("inicia una visita confirmada del profesional asignado", () => {
    const e = aplicar(confirmada(), iniciar());
    expect(e.solicitudes[0].estado).toBe("en_visita");
    expect(e.solicitudes[0].historial.at(-1)?.estado).toBe("en_visita");
  });

  it("no inicia una visita sin franja confirmada (asignada)", () => {
    const e = aplicar(
      ESTADO_INICIAL,
      { tipo: "crearSolicitud", datos: DATOS, fecha: FECHA },
      { tipo: "asignarProfesional", solicitudId: "SOL-001", profesionalId: A, fecha: FECHA },
      iniciar(),
    );
    expect(e.solicitudes[0].estado).toBe("asignada");
  });

  it("no inicia una visita de otro profesional", () => {
    const e = aplicar(confirmada(), iniciar(B));
    expect(e.solicitudes[0].estado).toBe("confirmada");
  });
});

describe("guardarRegistro y finalizarVisita", () => {
  it("solo guarda el registro durante la visita en curso", () => {
    const sinIniciar = aplicar(confirmada(), guardar());
    expect(sinIniciar.solicitudes[0].registro).toBeNull();
    const enCurso = aplicar(confirmada(), iniciar(), guardar());
    expect(enCurso.solicitudes[0].registro?.observaciones).toBe(OBS);
    expect(enCurso.solicitudes[0].registro?.cerrado).toBe(false);
  });

  it("no finaliza sin observaciones guardadas", () => {
    const e = aplicar(confirmada(), iniciar(), finalizar());
    expect(e.solicitudes[0].estado).toBe("en_visita");
  });

  it("finaliza con registro y lo cierra", () => {
    const e = aplicar(confirmada(), iniciar(), guardar(), finalizar());
    expect(e.solicitudes[0].estado).toBe("finalizada");
    expect(e.solicitudes[0].registro?.cerrado).toBe(true);
  });

  it("un registro finalizado no puede modificarse ni volver a finalizarse", () => {
    const final = aplicar(confirmada(), iniciar(), guardar(), finalizar());
    const intento = aplicar(final, guardar("Cambio posterior no permitido"), finalizar());
    expect(intento.solicitudes[0].registro?.observaciones).toBe(OBS);
    expect(intento.solicitudes[0].estado).toBe("finalizada");
    expect(intento.solicitudes[0].historial).toEqual(final.solicitudes[0].historial);
  });

  it("otro profesional no puede guardar ni finalizar", () => {
    const e = aplicar(confirmada(), iniciar(), guardar(OBS, B), finalizar(B));
    expect(e.solicitudes[0].estado).toBe("en_visita");
    expect(e.solicitudes[0].registro).toBeNull();
  });
});

describe("elegirProfesionalActivo", () => {
  it("cambia el profesional activo y rechaza ids desconocidos", () => {
    expect(aplicar(ESTADO_INICIAL, { tipo: "elegirProfesionalActivo", profesionalId: B }).profesionalActivoId).toBe(B);
    expect(aplicar(ESTADO_INICIAL, { tipo: "elegirProfesionalActivo", profesionalId: "inexistente" }).profesionalActivoId).toBe(A);
  });
});

describe("selectores del profesional", () => {
  it("la agenda muestra solo visitas con franja de su profesional, sin asignadas pendientes", () => {
    const e = aplicar(
      confirmada(),
      { tipo: "crearSolicitud", datos: DATOS, fecha: FECHA },
      { tipo: "asignarProfesional", solicitudId: "SOL-002", profesionalId: A, fecha: FECHA },
    );
    const visitas = visitasDelProfesional(e.solicitudes, A);
    expect(visitas.map((s) => s.id)).toEqual(["SOL-001"]);
    expect(visitasDelProfesional(e.solicitudes, B)).toEqual([]);
  });

  it("el resumen cuenta por estado", () => {
    const e = aplicar(confirmada(), iniciar(), guardar(), finalizar());
    expect(resumenProfesional(e.solicitudes, A)).toEqual({ confirmadas: 0, enCurso: 0, finalizadas: 1, pendientesFranja: 0 });
  });
});

describe("validarRegistro", () => {
  it("exige observaciones mínimas", () => {
    expect(validarRegistro({ observaciones: "corto", indicaciones: "" }).observaciones).toBeDefined();
    expect(validarRegistro({ observaciones: "Observación suficiente", indicaciones: "" })).toEqual({});
  });
});
