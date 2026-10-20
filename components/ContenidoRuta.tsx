"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Monta el contenido por ruta: al navegar, la pantalla anterior se desmonta por completo. */
export function ContenidoRuta({ children }: { children: ReactNode }) {
  const ruta = usePathname();
  return <div key={ruta}>{children}</div>;
}
