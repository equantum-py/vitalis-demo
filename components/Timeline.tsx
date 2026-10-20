import { ETIQUETA_ESTADO, PASOS_SOLICITUD } from "@/lib/estado-ui";
import { formatearFecha } from "@/lib/formato";
import type { EntradaHistorial, EstadoSolicitud } from "@/lib/types";

interface Props {
  estado: EstadoSolicitud;
  historial: EntradaHistorial[];
}

/** Línea de etapas de la solicitud. Cada etapa se comunica con texto, no solo con color. */
export function Timeline({ estado, historial }: Props) {
  if (estado === "cancelada") {
    return <p className="rounded-2xl border border-line bg-white p-4 text-ink-soft">Esta solicitud fue cancelada.</p>;
  }
  const indiceActual = PASOS_SOLICITUD.indexOf(estado);
  return (
    <ol className="flex flex-col gap-0" aria-label="Etapas de la solicitud">
      {PASOS_SOLICITUD.map((paso, i) => {
        const completo = i < indiceActual;
        const actual = i === indiceActual;
        const entrada = [...historial].reverse().find((h) => h.estado === paso);
        const ultimo = i === PASOS_SOLICITUD.length - 1;
        return (
          <li key={paso} className="relative flex gap-4 pb-5 last:pb-0">
            {!ultimo && (
              <span
                aria-hidden="true"
                className={`absolute left-[13px] top-7 h-[calc(100%-1.25rem)] w-0.5 ${completo ? "bg-azul" : "bg-line"}`}
              />
            )}
            <span
              aria-hidden="true"
              className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                completo || actual ? "bg-azul text-white" : "border-2 border-line bg-white text-ink-soft"
              } ${actual ? "ring-4 ring-azul-200" : ""}`}
            >
              {completo ? "✓" : i + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={`font-semibold ${completo || actual ? "text-ink" : "text-ink-soft"}`}>
                {ETIQUETA_ESTADO[paso]}
                {actual && <span className="ml-2 text-sm font-normal text-azul-600">(etapa actual)</span>}
              </p>
              {entrada && <p className="text-sm text-ink-soft">{formatearFecha(entrada.fecha)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
