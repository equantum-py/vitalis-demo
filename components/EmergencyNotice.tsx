export function EmergencyNotice() {
  return (
    <section
      aria-labelledby="aviso-urgencia"
      className="flex flex-col gap-1.5 rounded-2xl border border-warm-200 bg-warm-soft p-4 text-warm-ink"
    >
      <h2 id="aviso-urgencia" className="text-sm font-bold uppercase tracking-wider">
        Urgencias
      </h2>
      <p className="text-[15px] leading-relaxed">
        Si hay una emergencia, llame al servicio de emergencias de inmediato. Esta aplicación no reemplaza una atención
        urgente.
      </p>
    </section>
  );
}
