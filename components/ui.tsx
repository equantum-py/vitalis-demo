import Link from "next/link";
import type { ReactNode } from "react";

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-5">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-600">{eyebrow}</p>}
      <h1 className="mt-1 font-display text-2xl font-semibold leading-tight text-ink">{title}</h1>
      {children && <div className="mt-2 text-ink-soft">{children}</div>}
    </header>
  );
}

export function Tarjeta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-4 ${className}`}>{children}</div>;
}

const BASE_BOTON =
  "inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-base font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50";

export const CLASE_BOTON = {
  primario: `${BASE_BOTON} bg-teal text-white hover:bg-teal-600`,
  secundario: `${BASE_BOTON} border border-line bg-white text-ink hover:bg-mint`,
  peligro: `${BASE_BOTON} border border-[#C9784F] bg-white text-warm-ink hover:bg-warm-soft`,
};

export function EnlaceBoton({
  href,
  variante = "primario",
  children,
  className = "",
}: {
  href: string;
  variante?: keyof typeof CLASE_BOTON;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${CLASE_BOTON[variante]} ${className}`}>
      {children}
    </Link>
  );
}

export function CampoTexto({
  id,
  label,
  ayuda,
  error,
  children,
}: {
  id: string;
  label: string;
  ayuda?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
      </label>
      {ayuda && (
        <p id={`${id}-ayuda`} className="text-sm text-ink-soft">
          {ayuda}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-warm-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export const CLASE_INPUT =
  "min-h-11 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-ink-soft/70 focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-teal-600 aria-invalid:border-warm";

export function AvisoDemo({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-ink-soft/40 bg-white/70 p-3 text-sm text-ink-soft">{children}</p>
  );
}
