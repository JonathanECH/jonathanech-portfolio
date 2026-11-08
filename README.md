# ⚡ Jonathan Campos (ECH) — Developer Portfolio

<div align="center">

  ![Portfolio Banner](https://img.shields.io/badge/ECH-Portfolio_v0.1.0-00E5FF?style=for-the-badge&logoColor=black)
  [![Live Demo](https://img.shields.io/badge/Live_Demo-jonathanech--portfolio.vercel.app-0B0E14?style=for-the-badge&logo=vercel&logoColor=white)](https://jonathanech-portfolio.vercel.app)
  [![Vue.js](https://img.shields.io/badge/Vue.js_3.5-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript_5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Tests](https://img.shields.io/badge/Tests-25%2F25_Passing-34D399?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

  <p align="center">
    <strong>Portafolio de Ingeniería de Software con estética <i>Motion Driven</i>.</strong>
    <br />
    Home cinética interactiva, arquitectura modular, casos de estudio data-driven, doble tema y soporte multilingüe completo.
  </p>

  <p align="center">
    <a href="https://jonathanech-portfolio.vercel.app">🔗 Demo en vivo</a> •
    <a href="#-visión-general">Visión General</a> •
    <a href="#-características-principales">Características</a> •
    <a href="#-stack-tecnológico">Stack Tecnológico</a> •
    <a href="#-casos-de-estudio">Casos de Estudio</a> •
    <a href="#-arquitectura-y-estructura">Estructura</a> •
    <a href="#-comandos-de-desarrollo">Comandos</a> •
    <a href="#-accesibilidad-y-rendimiento">Accesibilidad</a>
  </p>

</div>

---

## 🎯 Visión General

Este portafolio trasciende la plantilla estática convencional: está concebido y desarrollado como una **aplicación web de ingeniería** reactiva, tipada y de alto rendimiento.

Combina una estética cyberpunk industrial (*Motion Driven*) con:
- 🔗 **Demo en vivo**: [jonathanech-portfolio.vercel.app](https://jonathanech-portfolio.vercel.app) — build de producción desplegado en Vercel.
- 🌌 **Físicas y partículas interactivas** en tiempo real mediante HTML5 Canvas.
- 🌓 **Sistema de diseño bitemático** con tokens CSS runtime (Oscuro Profundo y Claro Suave para descanso visual).
- 🌐 **Internacionalización completa (i18n)** sin bibliotecas externas, tipada de extremo a extremo.
- 📊 **Casos de estudio técnicos** con métricas de auditoría real (latencias pre/post, sincronización offline y análisis arquitectónico).

---

## ✨ Características Principales

- 🌐 **Internacionalización Nativa (i18n ES / EN)**:
  - Motor de traducción tipado en TypeScript con interpolación de variables.
  - Soporte 100% bilingüe: navegación, perfil, habilidades, los 3 casos de estudio, mockups vectoriales y metadatos dinámicos (`document.title` y `meta[name=description]`).
- 🌓 **Doble Modo de Tema (Obsidian Dark & Soft Light)**:
  - **Oscuro (`#0b0e14`)**: Fondo obsidian profundo con acento cian brillante (`#00e5ff`) y superficies oscuras sin reflejos.
  - **Claro Soft (`#edf0f8`)**: Fondo azul-grisáceo suave con tarjetas en `#f5f7fa` y texto `#1a1f2e` para máxima comodidad visual sin deslumbrar.
  - Script inline anti-flash en `index.html` que detecta la preferencia antes del primer render.
- ⚙️ **Menú de Ajustes Navbar**:
  - Popover accesible con cursor interactivo, foco atrapado y soporte de tecla `Escape`.
  - Conmutador reactivo para idioma (*Sistema / Español / Inglés*) y tema (*Sistema / Oscuro / Claro*) con persistencia en `localStorage`.
- ⚡ **Hero Cinético Reactivo**:
  - Canvas interactivo de partículas atraídas gravitacionalmente al puntero con efecto de red neuronal.
  - Parámetros de color y brillo sincronizados reactivamente al cambiar de tema.
  - Respeto automático a la directiva de accesibilidad `prefers-reduced-motion`.
- 💼 **Casos de Estudio Técnicos**:
  - Análisis detallado de desafíos reales, decisiones de arquitectura y métricas de auditoría verificables.
  - Mockups vectoriales SVG interactivos adaptados al tema del usuario.
- 🧩 **Ecosistema Tecnológico Filtrable**:
  - Catálogo de 23 tecnologías con filtrado instantáneo por categoría gestionado con Pinia.
- 🪟 **Modal de Inspección Rápida**:
  - Vista rápida de proyectos accesible desde la Home con bloqueo de scroll y focus trap.

---

## 🛠️ Stack Tecnológico

### 🚀 Stack de Construcción del Portafolio

<div align="center">
  <img src="https://skillicons.dev/icons?i=vue,ts,vite,tailwind,pinia,vitest,html,css,nodejs" alt="Core Technologies" />
</div>

<br />

| Tecnología | Categoría | Insignia | Rol en el Proyecto |
| :--- | :--- | :--- | :--- |
| **Vue.js 3.5** | Framework | [![Vue](https://img.shields.io/badge/Vue.js_3.5-35495E?style=flat-square&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/) | Single File Components con `<script setup lang="ts">` y Composition API |
| **TypeScript 5.9** | Lenguaje | [![TypeScript](https://img.shields.io/badge/TypeScript_5.9-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) | Tipado estricto en datos de proyectos, estado, temas y mensajes i18n |
| **Vite 8** | Build Tool | [![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/) | Bundler ultrarrápido impulsado por motor Rolldown |
| **Tailwind CSS v4** | Estilos | [![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) | Tokens CSS-first con `@theme inline` y paleta dinámica sin clases duplicadas |
| **Pinia 4** | Estado Global | [![Pinia](https://img.shields.io/badge/Pinia_4-FFE56E?style=flat-square&logo=pinia&logoColor=black)](https://pinia.vuejs.org/) | Gestión reactiva de filtros tecnológicos y estado del modal rápido |
| **Vue Router 5** | Enrutador | [![Vue Router](https://img.shields.io/badge/Vue_Router_5-4FC08D?style=flat-square&logo=vuerouter&logoColor=white)](https://router.vuejs.org/) | Navegación SPA fluida con sincronización reactiva de rutas y scroll suave |
| **Vitest 5** | Pruebas | [![Vitest](https://img.shields.io/badge/Vitest_5-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/) | Suite de pruebas unitarias para composables de preferencias, store e i18n |
| **pnpm** | Paquetes | [![pnpm](https://img.shields.io/badge/pnpm_12-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/) | Gestor eficiente y determinista de dependencias |

<br />

### 🌐 Ecosistema de Habilidades Representadas (23 Tecnologías)

El portafolio incluye una sección interactiva para explorar y filtrar las tecnologías dominadas en producción:

<div align="center">
  <img src="https://skillicons.dev/icons?i=vue,react,angular,ts,js,html,css,tailwind,nodejs,express,nestjs,go,php,c,cs,python,docker,aws,cloudflare,linux,git,github,postgres,mysql,mongodb,redis" alt="All Skills Icons" />
</div>

<br />

- 🖥️ **Frontend**:
  ![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

- ⚙️ **Backend & Lenguajes**:
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
  ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
  ![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
  ![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
  ![C](https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=black)
  ![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
  ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

- ☁️ **Cloud, DevOps & Infraestructura**:
  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
  ![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white)
  ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
  ![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
  ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
  ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

- 🗄️ **Bases de Datos & Caché**:
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### 🎨 Iconografía y Tipografía

- 🔤 **Fuentes Variables**: `@fontsource-variable/plus-jakarta-sans` (interfaz) y `@fontsource-variable/jetbrains-mono` (código, terminal y métricas).
- 🖼️ **Iconos de Interfaz**: `@lucide/vue` para controles, estados, navegación y flechas.
- 🏷️ **Logos de Marcas**: `simple-icons` para la renderización SVG nativa de marcas tecnológicas.

---

## 💼 Casos de Estudio

El portafolio incluye 3 proyectos emblemáticos data-driven con páginas de detalle completas:

```
├── 📦 TilyShop Inventory  ── Sincronización offline-first, lotes y auditoría crítica de almacenes.
│                           (Auditoría: 4,820 ms → 42 ms | Discrepancia: 0.00%)
├── 🏥 Gestión Médica      ── Plataforma clínica integral con agenda médica en tiempo real y triaje seguro.
└── 📊 ERP Lubriken        ── Motor contable de doble partida, balance de comprobación y conciliación fiscal.
```

---

## 📁 Arquitectura y Estructura

```
src/
├── 🧩 components/
│   ├── detail/         # Cabecera técnica, specs, auditoría, módulos, galería y mockups
│   ├── home/           # Hero cinético, tech stack, proyectos, modal rápido, about y contacto
│   ├── layout/         # AppNavbar, AppFooter y SettingsMenu con popover accesible
│   └── ui/             # SectionHeading, TechIcon y componentes visuales base
├── 🪝 composables/      # usePreferences, usePortfolioData, useScrollLock, useFocusTrap
├── 💾 data/             # portfolio.ts (ES) y portfolio.en.ts (EN) fuertemente tipados
├── 🌐 i18n/             # Diccionarios de mensajes, función t(), resolutores y paridad
├── 🚦 router/           # Configuración de rutas SPA con scroll suave y metadatos reactivos
├── 🍍 stores/           # Store de Pinia para estado global de filtrado y modal
├── 🎨 styles/           # main.css con tokens CSS variables runtime (:root y .light)
├── 📐 types/            # Contratos de interfaz para tecnologías, proyectos y preferencias
└── 📄 views/            # HomeView, ProjectDetailView y NotFoundView (404)
```

---

## 🔗 Demo

> [!TIP]
> El portafolio está desplegado y disponible en producción: **[jonathanech-portfolio.vercel.app](https://jonathanech-portfolio.vercel.app)**

| Entorno | URL |
| :--- | :--- |
| 🟢 Producción (Vercel) | [jonathanech-portfolio.vercel.app](https://jonathanech-portfolio.vercel.app) |
| 💻 Desarrollo local | [localhost:5173](http://localhost:5173) con `pnpm dev` |

El sitio desplegado corresponde al build de producción generado con `pnpm build`.

---

## 🚀 Comandos de Desarrollo

> [!NOTE]
> El proyecto está optimizado para su ejecución con **pnpm**.

```bash
# 📥 1. Instalar dependencias
pnpm install

# 💻 2. Iniciar servidor de desarrollo local con recarga en caliente
pnpm dev

# 🔍 3. Verificación de tipos estricta con vue-tsc y tsc
pnpm typecheck

# 🧪 4. Ejecutar la suite completa de pruebas unitarias (Vitest)
pnpm test

# 📦 5. Compilar bundle optimizado para producción
pnpm build

# 🛡️ 6. Pipeline de verificación completo (Typecheck + Tests + Build)
pnpm verify

# 🌐 7. Previsualizar el bundle de producción localmente
pnpm preview
```

---

## ♿ Accesibilidad y Rendimiento

- ♿ **Pautas WCAG**: Ratios de contraste calculados en temas oscuro y claro suave para superar el estándar AA/AAA.
- ⌨️ **Navegación por Teclado**: Foco visible (`:focus-visible`), cierre con tecla `Escape` en menús/modales y trampas de foco.
- 🎬 **Movimiento Reducido**: Respeta la directiva `prefers-reduced-motion: reduce`, pausando el canvas de partículas continuas y transiciones complejas.
- ⚡ **Rendimiento Web**: Tipografías alojadas localmente en formato WOFF2, cero dependencias CDN bloqueantes y SVGs vectoriales inline.

---

<div align="center">
  Diseñado y programado por <strong>Jonathan Campos (ECH)</strong> • 2026
</div>
