import { ETIQUETA_ESTADO, PASOS_SOLICITUD } from "@/lib/estado-ui";
import type { EstadoSolicitud } from "@/lib/types";

/** Barra de progreso de cinco etapas, con la etapa actual nombrada en texto. */
export function ProgresoSolicitud({ estado }: { estado: EstadoSolicitud }) {
  if (estado === "cancelada") {
    return <p className="text-sm text-ink-soft">Solicitud cancelada.</p>;
  }
  const indice = PASOS_SOLICITUD.indexOf(estado);
  return (
    <div className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={`Etapa ${indice + 1} de ${PASOS_SOLICITUD.length}: ${ETIQUETA_ESTADO[estado]}`}
        className="flex items-center"
      >
        {PASOS_SOLICITUD.map((paso, i) => (
          <span key={paso} className="flex flex-1 items-center last:flex-none">
            <span
              aria-hidden="true"
              className={`size-3.5 shrink-0 rounded-full ${
                i <= indice ? "bg-azul" : "border-2 border-line bg-surface"
              } ${i === indice ? "ring-4 ring-azul-soft" : ""}`}
            />
            {i < PASOS_SOLICITUD.length - 1 && (
              <span aria-hidden="true" className={`h-0.5 flex-1 ${i < indice ? "bg-azul" : "bg-line"}`} />
            )}
          </span>
        ))}
      </div>
      <p className="text-xs font-semibold text-ink-soft">
        Paso {indice + 1} de {PASOS_SOLICITUD.length} · {ETIQUETA_ESTADO[estado]}
      </p>
    </div>
  );
}
