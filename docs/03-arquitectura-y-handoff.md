# 03 — Arquitectura y traspaso a desarrollo

## Recorrido principal

1. Paciente crea solicitud ficticia → `Recibida`.
2. Administración ve la solicitud una sola vez → asigna profesional disponible → `Asignada`.
3. Administración confirma franja → `Confirmada`.
4. Profesional asignado ve la visita, la inicia → `En visita`.
5. Profesional guarda registro **simulado**, finaliza → `Finalizada`.
6. Paciente y administración ven el nuevo estado.

Cancelación: prevista desde estados permitidos por el reducer. Urgencias: ruta separada, **nunca** crear solicitud programada.

## Navegación planeada (E03-A)

**Entrada:** `/demo` selector paciente/profesional/administración.

**Paciente:** `/paciente`, `/paciente/servicios`, `/paciente/servicios/[id]`, `/paciente/solicitar`, `/paciente/solicitudes`, `/paciente/solicitudes/[id]`, `/paciente/solicitudes/[id]/confirmacion`, `/paciente/familiares`, `/paciente/perfil`, `/paciente/urgencia`.

**Profesional:** `/profesional`, `/profesional/agenda`, `/profesional/visitas/[id]`, `/profesional/visitas/[id]/registro`, `/profesional/visitas/[id]/finalizar`, `/profesional/perfil`.

**Administración:** `/admin`, `/admin/solicitudes`, `/admin/solicitudes/[id]`, `/admin/agenda`, `/admin/profesionales`, `/admin/profesionales/[id]`, `/admin/asignaciones`, `/admin/pacientes`, `/admin/pacientes/[id]`, `/admin/indicadores`, `/admin/urgencias`.

Inventario E03-A: **28 pantallas** (1 común, 10 pacientes, 6 profesionales, 11 administración). No todas pertenecen a la primera entrega.

## Estructura prevista

Next.js App Router; `app/` rutas por rol; `components/shell`, `components/ui`, `components/data`, `components/domain`; `features/solicitudes`, `features/agenda`, `features/asignaciones`, `features/visitas`, `features/urgencias`; `lib/store`, `lib/fixtures`, `lib/types`, `lib/permisos`, `lib/theme`; `tests/unit`, `tests/e2e`.

Store compartido `useReducer` + contexto con acciones tipadas. Cambios de perfil preservan estado; recarga lo conserva en `localStorage`; reset restaura fixtures. No hay sincronización entre navegadores.

## Entregas reportadas

**E03-B (commit local `6f6b0e6`):** base técnica, selector, pacientes (inicio, solicitar, confirmación, solicitudes, seguimiento, urgencias), estado persistente. Claude reportó 15 unitarias y 6 E2E aprobadas, además de build/lint. Estos resultados fueron reportados, no certificados por un CI remoto.

**E03-C (commit local `03fbbd8`, mismo historial):** dashboard, solicitudes con filtros, detalle, asignación y confirmación separadas, agenda, profesionales ficticios, urgencias separadas. En móvil administración solo lectura. Claude reportó 21 unitarias, 9 E2E aprobadas y 1 omitida por diseño; build/lint/TypeScript correctos. No hay publicación Vercel.

**E03-D (pendiente):** profesional ve solo sus visitas asignadas, agenda, inicio de visita confirmada, registro ficticio, finalización, reflejo en paciente y administración.

**E03-E:** pruebas del recorrido integrado. **E03-F:** QA final y despliegue solo con autorización.

## Aceptación mínima

- Formularios obligatorios validados, sin doble envío.
- Estados coherentes y transiciones inválidas rechazadas.
- No asignar profesional indisponible.
- No iniciar visita sin confirmación.
- Profesional no ve visitas ajenas.
- Urgencias nunca en la cola programada.
- Restablecimiento y persistencia comprobados.
- Sin desplazamiento horizontal en 390 px y 1440 px, botones táctiles adecuados, estados no solo por color, foco visible.
- Build, lint, tipos, unitarias y Playwright; capturas de evidencia.
- Ningún servicio ni funcionalidad se presenta como aprobado por Vitalis.

## Regla de integración Git

No sobrescribir `main` ni reescribir commits de Claude. Subir su rama de desarrollo conservando historial y revisar antes de integrar. Esta documentación vive en rama independiente.
