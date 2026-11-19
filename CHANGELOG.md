# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
proyecto adopta [Semantic Versioning](https://semver.org/lang/es/).

## [1.1.0] - 2026-11-19

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
