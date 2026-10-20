import { describe, expect, it } from "vitest";
import { validarSolicitud } from "@/lib/validacion";

const OK = { motivo: "Motivo de demostración", direccion: "Calle Ficticia 1", telefono: "000 000 0000", preferencia: "tarde" as const };

describe("validarSolicitud", () => {
  it("acepta datos completos", () => {
    expect(validarSolicitud(OK)).toEqual({});
  });
  it("exige motivo de al menos 10 caracteres", () => {
    expect(validarSolicitud({ ...OK, motivo: "corto" }).motivo).toBeDefined();
  });
  it("exige dirección y teléfono válidos", () => {
    const e = validarSolicitud({ ...OK, direccion: "", telefono: "abc" });
    expect(e.direccion).toBeDefined();
    expect(e.telefono).toBeDefined();
  });
});
