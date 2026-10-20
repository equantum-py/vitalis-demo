const formateador = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" });

export function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? "" : formateador.format(fecha);
}
