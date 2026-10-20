import type { ReactNode } from "react";

export function EncabezadoPagina({ titulo, descripcion, acciones }: { titulo: string; descripcion?: string; acciones?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">{titulo}</h1>
        {descripcion && <p className="mt-1 max-w-3xl text-ink-soft">{descripcion}</p>}
      </div>
      {acciones}
    </div>
  );
}

export function Panel({ titulo, children, className = "" }: { titulo?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white ${className}`}>
      {titulo && <h2 className="border-b border-line px-5 py-3.5 font-semibold text-ink">{titulo}</h2>}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Vacio({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-paper p-6 text-center text-ink-soft">{children}</p>;
}
