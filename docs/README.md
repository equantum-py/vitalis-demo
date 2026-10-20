# Vitalis Salta — expediente del proyecto

**Proyecto:** demo conceptual de atención domiciliaria para Vitalis (Salta, Argentina).  
**Consultora:** eQuantum Consulting Group.  
**Fecha de corte:** 20 de octubre de 2026.  
**Estado:** investigación E01 cerrada documentalmente; demo E03-B y E03-C desarrolladas localmente por Claude; E03-D pendiente. Ninguna funcionalidad clínica ni alcance de MVP fue aprobado por Vitalis.

## Empezar por aquí

1. [Contexto, visión y alcance](01-contexto-y-vision.md)
2. [Decisiones, seguridad y limitaciones](02-decisiones-y-riesgos.md)
3. [Arquitectura, pantallas y flujo](03-arquitectura-y-handoff.md)
4. [Registro de documentos fuente](04-fuentes-y-entregables.md)

**Importante:** estos documentos son un resumen de traspaso elaborado a partir del expediente de trabajo; **no sustituyen los archivos originales** E01, guion, presentación y contrato E03-A. No interpretar hipótesis como hechos comprobados ni esta demo como un producto sanitario operativo.

## Para el desarrollador

La demo usa Next.js, React, TypeScript, Tailwind y estado local ficticio. Debe permitir alternar tres perfiles en un mismo navegador: paciente, administración y profesional. El flujo central es crear solicitud programada → asignar profesional → confirmar franja → iniciar visita ficticia → finalizar → consultar seguimiento.

No integrar datos clínicos reales, autenticación real, pagos, recetas, videollamadas, geolocalización real ni sistemas externos. Urgencias deben quedar separadas de solicitudes programadas.

**Repositorio:** la rama de código que Claude prepara es `e03-b-construccion-inicial`, con commits locales reportados `6f6b0e6` (E03-B) y `03fbbd8` (E03-C). Este paquete documental se publica por separado para no interferir con la subida de esa rama.

## Estado de aprobación

- E01: aprobado **solo** como investigación documental.
- Reunión de descubrimiento: guion preparado, presentación comercial de diez diapositivas aprobada provisionalmente.
- E03-A: arquitectura de demo aprobada con ajustes.
- E03-B: implementación de pacientes entregada y verificada por Claude; revisión externa parcial.
- E03-C: administración entregada y pruebas reportadas por Claude; revisión externa parcial.
- E03-D: profesionales, por construir.
- E03-E/F: integración final, QA y publicación, pendientes.
