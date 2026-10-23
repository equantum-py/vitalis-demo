"use client";

import { useEffect, useState } from "react";

type EventoInstalacion = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstalarVitalis() {
  const [evento, setEvento] = useState<EventoInstalacion | null>(null);
  const [ios] = useState(() => process.env.NODE_ENV === "production" && typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent));
  const [instalada, setInstalada] = useState(() => typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))));

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
    const antes = (e: Event) => { e.preventDefault(); setEvento(e as EventoInstalacion); };
    const despues = () => { setInstalada(true); setEvento(null); };
    window.addEventListener("beforeinstallprompt", antes);
    window.addEventListener("appinstalled", despues);
    return () => {
      window.removeEventListener("beforeinstallprompt", antes);
      window.removeEventListener("appinstalled", despues);
    };
  }, []);

  if (instalada || (!evento && !ios)) return null;
  return (
    <div className="vitalis-card mt-5 p-4 text-center">
      <p className="font-display text-sm font-semibold">Vitalis en tu celular</p>
      {evento ? (
        <button type="button" className="vitalis-primary mt-3 min-h-11 w-full px-5" onClick={async () => {
          await evento.prompt();
          await evento.userChoice;
          setEvento(null);
        }}>Instalar aplicación</button>
      ) : (
        <p className="mt-2 text-xs text-[#6d6e71]">En Safari, tocá Compartir y después «Agregar a pantalla de inicio».</p>
      )}
    </div>
  );
}
