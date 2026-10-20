import { describe, expect, it } from "vitest";
import { construirAgenda, filtrarSolicitudes, indicadores } from "@/lib/admin";
import { ESTADO_INICIAL, FRANJAS_DEMO, PROFESIONALES_DEMO } from "@/lib/fixtures";
import { reducer } from "@/lib/reducer";
import type { EstadoDemo } from "@/lib/types";

const FECHA = "2026-10-20T13:00:00.000Z";
const DATOS = { motivo: "Motivo de prueba ficticio", direccion: "Calle Ficticia 1", telefono: "000 000 0000", preferencia: "tarde" as const };

function construir(): EstadoDemo {
  let e = ESTADO_INICIAL;
  for (let i = 0; i < 3; i++) e = reducer(e, { tipo: "crearSolicitud", datos: { ...DATOS, motivo: `Motivo ${i} ficticio` }, fecha: FECHA });
  e = reducer(e, { tipo: "asignarProfesional", solicitudId: "SOL-003", profesionalId: PROFESIONALES_DEMO[0].id, fecha: FECHA });
  e = reducer(e, { tipo: "confirmarFranja", solicitudId: "SOL-003", franja: FRANJAS_DEMO[1], fecha: FECHA });
  e = reducer(e, { tipo: "asignarProfesional", solicitudId: "SOL-002", profesionalId: PROFESIONALES_DEMO[1].id, fecha: FECHA });
  return e;
}

describe("indicadores", () => {
  it("cuenta por estado y separa urgencias", () => {
    const e = reducer(construir(), { tipo: "registrarUrgencia", fecha: FECHA });
    const i = indicadores(e.solicitudes, e.urgencias);
    expect(i).toMatchObject({ total: 3, recibidas: 1, asignadas: 1, confirmadas: 1, urgencias: 1 });
  });
});

describe("filtros", () => {
  it("filtra por estado y por texto", () => {
    const e = construir();
    expect(filtrarSolicitudes(e.solicitudes, "asignada", "").map((s) => s.id)).toEqual(["SOL-002"]);
    expect(filtrarSolicitudes(e.solicitudes, "todas", "motivo 0").map((s) => s.id)).toEqual(["SOL-001"]);
    expect(filtrarSolicitudes(e.solicitudes, "todas", "").length).toBe(3);
  });
});

describe("agenda", () => {
  it("muestra solo visitas con franja confirmada y separa las asignadas pendientes", () => {
    const e = construir();
    const a = construirAgenda(e.solicitudes);
    const celdaTarde = a.filas[0].franjas[1].visitas.map((s) => s.id);
    expect(celdaTarde).toEqual(["SOL-003"]);
    expect(a.pendientes.map((s) => s.id)).toEqual(["SOL-002"]);
  });
});
