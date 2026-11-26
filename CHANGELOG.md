# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
proyecto adopta [Semantic Versioning](https://semver.org/lang/es/).

## [1.3.3] - 2026-11-26

### Fixed

- Menú móvil: `AppNavbar.vue` limita el panel a `100dvh` con scroll propio y
  `overscroll-contain`, deja el backdrop con `pointerdown.prevent` para que la
  página detrás no se desplace, cierra el menú al abrir Ajustes y devuelve el foco
  al botón del menú al elegir un enlace, pulsar Escape o tocar fuera.
- Resaltado de la navegación: `useActiveSection` ya no elige la sección por
  `intersectionRatio`. Calcula la geometría real dentro de la banda comprendida
  entre el offset del navbar y el 45% del viewport, de modo que **Proyectos**
  queda marcado con `aria-current="page"` tras el salto al ancla en móvil. El
  mismo arreglo aplica al resaltado de escritorio.
- Entrada táctil: `main.css` aplica `touch-action: manipulation` a botones y
  enlaces y `user-select: none` a botones, eliminando el retardo de doble toque y
  la selección accidental de texto sin desactivar el zoom con pellizco.

### Verificación

- `pnpm verify`: typecheck OK, **143/143** pruebas en **17** archivos y build
  `vite-ssg` correcto (6 páginas). Se añaden `AppNavbar.spec.ts` y
  `useActiveSection.spec.ts` para blindar el menú y la geometría del resaltado.
- Brave real con eventos táctiles a 390×844 y 320×568: el panel cabe en el
  viewport, la página detrás no scrollea, Ajustes no se solapa, Escape y el
  backdrop devuelven el foco, y al reabrir el menú Proyectos y Stack aparecen
  resaltados. El zoom con pellizco sigue disponible.
- Tras la fusión del PR se publica el tag anotado `v1.3.3` con `git push --follow-tags`;
  los tags `v1.3.0`, `v1.3.1` y `v1.3.2` no se mueven.

## [1.3.2] - 2026-11-26

### Fixed

- Dimensionamiento vertical de la home en desktop: `HeroSection.vue` usa
  `lg:min-h-svh` y un ritmo vertical fluido con `clamp(..., ...vh, ...)` para que
  badges, titular, subtítulo, CTAs, bloque de métricas y `SCROLL // STACK` quepan
  completos en el primer pantallazo. Se añade un ajuste estático solo para
  `(min-width: 1024px) and (max-height: 760px)`.
- `TechEcosystem.vue`, `ProjectsShowcase.vue`, `AboutSection.vue` y
  `ContactSection.vue` usan `flex flex-col justify-center lg:min-h-svh` y
  conservan `lg:py-28` para la navbar fija. Ninguna sección fija su altura: pueden
  crecer cuando el contenido supera el viewport.

### Verificación

- `pnpm verify`: typecheck OK, **138/138** pruebas en **15** archivos y build
  `vite-ssg` correcto (6 páginas prerenderizadas). `reveal.spec.ts` añade un
  contrato que impide volver a introducir alturas fijas.
- Medición real en navegador a 1366×768, 1366×720 y 1280×1024: hero exactamente
  del alto del viewport, `SCROLL // STACK` visible, la siguiente sección nunca
  asoma y sin overflow horizontal. CLS 0 en Brave; geometría equivalente en
  Firefox/Gecko.

## [1.3.1] - 2026-11-26

### Fixed

- Corrección de metadatos de release: después de publicar `v1.3.0`, `package.json`
  seguía en `1.2.0`. Se ajusta a `1.3.1` y se publica el tag anotado con el mismo
  número, sin mover el tag `v1.3.0` ya publicado. El código de la aplicación no
  cambia; solo la versión declarada y su documentación.

## [1.3.0] - 2026-11-26

> Fase 0 del CMS integrada en `main` el 24 de noviembre de 2026 (PR #19).

### Added

- Worker mínimo de Cloudflare (`worker/src/index.ts`, `worker/wrangler.toml`) que
  deja pasar el HTML prerenderizado de Vercel y fija en cada respuesta HTML la
  cookie `ech_theme` leída de la KV `THEME_STATE` (clave `theme`, valores
  `default` | `christmas`). La respuesta HTML del Worker usa
  `Cache-Control: private, no-cache` para que un caché compartido no congele
  la cookie de un estado anterior.
- Panel de administración temporal `GET /admin/theme` (`noindex`, `no-store`):
  formulario con token, botón deshabilitado mientras envía y feedback en un
  contenedor con `aria-live="polite"` y altura reservada, sin CLS. El secreto
  `THEME_ADMIN_TOKEN` se configura con `wrangler secret put` y nunca se
  renderiza ni se versiona.
- Endpoint `POST /api/admin/theme`: exige `Authorization: Bearer <token>` con
  comparación en tiempo constante (SHA-256 + XOR), responde `401` sin escribir
  en KV si falta o es inválido — también para métodos distintos de `POST` —,
  `422` si el valor está fuera del enum y `204` con `no-store` al actualizar.
- Capa de tema navideño en `src/styles/main.css` bajo
  `[data-theme='christmas']`: tokens semánticos con contraste AA, acentos vivos
  limitados a bordes y detalles, y transiciones de `background-color`/`color`
  únicamente bajo `prefers-reduced-motion: no-preference`.
- Tests del Worker (`worker/src/index.spec.ts`), de preferencias con cookie
  (`src/composables/usePreferences.spec.ts`) y de tokens/UI pública
  (`src/styles/theme.spec.ts`).

### Changed

- El script síncrono de `index.html` prioriza la cookie `ech_theme` sobre
  `ech:preferences`, aplica `data-theme` y `theme-color` antes del primer paint
  e ignora valores desconocidos. `default` restaura la preferencia guardada.
- `usePreferences.ts` no sobrescribe `christmas` cuando la cookie está activa,
  incluso si el visitante cambia entre claro y oscuro.
- Documentación operativa ampliada en `README.md` y
  `docs/AUDIT_AND_ROADMAP.md` con despliegue, uso del interruptor y vuelta a
  `default`.
- Dependencias actualizadas (PR `#17`): `@lucide/vue` 1.77.0, `@unhead/vue`
  2.1.18, `vue` 3.5.46 y `vitest` 5.1.1. El proyecto raíz pasa a pnpm 12.23.0
  y `.github/workflows/verify.yml` usa la misma versión para que
  `pnpm install --frozen-lockfile` no diverga del lockfile.

### Fixed

- Rutas del CV unificadas: el PDF pasa de `public/cv/jonathan-campos-cv.pdf` a
  `public/cv/CV_JonathanCampos.pdf` y se actualizan los enlaces de descarga en
  `src/components/home/HeroSection.vue` y
  `src/components/layout/AppNavbar.vue`, junto con el estado P2.2 de
  `docs/AUDIT_AND_ROADMAP.md`. No quedan referencias al nombre anterior.

### Removed

- Métricas de auditoría del sitio: `AuditMetric`, `audit.metrics` y
  `audit.consistencyNote` en tipos, datos y los cuatro componentes que las
  mostraban. Se conservan `diagnosis`, `resolution`, `badge`, `ZoomMetrics`,
  `profile.stats`, `profile.performance`, los alt texts con "metrics", el
  whitepaper y la documentación de auditoría. Las alturas de las tarjetas se
  reservan con `min-h-*` para evitar CLS.

### Verificación

- `pnpm verify`: typecheck OK, **135/135** pruebas en **15** archivos y build
  `vite-ssg` correcto (6 páginas prerenderizadas).
- Worker de tema: `pnpm test` → **11/11** pruebas y `pnpm typecheck` OK.

## [1.2.0] - 2026-11-20

### Added

- Loading skeleton en `GalleryLightbox` (`src/components/detail/GalleryLightbox.vue`):
  se activa al abrir el visor o al cambiar la fuente/diapositiva activa (`id`/`src`),
  con sincronización de caché tras `nextTick()` (`complete` y `naturalWidth > 0`)
  para no dejarlo colgado, y se oculta en `@load` y en `@error`. El placeholder es
  decorativo (`aria-hidden="true"` y `pointer-events-none`) y usa
  `motion-safe:animate-pulse`, sin movimiento bajo
  `prefers-reduced-motion: reduce`; no bloquea el cierre por backdrop, el zoom,
  el swipe ni la navegación por teclado. Cubierto por
  `src/components/detail/GalleryLightbox.spec.ts`.

### Changed

- Movimiento de la interfaz unificado: `src/styles/main.css` define los tokens
  `--ease-out` y `--ease-in-out` y la utilidad `.interactive-transition`, que
  sustituye a `transition-all` en componentes interactivos con transiciones
  explícitas de 160 ms. Las salidas del menú y del backdrop usan `ease-out`
  en lugar de `ease-in`, y las transformaciones de hover/press están protegidas
  por `motion-safe:`. Cubierto por `src/styles/reveal.spec.ts`.
- Centralización del atributo `rel` en los canales de contacto: `ContactChannel`
  incorpora `rel?: string` en `src/types/portfolio.ts`, definido en la fuente de
  datos (`src/data/portfolio.ts` y `src/data/portfolio.en.ts`: `'me noopener noreferrer'`
  en GitHub y LinkedIn, `'noopener noreferrer'` en WhatsApp) y enlazado
  directamente con `:rel="link.rel"` / `:rel="channel.rel"` en `AppFooter.vue` y
  `ContactSection.vue`.
- Coherencia bilingüe en el diagnóstico de auditoría del caso **Clínica Razetti**
  (`src/data/portfolio.en.ts`): la cláusula final ahora refleja la ausencia de
  revocación de tokens JWT en tiempo real al desactivar usuarios, en paridad con
  la versión en español y con la resolución técnica del caso.
- Limpieza de la regla móvil `@media (prefers-reduced-motion: no-preference) and (max-width: 767px)`
  para `.reveal--project` en `src/styles/main.css`: se elimina la declaración
  redundante `animation-range: entry 0% entry 70%` que repetía el rango base y se
  documenta únicamente `--reveal-y: 12px`, manteniendo intacto el comportamiento
  y `@media (prefers-reduced-motion: reduce)`.
- Animación de revelado por scroll en Desktop (`min-width: 1024px`) para la
  sección de **Contacto** (`@keyframes reveal-contact` y `.reveal--contact` en
  `src/styles/main.css`): convergencia simétrica al eje central (*Console Docking*),
  donde el par interior (`GitHub` y `LinkedIn`) inicia en `entry 0%` con
  `--contact-x: ±18px` y `--contact-scale: 0.88`, y el par exterior (`Email` y
  `WhatsApp`) converge desde `--contact-x: ±44px` y `--contact-scale: 0.86` en
  `entry 6%` hasta `entry 85%`.

### Fixed

- Preservación permanente de la animación de scroll (`animation-timeline: view(block)`)
  en todas las cards del **Stack** y **Proyectos** (`src/composables/useRevealTransition.ts`,
  `src/components/home/TechEcosystem.vue`, `src/components/home/ProjectsShowcase.vue`
  y `src/styles/main.css`): `reveal-settled` ahora se elimina de forma incondicional
  en `@after-enter` y `@enter-cancelled` (además de pausar `animation: none` en
  `.tech-enter-active` / `.project-enter-active`), evitando que las cards pierdan
  su animación de scroll al filtrar categorías, expandir con "Ver más" o volver
  al filtro por defecto (`TODAS // ALL`).
- Hidratación SSG sin desajustes de idioma: `initPreferences()` se traslada de
  `src/main.ts` al hook `onMounted` de `src/App.vue`, garantizando que el primer
  render de hidratación coincida con el HTML prerenderizado en español antes de
  aplicar la preferencia del navegador o de `localStorage`.
- `GalleryLightbox` respeta la ventana de supresión de clic sintético tras un
  gesto horizontal (`swipe.justSwiped`) además de `zoom.justPanned`, evitando que
  el diálogo se cierre por accidente al soltar un swipe sobre el escenario o el
  backdrop.
- `ProjectGallery` se remonta al cambiar de idioma (`:key="`${project.slug}-${locale}`"`
  en `ProjectDetailView.vue`), sincronizando de inmediato los slides activos del
  carrusel y del lightbox con el contenido localizado.
- Limpieza determinista de temporizadores de supresión de clic (80 ms) en gestos:
  `useZoom.ts` limpia `clickSuppressionTimer` y restablece `justPanned = false`
  en `resetZoom()` y al disponer el scope (`onScopeDispose`); `useSwipeNavigation.ts`
  almacena el ID del temporizador y lo limpia en `reset()`, al iniciar un nuevo
  `onPointerDown` y en `onScopeDispose`.
- Restauración del foco de teclado al cerrar el menú móvil en `AppNavbar.vue`:
  el botón hamburguesa expone `ref="menuButtonRef"` y recupera el foco
  (`menuButtonRef.value?.focus()`) cuando el menú se cierra con `Escape`, clic en
  el backdrop o clic fuera de la barra.
- `useScrollLock.ts` preserva cualquier `padding-right` inline previo en
  `document.body` usando `calc(${previousPaddingRight || '0px'} + ${scrollbarWidth}px)`
  al compensar el scrollbar y restaura el valor original exacto al desbloquear.

### Removed

- Código muerto del renderizador de mockups CSS en `src/components/detail/MockupCanvas.vue`,
  props `:accent` y `:project-slug` en `ProjectGallery.vue`, el tipo `MockupVariant`
  y los campos `variant` en `src/types/portfolio.ts`, `src/data/portfolio.ts` y
  `src/data/portfolio.en.ts`, así como las 51 claves huérfanas `mockup.*` en
  `src/i18n/messages/es.ts` y `src/i18n/messages/en.ts`. `MockupCanvas.vue`
  conserva la renderización de imagen (`<img>`) y su respaldo accesible ante
  errores de carga (`@error`).

### Verificación

- `pnpm verify`: typecheck OK, **124/124** pruebas en **13** archivos de test y
  build `vite-ssg` correcto (6 páginas prerenderizadas).

## [1.1.1] - 2026-11-19

### Changed

- Ajuste final de los rangos de revelado por scroll en `src/styles/main.css`:
  las cards de proyectos completan la entrada en `entry 70%` (antes `entry 100%`
  en escritorio y `entry 35%` en móvil), y el escalonado de tablet
  (`entry 6%/12%`) también termina en `entry 70%`, para que la animación se
  perciba completa sin quedarse a media transición al desplazarse con inercia.
- Las cuatro barras de métricas de “Sobre Mí” pasan a un rango `cover`:
  inicios escalonados `cover 10% / 14% / 18% / 22%` y fin `cover 50%` en
  escritorio y `cover 45%` en móvil (antes `entry 10/16/22/28%` → `entry 90%/55%`),
  de modo que el llenado se reparte a lo largo del paso de la barra por el viewport.
- `src/styles/reveal.spec.ts` actualiza el contrato de rangos para reflejar
  estos valores (`entry 70%`, `cover 10/14/18/22%` y `cover 50%`).

### Verificación

- Integrado desde `feat/project-reveal-70` (commit `5bb208a`). `pnpm verify`:
  typecheck OK, **110/110** pruebas y build `vite-ssg` correcto (6 páginas
  prerenderizadas).

## [1.1.0] - 2026-11-19

### Added

- Preload automático en `vite.config.ts` (`<link rel="preload" as="font" type="font/woff2" crossorigin>`)
  para los dos subsets variables críticos (`Plus Jakarta Sans` y `JetBrains Mono`,
  `latin-wght-normal`) en el HTML prerenderizado.
- Priorización LCP (`:priority="activeIndex === 0"`, `loading="eager"` y
  `fetchpriority="high"`) para la primera diapositiva de `ProjectGallery` y
  `MockupCanvas`, manteniendo `loading="lazy"` en el resto de slides.
- Cabeceras `Cache-Control` en `vercel.json` para imágenes de casos de estudio
  (`/projects/(.*)`) y tarjeta Open Graph global (`/og-image.jpg`).
- `src/composables/useRevealTransition.ts` y `src/styles/reveal.spec.ts` (16
  pruebas de contrato CSS y transiciones de grupo).

### Changed

- Animación de revelado por scroll de las cards migrada de `IntersectionObserver`
  en JavaScript a *CSS Scroll-Driven Animations* (`animation-timeline: view()`
  y `animation-range: entry 0% entry 100%`) animando la propiedad `translate`
  dentro de `@supports ((animation-timeline: view()) and (animation-range: entry))`
  con respaldo visible por defecto y respeto a `prefers-reduced-motion`.
- Eliminada la directiva `v-reveal` (`src/directives/reveal.ts`), la clase
  auxiliar `html.js` en `index.html` y el prop `index` en `ProjectCard`,
  manteniendo intactos `useActiveSection` y `useScrolled`.
- Revelado del Stack con mayor presencia (`translate: 0 28px` y `scale: 0.97`)
  en un wrapper dedicado que preserva el feedback táctil del `<article>`
  (`pressed`, `pointerdown` y `transform` inline).
- Cards de proyectos con entrada vertical en móvil y entrada lateral con leve
  asentamiento y escalonado por posición en tablet/desktop, con
  `overflow-x-clip` en la grilla para evitar scroll horizontal.
- Transiciones unificadas al filtrar o expandir Stack y Proyectos mediante
  `<TransitionGroup>`, claves estables por `technology.id` / `project.slug` y
  `*-move` sobre `transform`. El hook `reveal-settled` cancela el `view()`
  timeline al entrar/salir para que ninguna tarjeta quede oculta o congelada.
- Stack ajustado a `animation-range: entry 0% entry 85%`; el bloque de
  `prefers-reduced-motion` también cubre las transiciones de grupo.
- Revelado sobrio en “Sobre Mí”: los bloques de biografía y paneles laterales
  entran con `translate: 0 18px` + `opacity`, y las cuatro barras de métricas
  llenan con `transform: scaleX()` desde `transform-origin: left` (rangos
  escalonados 10/16/22/28%), sin animar `width` ni provocar layout shifts.
- Entrada escalonada de los canales de contacto (`translate: 0 16px` + `opacity`,
  rangos 0/4/8/12%) y refuerzo de hover/focus en tarjetas y del botón de copiar
  correo, con movimiento limitado a `motion-safe:` y datos de contacto siempre
  legibles y seleccionables.
- Contenedor de Contacto y pista de métricas cambiados de `overflow-hidden` a
  `overflow-clip` para que `view()` se mida contra el viewport y no contra un
  scrollport anidado.
- Carga diferida (`defineAsyncComponent`) de `ProjectQuickModal` en
  `ProjectsShowcase` (montado bajo demanda al abrir la vista rápida) y de
  `NotFoundView` en `ProjectDetailView`.
- Contención de layout y estilo (`contain: layout style`) en `.deferred-section`.
- Clases utilitarias normalizadas a la sintaxis canónica nativa de Tailwind CSS v4
  en 14 componentes (`text-(--accent)`, `border-(--project-accent)`,
  `bg-linear-to-*`, `aspect-4/3`, `sm:aspect-video`, `h-18`, `z-100`, etc.).

### Fixed

- Fluidez del desplazamiento táctil en móvil:
  - Rangos `animation-range` acortados en `@media (max-width: 767px)` (`entry 0% entry 35%`
    / `40%` y `--reveal-y: 12px`) para que las tarjetas altas de una sola columna
    completen su entrada en el tercio inferior del viewport sin quedar a medio
    aparecer cuando desacelera el scroll inercial.
  - `HeroSection` ignora variaciones menores de altura (`< 160px`) causadas por la
    barra de direcciones del navegador móvil al hacer scroll (evitando reasignar el
    buffer de `<canvas>` y reiniciar las partículas en pleno desplazamiento),
    cachea los offsets del contenedor para no ejecutar `getBoundingClientRect()` en
    cada `pointermove`, escribe `--mouse-x`/`--mouse-y` en el elemento hoja
    `spotlightRef` únicamente cuando el puntero cambia (`spotlightDirty`), limita
    los listeners de hover a dispositivos `(hover: hover) and (pointer: fine)` y
    elimina `mix-blend-screen` / `mix-blend-mode` de las rejillas de fondo.
  - `TechCard` cancela el feedback táctil si el gesto se convierte en scroll
    (`pointermove > 6px` o `pointercancel`) y acota `transition-all` a
    `transition-[transform,border-color,background-color]`.
  - `ProjectCard` sustituye los 4 `backdrop-blur-sm` por tarjeta en móvil (`< 640px`)
    por fondos semitransparentes directos (`sm:backdrop-blur-sm` en pantallas
    mayores) y acota `transition-all` a `transition-[transform,border-color,box-shadow]`.
- Adaptado `router.beforeEach` en `src/main.ts` para convertir el guard interno de
  3 argumentos `(to, from, next)` de `vite-ssg` en un guard moderno de 2 argumentos
  basado en `return`, eliminando la advertencia `[VUE_ROUTER_R0025]` de Vue Router 5.
- Eliminada la opción deprecada `"baseUrl": "."` en `tsconfig.json` y
  `tsconfig.node.json` para compatibilidad con TypeScript 7.

### Removed

- `src/directives/reveal.ts` y `src/directives/reveal.spec.ts`, reemplazados por
  `src/styles/reveal.spec.ts` para validar el contrato CSS.

## [1.0.1] - 2026-11-19

### Fixed

- La animación de entrada por scroll de las cards de proyectos y tecnologías: la
  transición estaba declarada solo en el estado oculto, así que al añadir
  `.is-visible` el estado final no tenía `transition` y las cards aparecían de golpe.
  Ahora la transición vive en la regla base `html.js .reveal`.
- `v-reveal` se aplica directamente en el elemento raíz de `ProjectCard` y
  `TechCard`, sin depender del *attribute fallthrough* desde el componente padre.
- Las secciones con animaciones `reveal` ya no usan `content-visibility: auto`,
  para que `IntersectionObserver` detecte las cards de forma fiable.

### Added

- `src/directives/reveal.spec.ts`: 8 pruebas para la directiva (delay, reduced
  motion, sin `IntersectionObserver`, intersección, limpieza) y para la regla CSS.

## [1.0.0] - 2026-11-18

Primera release estable desplegada en `https://jonathanech.dev`. El portafolio pasa
de prototipo a versión pública: base técnica validada, contenido orientado a
reclutadores internacionales y flujo de publicación documentado.

### Added

- Guía `modern-web-guidance` instalada y escaneo legacy en cero hallazgos.
- Zoom con `Ctrl + rueda` y pellizco/doble toque en `GalleryLightbox`, con pistas
  adaptadas a `pointer: coarse` y `pointer: fine`.
- Texto de copyright con "Todos los derechos reservados." en el footer (y
  "All rights reserved." en inglés).
- `CHANGELOG.md`, `docs/MAINTENANCE.md` y configuración semanal de Dependabot para
  dependencias npm y GitHub Actions.
- Tag de release `v1.0.0` para identificar de forma inequívoca el deploy en producción.

### Changed

- Bio de **Sobre Mí** reorientada a reclutadores: sin pasantías, sin etiquetas
  Junior/Mid y sin "disponibilidad inmediata".
- Acento del modo claro a `#109ab6` con texto blanco; modo oscuro sin cambios.
- Acento del caso Clínica Razetti dependiente del tema (`#0f766e` / `#5eead4`).
- `SettingsMenu` vuelve al dropdown anclado bajo la navbar (se descartó Popover API).
- `ProjectQuickModal` y `GalleryLightbox` usan `<dialog>` nativo.
- Documentación de release en `README.md` y `docs/AUDIT_AND_ROADMAP.md`.

### Fixed

- Regresión que ocultaba el botón de ajustes tras renderizar el popover.
- Contraste insuficiente en superficies y acentos del modo claro.
- El scroll de la página se desbloqueaba al cerrar uno de varios modales.
- El footer de la galería tapaba la imagen ampliada.
