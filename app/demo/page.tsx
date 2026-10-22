"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DemoBadge } from "@/components/DemoBadge";
import { MarcaVitalis } from "@/components/MarcaVitalis";
import { CLASE_BOTON, CLASE_INPUT, Tarjeta } from "@/components/ui";
import { FRANJAS_DEMO, PACIENTE_DEMO, PROFESIONALES_DEMO } from "@/lib/fixtures";
import { ETIQUETA_ESTADO } from "@/lib/estado-ui";
import { useDemo } from "@/lib/store";
import type { Perfil } from "@/lib/types";

const PERFILES: { perfil: Perfil; titulo: string; descripcion: string; ruta: string; disponible: boolean }[] = [
  {
    perfil: "paciente",
    titulo: "Pacientes y familias",
    descripcion: `${PACIENTE_DEMO.nombre}. Solicitar atención y seguir su estado.`,
    ruta: "/paciente",
    disponible: true,
  },
  {
    perfil: "profesional",
    titulo: "Profesionales",
    descripcion: "Agenda, inicio de visita, registro y finalización.",
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
  const { estado, despachar } = useDemo();
  const router = useRouter();
  const [perfilElegido, setPerfilElegido] = useState<Perfil>("paciente");
  const [asignacion, setAsignacion] = useState<Record<string, string>>({});
  const [franjaSeleccionada, setFranjaSeleccionada] = useState<Record<string, string>>({});
  const ultima = estado.solicitudes[0];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#edf5fa] px-5 pb-8 pt-6 text-[#005b8f] sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:rounded-[34px] sm:border sm:border-white/80 sm:px-7 sm:shadow-[12px_18px_45px_#005b8f20]">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MarcaVitalis />
        </div>
        <DemoBadge />
      </header>

      <div className="mt-9">
        <div className="mb-4 flex size-[62px] items-center justify-center rounded-[23px] bg-[#e3f2dc] text-[#558c24] shadow-[6px_7px_14px_#0b5e9c18,-4px_-4px_12px_#ffffff,inset_1px_1px_1px_#ffffff]">
          <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-8-4.5-8-10a4.5 4.5 0 0 1 8-2.6A4.5 4.5 0 0 1 20 11c0 5.5-8 10-8 10Z"/><path d="M8 12h2l1-2 2 4 1-2h2"/></svg>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#1e88c8]">Bienvenido a Vitalis</p>
        <h1 className="mt-2 font-display text-[27px] font-semibold leading-[1.2] tracking-[-.04em] text-[#0b5e9c]">¿Cómo querés ingresar?</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6d6e71]">Seleccioná un perfil para conocer la experiencia de Vitalis.</p>
      </div>

      <section aria-labelledby="perfiles" className="mt-7 flex flex-col gap-3.5">
        <h2 id="perfiles" className="sr-only">Perfiles de acceso</h2>
        {PERFILES.map((p, index) => {
          const activo = perfilElegido === p.perfil;
          return (
            <button
              key={p.perfil}
              type="button"
              aria-pressed={activo}
              onClick={() => setPerfilElegido(p.perfil)}
              className={`clay-interactive flex min-h-[104px] w-full items-center gap-3.5 rounded-[23px] border p-3.5 text-left shadow-[7px_9px_18px_#0b5e9c1c,-5px_-5px_14px_#ffffff,inset_1px_1px_2px_#ffffff] ${activo ? "border-[#1e88c8] bg-gradient-to-br from-white to-[#e7f4fb] ring-1 ring-[#1e88c8]/30" : "border-[#d6e6ef] bg-gradient-to-br from-white to-[#f5f9fc]"}`}
            >
              <span className={`flex size-[58px] shrink-0 items-center justify-center rounded-[19px] shadow-[inset_1px_1px_2px_#ffffff,4px_5px_10px_#0b5e9c16] ${index === 0 ? "bg-[#e0f0fb] text-[#0b5e9c]" : index === 1 ? "bg-[#e8f4dc] text-[#629a2e]" : "bg-[#dfeef6] text-[#005b8f]"}`}>
                {index === 0 ? (
                  <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2M19 5v4m-2-2h4"/></svg>
                ) : index === 1 ? (
                  <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 4v6a4 4 0 0 0 8 0V4M6 4H4m10 0h2M10 14v2a4 4 0 0 0 8 0v-3"/><circle cx="18" cy="11" r="2"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 10h8M8 14h5"/></svg>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[14px] font-semibold leading-snug text-[#005b8f]">{p.titulo}</span>
                <span className="mt-1 block text-[12px] leading-[1.45] text-[#6d6e71]">{p.descripcion}</span>
              </span>
              <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${activo ? "border-[#0b5e9c] bg-[#0b5e9c] text-white" : "border-[#b9cedd] bg-white"}`} aria-hidden="true">
                {activo && <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m4 10 4 4 8-8"/></svg>}
              </span>
            </button>
          );
        })}
      </section>

      <button
        type="button"
        onClick={() => {
          const elegido = PERFILES.find((p) => p.perfil === perfilElegido);
          if (!elegido) return;
          despachar({ tipo: "cambiarPerfil", perfil: elegido.perfil });
          router.push(elegido.ruta);
        }}
        className="clay-interactive mt-6 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[18px] bg-gradient-to-r from-[#0b5e9c] to-[#1e88c8] px-5 font-display text-sm font-semibold text-white shadow-[5px_8px_16px_#0b5e9c40,inset_1px_1px_2px_#ffffff50] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0b5e9c]"
      >
        Continuar
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 14 0m-6-6 6 6-6 6"/></svg>
      </button>
      <p className="mt-3 text-center text-xs leading-relaxed text-[#6d6e71]">Servicio de enfermería · Atención a domicilio</p>

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

    </main>
  );
}
