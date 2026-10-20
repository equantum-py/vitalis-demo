import { ETIQUETA_ESTADO, TONO_ESTADO } from "@/lib/estado-ui";
import type { EstadoSolicitud } from "@/lib/types";

const CLASES = {
  neutro: "bg-white text-ink-soft border-line",
  info: "bg-mint text-teal border-mint-200",
  ok: "bg-teal text-white border-teal",
  cerrado: "bg-paper text-ink border-line",
} as const;

export function StatusPill({ estado }: { estado: EstadoSolicitud }) {
  const tono = TONO_ESTADO[estado];
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${CLASES[tono]}`}>
      {ETIQUETA_ESTADO[estado]}
    </span>
  );
}
