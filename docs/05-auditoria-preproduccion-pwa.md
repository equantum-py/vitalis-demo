# Vitalis — auditoría de preproducción y PWA (23/10/2026)

## Alcance
Preparación para **pruebas controladas** en Vercel. No es autorización ni certificación para atención médica real.

## Evidencia
- El usuario confirmó build y ESLint correctos en Codespaces antes de incorporar PWA.
- El repositorio incluye Vitest y Playwright, pero las pruebas posteriores a estos cambios **todavía no se ejecutaron**.
- La identidad visual está parcialmente unificada; requiere QA visual de todos los recorridos.

## Hallazgos críticos
1. Autenticación de Personas/Profesionales: credenciales de prueba definidas en el frontend. No es un control de acceso real.
2. Administración: acceso desde la pantalla de inicio sin verificación de identidad.
3. Estado: `localStorage` por navegador; no hay backend ni sincronización entre usuarios.
4. No se deben cargar datos personales, clínicos ni pacientes reales en este prototipo.
5. El registro de service worker solo se hace en builds de producción. Cachea exclusivamente imágenes estáticas; las páginas y sus datos no se cachean.
6. El manifiesto y el icono SVG están incorporados. Para máxima compatibilidad Android/iOS faltan iconos PNG cuadrados 192×192, 512×512 y Apple Touch Icon 180×180 derivados del logo oficial. El icono SVG es provisional.
7. La instalación requiere HTTPS y compatibilidad del navegador; el botón se muestra solo si el navegador emite `beforeinstallprompt`; iOS muestra instrucciones de Safari.
8. El modo sin conexión no está habilitado para formularios ni flujos de atención: no prometer funcionalidad offline.

## Bloqueos para apertura pública
- Autenticación y autorización reales, por rol y servidor.
- Persistencia segura, consentimiento, políticas de privacidad y controles de acceso para información médica.
- Auditoría de seguridad, flujos y QA responsive/E2E en el despliegue HTTPS.
- Iconos PWA definitivos y comprobación de instalación Android/iOS.

## Puerta de salida para preview de pruebas
1. `npm run build`
2. `npm run lint`
3. `npm test`
4. `npm run test:e2e` con Chromium disponible.
5. Revisar `/manifest.webmanifest` (Next.js App Router manifest) y `/sw.js` en HTTPS.
6. Probar Personas, Profesionales y Administración únicamente con datos ficticios.
7. Probar instalación y apertura standalone en Android Chrome y iPhone Safari.
8. Validar permisos y privacidad del proyecto Vercel antes de habilitar el enlace.
9. Publicar primero preview protegido; no promover a dominio público hasta aprobación explícita.

## Despliegue
- Framework: Next.js. Comando build: `npm run build`.
- No requiere variables de entorno para los datos ficticios actuales.
- Mantener `robots: noindex, nofollow`.
- No usar el nombre «producción clínica» para esta entrega.
