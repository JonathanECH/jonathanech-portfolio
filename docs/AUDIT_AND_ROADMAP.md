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
| **P1.1** | **Educación, Cronología y Fechas Oficiales** | **COMPLETADO** | Contextualizado TSU en Informática con institución y equivalencia internacional (`IUTEPAL • Associate Degree in CS`). Agregados idiomas en entorno (`Español Nativo • Inglés B1`). Fechas oficiales actualizadas: **ERP Lubriken** (Julio 2026 – Noviembre 2026) y **TilyShop Inventory** (Octubre 2026 – Noviembre 2026). |
| **P1.2** | **Simplificación del Stack** | **COMPLETADO** | Se limpiaron los wrappers decorativos (`<Vue 3>` → `Vue 3`, `[TypeScript]` → `TypeScript`, `{ Tailwind CSS }` → `Tailwind CSS`, `(Pinia)` → `Pinia`, etc.) dejando nombres directos, profesionales y escaneables para reclutadores y sistemas ATS. |
| **P1.3** | **Metadatos SEO, Open Graph y Enrutamiento** | **COMPLETADO** | Creados `public/robots.txt`, `public/sitemap.xml` y `vercel.json` (rewrites SPA para evitar 404 en refrescos de `/proyectos/:slug`). Añadidas etiquetas Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`), Twitter Cards y `canonical` en `index.html`. Sincronización reactiva de OG tags por ruta e idioma en `src/App.vue`. |
| **P1.4** | **Optimización de Assets** | **COMPLETADO** | `public/favicon.svg` optimizado de 457 KB a 1.1 KB (reducción del 99.8%) retirando bitmaps y metadatos no visibles de Inkscape, manteniendo el vector exacto del logo ECH. |
| **P1.5** | **Tipografías y Legibilidad** | **COMPLETADO** | Jerarquía tipográfica revisada con tokens de alto contraste y legibilidad validada en temas claro y oscuro. |

---

## Fase P2 — Pulido y Evidencia Externa

| Ítem | Descripción | Estado | Detalle técnico |
| :--- | :--- | :---: | :--- |
| **P2.1** | **Enlaces a Repositorios Públicos Reales** | **PENDIENTE** | Enlazar proyectos públicos del usuario como complementos de código visible. |
| **P2.2** | **CV en PDF Actualizado** | **PENDIENTE** | Asegurar coherencia entre el CV descargable y los datos de la web. |
| **P2.3** | **Verificación Integral CI/Local** | **PENDIENTE** | Ejecutar pipeline `pnpm verify` y script de verificación de enlaces. |

