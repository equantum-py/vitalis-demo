# Vitalis · Demo funcional

**DEMO · datos completamente ficticios.** Aplicación de demostración comercial para Vitalis (Salta, Argentina). No procesa información médica real, no se conecta a servicios hospitalarios ni a sistemas de Vitalis o del Gobierno de Salta, no tiene autenticación real, no incluye pagos ni recetas electrónicas. Las funcionalidades son propuestas sujetas a validación con Vitalis.

Elaborada por **eQuantum Consulting Group**.

## Documentación del proyecto

El expediente de investigación, decisiones y arquitectura está en [`docs/`](docs/README.md):

1. [Contexto, visión y alcance](docs/01-contexto-y-vision.md)
2. [Decisiones, seguridad y limitaciones](docs/02-decisiones-y-riesgos.md)
3. [Arquitectura, pantallas y flujo](docs/03-arquitectura-y-handoff.md)
4. [Registro de documentos fuente](docs/04-fuentes-y-entregables.md)

Estos documentos son un resumen de traspaso. No sustituyen los archivos originales (E01, guion, presentación y contrato E03-A).

## Estado de la entrega

| Etapa | Alcance | Estado |
|---|---|---|
| E03-A | Arquitectura de la demo (decisiones D1–D6) | Aprobada |
| E03-B | Base técnica, estado compartido, módulo de **Pacientes** | Implementado |
| E03-C | Módulo de **Administración**: dashboard, solicitudes, asignación, confirmación de franja, agenda, profesionales, urgencias | Implementado |
| E03-D | Módulo de **Profesionales**: inicio, agenda, visita, registro simulado y finalización | Implementado |
| E03-E | Integración y control de calidad: recorrido completo, auditoría responsive y de accesibilidad, pruebas | Completado |
| E03-F | Publicación en Vercel | **Pendiente de aprobación** |

Fuera de alcance de la demo, sin fecha: familiares autorizados, mi perfil del paciente, firma digital y cualquier integración con sistemas reales.

## Instalación y ejecución

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev              # desarrollo en http://localhost:3000
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start -- -p 3100` | Sirve el build de producción (lo usan las pruebas E2E) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Verificación de tipos TypeScript |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run test:e2e` | Pruebas de extremo a extremo (Playwright) |

Para las pruebas E2E, Playwright necesita un navegador Chromium. Si ya existe uno instalado:

```bash
CHROMIUM_PATH=/ruta/al/chrome npm run test:e2e
```

De lo contrario, `npx playwright install chromium` (una sola vez).

Las pruebas E2E corren en **390 px** (móvil, con dispositivo táctil) y **1440 px** (escritorio). La auditoría responsive corre además en **768 px** y **1024 px**.

## Recorrido comercial

Abrir `/demo` y elegir un perfil. Los tres perfiles comparten el mismo estado en el navegador, así que cualquier cambio hecho en un perfil se ve en los otros.

1. **Pacientes y familias.** Solicitar atención domiciliaria. Se genera un código de demostración (p. ej. `SOL-001`) y se puede consultar el seguimiento. La opción **Urgencia** registra una orientación en un registro separado y **no crea solicitudes**.
2. **Administración y coordinación.** Revisar solicitudes recibidas, asignar un profesional disponible y confirmar la franja horaria. Son acciones separadas. Los profesionales no disponibles no se pueden elegir. La agenda muestra las visitas por profesional y franja.
3. **Profesionales.** Elegir el profesional activo, ver su agenda, iniciar una visita confirmada, registrar observaciones e indicaciones ficticias y finalizar. Al finalizar, el registro queda cerrado.

Los cambios de estado aparecen de inmediato en pacientes y administración. El botón **Restablecer demo** (en `/demo`) borra todos los datos guardados en el navegador.

## Reglas de negocio

- **Urgencias separadas.** Nunca entran en la cola de solicitudes programadas. No hay detección ni clasificación automática: la orientación se registra solo cuando la persona la elige.
- **Asignación y confirmación separadas.** Asignar profesional pasa la solicitud a «Asignada»; confirmar la franja, a «Confirmada».
- **Visitas restringidas.** Solo el profesional asignado ve y opera su visita, y solo se inicia una visita con franja confirmada.
- **Registros cerrados.** Un registro finalizado no se puede modificar ni volver a finalizar.
- **Información separada.** Administración no ve observaciones clínicas simuladas. Pacientes no ven el registro de la visita. La firma digital no está implementada: en la interfaz aparece solo como función futura.
- **Transiciones válidas.** `recibida → asignada → confirmada → en_visita → finalizada`. Se puede cancelar solo mientras la solicitud está recibida o asignada.
- **Selección de perfil simulada.** No hay inicio de sesión real: el perfil solo define por dónde empieza el recorrido.

