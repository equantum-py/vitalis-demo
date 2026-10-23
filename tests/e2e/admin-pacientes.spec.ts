import { expect, test } from "@playwright/test";

test("08-A: alta, edición, búsqueda y persistencia de paciente ficticio", async ({ page }) => {
  await page.goto("/admin/pacientes");
  await expect(page.getByRole("heading", { name: "Pacientes", exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Nuevo paciente/ }).click();
  await page.getByLabel("Nombre *").fill("Prueba");
  await page.getByLabel("Apellido *").fill("Ficticia QA");
  await page.getByLabel("Documento ficticio *").fill("QA-08A-001");
  await page.getByLabel("Teléfono ficticio").fill("000 111 222");
  await page.getByRole("button", { name: "Guardar paciente" }).click();
  await expect(page.getByRole("heading", { name: "Prueba Ficticia QA" })).toBeVisible();
  await expect(page.getByText("QA-08A-001")).toBeVisible();

  await page.getByRole("button", { name: "Editar ficha" }).click();
  await page.getByLabel("Apellido *").fill("Ficticia Editada");
  await page.getByLabel("Teléfono ficticio").fill("000 333 444");
  await page.getByRole("button", { name: "Guardar paciente" }).click();
  await expect(page.getByRole("heading", { name: "Prueba Ficticia Editada" })).toBeVisible();
  await expect(page.getByText("000 333 444")).toBeVisible();

  await page.reload();
  await page.getByRole("searchbox").fill("QA-08A-001");
  await expect(page.getByText("Prueba Ficticia Editada")).toBeVisible();
  await expect(page.getByText("1 de 3 pacientes ficticios")).toBeVisible();
  await page.getByRole("button", { name: "Ver ficha" }).click();
  await expect(page.getByText("000 333 444")).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "sin desplazamiento horizontal").toBeLessThanOrEqual(0);
});

test("08-A: documento duplicado no se acepta", async ({ page }) => {
  await page.goto("/admin/pacientes");
  await page.getByRole("button", { name: /Nuevo paciente/ }).click();
  await page.getByLabel("Nombre *").fill("Otro");
  await page.getByLabel("Apellido *").fill("Ficticio");
  await page.getByLabel("Documento ficticio *").fill("DEMO-001");
  await page.getByRole("button", { name: "Guardar paciente" }).click();
  await expect(page.getByRole("alert")).toContainText("Ya existe un paciente");
});
