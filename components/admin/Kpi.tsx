export function Kpi({ etiqueta, valor, nota }: { etiqueta: string; valor: number; nota?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm font-semibold text-ink-soft">{etiqueta}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{valor}</p>
      {nota && <p className="mt-1 text-xs text-ink-soft">{nota}</p>}
    </div>
  );
}
