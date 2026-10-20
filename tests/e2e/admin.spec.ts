import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Page, TestInfo } from "@playwright/test";

const CAPTURAS = path.join("tests", "e2e", "capturas");
mkdirSync(CAPTURAS, { recursive: true });

async function capturar(page: Page, nombre: string, testInfo: TestInfo) {
  await page.screenshot({ path: path.join(CAPTURAS, `${testInfo.project.name}-${nombre}.png`), fullPage: true });
}

async function sinDesbordeHorizontal(page: Page) {
  const { ancho, ventana } = await page.evaluate(() => ({
    ancho: document.documentElement.scrollWidth,
    ventana: window.innerWidth,
  }));
  expect(ancho, "no debe haber desplazamiento horizontal").toBeLessThanOrEqual(ventana);
}

/** Elementos visibles con un código exacto (la tabla de escritorio y las tarjetas móviles coexisten en el DOM). */
function visiblesCon(page: Page, codigo: string) {
  return page.locator("td:visible, span:visible").filter({ hasText: new RegExp(`^${codigo}$`) });
}

async function crearSolicitudPaciente(page: Page) {
  await page.goto("/paciente/solicitar");
  await page.getByLabel("Motivo de la solicitud").fill("Control de seguimiento (dato ficticio)");
  await page.getByLabel("Dirección de la visita").fill("Calle Ficticia 123");
  await page.getByLabel("Teléfono de contacto").fill("000 000 0000");
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page).toHaveURL(/SOL-001\/confirmacion$/);
}

test("administración: solicitud del paciente aparece una sola vez y el flujo llega a Confirmada", async ({ page }, testInfo) => {
  const escritorio = testInfo.project.name === "escritorio-1440";
  await crearSolicitudPaciente(page);

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await capturar(page, "a1-dashboard", testInfo);
  await sinDesbordeHorizontal(page);

  await page.goto("/admin/solicitudes");
  await expect(visiblesCon(page, "SOL-001")).toHaveCount(1);
  await capturar(page, "a2-solicitudes", testInfo);
  await sinDesbordeHorizontal(page);

  // Móvil: aviso de optimización para escritorio y sin acciones de escritura
  if (!escritorio) {
    await expect(page.getByRole("note")).toContainText("La administración está optimizada para escritorio. En este tamaño verá tarjetas de solo lectura.");
    await page.goto("/admin/solicitudes/SOL-001");
    await expect(page.getByRole("button", { name: "Asignar profesional" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Confirmar franja" })).toBeHidden();
    await capturar(page, "a3-detalle-solo-lectura", testInfo);
    await sinDesbordeHorizontal(page);
    return;
  }

  // Escritorio: menú lateral visible y flujo completo
  await expect(page.locator("aside").getByRole("link", { name: "Agenda" })).toBeVisible();

  await page.goto("/admin/solicitudes/SOL-001");
  await expect(page.getByRole("heading", { name: "Solicitud SOL-001" })).toBeVisible();

  // Profesional no disponible no puede seleccionarse
  await expect(page.getByRole("option", { name: /Profesional Demo C/ })).toBeDisabled();

  // Paso 1: asignar profesional
  await page.getByLabel("Profesional disponible").selectOption("prof-demo-a");
  await page.getByRole("button", { name: "Asignar profesional" }).click();
  await expect(page.getByRole("status")).toContainText("quedó en estado Asignada");
  await capturar(page, "a4-detalle-asignada", testInfo);

  // Paso 2: confirmar franja (acción separada)
  await page.getByLabel("Franja a confirmar").selectOption("Tarde · franja de demostración");
  await page.getByRole("button", { name: "Confirmar franja" }).click();
  await expect(page.getByRole("status")).toContainText("quedó en estado Confirmada");
  await capturar(page, "a5-detalle-confirmada", testInfo);

  // Agenda: la visita aparece una sola vez
  await page.goto("/admin/agenda");
  await expect(visiblesCon(page, "SOL-001")).toHaveCount(1);
  await capturar(page, "a6-agenda", testInfo);
  await sinDesbordeHorizontal(page);

  // Paciente: ve el cambio al volver a su seguimiento
  await page.goto("/paciente/solicitudes/SOL-001");
  await expect(page.getByText("Profesional Demo A")).toBeVisible();
  await expect(page.getByText("Tarde · franja de demostración")).toBeVisible();
  await expect(page.getByText("La visita está programada en la franja confirmada.")).toBeVisible();

  // Sin duplicados en la lista del paciente
  await page.goto("/paciente/solicitudes");
  await expect(page.getByRole("link", { name: /SOL-001/ })).toHaveCount(1);
});

test("administración: filtros por estado, profesionales y registro de urgencias separado", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "escritorio-1440", "Flujo de escritorio");
  await crearSolicitudPaciente(page);

  await page.goto("/admin/solicitudes");
  await page.getByLabel("Estado", { exact: true }).selectOption("confirmada");
  await expect(page.getByRole("status")).toContainText("0 de 1 solicitudes");
  await page.getByLabel("Estado", { exact: true }).selectOption("recibida");
  await expect(visiblesCon(page, "SOL-001")).toHaveCount(1);

  // Profesionales: marcar uno como no disponible y dejarlo sin poder asignarse
  await page.goto("/admin/profesionales");
  await page.getByRole("button", { name: "Marcar como no disponible" }).first().click();
  await expect(page.getByText("No disponible", { exact: true }).first()).toBeVisible();
  await capturar(page, "a7-profesionales", testInfo);

  // Urgencia: registro separado, sin solicitud nueva
  await page.goto("/paciente/urgencia");
  await page.getByRole("button", { name: "Registrar que leí esta orientación" }).click();
  await page.goto("/admin/urgencias");
  await expect(page.getByText("no son solicitudes", { exact: false }).first()).toBeVisible();
  await capturar(page, "a8-urgencias", testInfo);

  await page.goto("/admin/solicitudes");
  await expect(page.getByText(/URG-/)).toHaveCount(0);
  await expect(visiblesCon(page, "SOL-001")).toHaveCount(1);
  await capturar(page, "a9-solicitudes-final", testInfo);
  await sinDesbordeHorizontal(page);
});
