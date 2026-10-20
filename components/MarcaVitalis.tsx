/** Marcador de marca provisional: monograma limpio, sin logotipo recreado ni imagen sin licencia.
 *  Reemplazar por el logotipo transparente cuando Vitalis lo autorice. */
export function MarcaVitalis({ variante = "oscura" }: { variante?: "oscura" | "clara" }) {
  const color = variante === "oscura" ? "bg-navy text-white" : "bg-white text-navy";
  return (
    <span
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-xl font-display text-lg font-semibold leading-none ${color}`}
      aria-hidden="true"
    >
      V
    </span>
  );
}
