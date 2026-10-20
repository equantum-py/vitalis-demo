import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const OBS = "Observación ficticia del recorrido completo";

function visiblesCon(page: Page, codigo: string) {
  return page.locator("td:visible, span:visible, p:visible").filter({ hasText: new RegExp(`^${codigo}$`) });
}

/**
 * Recorrido de punta a punta usando el panel de administración real (no la herramienta de atajo).
 * Se ejecuta en escritorio porque la asignación es una acción de escritorio por diseño (D1).
 */
test("recorrido completo: paciente, administración, profesional y estado final en cada perfil", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "escritorio-1440", "La asignación administrativa es de escritorio (D1).");

  // 1. Paciente solicita atención domiciliaria ficticia
  await page.goto("/paciente");
  await expect(page.getByRole("heading", { name: "Hola, Ana" })).toBeVisible();
  await page.goto("/paciente/solicitar");
  await page.getByLabel("Motivo de la solicitud").fill("Atención domiciliaria de control (dato ficticio)");
  await page.getByLabel("Dirección de la visita").fill("Calle Ficticia 123");
  await page.getByLabel("Teléfono de contacto").fill("000 000 0000");
  await page.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page).toHaveURL(/SOL-001\/confirmacion$/);

  // 2. Administración recibe la solicitud (aparece una sola vez)
  await page.goto("/admin/solicitudes");
  await expect(visiblesCon(page, "SOL-001")).toHaveCount(1);
  await page.goto("/admin/solicitudes/SOL-001");
  await expect(page.getByText("Recibida", { exact: true }).first()).toBeVisible();

  // 3. Administración asigna un profesional disponible (no puede elegir el no disponible)
  await expect(page.getByRole("option", { name: /Profesional Demo C/ })).toBeDisabled();
  await page.getByLabel("Profesional disponible").selectOption("prof-demo-a");
  await page.getByRole("button", { name: "Asignar profesional" }).click();
  await expect(page.getByRole("status")).toContainText("quedó en estado Asignada");

  // 4. Administración confirma la franja (acción separada)
  await page.getByLabel("Franja a confirmar").selectOption("Mañana · franja de demostración");
  await page.getByRole("button", { name: "Confirmar franja" }).click();
  await expect(page.getByRole("status")).toContainText("quedó en estado Confirmada");

  // 5. Profesional ve la visita en su agenda y la inicia
  await page.goto("/profesional/agenda");
  await expect(visiblesCon(page, "SOL-001")).toHaveCount(1);
  await page.goto("/profesional/visitas/SOL-001");
  await page.getByRole("button", { name: "Iniciar visita" }).click();

  // 6. Registro simulado y finalización
  await page.getByLabel("Observaciones (texto ficticio)").fill(OBS);
  await page.getByRole("button", { name: "Guardar registro" }).click();
  await page.getByRole("button", { name: "Finalizar visita" }).click();
  await expect(page.getByRole("status")).toContainText("Visita finalizada");

  // 7. Paciente ve el estado final, sin registro clínico
  await page.goto("/paciente/solicitudes/SOL-001");
  await expect(page.getByText("Finalizada", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("La visita fue finalizada. Gracias por usar la demostración.")).toBeVisible();
  await expect(page.getByText(OBS)).toHaveCount(0);

  // 8. Administración ve el estado final, sin registro clínico, y no hay duplicados
  await page.goto("/admin/solicitudes/SOL-001");
  await expect(page.getByText("Finalizada", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(OBS)).toHaveCount(0);
  await page.goto("/admin/solicitudes");
  await expect(visiblesCon(page, "SOL-001")).toHaveCount(1);
  await expect(page.getByText(/^SOL-002$/)).toHaveCount(0);
  await expect(page.getByText(/URG-/)).toHaveCount(0);

  // 9. Profesional: la visita figura finalizada y bloqueada
  await page.goto("/profesional/visitas/SOL-001");
  await expect(page.getByRole("button", { name: "Guardar registro" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Finalizar visita" })).toHaveCount(0);
  await expect(page.getByText(OBS)).toBeVisible();
});
