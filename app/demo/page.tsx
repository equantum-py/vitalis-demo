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

// Cuentas ficticias exclusivamente para recorrer la interfaz. No constituyen autenticación real.
const CUENTAS_PRUEBA = [
  { perfil: "paciente" as Perfil, usuario: "persona@vitalis.test", clave: "Vitalis2026!" },
  { perfil: "profesional" as Perfil, usuario: "profesional@vitalis.test", clave: "Vitalis2026!" },
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
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [errorAcceso, setErrorAcceso] = useState("");
  const [asignacion, setAsignacion] = useState<Record<string, string>>({});
  const [franjaSeleccionada, setFranjaSeleccionada] = useState<Record<string, string>>({});
  const ultima = estado.solicitudes[0];

  const ingresar = () => {
    const valido = CUENTAS_PRUEBA.some((cuenta) =>
      cuenta.perfil === perfilElegido &&
      cuenta.usuario === usuario.trim().toLowerCase() &&
      cuenta.clave === clave
    );
    if (!valido) {
      setErrorAcceso("Usuario o contraseña incorrectos para el perfil seleccionado.");
      return;
    }
    setErrorAcceso("");
    const elegido = PERFILES.find((p) => p.perfil === perfilElegido);
    if (!elegido) return;
    despachar({ tipo: "cambiarPerfil", perfil: elegido.perfil });
    router.push(elegido.ruta);
  };

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden bg-[#f8fcff] text-[#005b8f] sm:my-6 sm:min-h-[calc(100dvh-3rem)] sm:rounded-[34px] sm:shadow-[12px_18px_45px_#005b8f20]">
      <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-[#dff3fc]/70 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-32 top-72 size-72 rounded-full bg-[#e7f5ed]/70 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-1 flex-col px-7 pb-7 pt-8">
        <header className="flex items-center justify-center">
          <div className="scale-125 origin-center"><MarcaVitalis /></div>
          <DemoBadge />
        </header>
        <div className="mt-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-[#7cb342]">Servicio de enfermería</p>
          <h1 className="mt-2 font-display text-[27px] font-semibold leading-tight text-[#005b8f]">Tu salud en buenas manos</h1>
          <p className="mx-auto mt-2 max-w-[270px] text-sm leading-relaxed text-[#6d6e71]">Accedé a una atención más simple, cercana y segura.</p>
        </div>

        <div className="mt-7 grid grid-cols-2 rounded-full border border-[#dce8f0] bg-[#edf3f8] p-1 shadow-inner" role="group" aria-label="Tipo de acceso">
          {PERFILES.slice(0, 2).map((p) => (
            <button key={p.perfil} type="button" aria-pressed={perfilElegido === p.perfil}
              onClick={() => { setPerfilElegido(p.perfil); setErrorAcceso(""); setUsuario(""); setClave(""); }}
              className={`min-h-12 rounded-full px-2 font-display text-sm font-semibold transition-colors ${perfilElegido === p.perfil ? "bg-gradient-to-r from-[#1e88c8] to-[#0b5e9c] text-white shadow-[0_5px_12px_#0b5e9c30]" : "text-[#6d6e71]"}`}>
              {p.perfil === "paciente" ? "Personas" : "Profesionales"}
            </button>
          ))}
        </div>

        <section className="mt-7" aria-labelledby="acceso-vitalis">
          <h2 id="acceso-vitalis" className="text-center font-display text-lg font-semibold">Ingresá a tu cuenta</h2>
          <p className="mt-1 text-center text-xs text-[#6d6e71]">{perfilElegido === "paciente" ? "Pacientes y familias" : "Personal de enfermería y profesionales"}</p>
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); ingresar(); }}>
            <label className="block">
              <span className="sr-only">Cédula o correo electrónico</span>
              <span className="flex min-h-14 items-center gap-3 rounded-[20px] border border-[#dbe7ef] bg-white px-4 shadow-[3px_5px_14px_#0b5e9c0b]">
                <svg className="size-5 shrink-0 text-[#1e88c8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg>
                <input type="text" value={usuario} onChange={(e) => { setUsuario(e.target.value); setErrorAcceso(""); }} autoComplete="username" placeholder="Cédula o correo electrónico" className="min-w-0 w-full bg-transparent text-sm text-[#005b8f] outline-none placeholder:text-[#8d9ca8]" />
              </span>
            </label>
            <label className="block">
              <span className="sr-only">Contraseña</span>
              <span className="flex min-h-14 items-center gap-3 rounded-[20px] border border-[#dbe7ef] bg-white px-4 shadow-[3px_5px_14px_#0b5e9c0b]">
                <svg className="size-5 shrink-0 text-[#1e88c8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                <input type="password" value={clave} onChange={(e) => { setClave(e.target.value); setErrorAcceso(""); }} autoComplete="current-password" placeholder="Contraseña" className="min-w-0 w-full bg-transparent text-sm text-[#005b8f] outline-none placeholder:text-[#8d9ca8]" />
              </span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-[#6d6e71]">
              <input type="checkbox" className="size-4 accent-[#0b5e9c]" /> Recordar mis datos
            </label>
            {errorAcceso && <p role="alert" className="text-center text-xs font-medium text-[#a43c32]">{errorAcceso}</p>}
            <button type="submit" className="clay-interactive flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#1e88c8] to-[#0b5e9c] font-display text-base font-semibold text-white shadow-[4px_9px_20px_#0b5e9c35]">
              Ingresar <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="mt-3 text-center text-[11px] text-[#6d6e71]">Cuenta de prueba: {perfilElegido === "paciente" ? "persona@vitalis.test" : "profesional@vitalis.test"} · Clave: Vitalis2026!</p>
        </section>

        <div className="mt-auto pt-7">
          <div className="grid grid-cols-3 gap-2 border-t border-[#dbe7ef] pt-5 text-center text-[11px] text-[#6d6e71]">
            <span className="flex flex-col items-center gap-2"><span className="text-xl text-[#0b5e9c]">▦</span>Agendá tu visita</span>
            <span className="flex flex-col items-center gap-2"><span className="text-xl text-[#0b5e9c]">♡</span>Atención cercana</span>
            <span className="flex flex-col items-center gap-2"><span className="text-xl text-[#0b5e9c]">✓</span>Todo en un lugar</span>
          </div>
          <button type="button" onClick={() => { despachar({ tipo: "cambiarPerfil", perfil: "administracion" }); router.push("/admin"); }} className="mt-5 w-full py-2 text-center text-xs font-medium text-[#005b8f] underline underline-offset-4">Acceso de administración</button>
        </div>
      </div>
      <div className="h-3 bg-gradient-to-r from-[#43b9d7] via-[#1e88c8] to-[#005b8f]" aria-hidden="true" />

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
