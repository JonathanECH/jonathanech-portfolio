# Seguimiento de Auditoría y Mejoras del Portafolio

Este documento registra las acciones realizadas y pendientes para transformar el portafolio en una presentación profesional, honesta, creíble y verificable para reclutadores y líderes técnicos.

---

## Estado General

- **Rama activa:** `fix/portfolio-credibility-p0`
- **Fecha de inicio:** 9 de noviembre de 2026
- **Objetivo:** Credibilidad en 30–60 segundos, enlaces funcionales, posicionamiento claro como Frontend Engineer y paridad completa ES/EN.

---

## Fase P0 — Fallas Vulnerables y Credibilidad Crítica

| Ítem | Descripción | Estado | Detalle técnico |
| :--- | :--- | :---: | :--- |
| **P0.1** | **Whitepaper Técnico Real** | **COMPLETADO** | Se instaló el documento técnico real de 8 páginas (196 KB) de TilyShop Inventory en `public/docs/tilyshop-whitepaper.pdf`. El botón de descarga en el detalle de proyecto permanece activo y funcional. |
| **P0.2** | **Eliminación de Enlaces Rotos** | **COMPLETADO** | Se removieron las URLs inexistentes `.demo` y enlaces a repositorios 404 en los 3 proyectos (`src/data/portfolio.ts` y `portfolio.en.ts`). Los componentes ya ocultan condicionalmente los botones cuando `demo` o `repo` no están definidos. |
| **P0.3** | **Sustitución de Hosts Ficticios (.live)** | **COMPLETADO** | Se cambiaron `*.live` por identificadores contextuales de caso de estudio (`app.tilyshop.internal`, `clinica.local`, `erp.local`) en el HUD de galería y tarjetas. |
| **P0.4** | **Honestidad en Estados y Clientes** | **COMPLETADO** | Se reemplazó el estado "EN PRODUCCIÓN" por "CASO DE ESTUDIO" / "CASE STUDY". Se contextualizaron los clientes hacia sectores de aplicación reales sin inventar entidades B2B. |
| **P0.5** | **Contextualización de Métricas** | **COMPLETADO** | Se actualizaron las notas de consistencia (`consistencyNote`) de los 3 proyectos, explicando que las métricas corresponden a benchmarks en entornos de prueba y sincronización offline documentada en el whitepaper técnico. |
| **P0.6** | **Posicionamiento Profesional Claro** | **COMPLETADO** | Se unificó el rol a "Desarrollador Frontend / Frontend Engineer", se eliminó "ARQUITECTO DE SOFTWARE" del titular (cambiado a `['DESARROLLADOR WEB', 'FRONTEND ENGINEER']`), se explicitó la zona horaria (`UTC-4 (Barquisimeto, Venezuela)`), disponibilidad remota inmediata y posicionamiento claro Junior/Mid en bio y estadísticas de perfil. |
| **P0.7** | **Actualización de Tests de Paridad** | **COMPLETADO** | Se sincronizaron `src/stores/portfolio.spec.ts` e `src/i18n/i18n.spec.ts`. La suite completa pasa al 100% (35/35 pruebas) junto a `vue-tsc` y `vite build`. |

---

## Fase P1 — Enriquecimiento de Información y SEO

| Ítem | Descripción | Estado | Detalle técnico |
| :--- | :--- | :---: | :--- |
| **P1.1** | **Educación y Cronología** | **PENDIENTE** | Contextualizar TSU en Informática para reclutadores internacionales (Associate Degree in Computer Science) y detallar cronología formativa. |
| **P1.2** | **Simplificación del Stack** | **PENDIENTE** | Limpiar nombres cosméticos (`<Vue 3>`, `[TypeScript]`) por nombres directos y ordenar el stack priorizando el Core Frontend defendible en entrevista. |
| **P1.3** | **Metadatos SEO y Open Graph** | **PENDIENTE** | Añadir etiquetas `og:title`, `og:description`, `og:image`, `og:url`, `canonical`, `robots.txt` y `sitemap.xml`. |
| **P1.4** | **Optimización de Assets** | **PENDIENTE** | Optimizar tamaño de favicon y validar que no existan recursos sobredimensionados. |
| **P1.5** | **Tipografías y Legibilidad** | **PENDIENTE** | Revisar tamaños de texto mínimos (9–11px) en datos clave para asegurar lectura fluida. |

---

## Fase P2 — Pulido y Evidencia Externa

| Ítem | Descripción | Estado | Detalle técnico |
| :--- | :--- | :---: | :--- |
| **P2.1** | **Enlaces a Repositorios Públicos Reales** | **PENDIENTE** | Enlazar proyectos públicos del usuario como complementos de código visible. |
| **P2.2** | **CV en PDF Actualizado** | **PENDIENTE** | Asegurar coherencia entre el CV descargable y los datos de la web. |
| **P2.3** | **Verificación Integral CI/Local** | **PENDIENTE** | Ejecutar pipeline `pnpm verify` y script de verificación de enlaces. |

