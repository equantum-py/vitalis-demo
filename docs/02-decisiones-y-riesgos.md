# 02 — Decisiones, riesgos y límites

## Evidencia y límites de investigación E01

- La existencia legal de Vitalis Salta, su razón social y habilitaciones **no fueron verificadas**.
- Acceso automatizado a Instagram, TeleSalud de Salta y algunas páginas del Hospital San Bernardo fue limitado; ausencia de observación no significa ausencia de servicios.
- Estudios de conducta digital específicos de pacientes salteños fueron insuficientes; extrapolaciones de otras provincias son hipótesis.
- Referencias comparadas incluyeron Heal, URG Móvil, Vittal, PAMI, CPCE Córdoba, OSDE, Swiss Medical y Hospital Italiano. Algunas fuentes eran históricas (2015–2021) y no prueban funciones vigentes.
- El expediente E01 corrigió 22 afirmaciones que usaban fuentes históricas como situación actual.
- La guía de habilitación domiciliaria encontrada era de **CABA**, no debe aplicarse automáticamente a Salta.
- Se identificaron referencias a Ley 26.529, Ley 27.553, Ley 25.326, Ley 26.061, normativa de Salta sobre telesalud y Resolución 2214/2025. **No hay dictamen legal ni revisión normativa exhaustiva**; no afirmar que una resolución aislada cubre telemedicina o cumplimiento sanitario.

## Decisiones aprobadas para la demo (no producción)

- Next.js + TypeScript + Tailwind; fuentes autoalojadas.
- Sin backend ni base de datos remota; store compartido con fixtures ficticios.
- `localStorage` para conservar cambios entre recargas en **un solo navegador** y botón «Restablecer demo». No hay sincronización entre equipos.
- Selector de roles ficticios; **no es autenticación ni autorización real**.
- Pacientes/profesionales mobile-first; administración escritorio, en 390 px tarjetas de solo lectura.
- Paleta provisional verde petróleo/blanco/gris; reemplazar por identidad oficial solo cuando el cliente la facilite.
- Urgencias fuera de la cola programada; no diagnóstico, triaje ni detección automática. Orientar al servicio de emergencias, sin prometer respuesta de Vitalis.
- No datos personales reales, registros clínicos reales, recetas, pagos, telemedicina, integración hospitalaria, geolocalización real ni almacenamiento clínico offline.
- Etiqueta visible «DEMO» y servicios «a confirmar por Vitalis».
- Asignación de profesional y confirmación de franja son **dos acciones distintas**.

## Modelo conceptual de permisos futuros

Separar información administrativa, logística, clínica, financiera y de auditoría. Los permisos clínicos reales requieren rol, relación asistencial, paciente asignado, finalidad legítima y controles de acceso/auditoría del servidor. Familiares ven logística por defecto; cualquier acceso clínico exige autorización y revisión legal/médica. Los filtros de interfaz de la demo **no protegen datos reales**.

## Riesgos antes de producto real

1. Validación de identidad, habilitaciones y servicios de Vitalis.
2. Dirección médica: protocolos de urgencias, asignación, registro y firma.
3. Abogado sanitario/privacidad: normativa aplicable, consentimiento, datos sensibles, receta/historia clínica.
4. Infraestructura: autenticación, cifrado, acceso por paciente asignado, auditoría, backup y gestión de incidentes.
5. Pruebas de conectividad, iOS, notificaciones, ubicación y accesibilidad antes de decidir PWA versus nativa.
6. No incorporar offline clínico sin evaluación formal de seguridad.
7. No reutilizar esta demo pública como plataforma asistencial real.
