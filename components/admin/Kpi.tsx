export function Kpi({ etiqueta, valor, nota, className = "" }: { etiqueta: string; valor: number; nota?: string; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 rounded-2xl border border-line bg-surface p-4 sm:p-5 ${className}`}>
      <p className="text-sm font-semibold text-ink-soft">{etiqueta}</p>
      <p className="font-display text-[2rem] font-medium leading-none text-navy">{valor}</p>
      {nota && <p className="mt-1 text-xs leading-snug text-ink-soft">{nota}</p>}
    </div>
  );
}
