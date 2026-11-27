# Jonathan Campos (ECH) — Portafolio Frontend

[![Sitio en vivo](https://img.shields.io/badge/Sitio_en_vivo-jonathanech.dev-00E5FF?style=flat-square&logo=vercel&logoColor=white)](https://jonathanech.dev)
[![Vue](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9_(Strict)-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-passing-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-12-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)

**Autor:** Jonathan Campos — Frontend Web Developer (JonathanECH)

**Sitio en producción:** **https://jonathanech.dev**

Portafolio profesional de ingeniería frontend, generado estáticamente con **Vite SSG**. Reúne casos de estudio técnicos, sistema bilingüe ES/EN, temas claro/oscuro con tokens CSS en runtime y una capa completa de **SEO técnico + GEO** (Generative Engine Optimization) para que buscadores y motores de IA indexen y recomienden el perfil.

---

## Índice

- [Perfil y objetivos](#perfil-y-objetivos)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Worker de tema global (Fase 0)](#worker-de-tema-global-fase-0)
- [SEO técnico y GEO](#seo-técnico-y-geo)
- [Casos de estudio](#casos-de-estudio)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Scripts y flujo de trabajo](#scripts-y-flujo-de-trabajo)
- [Accesibilidad y rendimiento](#accesibilidad-y-rendimiento)
- [Control de calidad y publicación](#control-de-calidad-y-publicación)
- [Contacto](#contacto)

---

## Perfil y objetivos

Jonathan Campos es un **Frontend Web Developer** especializado en **Vue 3, Tailwind CSS y TypeScript**, con base en **Barquisimeto, Venezuela (UTC-4)**. Diseña y construye interfaces reactivas, accesibles y de alto rendimiento con arquitectura modular y tipado estricto.

- **Rol:** Frontend Web Developer / Frontend Engineer.
- **Especialidades:** Arquitectura de componentes en Vue 3, gestión de estado con Pinia, optimización de rendimiento en cliente, PWA offline-first, accesibilidad web y SEO técnico.
- **Objetivo:** Colaborar con equipos de producto e ingeniería de todo el mundo, entregando interfaces frontend medibles, accesibles y listas para producción; abierto a procesos de selección y entrevistas técnicas.
- **Idiomas:** Español (nativo) e inglés técnico/profesional.

---

## Stack tecnológico

<div align="center">
  <img src="https://skillicons.dev/icons?i=vue,ts,vite,tailwind,pinia,vitest,html,css,nodejs" alt="Stack: Vue, TypeScript, Vite, Tailwind CSS, Pinia, Vitest, HTML, CSS y Node.js" />
</div>

<br />

| Herramienta | Versión | Propósito técnico |
| :--- | :--- | :--- |
| **Vue.js** | 3.5 | Framework reactivo con Composition API y `<script setup lang="ts">`. |
| **TypeScript** | 5.9 | Tipado estricto en datos, rutas, temas, i18n y capa SEO. |
| **Vite** | 8.3 | Servidor de desarrollo y empaquetado optimizado. |
| **vite-ssg** | 28 | Prerenderizado estático de la home y de cada caso de estudio. |
| **@unhead/vue** | 2.1 | Gestión declarativa y por ruta de `<head>`, Open Graph y JSON-LD. |
| **Tailwind CSS** | v4 | Utility-first sobre CSS nativo con `@theme inline` y variables runtime. |
| **Pinia** | 4.1 | Estado global para filtros del ecosistema y vista rápida. |
| **Vue Router** | 5.4 | Rutas, scroll declarativo y resolución de metadatos por ruta. |
| **Vitest** | 5.1 | Pruebas unitarias de datos, i18n, preferencias, tienda y SEO. |
| **pnpm** | 12 | Gestor de paquetes determinista. |

### Ecosistema y competencias

- **Frontend:** Vue.js, Angular, TypeScript, JavaScript (ES2024), Tailwind CSS, HTML5 semántico, CSS3 moderno.
- **Backend & APIs:** Node.js, Express, NestJS, Go, PHP, C, C# (.NET), REST APIs.
- **Bases de datos:** PostgreSQL, MySQL, MongoDB, Redis.
- **DevOps:** Git, GitHub, Docker, Linux, AWS, Cloudflare, Vercel.

---

## Arquitectura

### 1. Generación estática con `vite-ssg`

`src/main.ts` exporta `createApp` mediante `ViteSSG`, que crea la aplicación con historial en memoria durante el prerenderizado e historial web en el navegador. La hidratación de preferencias de idioma del cliente (`initPreferences()`) se ejecuta dentro de `onMounted` en `src/App.vue` para evitar discrepancias de hidratación con el HTML prerenderizado:

```ts
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ app }) => {
    app.use(createPinia())
  },
)
```

`vite.config.ts` define las rutas incluidas en la generación a partir de la colección `projects`, de modo que cada nuevo caso de estudio se prerenderiza y aparece en el sitemap sin pasos manuales:

```ts
ssgOptions: {
  dirStyle: 'flat',
  formatting: 'none',
  mock: true,
  beastiesOptions: false,
  includedRoutes(paths) {
    const staticPaths = paths.filter((path) => !path.includes(':') && !path.includes('*'))
    return Array.from(
      new Set([
        ...staticPaths,
        '/404',
        ...projects.flatMap((project) => [
          `/proyectos/${project.slug}`,
          `/en/proyectos/${project.slug}`,
        ]),
      ]),
    )
  },
},
```

Resultado: `/proyectos/<slug>` y `/en/proyectos/<slug>` se publican como HTML estático (`<slug>.html`) y Vercel lo sirve con URLs limpias. La raíz `/` respeta la preferencia del navegador; `/en` fuerza inglés.

### 2. Internacionalización nativa y tipada

- Diccionarios tipados en `src/i18n/messages/es.ts` y `src/i18n/messages/en.ts` bajo el contrato `UiMessageKey`.
- Contenido desacoplado en `src/data/portfolio.ts` (ES) y `src/data/portfolio.en.ts` (EN).
- Conmutación de idioma (con navegación a `/en` cuando corresponde) y tema sin recarga; los metadatos se recalculan de forma reactiva.
- `src/utils/localized-path.ts` es la única fuente de verdad para alternar entre rutas ES/EN; `useRouteLocale()` hace que la URL gane sobre `localStorage` en las páginas prerenderizadas.

### 3. Sistema de doble tema con tokens CSS runtime

- **Modo oscuro (*Obsidian Cyber*):** fondo `#0b0e14`, acento cian `#00e5ff`.
- **Modo claro (*Soft Cyber*):** fondo `#edf0f8`, superficies `#f5f7fa`, acento `#109ab6` con texto de acento en blanco.
- **Acento de caso (Clínica Razetti):** token `--ech-razetti-accent`, `#0f766e` en claro y `#5eead4` en oscuro, para mantener contraste suficiente en ambos temas.
- **Anti-flash:** script síncrono en `index.html` que aplica la cookie `ech_theme` del Worker antes que `localStorage` / `prefers-color-scheme`, y actualiza `theme-color` antes del primer render.

### 4. Componentes accesibles sin dependencias UI externas

- **SettingsMenu:** selector de idioma y tema con `aria-haspopup`, `aria-expanded`, cierre con `Escape` y panel anclado bajo la navbar.
- **ProjectQuickModal:** `<dialog>` nativo con `showModal()`, bloqueo de scroll (`useScrollLock`) y contención en `::backdrop`; sin trampa de foco manual.
- **GalleryLightbox:** `<dialog>` nativo, zoom con pellizco/doble toque y `Ctrl + rueda` en desktop, paneo al ampliar, pista adaptada a `pointer: coarse` / `pointer: fine`, footer oculto durante el zoom y bloqueo de scroll.
- **Hero Canvas:** partículas que respetan `prefers-reduced-motion: reduce`.

### 5. Worker de tema global (Fase 0 del CMS)

Un Worker de Cloudflare se sitúa delante del HTML prerenderizado de Vercel. No hay base de datos ni backend: el estado global vive en la KV `THEME_STATE` (clave `theme`, valores estrictos `default` | `christmas`) y el secreto `THEME_ADMIN_TOKEN` se guarda fuera del repositorio.

| Ruta | Comportamiento |
| :--- | :--- |
| `GET /*` | Pasa el HTML de Vercel y fija `Set-Cookie: ech_theme=<valor>; Path=/; SameSite=Lax`. El HTML con cookie lleva `Cache-Control: private, no-cache`. |
| `GET /admin/theme` | Formulario temporal (`noindex`, `no-store`) para introducir el token y elegir tema; nunca renderiza el secreto. |
| `POST /api/admin/theme` | `{ "theme": "default" \| "christmas" }` con `Authorization: Bearer <token>` → `204`; `401` sin escribir en KV si falta o es inválido; `422` fuera del enum. |

Despliegue y operación:

```bash
cd worker
pnpm install
# Crear el namespace KV y pegar su id en wrangler.toml; PUBLIC_SITE_ORIGIN debe ser Vercel
pnpm exec wrangler secret put THEME_ADMIN_TOKEN   # nunca se commitea
pnpm exec wrangler deploy
```

Guía completa de KV, secreto, ruta, DNS, caché, verificación y rollback:
[`docs/CLOUDFLARE_WORKER.md`](docs/CLOUDFLARE_WORKER.md).

Tras el despliegue, abre `https://<dominio-del-worker>/admin/theme`, introduce el token y pulsa **Navideño** o **Predeterminado**. El Interruptor afecta a todas las visitantes sin rebuild; **Predeterminado** restaura `ech:preferences` de cada visitante en la siguiente respuesta HTML. Fase 1 migrará este valor a `site_settings.active_theme`, retirará el formulario temporal y el endpoint de administración.

---

## SEO técnico y GEO

La capa SEO vive en `src/seo/` y `src/composables/useSeo.ts`, con una única fuente de verdad para el dominio canónico (`src/seo/site.ts`).

### Metadatos por ruta

`useSeo()` combina `useSeoMeta` y `useHead` de `@unhead/vue` y calcula, para cada ruta:

- `title` y `description` localizados; el `description` se mantiene entre 25 y 160 caracteres. Los casos usan `Project.metaDescription`, separado del `summary` completo que alimenta el JSON-LD.
- `link[rel="canonical"]` absoluto hacia la variante de idioma correspondiente (`https://jonathanech.dev` o `https://jonathanech.dev/en`).
- `link[rel="alternate"]` con `hreflang="es"`, `hreflang="en"` y `x-default`, recíproco en cada página y en el sitemap.
- Open Graph (`og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:image:alt`, `og:locale`).
- Twitter Card `summary_large_image`.
- `robots` con `noindex` únicamente en la página 404.
- `html[lang]` sincronizado con el idioma activo.

Como `vite-ssg` ejecuta la aplicación en Node, estas etiquetas llegan al HTML final: los crawlers no necesitan ejecutar JavaScript.

### Datos estructurados JSON-LD

`src/seo/structured-data.ts` construye un grafo Schema.org por página:

| Ruta | Nodos |
| :--- | :--- |
| `/` y `/en` | `Person`, `WebSite`, `ItemList` de casos de estudio |
| `/proyectos/<slug>` y `/en/proyectos/<slug>` | `Person`, `WebSite`, `CreativeWork`, `BreadcrumbList` |

`Person` incluye `jobTitle`, `knowsAbout`, `sameAs` (GitHub y LinkedIn), ubicación y formación. `CreativeWork` expone problema (`abstract`), stack (`keywords`, `about`) y fuentes verificables (`codeRepository` y `sameAs` solo cuando existen de verdad).

### HTML semántico y contenido NLP-friendly

- Landmarks estrictos: `header`, `main`, `section`, `article`, `footer`.
- Jerarquía de encabezados `h1 → h2 → h3` sin saltos.
- Bio declarativa con rol, especialidades, ubicación y objetivo profesional.
- Cada proyecto separa explícitamente **Problema**, **Solución técnica (Stack)** e **Impacto**, tanto en las tarjetas como en la cabecera del caso de estudio.
- Enlaces salientes a GitHub y LinkedIn con `rel="me noopener noreferrer"`.

### Rastreo e indexación

- `public/robots.txt` permite explícitamente crawlers de IA (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, CCBot y otros) y declara el sitemap.
- `sitemap.xml` se genera en build desde un plugin de Vite (`vite.config.ts`) que reutiliza `src/seo/sitemap.ts` y la colección de proyectos.
- `public/llms.txt` resume el perfil, stack, casos de estudio, repos/demos públicos reales y una cita sugerida por caso para motores generativos. Se descubre desde `robots.txt` y desde `<link rel="alternate" type="text/plain">` en el `<head>` de todas las rutas prerenderizadas; el footer ya no muestra un enlace visible.
- `sitemap.xml` incluye las ocho entradas por idioma con `lastmod` basado en cambios reales de contenido (`Project.updatedAt`), nunca en la fecha del build.
- `vercel.json` activa `cleanUrls`, elimina barras finales y añade caché a robots, sitemap, `llms.txt` y assets con hash.

---

## Casos de estudio

Cada caso de estudio sigue la estructura **Problema → Solución técnica → Impacto**, con métricas auditables y capturas reales.

### 1. TilyShop Inventory — Inventario y logística offline-first
- **Problema:** baja conectividad en depósitos y riesgo de descuadre de inventario.
- **Solución:** Vue 3 + TypeScript, IndexedDB local, colas de mutaciones y sincronización por lotes.
- **Impacto:** `0.00% Descuadre` y arquitectura verificada en [whitepaper](/docs/tilyshop-whitepaper.pdf).
- **Vivo:** https://jonathanech.dev/proyectos/tilyshop-inventory

### 2. Clima Vue — Clima en tiempo real y geolocalización
- **Problema:** consumo de API disperso y geolocalización inválida.
- **Solución:** composables centralizados, debounce de búsquedas y validación de coordenadas.
- **Impacto:** `350 ms Debounce` y respuestas resilientes ante errores de red.
- **Vivo:** https://jonathanech.dev/proyectos/clima-vue · **Repo:** https://github.com/JonathanECH/clima-vue

### 3. Clínica Razetti — Plataforma clínica y expediente electrónico
- **Problema:** agenda, turnos e historias clínicas sin una interfaz unificada.
- **Solución:** Vue 3, Composition API, Pinia y REST APIs con validación estricta.
- **Impacto:** flujos clínicos accesibles y consulta rápida de datos.
- **Vivo:** https://jonathanech.dev/proyectos/gestion-medica

### 4. ERP Contable (Lubriken) — Motor de doble partida y conciliación fiscal
- **Problema:** contabilidad manual propensa a inconsistencias.
- **Solución:** libro mayor, balance de sumas y saldos y conciliación bancaria en Vue 3 + TypeScript.
- **Impacto:** consistencia contable y reportes estructurados.
- **Vivo:** https://jonathanech.dev/proyectos/erp-contable

---

## Estructura del proyecto

```
src/
├── components/
│   ├── detail/         # Cabecera del caso de estudio, auditoría, módulos y galería
│   ├── home/           # Hero, stack, proyectos, modal y contacto
│   ├── layout/         # AppNavbar, AppFooter y SettingsMenu accesible
│   └── ui/             # SectionHeading, TechIcon y soporte visual
├── composables/        # useSeo, usePreferences, usePortfolioData, useScrollLock, useZoom, useSwipeNavigation
├── data/               # portfolio.ts (ES) y portfolio.en.ts (EN)
├── i18n/               # Diccionarios de UI, función t() y resolución de idioma
├── router/             # Rutas exportadas, historial y scroll reactivo
├── seo/                # site.ts, structured-data.ts y sitemap.ts
├── stores/             # Pinia: filtros tecnológicos y vista rápida
├── styles/             # main.css con tokens runtime
├── types/              # Contratos de dominio
└── views/              # HomeView, ProjectDetailView y NotFoundView
public/
├── robots.txt          # Política de rastreo + crawlers de IA
├── llms.txt            # Resumen para motores generativos
├── cv/                 # Currículum en PDF
├── docs/               # Whitepaper técnico
└── projects/           # Capturas de los casos de estudio
```

---

## Scripts y flujo de trabajo

El proyecto usa **pnpm** como gestor exclusivo:

```bash
# Instalación de dependencias
pnpm install

# Servidor de desarrollo local (HMR)
pnpm dev

# Verificación de tipos estricta (vue-tsc + tsc)
pnpm typecheck

# Pruebas unitarias (Vitest)
pnpm test

# Build de producción con prerenderizado (vite-ssg)
pnpm build

# Pipeline integral: typecheck + tests + build
pnpm verify

# Servir el build de producción localmente
pnpm preview

# Worker de tema: tests, typecheck y servidor local (dependencias propias)
cd worker && pnpm install && pnpm test && pnpm typecheck && pnpm dev
```

`pnpm build` genera `dist/index.html`, `dist/404.html`, `dist/proyectos/<slug>.html`, `dist/sitemap.xml` y los assets con hash. El Worker tiene su propio `pnpm-lock.yaml`: `pnpm verify` no cubre sus tests, así que ambos comandos son obligatorios antes de integrar.

---

## Accesibilidad y rendimiento

- **Navegación por teclado:** enlace de salto al contenido, foco visible (`:focus-visible`), restauración del foco al botón de menú móvil al cerrar con `Escape` o backdrop, y cierre con `Escape` en modales.
- **Movimiento reducido:** respeto íntegro de `prefers-reduced-motion` y utilidades `motion-safe:` en microinteracciones.
- **Animaciones de scroll y transiciones de grupo:** revelado nativo con `animation-timeline: view()` y `animation-range` adaptados por sección y breakpoint (proyectos al `entry 70%`, métricas de "Sobre Mí" en rango `cover`, convergencia simétrica al centro en "Contacto" desktop y contenedores con `overflow-clip` para no crear scrollports anidados), coordinado con `<TransitionGroup>` mediante `useRevealTransition` (`reveal-settled` liberado en `@after-enter` / `@enter-cancelled`) para que las tarjetas conserven siempre su animación de scroll tras filtrar o expandir, con contenido visible por defecto si el navegador no las soporta y sin polyfill.
- **Tipografías locales:** `@fontsource-variable` autoalojado con `preload` automático
  de los subsets WOFF2 latinos críticos en el HTML prerenderizado, sin peticiones
  a CDNs externos y con menor CLS.
- **Semántica HTML:** `header`, `main`, `section`, `article`, `nav`, `footer` y atributos ARIA en controles interactivos.
- **Imágenes y carga diferida:** primera captura de galería con `loading="eager"` y
  `fetchpriority="high"` (LCP), resto de imágenes con `loading="lazy"` y
  `decoding="async"`, y carga bajo demanda (`defineAsyncComponent`) para
  `ProjectQuickModal` y `NotFoundView`. `GalleryLightbox` muestra un skeleton
  decorativo y accesible mientras carga la imagen activa.

---

## Control de calidad y publicación

- `pnpm verify` ejecuta typecheck estricto (`vue-tsc` + `tsc`), la suite de Vitest (**151/151 pruebas** en **18 archivos**) y el build estático con `vite-ssg` (11 páginas). `cd worker && pnpm test` añade **11 pruebas** del tema global y `pnpm typecheck` verifica el Worker.
- **Fase 0 del CMS integrada en `main`** (PR #19, 2026-11-24): métricas de auditoría retiradas del sitio y tema navideño controlado solo por el admin mediante Worker + KV, sin opción pública en `SettingsMenu` ni claves nuevas en i18n.
- Release actual: **v1.4.0** (2026-11-26), mejoras de SEO/GEO: rutas `/en` prerenderizadas, `hreflang`, `lastmod` real, `llms.txt` enlazado, citas verificables y meta descriptions de 25–160 caracteres.
- Release anterior: **v1.3.3**, corrección del menú móvil y del resaltado de sección activa en el navbar. El detalle está en [`CHANGELOG.md`](CHANGELOG.md).
- Historial de cambios en [`CHANGELOG.md`](CHANGELOG.md); procedimientos de mantenimiento, tags, dependencias, monitoreo y rollback en [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md).
- Antes de publicar se revisa `git status`, se confirma que `main` no tiene cambios locales pendientes y se hace push a `origin/main` con `--follow-tags`; la rama está desplegada en producción.
- El detalle de las mejoras, su trazabilidad y la validación previa al despliegue está en [`docs/AUDIT_AND_ROADMAP.md`](docs/AUDIT_AND_ROADMAP.md).

---

## Contacto

- **Sitio en vivo:** **https://jonathanech.dev**
- **Ubicación:** Barquisimeto, Venezuela (UTC-4)
- **Email:** [jonathancamposbusiness@gmail.com](mailto:jonathancamposbusiness@gmail.com)
- **LinkedIn:** [linkedin.com/in/jonathanech](https://www.linkedin.com/in/jonathanech)
- **GitHub:** [github.com/JonathanECH](https://github.com/JonathanECH)
- **Repositorio:** [github.com/JonathanECH/jonathanech-portfolio](https://github.com/JonathanECH/jonathanech-portfolio)
