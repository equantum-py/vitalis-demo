"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ESTADO_INICIAL } from "./fixtures";
import { reducer } from "./reducer";
import type { Accion } from "./reducer";
import { borrarEstado, guardarEstado, leerEstado } from "./persistencia";
import type { EstadoDemo } from "./types";

interface ContextoDemo {
  estado: EstadoEnMemoria;
  despachar: (accion: Accion) => void;
  restablecer: () => void;
}

type EstadoEnMemoria = EstadoDemo & { cargado: boolean };

const Contexto = createContext<ContextoDemo | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [estado, despachar] = useReducer(reducer, ESTADO_INICIAL);
  const [cargado, setCargado] = useState(false);
  const primeraCarga = useRef(true);

  // Carga inicial desde localStorage (solo en cliente, para no romper la hidratación).
  useEffect(() => {
    const guardado = leerEstado();
    if (guardado) despachar({ tipo: "cargar", estado: guardado });
    // Carga única tras hidratar: leer localStorage en el primer render rompería la hidratación de Next.js.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCargado(true);
  }, []);

  // Persistencia tras cada cambio, una vez cargado el estado previo.
  useEffect(() => {
    if (!cargado) return;
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }
    guardarEstado(estado);
  }, [estado, cargado]);

  const valor = useMemo<ContextoDemo>(
    () => ({
      estado: { ...estado, cargado },
      despachar,
      restablecer: () => {
        borrarEstado();
        despachar({ tipo: "restablecer" });
      },
    }),
    [estado, cargado],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDemo(): ContextoDemo {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useDemo debe usarse dentro de DemoProvider");
  return valor;
}
