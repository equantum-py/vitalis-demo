"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DemoBadge } from "@/components/DemoBadge";
import { AvisoDemo, CLASE_BOTON, CLASE_INPUT, PageTitle, Tarjeta } from "@/components/ui";
import { FRANJAS_DEMO, PACIENTE_DEMO, PROFESIONALES_DEMO } from "@/lib/fixtures";
import { ETIQUETA_ESTADO } from "@/lib/estado-ui";
import { useDemo } from "@/lib/store";
import type { Perfil } from "@/lib/types";

const PERFILES: { perfil: Perfil; titulo: string; descripcion: string; ruta: string; disponible: boolean }[] = [
  {
    perfil: "paciente",
    titulo: "Pacientes y familias",
    descripcion: `${PACIENTE_DEMO.nombre} (ficticia). Solicitar atención y seguir su estado.`,
    ruta: "/paciente",
    disponible: true,
  },
  {
    perfil: "profesional",
    titulo: "Profesionales",
    descripcion: "Agenda, inicio de visita, registro simulado y finalización.",
    ruta: "/profesional",
    disponible: true,
  },
  {
    perfil: "administracion",
    titulo: "Administración y coordinación",
    descripcion: "Dashboard, solicitudes, asignaciones, confirmación de franjas, agenda y profesionales.",
    ruta: "/admin",
    disponible: true,
  },
];

export default function SelectorDemo() {
  return (
    <Suspense fallback={null}>
      <Selector />
    </Suspense>
  );
}

function Selector() {
  // Herramienta de atajo: solo para desarrollo y pruebas automatizadas (?pruebas=1). No aparece en el recorrido comercial.
  const modoPruebas = useSearchParams().get("pruebas") === "1";
  const { estado, despachar, restablecer } = useDemo();
  const router = useRouter();
  const [confirmarReinicio, setConfirmarReinicio] = useState(false);
  const [asignacion, setAsignacion] = useState<Record<string, string>>({});
  const [franjaSeleccionada, setFranjaSeleccionada] = useState<Record<string, string>>({});
  const ultima = estado.solicitudes[0];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 p-5 md:my-8 md:rounded-3xl md:bg-paper md:p-8 md:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-semibold text-azul-600">VITALIS</p>
        <DemoBadge />
      </div>

      <PageTitle eyebrow="Demostración" title="Elija un perfil para recorrer la demo">
        <span>
          Todos los datos son ficticios. No hay inicio de sesión real: el perfil solo define por dónde empieza el
          recorrido.
        </span>
      </PageTitle>

      <section aria-labelledby="perfiles" className="flex flex-col gap-3">
        <h2 id="perfiles" className="sr-only">
          Perfiles de demostración
        </h2>
        {PERFILES.map((p) => (
          <button
            key={p.perfil}
            type="button"
            onClick={() => {
              despachar({ tipo: "cambiarPerfil", perfil: p.perfil });
              router.push(p.ruta);
            }}
            className="flex min-h-16 flex-col items-start gap-1 rounded-2xl border border-line bg-white p-4 text-left transition-colors hover:border-azul-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-azul-600"
          >
            <span className="flex w-full items-center justify-between">
              <span className="font-semibold text-ink">{p.titulo}</span>
              {!p.disponible && (
                <span className="shrink-0 whitespace-nowrap rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-ink-soft">En construcción</span>
              )}
            </span>
            <span className="text-sm text-ink-soft">{p.descripcion}</span>
          </button>
        ))}
      </section>

      {modoPruebas && (
      <Tarjeta className="flex flex-col gap-4 border-dashed">
        <div>
          <h2 className="font-semibold text-ink">Herramienta de prueba de integración</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Temporal, para verificar que una solicitud creada en el módulo de pacientes llega al estado compartido. En
            E03-C, estas acciones pasan al panel de administración.
          </p>
        </div>

        {!ultima && <p className="text-ink-soft">Todavía no hay solicitudes. Cree una desde el perfil de pacientes.</p>}

        {ultima && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink">
              Última solicitud: <span className="font-semibold">{ultima.id}</span> ·{" "}
              {ETIQUETA_ESTADO[ultima.estado]}
            </p>

            {ultima.estado === "recibida" && (
              <div className="flex flex-col gap-2">
                <label htmlFor="prof" className="text-sm font-semibold">
                  Profesional a asignar
                </label>
                <select
                  id="prof"
                  className={CLASE_INPUT}
                  value={asignacion[ultima.id] ?? ""}
                  onChange={(e) => setAsignacion({ ...asignacion, [ultima.id]: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  {PROFESIONALES_DEMO.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!asignacion[ultima.id]}
                  onClick={() =>
                    despachar({
                      tipo: "asignarProfesional",
                      solicitudId: ultima.id,
                      profesionalId: asignacion[ultima.id],
                      fecha: new Date().toISOString(),
                    })
                  }
                  className={CLASE_BOTON.secundario}
                >
                  Asignar profesional
                </button>
              </div>
            )}

            {ultima.estado === "asignada" && (
              <div className="flex flex-col gap-2">
                <label htmlFor="franja" className="text-sm font-semibold">
                  Franja a confirmar
                </label>
                <select
                  id="franja"
                  className={CLASE_INPUT}
                  value={franjaSeleccionada[ultima.id] ?? ""}
                  onChange={(e) => setFranjaSeleccionada({ ...franjaSeleccionada, [ultima.id]: e.target.value })}
                >
                  <option value="">Seleccionar</option>
                  {FRANJAS_DEMO.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!franjaSeleccionada[ultima.id]}
                  onClick={() =>
                    despachar({
                      tipo: "confirmarFranja",
                      solicitudId: ultima.id,
                      franja: franjaSeleccionada[ultima.id],
                      fecha: new Date().toISOString(),
                    })
                  }
                  className={CLASE_BOTON.secundario}
                >
                  Confirmar franja
                </button>
              </div>
            )}
          </div>
        )}
      </Tarjeta>
      )}

      <Tarjeta className="flex flex-col gap-3">
        <h2 className="font-semibold text-ink">Datos de la demo</h2>
        <p className="text-sm text-ink-soft">
          Los cambios se guardan solo en este navegador. No se envían a Vitalis ni a ningún sistema externo.
        </p>
        {!confirmarReinicio ? (
          <button type="button" onClick={() => setConfirmarReinicio(true)} className={CLASE_BOTON.peligro}>
            Restablecer demo
          </button>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                restablecer();
                setConfirmarReinicio(false);
                setAsignacion({});
                setFranjaSeleccionada({});
              }}
              className={CLASE_BOTON.peligro}
            >
              Sí, borrar los datos de la demo
            </button>
            <button type="button" onClick={() => setConfirmarReinicio(false)} className={CLASE_BOTON.secundario}>
              Cancelar
            </button>
          </div>
        )}
      </Tarjeta>

      <AvisoDemo>
        Vitalis todavía no aprobó las funcionalidades que se muestran. Son propuestas para validar en conjunto.{" "}
        <Link href="/paciente" className="font-semibold text-azul-600 underline underline-offset-4">
          Ir a pacientes
        </Link>
      </AvisoDemo>
    </main>
  );
}
