"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { AvisoDemo, CampoTexto, CLASE_BOTON, CLASE_INPUT, PageTitle, Tarjeta } from "@/components/ui";
import { ETIQUETA_PREFERENCIA } from "@/lib/estado-ui";
import { useDemo } from "@/lib/store";
import { validarSolicitud } from "@/lib/validacion";
import type { ErroresSolicitud } from "@/lib/validacion";
import type { Preferencia } from "@/lib/types";

const PREFERENCIAS: Preferencia[] = ["manana", "tarde", "sin_preferencia"];

export default function SolicitarAtencion() {
  const { despachar, estado } = useDemo();
  const router = useRouter();
  const [motivo, setMotivo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [preferencia, setPreferencia] = useState<Preferencia>("sin_preferencia");
  const [errores, setErrores] = useState<ErroresSolicitud>({});
  const [intentado, setIntentado] = useState(false);
  const enviandoRef = useRef(false);

  const datos = { motivo, direccion, telefono, preferencia };

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Guarda síncrona: evita crear dos solicitudes con un doble clic o Enter repetido.
    if (enviandoRef.current) return;
    setIntentado(true);
    const nuevosErrores = validarSolicitud(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    enviandoRef.current = true;

    const fecha = new Date().toISOString();
    despachar({ tipo: "crearSolicitud", datos, fecha });
    // El id se genera en el reducer. La siguiente solicitud es la secuencia + 1.
    const id = `SOL-${String(estado.secuencia + 1).padStart(3, "0")}`;
    router.push(`/paciente/solicitudes/${id}/confirmacion`);
  }

  function revalidar() {
    if (!intentado) return;
    setErrores(validarSolicitud(datos));
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle eyebrow="Atención a domicilio" title="Solicitar atención">
        <span>Complete los datos básicos. Coordinación le confirmará la franja y el profesional asignado.</span>
      </PageTitle>

      <form onSubmit={enviar} noValidate className="flex flex-col gap-5" aria-label="Solicitud de atención">
        <Tarjeta className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ink-soft">Tipo de atención</p>
          <p className="text-ink">Atención domiciliaria · a confirmar por Vitalis</p>
        </Tarjeta>

        <CampoTexto
          id="motivo"
          label="Motivo de la solicitud"
          ayuda="Describa brevemente el motivo. No incluya datos médicos sensibles en esta demostración."
          error={errores.motivo}
        >
          <textarea
            id="motivo"
            rows={4}
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              revalidar();
            }}
            aria-invalid={!!errores.motivo}
            aria-describedby={errores.motivo ? "motivo-error motivo-ayuda" : "motivo-ayuda"}
            className={CLASE_INPUT}
          />
        </CampoTexto>

        <CampoTexto id="direccion" label="Dirección de la visita" error={errores.direccion}>
          <input
            id="direccion"
            type="text"
            autoComplete="street-address"
            value={direccion}
            onChange={(e) => {
              setDireccion(e.target.value);
              revalidar();
            }}
            aria-invalid={!!errores.direccion}
            aria-describedby={errores.direccion ? "direccion-error" : undefined}
            className={CLASE_INPUT}
          />
        </CampoTexto>

        <CampoTexto id="telefono" label="Teléfono de contacto" error={errores.telefono}>
          <input
            id="telefono"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={telefono}
            onChange={(e) => {
              setTelefono(e.target.value);
              revalidar();
            }}
            aria-invalid={!!errores.telefono}
            aria-describedby={errores.telefono ? "telefono-error" : undefined}
            className={CLASE_INPUT}
          />
        </CampoTexto>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 font-semibold text-ink">Preferencia horaria</legend>
          {PREFERENCIAS.map((p) => (
            <label
              key={p}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-3.5 has-checked:border-azul has-checked:bg-azul-soft"
            >
              <input
                type="radio"
                name="preferencia"
                value={p}
                checked={preferencia === p}
                onChange={() => {
                  setPreferencia(p);
                  revalidar();
                }}
                className="h-5 w-5 accent-azul"
              />
              <span>{ETIQUETA_PREFERENCIA[p]}</span>
            </label>
          ))}
          <p className="text-sm text-ink-soft">La preferencia es orientativa. Coordinación la confirmará.</p>
        </fieldset>

        <div role="note" className="rounded-xl border border-warm-200 bg-warm-soft p-3 text-sm text-warm-ink">
          Si es una emergencia, no use este formulario. Llame al servicio de emergencias de inmediato.
        </div>

        <button type="submit" className={CLASE_BOTON.primario}>
          Enviar solicitud
        </button>

        <AvisoDemo>
          Demostración: la solicitud se guarda solo en este navegador. No se envía a Vitalis ni a ningún sistema externo.
        </AvisoDemo>
      </form>
    </div>
  );
}
