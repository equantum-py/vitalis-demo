import { describe, expect, it } from "vitest";
import { ESTADO_INICIAL, FRANJAS_DEMO, PROFESIONALES_DEMO } from "@/lib/fixtures";
import { reducer } from "@/lib/reducer";
import type { Accion } from "@/lib/reducer";
import type { EstadoDemo } from "@/lib/types";

const FECHA = "2026-10-20T13:00:00.000Z";
const DATOS_VALIDOS = {
  motivo: "Control de seguimiento a domicilio (ficticio)",
  direccion: "Calle Ficticia 123",
  telefono: "000 000 0000",
  preferencia: "manana" as const,
};

function aplicar(estado: EstadoDemo, ...acciones: Accion[]): EstadoDemo {
  return acciones.reduce(reducer, estado);
}

describe("crearSolicitud", () => {
  it("crea una solicitud en estado recibida con código secuencial", () => {
    const estado = aplicar(ESTADO_INICIAL, { tipo: "crearSolicitud", datos: DATOS_VALIDOS, fecha: FECHA });
    expect(estado.solicitudes).toHaveLength(1);
    expect(estado.solicitudes[0].id).toBe("SOL-001");
    expect(estado.solicitudes[0].estado).toBe("recibida");
    expect(estado.solicitudes[0].profesionalId).toBeNull();
    expect(estado.solicitudes[0].franja).toBeNull();
    expect(estado.solicitudes[0].historial).toEqual([{ estado: "recibida", fecha: FECHA }]);
  });

  it("no crea solicitudes con datos inválidos", () => {
    const estado = aplicar(ESTADO_INICIAL, {
      tipo: "crearSolicitud",
      datos: { ...DATOS_VALIDOS, motivo: "corto" },
      fecha: FECHA,
    });
    expect(estado).toBe(ESTADO_INICIAL);
  });
});

describe("asignación y confirmación separadas", () => {
  const base = aplicar(ESTADO_INICIAL, { tipo: "crearSolicitud", datos: DATOS_VALIDOS, fecha: FECHA });

  it("asignar profesional pasa de recibida a asignada, sin confirmar la franja", () => {
    const estado = aplicar(base, {
      tipo: "asignarProfesional",
      solicitudId: "SOL-001",
      profesionalId: PROFESIONALES_DEMO[0].id,
      fecha: FECHA,
    });
    const s = estado.solicitudes[0];
    expect(s.estado).toBe("asignada");
    expect(s.profesionalId).toBe(PROFESIONALES_DEMO[0].id);
    expect(s.franja).toBeNull();
  });

  it("no se puede confirmar la franja sin asignación previa", () => {
    const estado = aplicar(base, {
      tipo: "confirmarFranja",
      solicitudId: "SOL-001",
      franja: FRANJAS_DEMO[0],
      fecha: FECHA,
    });
    expect(estado.solicitudes[0].estado).toBe("recibida");
    expect(estado.solicitudes[0].franja).toBeNull();
  });

  it("confirmar la franja después de asignar pasa a confirmada", () => {
    const estado = aplicar(
      base,
      { tipo: "asignarProfesional", solicitudId: "SOL-001", profesionalId: PROFESIONALES_DEMO[1].id, fecha: FECHA },
      { tipo: "confirmarFranja", solicitudId: "SOL-001", franja: FRANJAS_DEMO[1], fecha: FECHA },
    );
    expect(estado.solicitudes[0].estado).toBe("confirmada");
    expect(estado.solicitudes[0].franja).toBe(FRANJAS_DEMO[1]);
    expect(estado.solicitudes[0].historial.map((h) => h.estado)).toEqual(["recibida", "asignada", "confirmada"]);
  });

  it("no acepta profesionales ni franjas que no existan en la demo", () => {
    const estado = aplicar(base, {
      tipo: "asignarProfesional",
      solicitudId: "SOL-001",
      profesionalId: "inexistente",
      fecha: FECHA,
    });
    expect(estado.solicitudes[0].estado).toBe("recibida");
  });
});

describe("cancelación", () => {
  it("permite cancelar una solicitud recibida", () => {
    const estado = aplicar(
      ESTADO_INICIAL,
      { tipo: "crearSolicitud", datos: DATOS_VALIDOS, fecha: FECHA },
      { tipo: "cancelarSolicitud", solicitudId: "SOL-001", fecha: FECHA },
    );
    expect(estado.solicitudes[0].estado).toBe("cancelada");
  });

  it("no cancela una solicitud ya confirmada", () => {
    const estado = aplicar(
      ESTADO_INICIAL,
      { tipo: "crearSolicitud", datos: DATOS_VALIDOS, fecha: FECHA },
      { tipo: "asignarProfesional", solicitudId: "SOL-001", profesionalId: PROFESIONALES_DEMO[0].id, fecha: FECHA },
      { tipo: "confirmarFranja", solicitudId: "SOL-001", franja: FRANJAS_DEMO[0], fecha: FECHA },
      { tipo: "cancelarSolicitud", solicitudId: "SOL-001", fecha: FECHA },
    );
    expect(estado.solicitudes[0].estado).toBe("confirmada");
  });
});

describe("urgencias separadas de la cola programada", () => {
  it("registrar una urgencia no crea ninguna solicitud", () => {
    const estado = aplicar(ESTADO_INICIAL, { tipo: "registrarUrgencia", fecha: FECHA });
    expect(estado.urgencias).toHaveLength(1);
    expect(estado.solicitudes).toHaveLength(0);
    expect(estado.secuencia).toBe(0);
  });
});

describe("cambiar perfil y restablecer", () => {
  it("cambia el perfil sin tocar las solicitudes", () => {
    const con = aplicar(ESTADO_INICIAL, { tipo: "crearSolicitud", datos: DATOS_VALIDOS, fecha: FECHA });
    const estado = aplicar(con, { tipo: "cambiarPerfil", perfil: "administracion" });
    expect(estado.perfil).toBe("administracion");
    expect(estado.solicitudes).toEqual(con.solicitudes);
  });

  it("restablecer devuelve el estado inicial", () => {
    const con = aplicar(ESTADO_INICIAL, { tipo: "crearSolicitud", datos: DATOS_VALIDOS, fecha: FECHA });
    expect(aplicar(con, { tipo: "restablecer" })).toEqual(ESTADO_INICIAL);
  });

  it("cargar reemplaza el estado por el guardado", () => {
    const guardado = aplicar(ESTADO_INICIAL, { tipo: "crearSolicitud", datos: DATOS_VALIDOS, fecha: FECHA });
    expect(aplicar(ESTADO_INICIAL, { tipo: "cargar", estado: guardado })).toEqual(guardado);
  });
});
