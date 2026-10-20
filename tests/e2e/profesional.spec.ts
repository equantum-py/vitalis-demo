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

function visiblesCon(page: Page, codigo: string) {
  return page.locator("td:visible, span:visible, p:visible").filter({ hasText: new RegExp(`^${codigo}$`) });
}

const OBS = "Observación ficticia de la visita (dato de prueba)";

test("recorrido completo entre los tres perfiles: crear, asignar, confirmar, visitar, finalizar", async ({ page }, testInfo) => {
  // 1. Paciente crea la solicitud
  await page.goto("/paciente/solicitar");
  await page.getByLabel("Motivo de la solicitud").fill("Control de seguimiento (dato ficticio)");
  await page.getByLabel("Dirección de la visita").fill("Calle Ficticia 123");
  await page.getByLabel("Teléfono de contacto").fill("000 000 0000");
  await page.getByLabel("Tarde").check();
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page).toHaveURL(/SOL-001\/confirmacion$/);

  // 2. Coordinación asigna y confirma la franja (herramienta de integración de la demo, válida en todos los tamaños)
  await page.goto("/demo?pruebas=1");
  await page.getByLabel("Profesional a asignar").selectOption("prof-demo-a");
  await page.getByRole("button", { name: "Asignar profesional" }).click();
  await page.getByLabel("Franja a confirmar").selectOption("Tarde · franja de demostración");
  await page.getByRole("button", { name: "Confirmar franja" }).click();
  await expect(page.getByText("Última solicitud: SOL-001 · Confirmada")).toBeVisible();

  // 3. Profesional: inicio, agenda y visita
  await page.goto("/profesional");
  await expect(page.getByRole("heading", { name: "Hola, Profesional Demo A" })).toBeVisible();
  await capturar(page, "p1-inicio", testInfo);
  await sinDesbordeHorizontal(page);

  await page.getByRole("link", { name: "Agenda", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Agenda" })).toBeVisible();
  await expect(visiblesCon(page, "SOL-001")).toHaveCount(1);
  await capturar(page, "p2-agenda", testInfo);
  await sinDesbordeHorizontal(page);

  await page.goto("/profesional/visitas/SOL-001");
  await expect(page.getByRole("heading", { name: "Visita SOL-001" })).toBeVisible();
  // Sin registro ni finalización antes de iniciar
  await expect(page.getByRole("button", { name: "Finalizar visita" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Guardar registro" })).toHaveCount(0);
  await capturar(page, "p3-visita-confirmada", testInfo);

  await page.getByRole("button", { name: "Iniciar visita" }).click();
  await expect(page.getByRole("status")).toContainText("Visita iniciada");
  await expect(page.getByText("En visita", { exact: true }).first()).toBeVisible();
  // Finalizar sigue bloqueado sin registro guardado
  await expect(page.getByRole("button", { name: "Finalizar visita" })).toBeDisabled();

  // 4. Registro simulado y finalización
  await page.getByLabel("Observaciones (texto ficticio)").fill(OBS);
  await page.getByLabel("Indicaciones (texto ficticio, opcional)").fill("Indicación ficticia");
  await page.getByRole("button", { name: "Guardar registro" }).click();
  await expect(page.getByText("Registro guardado (simulado)", { exact: false })).toBeVisible();
  await capturar(page, "p4-registro", testInfo);
  await sinDesbordeHorizontal(page);

  await page.getByRole("button", { name: "Finalizar visita" }).click();
  await expect(page.getByRole("status")).toContainText("Visita finalizada");
  await expect(page.getByRole("button", { name: "Guardar registro" })).toHaveCount(0);
  await expect(page.getByText(OBS)).toBeVisible();
  await capturar(page, "p5-finalizada", testInfo);

  // 5. Paciente ve la finalización
  await page.goto("/paciente/solicitudes/SOL-001");
  await expect(page.getByText("La visita fue finalizada. Gracias por usar la demostración.")).toBeVisible();
  await expect(page.getByText(OBS)).toHaveCount(0); // el paciente no ve el registro clínico simulado
  await capturar(page, "p6-paciente-finalizada", testInfo);
  await sinDesbordeHorizontal(page);

  // 6. Administración ve Finalizada, sin registro
  await page.goto("/admin/solicitudes/SOL-001");
  await expect(page.getByRole("heading", { name: "Solicitud SOL-001" })).toBeVisible();
  await expect(page.getByText("Finalizada", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(OBS)).toHaveCount(0);
  await sinDesbordeHorizontal(page);
});

test("bloqueos: visita de otro profesional no disponible y registro cerrado tras reiniciar el navegador", async ({ page }, testInfo) => {
  await page.goto("/paciente/solicitar");
  await page.getByLabel("Motivo de la solicitud").fill("Visita de prueba (dato ficticio)");
  await page.getByLabel("Dirección de la visita").fill("Calle Ficticia 123");
  await page.getByLabel("Teléfono de contacto").fill("000 000 0000");
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page).toHaveURL(/SOL-001\/confirmacion$/);

  await page.goto("/demo?pruebas=1");
  await page.getByLabel("Profesional a asignar").selectOption("prof-demo-a");
  await page.getByRole("button", { name: "Asignar profesional" }).click();
  await page.getByLabel("Franja a confirmar").selectOption("Mañana · franja de demostración");
  await page.getByRole("button", { name: "Confirmar franja" }).click();

  // Otro profesional no puede abrir la visita
  await page.goto("/profesional/visitas/SOL-001");
  await page.getByLabel("Profesional activo").selectOption("prof-demo-b");
  await expect(page.getByRole("heading", { name: "Visita no disponible" })).toBeVisible();
  await capturar(page, "p7-no-asignada", testInfo);

  // Volver al profesional A, iniciar, guardar y recargar: el estado se conserva
  await page.getByLabel("Profesional activo").selectOption("prof-demo-a");
  await page.getByRole("button", { name: "Iniciar visita" }).click();
  await page.getByLabel("Observaciones (texto ficticio)").fill(OBS);
  await page.getByRole("button", { name: "Guardar registro" }).click();
  await page.reload();
  await expect(page.getByLabel("Observaciones (texto ficticio)")).toHaveValue(OBS);
  await expect(page.getByText("En visita", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: "Finalizar visita" }).click();
  await page.reload();
  await expect(page.getByText(OBS)).toBeVisible();
  await expect(page.getByRole("button", { name: "Guardar registro" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Finalizar visita" })).toHaveCount(0);
  await sinDesbordeHorizontal(page);
});
