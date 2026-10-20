"use client";

import Link from "next/link";
import { StatusPill } from "@/components/StatusPill";
import { EnlaceBoton, PageTitle, Tarjeta } from "@/components/ui";
import { formatearFecha } from "@/lib/formato";
import { ETIQUETA_PREFERENCIA } from "@/lib/estado-ui";
import { useDemo } from "@/lib/store";

export default function MisSolicitudes() {
  const { estado } = useDemo();

  return (
    <div className="flex flex-col gap-5">
      <PageTitle eyebrow="Atención programada" title="Mis solicitudes">
        <span>Las urgencias no aparecen en esta lista. Tienen su propio registro.</span>
      </PageTitle>

      {estado.solicitudes.length === 0 ? (
        <Tarjeta className="flex flex-col gap-3">
          <p className="text-ink-soft">Todavía no creó ninguna solicitud.</p>
          <EnlaceBoton href="/paciente/solicitar">Crear solicitud</EnlaceBoton>
        </Tarjeta>
      ) : (
        <ul className="flex flex-col gap-3">
          {estado.solicitudes.map((s) => (
            <li key={s.id}>
              <Link
                href={`/paciente/solicitudes/${s.id}`}
                className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-teal-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-ink">{s.id}</span>
                  <StatusPill estado={s.estado} />
                </div>
                <p className="text-sm text-ink-soft">
                  {formatearFecha(s.historial[0].fecha)} · Preferencia: {ETIQUETA_PREFERENCIA[s.preferencia]}
                </p>
                <p className="line-clamp-2 text-ink">{s.motivo}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
