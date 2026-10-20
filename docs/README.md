# Vitalis Salta — expediente del proyecto

**Proyecto:** demo conceptual de atención domiciliaria para Vitalis (Salta, Argentina).  
**Consultora:** eQuantum Consulting Group.  
**Fecha de corte:** 20 de octubre de 2026.  
**Estado:** investigación E01 cerrada documentalmente; E03-B Pacientes, E03-C Administración y E03-D Profesionales implementados; E03-E integración y QA completada según pruebas reportadas por el desarrollador; E03-F despliegue pendiente. Ninguna funcionalidad clínica ni alcance de MVP fue aprobado por Vitalis.

## Empezar por aquí

1. [Contexto, visión y alcance](01-contexto-y-vision.md)
2. [Decisiones, seguridad y limitaciones](02-decisiones-y-riesgos.md)
3. [Arquitectura, pantallas y flujo](03-arquitectura-y-handoff.md)
4. [Registro de documentos fuente](04-fuentes-y-entregables.md)

**Importante:** estos documentos son un resumen de traspaso elaborado a partir del expediente de trabajo; **no sustituyen los archivos originales** E01, guion, presentación y contrato E03-A. No interpretar hipótesis como hechos comprobados ni esta demo como un producto sanitario operativo.

## Para el desarrollador

La demo usa Next.js, React, TypeScript, Tailwind y estado local ficticio. Debe permitir alternar tres perfiles en un mismo navegador: paciente, administración y profesional. El flujo central es crear solicitud programada → asignar profesional → confirmar franja → iniciar visita ficticia → finalizar → consultar seguimiento.

No integrar datos clínicos reales, autenticación real, pagos, recetas, videollamadas, geolocalización real ni sistemas externos. Urgencias deben quedar separadas de solicitudes programadas.

**Repositorio:** el código se desarrolló en `e03-b-construccion-inicial` y se combinó con el expediente documental en `integracion/e03-e-documentacion`, PR #2 hacia `main`. El historial original está conservado. La publicación comercial y el backend real no están incluidos.

## Estado de aprobación

- E01: aprobado **solo** como investigación documental.
- Reunión de descubrimiento: guion preparado, presentación comercial de diez diapositivas aprobada provisionalmente.
- E03-A: arquitectura de demo aprobada con ajustes.
- E03-B: pacientes implementado (pruebas reportadas por Claude).
- E03-C: administración implementada (pruebas reportadas por Claude).
- E03-D: profesionales implementado (pruebas reportadas por Claude).
- E03-E: integración y QA completadas en la rama de integración; 41 unitarias y 86 E2E aprobadas, 2 omitidas por diseño, según reporte de Claude. No equivale a una certificación independiente.
- E03-F: despliegue de demostración pendiente de aprobación.
