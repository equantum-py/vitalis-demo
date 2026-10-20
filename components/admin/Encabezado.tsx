import type { ReactNode } from "react";

export function EncabezadoPagina({ titulo, descripcion, acciones }: { titulo: string; descripcion?: string; acciones?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="font-display text-[1.75rem] font-medium leading-tight text-navy text-balance">{titulo}</h1>
        {descripcion && <p className="max-w-3xl text-[15px] leading-relaxed text-ink-soft">{descripcion}</p>}
      </div>
      {acciones}
    </div>
  );
}

export function Panel({ titulo, children, className = "" }: { titulo?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-line bg-surface ${className}`}>
      {titulo && <h2 className="border-b border-line px-5 py-3.5 font-semibold text-navy">{titulo}</h2>}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Vacio({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-paper p-6 text-center leading-relaxed text-ink-soft">{children}</p>;
}
