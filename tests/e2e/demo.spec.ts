import { expect, test } from "@playwright/test";

test("selector comercial: tres perfiles y restablecimiento, sin herramienta de atajo visible", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("button", { name: /Pacientes y familias/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Profesionales/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Administración y coordinación/ })).toBeVisible();
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
