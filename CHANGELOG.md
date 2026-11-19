# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el
proyecto adopta [Semantic Versioning](https://semver.org/lang/es/).

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
