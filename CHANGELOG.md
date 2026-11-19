# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
proyecto adopta [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

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

- Rama `feat/project-reveal-70`, commit `5bb208a`. `pnpm verify`: typecheck OK,
  **110/110** pruebas y build `vite-ssg` correcto (6 páginas prerenderizadas).

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
