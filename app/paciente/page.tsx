"use client";

import Link from "next/link";
import { EmergencyNotice } from "@/components/EmergencyNotice";
import { StatusPill } from "@/components/StatusPill";
import { AvisoDemo, EnlaceBoton, PageTitle, Tarjeta } from "@/components/ui";
import { PACIENTE_DEMO } from "@/lib/fixtures";
import { formatearFecha } from "@/lib/formato";
import { PROXIMO_PASO } from "@/lib/estado-ui";
import { useDemo } from "@/lib/store";

export default function InicioPaciente() {
  const { estado } = useDemo();
  const reciente = estado.solicitudes[0];

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title={`Hola, ${PACIENTE_DEMO.nombre.split(" ")[0]}`}>
        <span>¿En qué le podemos ayudar hoy?</span>
      </PageTitle>

      <Tarjeta className="flex flex-col gap-3">
        <h2 className="font-semibold text-ink">Solicitar atención a domicilio</h2>
        <p className="text-sm text-ink-soft">Complete sus datos básicos y coordinación le confirmará la franja y el profesional.</p>
        <EnlaceBoton href="/paciente/solicitar">Crear solicitud</EnlaceBoton>
      </Tarjeta>

      {reciente ? (
        <Tarjeta className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold text-ink">Su solicitud más reciente</h2>
            <StatusPill estado={reciente.estado} />
          </div>
          <p className="text-sm text-ink-soft">
            {reciente.id} · {formatearFecha(reciente.historial[0].fecha)}
          </p>
          <p className="text-sm text-ink">{PROXIMO_PASO[reciente.estado]}</p>
          <Link
            href={`/paciente/solicitudes/${reciente.id}`}
            className="font-semibold text-teal underline underline-offset-4"
          >
            Ver seguimiento
          </Link>
        </Tarjeta>
      ) : (
        <Tarjeta>
          <p className="text-ink-soft">Todavía no tiene solicitudes en esta demostración.</p>
        </Tarjeta>
      )}

      <section aria-label="Cómo funciona" className="flex flex-col gap-2">
        <h2 className="font-semibold text-ink">Cómo funciona</h2>
        <ol className="flex flex-col gap-2 text-ink-soft">
          <li>1. Usted solicita la atención con datos básicos.</li>
          <li>2. Coordinación asigna un profesional y confirma la franja.</li>
          <li>3. Usted sigue el estado desde esta aplicación.</li>
        </ol>
      </section>

      <EmergencyNotice />

      <AvisoDemo>
        Demostración con datos ficticios. Las funciones son propuestas sujetas a validación con Vitalis.{" "}
        <Link href="/demo" className="font-semibold text-teal underline underline-offset-4">
          Cambiar de perfil
        </Link>
      </AvisoDemo>
    </div>
  );
}
