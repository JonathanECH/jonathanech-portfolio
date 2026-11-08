# Jonathan Campos — Portafolio

Portafolio personal de ingeniería con estética **Obsidian Cyber Minimalist**: una home cinética y casos de estudio técnicos con auditoría, arquitectura modular y galería de capturas.

## Stack

- **Vue 3.5** con `<script setup lang="ts">` y TypeScript estricto
- **Vite 8** (Rolldown) + **vue-router 5**
- **Pinia 4** para el estado global (filtros del stack y vista rápida)
- **Tailwind CSS v4** con tokens CSS-first en `src/styles/main.css`
- **@lucide/vue** para iconografía de interfaz y **simple-icons** para marcas
- **@fontsource-variable** para Plus Jakarta Sans y JetBrains Mono
- **Vitest 5** para la capa de datos/store

## Comandos

```bash
pnpm install      # instalar dependencias
pnpm dev          # servidor de desarrollo
pnpm typecheck    # vue-tsc + tsc estricto
pnpm test         # suite de Vitest
pnpm build        # typecheck + build de producción
pnpm verify       # typecheck + tests + build
pnpm preview      # servir el build
```

El gestor de paquetes es **pnpm**. No se usa npm ni yarn.

## Rutas

| Ruta | Vista | Descripción |
| --- | --- | --- |
| `/` | `HomeView` | Hero, ecosistema tecnológico filtrable, proyectos, sobre mí y contacto |
| `/proyectos/:slug` | `ProjectDetailView` | Caso de estudio data-driven (TilyShop Inventory, Gestión Médica, ERP Contable) |
| `/:pathMatch(.*)*` | `NotFoundView` | 404 |

Los tres proyectos comparten la misma plantilla de detalle. TilyShop Inventory es el caso insignia y usa los valores exactos de auditoría del brief: **4,820 ms → 42 ms → 0.00%**.

## Estructura

```
src/
├── components/
│   ├── detail/      # Header, specs, auditoría, módulos, galería y mockups
│   ├── home/        # Hero, stack, proyectos, modal, about y contacto
│   ├── layout/      # Navbar y footer compartidos
│   └── ui/          # SectionHeading, TechIcon, SocialIcon
├── composables/     # Datos, scroll, foco, clipboard y carrusel cinemático
├── data/            # Contenido tipado de tecnologías, proyectos y perfil
├── router/          # Rutas y scroll behavior
├── stores/          # Pinia: filtros y vista rápida
├── styles/          # Tema Tailwind v4, animaciones y utilidades
├── types/           # Contrato de dominio
└── views/           # Home, detalle y 404
```

## Contenido y placeholders

- **Datos**: edita `src/data/portfolio.ts` para proyectos, stack, perfil y canales de contacto.
- **Mockups**: las capturas son placeholders CSS/SVG por variante (`inventory`, `ledger`, `batches`, `medical`, `erp`, `analytics`). Puedes sustituirlas añadiendo `image` y `alt` a cualquier slide de `gallery`; no hace falta tocar componentes.
- **CV**: `public/cv/jonathan-campos-cv.pdf` es un PDF placeholder.
- **Whitepaper**: `public/docs/tilyshop-whitepaper.pdf` es un PDF placeholder.
- **Enlaces**: demo, repositorio, LinkedIn y WhatsApp viven en `src/data/portfolio.ts`; sustitúyelos por los definitivos.

## Accesibilidad y movimiento

La interfaz incluye landmarks semánticos, foco visible, navegación por teclado en el modal y la galería, bloqueo de scroll y focus trap. Todas las animaciones respetan `prefers-reduced-motion`; el spotlight del hero y el autoplay del carrusel se desactivan con esa preferencia.
