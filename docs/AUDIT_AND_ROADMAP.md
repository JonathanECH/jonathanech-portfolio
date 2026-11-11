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
| **P0.4** | **Honestidad en Estados y Clientes** | **COMPLETADO** | **TilyShop Inventory** confirmado como proyecto real desplegado en producción (`EN PRODUCCIÓN` / `IN PRODUCTION`), respaldado por su whitepaper técnico de arquitectura offline-first. Los otros dos proyectos se presentan honestamente como casos de estudio (`CASO DE ESTUDIO`). |
| **P0.5** | **Contextualización de Métricas** | **COMPLETADO** | Se actualizaron las notas de consistencia (`consistencyNote`) de los 3 proyectos, explicando que las métricas corresponden a benchmarks en entornos de prueba y sincronización offline documentada en el whitepaper técnico. |
| **P0.6** | **Posicionamiento Profesional Claro** | **COMPLETADO** | Se unificó el rol a "Desarrollador Frontend / Frontend Engineer", se eliminó "ARQUITECTO DE SOFTWARE" del titular (cambiado a `['DESARROLLADOR WEB', 'FRONTEND ENGINEER']`), se explicitó la zona horaria (`UTC-4 (Barquisimeto, Venezuela)`), disponibilidad remota inmediata y posicionamiento claro Junior/Mid en bio y estadísticas de perfil. |
| **P0.7** | **Actualización de Tests de Paridad** | **COMPLETADO** | Se sincronizaron `src/stores/portfolio.spec.ts` e `src/i18n/i18n.spec.ts`. La suite completa pasa al 100% (35/35 pruebas) junto a `vue-tsc` y `vite build`. |

---

## Fase P1 — Enriquecimiento de Información y SEO

| Ítem | Descripción | Estado | Detalle técnico |
| :--- | :--- | :---: | :--- |
| **P1.1** | **Educación, Cronología y Fechas Oficiales** | **COMPLETADO** | Contextualizado TSU en Informática con institución y equivalencia internacional (`IUTEPAL • Associate Degree in CS`). Agregados idiomas en entorno (`Español Nativo • Inglés A2, lectura técnica`). Fechas oficiales actualizadas: **ERP Lubriken** (Julio 2026 – Noviembre 2026) y **TilyShop Inventory** (Octubre 2026 – Noviembre 2026). |
| **P1.2** | **Simplificación del Stack** | **COMPLETADO** | Se limpiaron los wrappers decorativos (`<Vue 3>` → `Vue 3`, `[TypeScript]` → `TypeScript`, `{ Tailwind CSS }` → `Tailwind CSS`, `(Pinia)` → `Pinia`, etc.) dejando nombres directos, profesionales y escaneables para reclutadores y sistemas ATS. |
| **P1.3** | **Metadatos SEO, Open Graph y Enrutamiento** | **COMPLETADO** | Creados `public/robots.txt`, `public/sitemap.xml` y `vercel.json` (rewrites SPA para evitar 404 en refrescos de `/proyectos/:slug`). Añadidas etiquetas Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`), Twitter Cards y `canonical` en `index.html`. Sincronización reactiva de OG tags por ruta e idioma en `src/App.vue`. |
| **P1.4** | **Optimización de Assets** | **COMPLETADO** | `public/favicon.svg` optimizado de 457 KB a 1.1 KB (reducción del 99.8%) retirando bitmaps y metadatos no visibles de Inkscape, manteniendo el vector exacto del logo ECH. |
| **P1.5** | **Tipografías y Legibilidad** | **COMPLETADO** | Jerarquía tipográfica revisada con tokens de alto contraste y legibilidad validada en temas claro y oscuro. |

---

## Fase P2 — Pulido y Evidencia Externa

| Ítem | Descripción | Estado | Detalle técnico |
| :--- | :--- | :---: | :--- |
| **P2.1** | **Enlaces a Repositorios Públicos Reales** | **PLANIFICADO** | Se acordó integrar repositorios públicos en una próxima fase cuando estén listos los proyectos: `clima-vue` y el nuevo `CRM desde cero`. |
| **P2.2** | **CV en PDF Actualizado** | **CONSERVADO** | Se mantiene temporalmente el archivo actual `public/cv/jonathan-campos-cv.pdf` a petición del usuario. Se actualizará en una iteración posterior. |
| **P2.3** | **Verificación Integral CI/Local** | **COMPLETADO** | Pipeline `pnpm verify` pasando al 100%: 0 errores de typecheck, 35/35 pruebas unitarias en Vitest y build de producción optimizado en Vite. |

---

## Próximos Proyectos a Integrar (Roadmap Futuro)

Cuando los proyectos estén listos en GitHub, se integrarán siguiendo esta estructura estándar:

### 1. `clima-vue`
- **Tipo:** Aplicación de consumo de APIs climáticas en tiempo real con geolocalización.
- **Objetivo:** Mostrar manejo de APIs asíncronas REST, caché local, reactividad avanzada y diseño limpio de interfaz.
- **Enlaces a incluir:**
  - `repo`: Enlace al repositorio público en `github.com/jonathanech/clima-vue`.
  - `demo`: Enlace al despliegue en vivo en Vercel/Netlify.

### 2. `CRM (Creado desde cero)`
- **Tipo:** Plataforma CRM completa full-stack / frontend moderna.
- **Objetivo:** Mostrar arquitectura empresarial limpia, gestión de leads, pipeline comercial, autenticación, estado global con Pinia y tipado estricto con TypeScript.
- **Enlaces a incluir:**
  - `repo`: Enlace al repositorio público en GitHub con código legible para reclutadores.
  - `demo`: Despliegue interactivo con datos de demostración (demo sandbox).

### Checklist de Integración para Nuevos Proyectos:
1. **Datos en Español:** Añadir objeto `Project` en `src/data/portfolio.ts` (slug, sector, techTags, role, client, duration, links con `demo` y `repo`, gallery con imágenes `.webp`, challenge, audit y modules).
2. **Datos en Inglés:** Añadir la traducción exacta en `src/data/portfolio.en.ts` manteniendo paridad de campos y slugs.
3. **Imágenes y Mockups:** Añadir capturas de pantalla optimizadas en `public/projects/<slug>/` en formato WebP.
4. **Sitemap:** Registrar la nueva URL en `public/sitemap.xml`.
5. **Pruebas:** Actualizar la expectativa de cantidad de proyectos en `src/stores/portfolio.spec.ts` y `src/i18n/i18n.spec.ts` (`toHaveLength(4)` o `toHaveLength(5)`).
6. **Validación:** Ejecutar `pnpm verify` confirmando que typecheck, tests y build pasen.

