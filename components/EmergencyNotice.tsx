export function EmergencyNotice() {
  return (
    <section
      aria-labelledby="aviso-urgencia"
      className="rounded-2xl border border-[#EBCDBB] bg-warm-soft p-4 text-warm-ink"
    >
      <h2 id="aviso-urgencia" className="text-sm font-bold uppercase tracking-wider">
        Urgencias
      </h2>
      <p className="mt-2 leading-relaxed">
        Si hay una emergencia, llame al servicio de emergencias de inmediato. Esta aplicación no reemplaza una atención
        urgente.
      </p>
    </section>
  );
}
