# Seguimiento de Auditoría y Mejoras del Portafolio

Este documento registra las acciones realizadas y pendientes para transformar el portafolio en una presentación profesional, honesta, creíble y verificable para reclutadores y líderes técnicos.

---

## Estado General

- **Rama activa:** `main` (release `v1.3.3`)
- **Fase 0 del CMS:** integrada en `main` el 24 de noviembre de 2026 (PR #19).
- **Fecha de inicio:** 9 de noviembre de 2026
- **Última actualización:** 26 de noviembre de 2026
- **Objetivo:** Credibilidad en 30–60 segundos, enlaces funcionales, posicionamiento claro como Frontend Engineer para reclutadores internacionales y paridad completa ES/EN.

---

## Fase 0 del CMS — 2026-11-24 (integrada en `main` vía PR #19)

| Ítem | Descripción | Estado | Detalle técnico |
| :--- | :--- | :---: | :--- |
| **0B** | Retirada de métricas de auditoría del sitio | **COMPLETADO** | `AuditMetric`, `audit.metrics` y `audit.consistencyNote` desaparecen de tipos, datos ES/EN y los cuatro componentes que las mostraban (`ProjectCard`, `ProjectQuickModal`, `ChallengeAudit`, `ProjectHeader`). Se conservan `diagnosis`, `resolution`, `badge`, `ZoomMetrics`, `profile.stats`, `profile.performance`, los alt texts, el whitepaper y esta documentación. La altura de las tarjetas se reserva con `min-h-*` para no introducir CLS. |
| **0A** | Tema navideño global controlado solo por el admin | **COMPLETADO** | Worker de Cloudflare delante de Vercel: KV `THEME_STATE` con clave `theme` y enum `default` \| `christmas`, secreto `THEME_ADMIN_TOKEN`, cookie `ech_theme` en cada respuesta HTML y `Cache-Control: private, no-cache`. `GET /admin/theme` sirve un formulario temporal `noindex`/`no-store`; `POST /api/admin/theme` valida el token en tiempo constante (`401` sin escribir KV, `422` fuera del enum, `204` + `no-store`). Sin opción navideña en `SettingsMenu` ni claves nuevas en `src/i18n/messages/`. |
| **0A** | Anti-flash y accesibilidad | **COMPLETADO** | `index.html` prioriza la cookie sobre `ech:preferences`, aplica `data-theme` y `theme-color` antes del primer paint, ignora valores inválidos y restaura la preferencia guardada cuando la cookie vuelve a `default`. `usePreferences.ts` no sobrescribe `christmas` al cambiar claro/oscuro. Tokens semánticos con contraste AA en texto, superficies y CTA; movimiento solo bajo `prefers-reduced-motion: no-preference`, sin transiciones en carga. |
| **V** | Verificación | **COMPLETADO** | `cd worker && pnpm test` → 11/11 y `pnpm typecheck` limpio; `pnpm verify` → 143/143 tests, typecheck y 6 páginas SSG; `grep` de `christmas` en `SettingsMenu.vue` y `src/i18n/messages/` sin coincidencias; smoke con `wrangler dev`: `GET /api/admin/theme` → 401, `POST` sin token → 401, `POST` con token → 204, HTML con `ech_theme=christmas` y `private, no-cache`. |

**Operación:** crear el namespace KV, pegar su id en `worker/wrangler.toml`, ejecutar `wrangler secret put THEME_ADMIN_TOKEN`, desplegar con `wrangler deploy` y usar `/admin/theme`. La vuelta a **Predeterminado** restaura las preferencias ES/EN y claro/oscuro de cada visitante sin redeploy. **Fase 1** migrará el estado a `site_settings.active_theme` y retirará el formulario, el endpoint y el secreto temporales.

---

## Fase P0 — Fallas Vulnerables y Credibilidad Crítica

| Ítem | Descripción | Estado | Detalle técnico |
| :--- | :--- | :---: | :--- |
| **P0.1** | **Whitepaper Técnico Real** | **COMPLETADO** | Se instaló el documento técnico real de 8 páginas (196 KB) de TilyShop Inventory en `public/docs/tilyshop-whitepaper.pdf`. El botón de descarga en el detalle de proyecto permanece activo y funcional. |
| **P0.2** | **Eliminación de Enlaces Rotos** | **COMPLETADO** | Se removieron las URLs inexistentes `.demo` y enlaces a repositorios 404 en los 3 proyectos (`src/data/portfolio.ts` y `portfolio.en.ts`). Los componentes ya ocultan condicionalmente los botones cuando `demo` o `repo` no están definidos. |
| **P0.3** | **Sustitución de Hosts Ficticios (.live)** | **COMPLETADO** | Se cambiaron `*.live` por identificadores contextuales de caso de estudio (`app.tilyshop.internal`, `clinica.local`, `erp.local`) en el HUD de galería y tarjetas. |
| **P0.4** | **Honestidad en Estados y Clientes** | **COMPLETADO** | **TilyShop Inventory** confirmado como proyecto real desplegado en producción (`EN PRODUCCIÓN` / `IN PRODUCTION`), respaldado por su whitepaper técnico de arquitectura offline-first. Los otros dos proyectos se presentan honestamente como casos de estudio (`CASO DE ESTUDIO`). |
| **P0.5** | **Contextualización de Métricas** | **COMPLETADO** | Se actualizaron las notas de consistencia (`consistencyNote`) de los 3 proyectos, explicando que las métricas corresponden a benchmarks en entornos de prueba y sincronización offline documentada en el whitepaper técnico. |
| **P0.6** | **Posicionamiento Profesional Claro** | **COMPLETADO** | Se unificó el rol a "Desarrollador Frontend / Frontend Engineer", se eliminó "ARQUITECTO DE SOFTWARE" del titular (cambiado a `['DESARROLLADOR WEB', 'FRONTEND ENGINEER']`) y se explicitó la zona horaria (`UTC-4 (Barquisimeto, Venezuela)`). En la release 2026-11-18 se eliminaron pasantías, disponibilidad inmediata y etiquetas Junior/Mid: el bio pasó a describir colaboración con equipos remotos e internacionales y entregas listas para producción. |
| **P0.7** | **Actualización de Tests de Paridad** | **COMPLETADO** | Se sincronizaron `src/stores/portfolio.spec.ts` e `src/i18n/i18n.spec.ts`. La suite completa pasa al 100% (143/143 pruebas en 17 archivos) junto a `vue-tsc` y `vite-ssg build`; el Worker añade 11 pruebas propias. |

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
| **P2.1** | **Enlaces a Repositorios Públicos Reales** | **COMPLETADO (PARCIAL)** | `clima-vue` integrado con repositorio público (`github.com/JonathanECH/clima-vue`) y demo en vivo (`clima-vue-vert.vercel.app`). El `CRM desde cero` queda pendiente para una próxima fase. |
| **P2.2** | **CV en PDF Actualizado** | **ACTUALIZADO** | `public/cv/CV_JonathanCampos.pdf` sustituye al antiguo `jonathan-campos-cv.pdf` (PDF 1.4, 408 KB). Los enlaces de descarga en `HeroSection.vue` y `AppNavbar.vue` apuntan al nuevo nombre y no quedan referencias al anterior. |
| **P2.3** | **Verificación Integral CI/Local** | **COMPLETADO** | Pipeline `pnpm verify` pasando al 100%: 0 errores de typecheck, 143/143 pruebas unitarias en 17 archivos, 11 pruebas del Worker y build de producción con prerenderizado (`vite-ssg`). El CI usa pnpm 12.23.0, igual que `package.json` y el lockfile raíz. |

---

## Fase P3 — Modernización Web y Experiencia de Galería (2026-11-18)

| Ítem | Descripción | Estado | Detalle técnico / committing |
| :--- | :--- | :---: | :--- |
| **P3.1** | **Guía Modern Web instalada** | **COMPLETADO** | Skill `modern-web-guidance` instalada a nivel proyecto (`.agents/skills/`). Escaneo legacy: **0 hallazgos** sobre 52 reglas y 38 guías. Commit `668cdad`. |
| **P3.2** | **Auditoría de patrones web aplicada** | **COMPLETADO** | `color-scheme`, reveal CSS solo con JS, tokens de contraste, scrollbar theming, reduced motion con scope, semántica de filtros, `<dialog>` nativo, dimensiones/decoding de imágenes, optimización del canvas del hero y `content-visibility`. Commit `fdb5621`. |
| **P3.3** | **Estabilidad del menú de ajustes** | **COMPLETADO** | Se descartó Popover API por perder el anclaje bajo la navbar; se restauró el dropdown original y se añadieron tests de visibilidad, accesibilidad y posición. Commits `9368058` y `8ca71b9`. |
| **P3.4** | **Contraste y temas coherentes** | **COMPLETADO** | `GalleryLightbox` usa colores semánticos Light/Dark y `::selection` legible. Clínica Razetti usa el token `--ech-razetti-accent` (`#0f766e` claro / `#5eead4` oscuro). Commit `ef33e62`. |
| **P3.5** | **Acento claro definido por el usuario** | **COMPLETADO** | `--ech-accent` en claro pasó a `#109ab6` con derivados RGB sincronizados; modo oscuro intacto (`#00e5ff`). Texto sobre acento en blanco. Commits `e04f9fa` y `61f5381`. |
| **P3.6** | **Bloqueo real de scroll en modales** | **COMPLETADO** | `useScrollLock` con contador de referencias, compensación de ancho de scrollbar y contención en `::backdrop`. Aplica a `GalleryLightbox` y `ProjectQuickModal`. Commit `f2b4c02`. |
| **P3.7** | **Zoom con Ctrl + rueda** | **COMPLETADO** | `useZoom.onWheel()` con escala exponencial anclada al puntero, normalización de `deltaMode` y `preventDefault()` solo con `ctrlKey`. Commit `bce72db`. |
| **P3.8** | **Footer del lightbox durante el zoom** | **COMPLETADO** | El bloque de descripción y pista se oculta con `v-show` cuando `zoom.isZoomed`, liberando altura para la imagen. Commit `9e45c3b`. |
| **P3.9** | **Pistas adaptadas al dispositivo** | **COMPLETADO** | `@media (pointer: coarse)` muestra "Pellizca o doble toque"; `@media (pointer: fine)` muestra "Ctrl + scroll · Esc". Claves ES/EN separadas y testadas. Commit `5a4b7aa`. |
| **P3.10** | **Bio orientada a reclutadores** | **COMPLETADO** | Se eliminaron pasantías, Junior/Mid y "disponibilidad inmediata" de `portfolio.ts`, `portfolio.en.ts` y README; el bio ahora habla de equipos remotos/internacionales y entregas production-ready. Commit `ca9b246`. |
| **P3.11** | **Documentación de release** | **COMPLETADO** | README y este documento actualizados con el estado de la release, la verificación y el procedimiento de publicación (commit `docs: document production release`). |
| **P3.12** | **Release v1.0.0 y mantenimiento** | **COMPLETADO** | Bump a `1.0.0`, tag anotado `v1.0.0`, `CHANGELOG.md`, `docs/MAINTENANCE.md`, Dependabot semanal (npm + Actions), copyright localizado en el footer y limpieza de ramas integradas. |
| **P3.13** | **Fix de animaciones de entrada** | **COMPLETADO** | La transición se movió a la regla base `html.js .reveal` (antes solo estaba en `:not(.is-visible)`, así que no se animaba). `v-reveal` pasó al raíz de `ProjectCard`/`TechCard`, se excluyó `content-visibility` en secciones con reveals y se añadieron 8 tests. Commit `fix: restore scroll reveal animation`. |
| **P3.14** | **Revelado nativo por scroll** | **COMPLETADO** | Las cards usan `@keyframes` con `translate`/`opacity`, `animation-timeline: view(block)` y `animation-range: entry 0% entry 100%` dentro de `@supports`; contenido visible por defecto y `prefers-reduced-motion` con estado final. Se eliminaron `v-reveal`, `html.js` y el prop `index` de `ProjectCard`; `useActiveSection` y `useScrolled` quedaron intactos. `src/styles/reveal.spec.ts` valida el contrato CSS. El Stack cambió `overflow-hidden` por `overflow-clip`: `hidden` creaba un scrollport anidado y `view()` media la entrada dentro de la sección en lugar del viewport. El animador vive en wrappers separados (`reveal--stack`, `reveal--project`) para no competir con el `pressed`/`hover` de las cards; las proyectos distinguen móvil de tablet/desktop y la grilla usa `overflow-x-clip`. Filtros y "Ver más" usan `TransitionGroup` con keys estables y `reveal-settled` para cancelar `view()` al entrar/salir, evitando tarjetas ocultas o congeladas. "Sobre Mí" añade `reveal--about` en sus tres bloques y barras de métricas que llenan con `scaleX` escalonado (10/16/22/28%, incluida la cuarta barra SEO); "Contacto" añade `reveal--contact` con escalonado 0/4/8/12% y microinteracciones `motion-safe:`. Ambos usan `overflow-clip` en contenedores/pistas para preservar la geometría de `view()`. Los rangos indicados corresponden a `v1.1.0`; en `v1.1.1` se ajustan a `entry 70%` en proyectos y `cover 10/14/18/22%` en métricas. |
| **P3.15** | **Optimización Core Web Vitals y fluidez táctil en móvil** | **COMPLETADO** | Priorización LCP (`loading="eager"` + `fetchpriority="high"`) en primera slide de `ProjectGallery`/`MockupCanvas`; `preload` automático de los 2 WOFF2 variables latinos en `vite.config.ts`; lazy-load con `defineAsyncComponent` de `ProjectQuickModal` y `NotFoundView`; caché en `vercel.json` para `/projects/(.*)` y `/og-image.jpg`; rangos `animation-range` cortos en móvil (`max-width: 767px`, `entry 0% entry 35%/40%`); `HeroSection` sin layout thrashing, sin repintado de gradiente a 60fps en reposo y sin reinicio de `<canvas>` por la barra de direcciones móvil; `TechCard` cancela feedback táctil durante scroll; `ProjectCard` reserva `backdrop-blur-sm` a `sm:`. Commits `6e317b3` y `16c06a1`. |
| **P3.16** | **Higiene DX: Vue Router 5, TypeScript 7 y Tailwind v4** | **COMPLETADO** | Guard de `vite-ssg` adaptado en `src/main.ts` a firma de 2 argumentos basada en `return` (elimina `[VUE_ROUTER_R0025]`); eliminado `"baseUrl": "."` deprecado en `tsconfig.json` y `tsconfig.node.json`; migradas 58 clases a sintaxis canónica de Tailwind CSS v4 (`0` warnings restantes). Commit `8206837`. |
| **P3.17** | **Hidratación SSG, higiene de gestos, accesibilidad y limpieza de código** | **COMPLETADO** | `initPreferences()` movido a `onMounted` en `App.vue` (sin mismatch SSG); `GalleryLightbox` respeta `swipe.justSwiped` al hacer clic en backdrop/escenario; `ProjectGallery` se remonta al cambiar `locale`; limpieza de timers de 80 ms en `useZoom` y `useSwipeNavigation` (`reset`, `onPointerDown`, `onScopeDispose`); preservación aditiva de `padding-right` con `calc(...)` en `useScrollLock`; restauración de foco a `menuButtonRef` al cerrar menú móvil en `AppNavbar`; diagnóstico en inglés de Clínica Razetti alineado con revocación JWT en tiempo real; eliminado renderizador CSS muerto de mockups, `MockupVariant`/`variant` y 51 claves `mockup.*` huérfanas; limpiada declaración redundante `animation-range` en regla móvil de `.reveal--project`; `rel` centralizado en `ContactChannel` (`portfolio.ts` / `portfolio.en.ts`) para `AppFooter` y `ContactSection`. Suite ampliada a **120/120** pruebas en 13 archivos. |
| **P3.18** | **Skeleton de carga en el visor de galería** | **COMPLETADO** | `GalleryLightbox` muestra un placeholder accesible mientras carga la imagen activa: se activa al abrir o cambiar de diapositiva/fuente, respeta imágenes en caché (`complete` + `naturalWidth > 0` tras `nextTick()`) y se oculta en `load`/`error`. Es decorativo (`aria-hidden`, `pointer-events-none`), usa `motion-safe:animate-pulse` y no bloquea backdrop, zoom, swipe ni teclado. Cubierto en `GalleryLightbox.spec.ts` (commit `9bb3f82`). Suite en **123/123** pruebas en 13 archivos. |
| **P3.19** | **Persistencia de scroll-reveal en filtros de Stack y convergencia simétrica en Contacto Desktop** | **COMPLETADO** | `useRevealTransition` limpia `reveal-settled` de forma incondicional en `onAfterEnter` y `onEnterCancelled` (y `.tech-enter-active` / `.project-enter-active` declaran `animation: none` durante la transición de 220 ms), garantizando que ninguna card del Stack o Proyectos pierda su `animation-timeline: view(block)` al filtrar, expandir o volver a `TODAS // ALL`. Añadida coreografía de convergencia simétrica al centro (*Console Docking*) en Desktop (`min-width: 1024px`) para `.reveal--contact` (`--contact-x: ±44px / ±18px`, `--contact-scale: 0.86 / 0.88`). Suite en **124/124** pruebas en 13 archivos. |

---

## Validación previa a producción (release `v1.1.0` · 2026-11-19)

Checklist ejecutado e integrado en `main` (PR `#13`):

1. **Verificación integral:** `pnpm verify` → typecheck OK, **110/110** tests en 12 archivos y build `vite-ssg` correcto (6 páginas prerenderizadas).
2. **Contrato CSS y fluidez móvil:** `src/styles/reveal.spec.ts` comprueba el `@supports`, el rango acotado, el orden de `animation-timeline` respecto al shorthand y el estado final con `prefers-reduced-motion`, con rangos de entrada acortados en móvil (`max-width: 767px`).
3. **Fallback visible:** `.reveal` mantiene `opacity: 1` y `transform: none` por defecto; no quedan `html.js`, `.is-visible` ni `--reveal-delay`.
4. **Diagnósticos limpios:** `0` errores de TypeScript (`baseUrl` eliminado), `0` advertencias de clases canónicas de Tailwind CSS v4 y `0` warnings `[VUE_ROUTER_R0025]` en consola.
5. **Publicación:** PR `#13` fusionado en `main` y tag anotado `v1.1.0` publicado en `origin`.

---

## Validación previa a producción (release `v1.1.1` · 2026-11-19)

Checklist de la rama `feat/project-reveal-70` (commits `5bb208a` y `f593ee7`):

1. **Alcance:** ajuste de rangos en `src/styles/main.css` y su contrato en `src/styles/reveal.spec.ts`; bump a `1.1.1` en `package.json`. No hay cambios en componentes, composables ni dependencias.
2. **Proyectos:** `animation-range` termina en `entry 70%` tanto en la regla base como en móvil (`max-width: 767px`, antes `entry 35%`); el escalonado de tablet (`entry 6% / 12%`) también cierra en `entry 70%`.
3. **Sobre Mí:** las cuatro barras de métricas usan `cover` en vez de `entry`: inicios `cover 10% / 14% / 18% / 22%` y fin `cover 50%` en escritorio y `cover 45%` en móvil, manteniendo visible la cuarta barra (SEO) y sin animar `width`.
4. **Verificación integral:** `pnpm verify` → typecheck OK, **110/110** tests en 12 archivos y build `vite-ssg` correcto (6 páginas prerenderizadas).
5. **Publicación:** merge de la rama en `main` y tag anotado `v1.1.1` enviado con `git push --follow-tags`; `main` es la rama desplegada en producción.

---

## Validación previa a producción (release `v1.3.3` · 2026-11-26)

Checklist del menú móvil y del resaltado de sección:

1. **Causa raíz:** `useActiveSection` ordenaba las entradas del
   `IntersectionObserver` por `intersectionRatio`. En el salto suave a
   `#proyectos`, la entrada de `#stack` podía conservar mayor ratio y el navbar
   seguía marcando **Inicio** o **Stack**. Ahora se calcula la geometría real de
   cada sección y gana la más reciente dentro de la banda
   `topOffset` → `45%` del viewport.
2. **Menú táctil:** el panel usa `max-h-[calc(100dvh-5.5rem)]`, scroll propio y
   `overscroll-contain`; el backdrop cierra en `pointerdown.prevent` para evitar
   scroll chaining. `touch-action: manipulation` y `user-select: none` eliminan
   el retardo de doble tap y la selección accidental, sin quitar el zoom con
   pellizco.
3. **Coexistencia y foco:** abrir Ajustes cierra el menú; elegir un enlace,
   pulsar Escape o tocar el backdrop devuelve el foco a
   `menuButtonRef`. `aria-current="page"` y el acento cian se comprueban al
   reabrir el menú.
4. **Navegadores:** Brave real con eventos táctiles a 390×844 y 320×568: menú
   dentro del viewport, página detrás sin scroll, Proyectos y Stack resaltados
   correctamente.
5. **Verificación:** `pnpm verify` → typecheck OK, **143/143** pruebas en 17
   archivos y build `vite-ssg` correcto (6 páginas). Nuevos contratos en
   `AppNavbar.spec.ts` y `useActiveSection.spec.ts`.
6. **Publicación:** fusión del PR #23 en `main` y tag anotado `v1.3.3` enviado
   con `git push --follow-tags`; los tags `v1.3.0`, `v1.3.1` y `v1.3.2` no se
   mueven.

---

## Validación previa a producción (release `v1.3.2` · 2026-11-26)

Checklist del ajuste de viewport en desktop:

1. **Alcance:** `HeroSection.vue` mantiene `min-h-screen` en móvil y usa
   `lg:min-h-svh` en desktop, con espaciados fluidos
   `clamp(..., ...vh, ...)`; las otras cuatro secciones usan
   `flex flex-col justify-center lg:min-h-svh` y conservan `lg:py-28` para la
   navbar fija. No hay alturas fijas: el contenido puede crecer.
2. **Movimiento y CLS:** `overflow-clip` y `animation-timeline: view()` quedan
   intactos. Todos los cambios son estilos estáticos, por lo que no hay
   desplazamiento post-pintado.
3. **Navegadores:** medición real a 1366×768, 1366×720 y 1280×1024 en Brave y
   Firefox/Gecko: hero del alto exacto del viewport, `SCROLL // STACK` visible,
   la siguiente sección siempre fuera del pantallazo y sin overflow horizontal.
   CLS 0 medido en Brave; Firefox no expone la API `layout-shift`.
4. **Verificación:** `pnpm verify` → typecheck OK, **138/138** pruebas en 15
   archivos y build `vite-ssg` correcto (6 páginas).
5. **Publicación:** fusión del PR en `main` y tag anotado `v1.3.2` enviado con
   `git push --follow-tags`; los tags `v1.3.0` y `v1.3.1` no se mueven.

---

## Validación previa a producción (release `v1.3.1` · 2026-11-26)

Checklist del hotfix de metadatos tras la auditoría de la release `v1.3.0`:

1. **Alcance:** `package.json` pasa de `1.2.0` a `1.3.1` para coincidir con el changelog y con el nuevo tag; no hay cambios en código de aplicación ni en dependencias.
2. **Tag:** se crea `v1.3.1` anotado y se envía con `git push --follow-tags`; el tag `v1.3.0` ya publicado no se mueve ni se reutiliza.
3. **Verificación:** `pnpm verify` → typecheck OK, **135/135** tests en 15 archivos y build `vite-ssg` correcto (6 páginas).

---

## Validación previa a producción (release `v1.3.0` · 2026-11-26)

Checklist de los PR `#17`, `#18`, `#19` y de la auditoría local posterior:

1. **Alcance:** Fase 0 del CMS (Worker + KV, panel `/admin/theme` y cookie `ech_theme`), retirada de métricas de auditoría, plan/especificación del CMS, bump de dependencias y de pnpm 12.23.0 con CI alineado, y renombrado del CV.
2. **Movimiento y accesibilidad:** el tema navideño solo altera tokens semánticos, sin exponer interruptor público; las transiciones de color quedan limitadas a `prefers-reduced-motion: no-preference` y las tarjetas reservan altura con `min-h-*` para evitar CLS.
3. **Auditoría de enlaces:** no quedan referencias a `jonathan-campos-cv.pdf`; `HeroSection.vue` y `AppNavbar.vue` descargan `CV_JonathanCampos.pdf` (PDF 1.4, 408 KB, cabecera `%PDF` verificada).
4. **Verificación integral:** `pnpm verify` → typecheck OK, **135/135** tests en 15 archivos y build `vite-ssg` correcto (6 páginas prerenderizadas); `cd worker && pnpm test` → **11/11** y `pnpm typecheck` OK.
5. **Publicación:** fusión del PR de auditoría en `main` y tag anotado `v1.3.0` enviado con `git push --follow-tags`; `main` es la rama desplegada en producción.

---

## Validación previa a producción (release `v1.2.0` · 2026-11-20)

Checklist de los PR `#14`, `#15` y `#16`:

1. **Alcance:** skeleton accesible en `GalleryLightbox`, correcciones de SSG/gestos/accesibilidad, tokens de easing y transiciones explícitas, y preservación del reveal nativo por scroll al filtrar o expandir el Stack y los Proyectos; bump a `1.2.0` en `package.json`.
2. **Movimiento:** `reveal-settled` se libera en `@after-enter` y `@enter-cancelled`, con keys estables y wrappers de animación separados de las cards interactivas; Contacto añade convergencia escalonada en desktop sin animar propiedades de layout.
3. **Accesibilidad:** `motion-safe:` en hover/press, dot decorativo con `aria-hidden`, foco restaurado al cerrar el menú móvil y `rel` centralizado en los canales de contacto.
4. **Verificación integral:** `pnpm verify` → typecheck OK, **124/124** tests en 13 archivos y build `vite-ssg` correcto (6 páginas prerenderizadas).
5. **Publicación:** PR `#16` fusionado en `main` y tag anotado `v1.2.0` enviado con `git push --follow-tags`; `main` es la rama desplegada en producción.

---

## Validación previa a producción (release `v1.0.1` · 2026-11-19)

Checklist ejecutado antes de publicar en `origin/main`:

1. **Verificación integral:** `pnpm verify` → typecheck OK, **102/102** tests en 12 archivos y build `vite-ssg` correcto (6 páginas prerenderizadas).
2. **Patrones web:** `modern-web-guidance legacy-scan . --json` → `totalFindings: 0` (52 reglas, 38 guías).
3. **Salida compilada:** CSS con ambos temas y tokens `--ech-accent` / `--ech-razetti-accent`; JS con `onWheel` y las pistas táctil/puntero; HTML prerenderizado sin pasantías ni Junior.
4. **Estado de Git:** `git status --short --branch` sin cambios pendientes antes del push; `origin/main` sin commits nuevos tras `git fetch origin main`.
5. **Publicación:** push fast-forward de `main` a `origin/main` (rama desplegada en producción).

---

## Próximos Proyectos a Integrar (Roadmap Futuro)

Cuando el proyecto esté listo en GitHub, se integrará siguiendo esta estructura estándar:

### 1. `CRM (Creado desde cero)`
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
5. **Pruebas:** Actualizar la expectativa de cantidad de proyectos en `src/stores/portfolio.spec.ts` y `src/i18n/i18n.spec.ts` (`toHaveLength(4)`).
6. **Validación:** Ejecutar `pnpm verify` confirmando que typecheck, tests y build pasen.

