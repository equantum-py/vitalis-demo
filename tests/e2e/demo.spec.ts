import { expect, test } from "@playwright/test";

test("acceso comercial: personas y profesionales, sin herramienta de atajo visible", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("button", { name: "Personas" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Profesionales" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Ingresar/ })).toBeVisible();
  await page.getByLabel("Número de cédula").fill("1234567");
  await page.getByLabel("Contraseña").fill("123456");
  await page.getByRole("button", { name: /Ingresar/ }).click();
  await expect(page).toHaveURL(/\/paciente$/);
  await page.goto("/demo");
  await expect(page.getByText("En construcción")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Restablecer demo" })).toBeVisible();
  // La herramienta de atajo no aparece en el recorrido comercial
  await expect(page.getByText("Herramienta de prueba de integración")).toHaveCount(0);
  await expect(page.getByLabel("Profesional a asignar")).toHaveCount(0);
});

test("herramienta de atajo solo con ?pruebas=1 (desarrollo y pruebas automatizadas)", async ({ page }) => {
  await page.goto("/demo?pruebas=1");
  await expect(page.getByText("Herramienta de prueba de integración")).toBeVisible();
});
