import { expect, test } from "@playwright/test";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { sembrarEstado } from "./soporte/estado-sembrado";

/**
 * Control visual de la barra de navegación inferior en móvil.
 * Comprueba, con desplazamiento real de la rueda del mouse, que ningún elemento interactivo
 * queda oculto detrás de la barra, que el último elemento es alcanzable y que la barra
 * permanece fija al pie del viewport.
 */
const ANCHOS = [320, 375, 390, 430];
const PANTALLAS = [
  "/paciente",
  "/paciente/solicitar",
  "/paciente/solicitudes",
  "/paciente/solicitudes/SOL-003",
  "/paciente/solicitudes/SOL-004",
  "/paciente/solicitudes/SOL-005",
  "/paciente/urgencia",
  "/profesional",
  "/profesional/agenda",
  "/profesional/visitas/SOL-003",
  "/profesional/visitas/SOL-002",
  "/profesional/visitas/SOL-001",
];
const CAPTURAS = path.join("tests", "e2e", "capturas", "barra-inferior");
mkdirSync(CAPTURAS, { recursive: true });

// Selectores de elementos interactivos del contenido principal (excluye las barras de navegación).
const SELECTOR_INTERACTIVOS = "main a[href], main button, main input, main textarea, main select";

test.describe("barra inferior en móvil", () => {
  for (const ancho of ANCHOS) {
    for (const ruta of PANTALLAS) {
      test(`${ruta} a ${ancho} px: nada queda oculto y la barra permanece fija`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "movil-390", "Control de móvil: se ejecuta una sola vez por suite");
        await page.setViewportSize({ width: ancho, height: 740 });
        await sembrarEstado(page);
        await page.goto(ruta);
        await page.waitForLoadState("networkidle");
        await expect(page.locator("h1").first()).toBeVisible();

        const barraSel = "nav[aria-label$='de pacientes'], nav[aria-label$='de profesionales']";
        const marcarInteractivos = () =>
          page.evaluate((selector) => {
            const els = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => {
              const e = getComputedStyle(el);
              return e.display !== "none" && e.visibility !== "hidden" && el.getBoundingClientRect().width > 0;
            });
            els.forEach((el, i) => el.setAttribute("data-ctrl", String(i)));
            return els.length;
          }, SELECTOR_INTERACTIVOS);

        // Un elemento es alcanzable si, en alguna posición del desplazamiento REAL (sin scrollIntoView),
        // su centro queda dentro del viewport y no lo tapa la barra ni otro elemento.
        const comprobarPosicion = () =>
          page.evaluate(
            ({ selector, barra }) => {
              const nav = document.querySelector<HTMLElement>(barra);
              const navTop = nav ? nav.getBoundingClientRect().top : window.innerHeight;
              const res: Record<string, "ok" | "tapado" | "fuera"> = {};
              document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
                const id = el.getAttribute("data-ctrl");
                if (id === null) return;
                const r = el.getBoundingClientRect();
                if (r.width === 0) return;
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                if (cy < 0 || cy > window.innerHeight) { res[id] = res[id] ?? "fuera"; return; }
                if (r.bottom > navTop + 0.5 && cy > navTop) { res[id] = "tapado"; return; }
                const tope = document.elementFromPoint(cx, cy);
                if (tope && (el === tope || el.contains(tope) || tope.contains(el))) res[id] = "ok";
                else res[id] = "tapado";
              });
              return res;
            },
            { selector: SELECTOR_INTERACTIVOS, barra: barraSel },
          );

        const total = await marcarInteractivos();
        const alcanzados = new Set<string>();
        const registrar = (res: Record<string, string>) => {
          for (const [id, estado] of Object.entries(res)) if (estado === "ok") alcanzados.add(id);
        };

        // 1) Desplazamiento real con la rueda desde el inicio hasta el final, en pasos de 180 px.
        registrar(await comprobarPosicion());
        for (let i = 0; i < 40; i++) {
          const antes = await page.evaluate(() => window.scrollY);
          await page.mouse.move(ancho / 2, 400);
          await page.mouse.wheel(0, 180);
          await page.waitForTimeout(80);
          registrar(await comprobarPosicion());
          const despues = await page.evaluate(() => window.scrollY);
          if (despues === antes) break;
        }

        // 2) En la posición final, la barra está pegada al pie del viewport.
        const barra = await page.locator(barraSel).boundingBox();
        const alto = await page.evaluate(() => window.innerHeight);
        expect(barra, "la barra inferior existe").not.toBeNull();
        expect(Math.abs((barra!.y + barra!.height) - alto), `barra fija al pie en ${ancho} px`).toBeLessThanOrEqual(1);
        // Evidencia versionada: solo inicio del paciente y visita del profesional, en 320 y 390 px.
        if ([320, 390].includes(ancho) && ["/paciente", "/profesional/visitas/SOL-002"].includes(ruta)) {
          await page.screenshot({
            path: path.join(CAPTURAS, `${ancho}-${ruta.replace(/\//g, "_").replace(/^_/, "")}-fondo.png`),
          });
        }

        // 2b) Los elementos del encabezado no se superponen entre sí (p. ej., distintivo DEMO y botón Urgencia).
        const solapesEncabezado = await page.evaluate(() => {
          const cabecera = document.querySelector<HTMLElement>("body > div header, body > div > header") ?? document.querySelector<HTMLElement>("header");
          if (!cabecera) return [];
          const hijos = Array.from(cabecera.querySelectorAll<HTMLElement>("a, span, button, select, label"))
            .filter((e) => e.getBoundingClientRect().width > 0 && !e.closest("main"));
          const pares: string[] = [];
          for (let i = 0; i < hijos.length; i++) for (let j = i + 1; j < hijos.length; j++) {
            const a = hijos[i].getBoundingClientRect(), b = hijos[j].getBoundingClientRect();
            if (hijos[i].contains(hijos[j]) || hijos[j].contains(hijos[i])) continue;
            const se = a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
            if (se) pares.push(`${(hijos[i].textContent || "").trim().slice(0, 15)} / ${(hijos[j].textContent || "").trim().slice(0, 15)}`);
          }
          return pares;
        });
        expect(solapesEncabezado, `elementos del encabezado superpuestos en ${ruta} a ${ancho} px`).toEqual([]);

        // 3) Ningún elemento interactivo queda inaccesible durante el recorrido.
        const pendientes = Array.from({ length: total }, (_, i) => String(i)).filter((id) => !alcanzados.has(id));
        const nombres = await page.evaluate((ids) => ids.map((id) => {
          const el = document.querySelector<HTMLElement>(`[data-ctrl="${id}"]`);
          return (el?.textContent || el?.getAttribute("aria-label") || el?.id || el?.tagName || "?").trim().slice(0, 40);
        }), pendientes);
        expect(nombres, `elementos que nunca quedan accesibles en ${ruta} a ${ancho} px`).toEqual([]);

        if (total === 0) return; // pantalla de solo lectura: no hay acciones que alcanzar

        // 4) En la posición final, ningún elemento interactivo se solapa con la franja de la barra.
        const solapados = await page.evaluate((selector) => {
          const nav = document.querySelector<HTMLElement>("nav[aria-label$='de pacientes'], nav[aria-label$='de profesionales']");
          const navTop = nav ? nav.getBoundingClientRect().top : window.innerHeight;
          const res: string[] = [];
          document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
            if (el.getAttribute("data-ctrl") === null) return;
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            const visibleEnPantalla = r.bottom > 0 && r.top < window.innerHeight;
            if (visibleEnPantalla && r.bottom > navTop + 0.5) {
              res.push((el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 40));
            }
          });
          return res;
        }, SELECTOR_INTERACTIVOS);
        expect(solapados, `elementos cubiertos por la barra al final de ${ruta} a ${ancho} px`).toEqual([]);
      });
    }
  }
});
