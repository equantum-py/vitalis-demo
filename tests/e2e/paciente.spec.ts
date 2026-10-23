import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const CAPTURAS = path.join("tests", "e2e", "capturas");
mkdirSync(CAPTURAS, { recursive: true });

async function capturar(page: import("@playwright/test").Page, nombre: string, testInfo: { project: { name: string } }) {
  await page.screenshot({ path: path.join(CAPTURAS, `${testInfo.project.name}-${nombre}.png`), fullPage: true });
}

async function sinDesbordeHorizontal(page: import("@playwright/test").Page) {
  const { ancho, ventana } = await page.evaluate(() => ({
    ancho: document.documentElement.scrollWidth,
    ventana: window.innerWidth,
  }));
  expect(ancho, "no debe haber desplazamiento horizontal").toBeLessThanOrEqual(ventana);
}

test("flujo de paciente: crear, consultar, urgencia separada y persistencia", async ({ page }, testInfo) => {
  // Selector de perfiles
  await page.goto("/demo");
  await expect(page.getByRole("button", { name: "Personas" })).toBeVisible();
  await capturar(page, "01-selector", testInfo);
  await sinDesbordeHorizontal(page);

  // Inicio de pacientes
  await page.getByLabel("Número de cédula").fill("1234567");
  await page.getByLabel("Contraseña").fill("123456");
  await page.getByRole("button", { name: /Ingresar/ }).click();
  await expect(page).toHaveURL(/\/paciente$/);
  await expect(page.getByRole("heading", { name: "Hola, Ana" })).toBeVisible();
  await capturar(page, "02-inicio", testInfo);
  await sinDesbordeHorizontal(page);

  // Crear solicitud ficticia
  await page.getByRole("link", { name: "Solicitar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Solicitar atención" })).toBeVisible();

  // Validación visible
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page.getByText("Describa el motivo con al menos 10 caracteres.")).toBeVisible();
  await capturar(page, "03-solicitar-error", testInfo);

  await page.getByLabel("Motivo de la solicitud").fill("Control de seguimiento (dato ficticio)");
  await page.getByLabel("Dirección de la visita").fill("Calle Ficticia 123");
  await page.getByLabel("Teléfono de contacto").fill("000 000 0000");
  await page.getByLabel("Tarde").check();
  await page.getByRole("button", { name: "Enviar solicitud" }).click();

  // Confirmación
  await expect(page).toHaveURL(/\/paciente\/solicitudes\/SOL-001\/confirmacion$/);
  await expect(page.getByRole("heading", { name: "Gracias. Su solicitud quedó registrada." })).toBeVisible();
  await capturar(page, "04-confirmacion", testInfo);
  await sinDesbordeHorizontal(page);

  // Seguimiento: estado inicial
  await page.getByRole("link", { name: "Ver seguimiento" }).click();
  await expect(page.getByRole("heading", { name: "Solicitud SOL-001" })).toBeVisible();
  await expect(page.getByText("Pendiente", { exact: true })).toBeVisible();
  await expect(page.getByText("Esperar confirmación. Coordinación revisará la solicitud.")).toBeVisible();
  await capturar(page, "05-seguimiento-recibida", testInfo);
  await sinDesbordeHorizontal(page);

  // Persistencia tras actualizar el navegador
  await page.reload();
  await expect(page.getByRole("heading", { name: "Solicitud SOL-001" })).toBeVisible();

  // Urgencia: registro separado, no crea solicitud
  await page.goto("/paciente/urgencia");
  await page.getByRole("button", { name: "Registrar que leí esta orientación" }).click();
  await expect(page.getByText("No se creó ninguna solicitud.")).toBeVisible();
  await capturar(page, "06-urgencia", testInfo);
  await sinDesbordeHorizontal(page);

  await page.goto("/paciente/solicitudes");
  await expect(page.getByRole("link", { name: /SOL-001/ })).toHaveCount(1);
  await expect(page.getByText(/URG-/)).toHaveCount(0);
  await capturar(page, "07-mis-solicitudes", testInfo);
  await sinDesbordeHorizontal(page);
});

test("integración: asignar y confirmar desde la herramienta de prueba y reflejarlo en pacientes", async ({ page }, testInfo) => {
  await page.goto("/paciente/solicitar");
  await page.getByLabel("Motivo de la solicitud").fill("Visita de seguimiento (dato ficticio)");
  await page.getByLabel("Dirección de la visita").fill("Calle Ficticia 123");
  await page.getByLabel("Teléfono de contacto").fill("000 000 0000");
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page).toHaveURL(/SOL-001\/confirmacion$/);

  // Asignación (separada de la confirmación)
  await page.goto("/demo?pruebas=1");
  await page.getByLabel("Profesional a asignar").selectOption("prof-demo-a");
  await page.getByRole("button", { name: "Asignar profesional" }).click();
  await expect(page.getByText("Última solicitud: SOL-001 · Asignada")).toBeVisible();
  // Tras asignar, la confirmación de franja queda disponible como acción separada (deshabilitada hasta elegir franja).
  await expect(page.getByRole("button", { name: "Confirmar franja" })).toBeDisabled();

  await page.goto("/paciente/solicitudes/SOL-001");
  await expect(page.getByText("Profesional Demo A")).toBeVisible();
  await expect(page.getByText("A confirmar por coordinación")).toBeVisible();

  // Confirmación de franja
  await page.goto("/demo?pruebas=1");
  await page.getByLabel("Franja a confirmar").selectOption("Tarde · franja de demostración");
  await page.getByRole("button", { name: "Confirmar franja" }).click();
  await expect(page.getByText("Última solicitud: SOL-001 · Confirmada")).toBeVisible();

  await page.goto("/paciente/solicitudes/SOL-001");
  await expect(page.getByText("Tarde · franja de demostración")).toBeVisible();
  await expect(page.getByText("La visita está programada en la franja confirmada.")).toBeVisible();
  await capturar(page, "08-seguimiento-confirmada", testInfo);
  await sinDesbordeHorizontal(page);
});

test("restablecer la demo borra los datos y el estado se conserva al cambiar de perfil", async ({ page }, testInfo) => {
  await page.goto("/paciente/solicitar");
  await page.getByLabel("Motivo de la solicitud").fill("Consulta de prueba (dato ficticio)");
  await page.getByLabel("Dirección de la visita").fill("Calle Ficticia 123");
  await page.getByLabel("Teléfono de contacto").fill("000 000 0000");
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page).toHaveURL(/SOL-001\/confirmacion$/);

  // Cambio de perfil sin perder el estado
  await page.goto("/demo");
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.goto("/paciente/solicitudes");
  await expect(page.getByRole("link", { name: /SOL-001/ })).toBeVisible();
  await capturar(page, "09-perfil-cambiado", testInfo);

  // Restablecer
  await page.goto("/demo");
  await page.getByRole("button", { name: "Restablecer demo" }).click();
  await page.getByRole("button", { name: "Sí, borrar los datos de la demo" }).click();
  await page.goto("/paciente/solicitudes");
  await expect(page.getByText("Todavía no creó ninguna solicitud.")).toBeVisible();
});
