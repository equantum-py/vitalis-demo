"use client";

import Link from "next/link";
import { useState } from "react";
import { AvisoDemo, CLASE_BOTON, PageTitle, Tarjeta } from "@/components/ui";
import { useDemo } from "@/lib/store";

export default function OrientacionUrgencia() {
  const { estado, despachar } = useDemo();
  const [registrada, setRegistrada] = useState<string | null>(null);

  function registrar() {
    const fecha = new Date().toISOString();
    despachar({ tipo: "registrarUrgencia", fecha });
    setRegistrada(fecha);
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle eyebrow="Separado de la atención programada" title="Orientación de urgencias">
        <span>Esta sección no crea solicitudes ni entra en la cola de atención a domicilio.</span>
      </PageTitle>

      <section
        aria-labelledby="titulo-urgencia"
        className="rounded-2xl border border-warm-200 bg-warm-soft p-5 text-warm-ink"
      >
        <h2 id="titulo-urgencia" className="text-lg font-bold">
          Si hay una emergencia, llame al servicio de emergencias de inmediato.
        </h2>
        <p className="mt-2 leading-relaxed">Esta aplicación no reemplaza una atención urgente.</p>
      </section>

      <Tarjeta className="flex flex-col gap-3">
        <h2 className="font-semibold text-ink">Registrar esta orientación</h2>
        <p className="text-sm text-ink-soft">
          Solo se registra cuando usted lo elige. La aplicación no evalúa ni clasifica lo que describe.
        </p>
        <button type="button" onClick={registrar} className={CLASE_BOTON.secundario}>
          Registrar que leí esta orientación
        </button>
        {registrada && (
          <p role="status" className="text-sm font-medium text-azul-600">
            Orientación registrada en el registro separado de urgencias. No se creó ninguna solicitud.
          </p>
        )}
        <p className="text-sm text-ink-soft">Registros de urgencia: {estado.urgencias.length}</p>
      </Tarjeta>

      <Link href="/paciente/solicitudes" className="font-semibold text-azul-600 underline underline-offset-4">
        Ver solicitudes programadas
      </Link>

      <AvisoDemo>Este registro no contacta a servicios de emergencia. Ante una urgencia, llamá al servicio de emergencias.</AvisoDemo>
    </div>
  );
}
