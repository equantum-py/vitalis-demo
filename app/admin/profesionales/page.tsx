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
        descripcion="Profesionales ficticios de la demostración. Marque como no disponible para impedir nuevas asignaciones."
      />

      {PROFESIONALES_DEMO.length === 0 ? (
        <Panel>
          <Vacio>No hay profesionales cargados.</Vacio>
        </Panel>
      ) : (
        <ul className="grid gap-4 md:grid-cols-3">
          {PROFESIONALES_DEMO.map((p) => {
            const disponible = estado.disponibilidad[p.id] !== false;
            const visitas = estado.solicitudes.filter((s) => s.profesionalId === p.id).length;
            return (
              <li key={p.id}>
                <Panel>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-display text-lg font-semibold text-ink">{p.nombre}</h2>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-sm font-semibold ${
                          disponible ? "border-azul-200 bg-azul-soft text-azul-600" : "border-line bg-paper text-ink-soft"
                        }`}
                      >
                        {disponible ? "Disponible" : "No disponible"}
                      </span>
                    </div>
                    <p className="text-sm text-ink-soft">
                      Solicitudes asignadas: <span className="font-semibold text-ink">{visitas}</span>
                    </p>
                    {/* Acción solo en escritorio; en móvil es de solo lectura. */}
                    <button
                      type="button"
                      className={`${CLASE_BOTON.secundario} hidden lg:inline-flex`}
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
      <p className="mt-6 text-sm text-ink-soft">Profesionales ficticios. No representan personal real de Vitalis.</p>
    </div>
  );
}
