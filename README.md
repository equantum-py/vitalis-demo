# Vitalis · Demo funcional (E03-B)

**DEMO · datos completamente ficticios.** Esta aplicación es una demostración comercial. No procesa información médica real, no se conecta a servicios hospitalarios ni a sistemas de Vitalis o del Gobierno de Salta, no tiene autenticación real y no incluye pagos ni recetas electrónicas. Las funcionalidades son propuestas sujetas a validación con Vitalis.

## Estado de la entrega

| Módulo | Estado |
|---|---|
| Base técnica: Next.js, TypeScript, Tailwind, componentes compartidos, navegación responsive | Implementado |
| Estado compartido con persistencia en `localStorage` y restablecimiento | Implementado |
| Selector de perfiles (demo) | Implementado |
| Pacientes: inicio, solicitar, confirmación, mis solicitudes, seguimiento, orientación de urgencias | Implementado |
| Profesionales (E03-D) | Pendiente (marcador "En construcción") |
| Administración (E03-C) | Pendiente (marcador "En construcción"). El estado compartido ya está preparado para su integración |
| Familiares autorizados, mi perfil (pacientes) | Pendiente |
| Recorrido completo y despliegue (E03-E, E03-F) | Pendiente |

## Ejecutar la demo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev          # desarrollo en http://localhost:3000
```

Build de producción y pruebas:

```bash
npm run build
npm run lint
npm test             # pruebas unitarias (Vitest)
npx playwright install chromium   # solo la primera vez
npm run test:e2e     # pruebas de extremo a extremo en 390 px y 1440 px
```

Si ya existe un navegador Chromium instalado, puede indicarse con `CHROMIUM_PATH=/ruta/al/chrome npm run test:e2e`.

## Recorrido sugerido

1. Abrir `/demo` y elegir **Pacientes y familias**.
2. Crear una solicitud desde **Solicitar**. Se genera un código de demostración (p. ej. `SOL-001`).
3. Consultar el seguimiento desde **Mis solicitudes**.
4. En `/demo`, la herramienta de prueba asigna un profesional y confirma la franja. Esa herramienta es temporal y será reemplazada por el panel de administración en E03-C.
5. Volver a pacientes y comprobar el estado actualizado.
6. Probar **Urgencia**: registra una orientación en un registro separado y **no crea solicitudes**.

## Decisiones aplicadas (E03-A aprobado)

- **D1:** la administración en móvil será de solo lectura en tarjetas (pendiente de E03-C).
- **D2:** persistencia en `localStorage`, con botón para restablecer la demo.
- **D3:** perfiles y datos completamente ficticios.
- **D4:** Next.js estable, TypeScript y Tailwind CSS.
- **D6:** identidad visual provisoria, basada en la presentación aprobada.

## Reglas de la demo

- Las urgencias nunca entran en la cola de solicitudes programadas. No hay detección ni clasificación automática: la urgencia se registra solo cuando la persona la elige.
- La asignación de profesional y la confirmación de la franja son acciones separadas en el estado compartido.
- Ninguna pantalla presenta una función como aprobada por Vitalis.
- No se usan fuentes externas en tiempo de ejecución: las tipografías están autoalojadas (`@fontsource`).

## Estructura

```
app/            rutas (demo, paciente, profesional, admin)
components/     componentes compartidos
lib/            tipos, datos ficticios, reducer puro, persistencia, validación
tests/unit/     pruebas del reducer y validación
tests/e2e/      pruebas de extremo a extremo y capturas en 390 px y 1440 px
```
