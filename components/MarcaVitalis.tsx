import Image from "next/image";

/** Logotipo oficial proporcionado por Vitalis. */
export function MarcaVitalis({ variante = "oscura" }: { variante?: "oscura" | "clara" }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-lg ${variante === "clara" ? "bg-white px-2 py-1" : ""}`}>
      <Image src="/vitalis-logo.png" alt="Vitalis — Servicio de enfermería" width={144} height={58} className="h-10 w-auto max-w-[132px] object-contain" priority />
    </span>
  );
}