## Herramienta de pruebas

`/demo?pruebas=1` muestra una herramienta de atajo para asignar y confirmar sin pasar por el panel de administración. **No aparece en el recorrido comercial** y solo la usan las pruebas automatizadas y el desarrollo. Antes de publicar, debe seguir sin enlaces visibles.

## Pruebas

Resultados de la última verificación (E03-E):

| Verificación | Resultado |
|---|---|
| TypeScript (`tsc --noEmit`) | Sin errores |
| ESLint | Sin errores |
| Vitest (unitarias) | 41 de 41 pasan |
| Build de producción | Compila todas las rutas |
| Playwright (E2E) | Pasan todas las pruebas aplicables a cada viewport; las omitidas corresponden a pruebas de escritorio que no corren en móvil |

Cobertura principal:
- `tests/unit/`: reducer (transiciones válidas e inválidas), validación de solicitudes y de registro, selectores de administración y de profesionales.
- `tests/e2e/demo.spec.ts`: selector comercial sin herramienta de atajo visible, y herramienta solo con `?pruebas=1`.
- `tests/e2e/paciente.spec.ts`: flujo de paciente, urgencias, persistencia tras recargar, restablecimiento y cambio de perfil.
- `tests/e2e/admin.spec.ts`: solicitud única en administración, flujo hasta «Confirmada», filtros, profesionales no disponibles, urgencias separadas, aviso de solo lectura en móvil.
- `tests/e2e/profesional.spec.ts`: recorrido entre los tres perfiles, restricción por profesional, registro bloqueado y persistencia.
- `tests/e2e/recorrido.spec.ts`: recorrido completo de punta a punta con el panel de administración real (escritorio).
- `tests/e2e/auditoria.spec.ts`: 17 pantallas en los cuatro viewports, con control de desbordamiento horizontal y accesibilidad (axe, WCAG 2.x A/AA).

Las capturas están en `tests/e2e/capturas/`, y la auditoría en `tests/e2e/capturas/auditoria/`.

## Arquitectura

- **Next.js** (App Router) con **React** y **TypeScript**. Estilos con **Tailwind CSS**. Tipografías autoalojadas con `@fontsource`, sin fuentes externas en tiempo de ejecución.
- **Estado compartido** en `lib/store.tsx`, con un reducer puro (`lib/reducer.ts`). Todas las reglas de negocio están en el reducer, así que la interfaz no puede saltárselas.
- **Persistencia** en `localStorage` con versión de esquema y validación al leer (`lib/persistencia.ts`). Si el almacenamiento no está disponible, la demo sigue funcionando en memoria.
- **Datos ficticios** en `lib/fixtures.ts`: una paciente, tres profesionales y dos franjas.

```
app/
  demo/          selector de perfiles y restablecimiento
  paciente/      inicio, solicitar, mis solicitudes, seguimiento, confirmación, urgencia
  admin/         dashboard, solicitudes, agenda, profesionales, urgencias
  profesional/   inicio, agenda, visita (registro y finalización)
components/      componentes compartidos y de cada perfil
lib/             tipos, reducer, persistencia, validaciones, selectores, datos ficticios
tests/unit/      pruebas unitarias (Vitest)
tests/e2e/       pruebas de extremo a extremo, auditoría y capturas (Playwright)
docs/            expediente del proyecto
```

## Limitaciones conocidas

- Los datos y el estado viven solo en el navegador. No hay backend, base de datos compartida ni sincronización entre personas o dispositivos.
- Las franjas, profesionales y pacientes son fijos y ficticios.
- No hay autenticación: el perfil se elige, no se verifica.
- La firma digital del registro es solo visual y no tiene validez.
- La administración en móvil (menor a 1024 px) es de solo lectura, por diseño (decisión D1).
- La paleta, el logo y el nombre de la aplicación son provisorios (decisión D6).

## Decisiones aplicadas (E03-A aprobado)

- **D1.** Administración optimizada para escritorio. En móvil, tarjetas de solo lectura con aviso.
- **D2.** Persistencia en `localStorage`, con botón para restablecer la demo.
- **D3.** Perfiles y datos completamente ficticios.
- **D4.** Next.js estable, TypeScript y Tailwind CSS.
- **D5.** Repositorio de GitHub autorizado. Sin publicación en producción hasta aprobación (E03-F).
- **D6.** Identidad visual provisoria, basada en la presentación aprobada.

## Publicación

No publicado en Vercel. La publicación (E03-F) requiere aprobación de eQuantum Consulting Group.
