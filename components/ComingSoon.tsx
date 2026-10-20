import Link from "next/link";
import { DemoBadge } from "./DemoBadge";

export function ComingSoon({ titulo, fase }: { titulo: string; fase: string }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-4 p-6">
      <DemoBadge />
      <h1 className="font-display text-2xl font-semibold text-ink">{titulo}</h1>
      <p className="text-ink-soft">
        Este módulo todavía no está implementado. Se construye en {fase}. Ninguna función de esta pantalla está activa.
      </p>
      <Link href="/demo" className="font-semibold text-azul-600 underline underline-offset-4">
        Volver al selector de perfiles
      </Link>
    </main>
  );
}
