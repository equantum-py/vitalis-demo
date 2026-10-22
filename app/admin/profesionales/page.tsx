"use client";

import { EncabezadoPagina, Panel, Vacio } from "@/components/admin/Encabezado";
import { CLASE_BOTON } from "@/components/ui";
import { PROFESIONALES_DEMO } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";

export default function ProfesionalesAdmin() {
  const { estado, despachar } = useDemo();

  return (
    <div>
      <EncabezadoPagina
        titulo="Profesionales"
        descripcion="Gestione la disponibilidad para nuevas asignaciones."
      />

      {PROFESIONALES_DEMO.length === 0 ? (
        <Panel>
          <Vacio>No hay profesionales cargados.</Vacio>
        </Panel>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PROFESIONALES_DEMO.map((p) => {
            const disponible = estado.disponibilidad[p.id] !== false;
            const visitas = estado.solicitudes.filter((s) => s.profesionalId === p.id).length;
            return (
              <li key={p.id}>
                <Panel>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col items-start gap-2">
                      <h2 className="font-display text-xl font-medium text-navy">{p.nombre}</h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                          disponible ? "border-azul-200 bg-azul-soft text-azul-600" : "border-line bg-paper text-ink-soft"
                        }`}
                      >
                        {disponible ? "Disponible" : "No disponible"}
                      </span>
                    </div>
                    <p className="text-sm text-ink-soft">
                      Solicitudes asignadas: <span className="font-semibold text-ink">{visitas}</span>
                    </p>
                    {/* Acción solo en escritorio amplio; por debajo de xl es de solo lectura. */}
                    <button
                      type="button"
                      className={`${CLASE_BOTON.secundario} hidden xl:inline-flex`}
                      onClick={() => despachar({ tipo: "cambiarDisponibilidad", profesionalId: p.id, disponible: !disponible })}
                    >
                      {disponible ? "Marcar como no disponible" : "Marcar como disponible"}
                    </button>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-6 text-sm text-ink-soft">La disponibilidad determina qué profesionales pueden recibir nuevas asignaciones.</p>
    </div>
  );
}
