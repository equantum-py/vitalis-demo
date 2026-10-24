import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { sembrarEstado } from "./soporte/estado-sembrado";

const CAPTURAS = path.join("tests", "e2e", "capturas", "auditoria");
mkdirSync(CAPTURAS, { recursive: true });

const RUTAS = [
  "/demo",
  "/paciente",
  "/paciente/solicitar",
  "/paciente/solicitudes",
  "/paciente/solicitudes/SOL-003",
  "/paciente/solicitudes/SOL-001/confirmacion",
  "/paciente/urgencia",
  "/profesional",
  "/profesional/agenda",
  "/profesional/visitas/SOL-002",
  "/profesional/visitas/SOL-001",
  "/admin",
  "/admin/solicitudes",
  "/admin/solicitudes/SOL-005",
  "/admin/agenda",
  "/admin/profesionales",
  "/admin/urgencias",
];

for (const ruta of RUTAS) {
  test(`auditoría ${ruta}`, async ({ page }, testInfo) => {
    await sembrarEstado(page);
    const respuesta = await page.goto(ruta);
    expect(respuesta?.status(), "la ruta responde").toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();

    // Sin desplazamiento horizontal
    const { ancho, ventana } = await page.evaluate(() => ({
      ancho: document.documentElement.scrollWidth,
      ventana: window.innerWidth,
    }));
    expect(ancho, `desbordamiento horizontal en ${ruta}`).toBeLessThanOrEqual(ventana);

    // Accesibilidad: WCAG 2.0/2.1 A y AA. Se falla por problemas serios y críticos.
    const resultado = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const graves = resultado.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const resumen = graves.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nodo(s) — ${v.nodes.map((n) => `${n.target.join(", ")}: ${n.failureSummary ?? "sin detalle"}`).join(" | ")}`).join("; ");
    expect(graves.length, `accesibilidad en ${ruta}: ${resumen}`).toBe(0);

    const nombre = ruta.replace(/\//g, "_").replace(/^_/, "") || "inicio";
    await page.screenshot({ path: path.join(CAPTURAS, `${testInfo.project.name}-${nombre}.png`), fullPage: true });
  });
}
