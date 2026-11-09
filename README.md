# Jonathan Campos (ECH) — Portfolio

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://jonathanech-portfolio.vercel.app)
[![Vue](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9_(Strict)-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-25%2F25_passed-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-12-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)

Portafolio profesional de ingeniería de software orientado al desarrollo frontend moderno. Desarrollado como una aplicación web SPA de alto rendimiento con arquitectura modular, sistema bilingüe (ES/EN), soporte para tema claro/oscuro con tokens en tiempo de ejecución, y casos de estudio técnicos data-driven.

- **Sitio en producción:** [jonathanech-portfolio.vercel.app](https://jonathanech-portfolio.vercel.app)
- **Repositorio oficial:** [github.com/JonathanECH/jonathanech-portfolio](https://github.com/JonathanECH/jonathanech-portfolio)

---

## Índice

- [Perfil y Objetivos](#perfil-y-objetivos)
- [Stack Tecnológico](#stack-tecnológico)
- [Decisiones de Arquitectura](#decisiones-de-arquitectura)
- [Casos de Estudio](#casos-de-estudio)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts y Flujo de Trabajo](#scripts-y-flujo-de-trabajo)
- [Accesibilidad y Rendimiento](#accesibilidad-y-rendimiento)
- [Contacto](#contacto)

---

## Perfil y Objetivos

- **Rol principal:** Desarrollador Frontend / Frontend Engineer.
- **Especialidades:** Arquitectura de componentes en Vue 3 y TypeScript, optimización de rendimiento en cliente, gestión de estado y diseño de interfaces accesibles.
- **Disponibilidad:** Abierto a oportunidades laborales remotas, híbridas o presenciales.
- **Zona horaria:** UTC-4.
- **Idiomas:** Español (nativo), Inglés (técnico / profesional).

---

## Stack Tecnológico

### Núcleo de la Aplicación

<div align="center">
  <img src="https://skillicons.dev/icons?i=vue,ts,vite,tailwind,pinia,vitest,html,css,nodejs" alt="Tech Stack Icons" />
</div>

<br />

| Herramienta | Versión | Propósito técnico |
| :--- | :--- | :--- |
| **Vue.js** | 3.5 | Framework reactivo utilizando Composition API y `<script setup lang="ts">`. |
| **TypeScript** | 5.9 | Tipado estricto en toda la aplicación (datos, rutas, temas e internacionalización). |
| **Vite** | 8.3 | Servidor de desarrollo instantáneo y empaquetado optimizado mediante Rolldown. |
| **Tailwind CSS** | v4 | Estilos utility-first basados en CSS nativo con directiva `@theme inline` y variables runtime. |
| **Pinia** | 4.1 | Almacén de estado global para filtros del ecosistema y control del modal rápido. |
| **Vue Router** | 5.4 | Enrutamiento SPA con scroll declarativo y sincronización de metadatos. |
| **Vitest** | 5.1 | Suite de pruebas unitarias para composables de preferencias, lógica de datos e i18n. |
| **pnpm** | 12 | Gestor de paquetes eficiente y determinista basado en enlaces duros. |

### Ecosistema y Competencias

El portafolio incluye una sección interactiva para explorar tecnologías utilizadas en proyectos reales:

- **Frontend:** Vue.js, React, Angular, TypeScript, JavaScript (ES2024), Tailwind CSS, HTML5 semántico, CSS3 moderno.
- **Backend & APIs:** Node.js, Express, NestJS, Go, PHP, C, C# (.NET), REST APIs.
- **Bases de Datos & Caché:** PostgreSQL, MySQL, MongoDB, Redis.
- **Herramientas & DevOps:** Git, GitHub, Docker, Linux, AWS, Cloudflare, Vercel.

---

## Decisiones de Arquitectura

### 1. Internacionalización Nativa y Tipada (i18n)

Se diseñó un motor de internacionalización ligero sin dependencias pesadas externas:
- **Estructura:** Diccionarios tipados bajo un contrato estricto (`src/i18n/types.ts`) que garantiza paridad total entre `src/i18n/messages/es.ts` y `src/i18n/messages/en.ts`.
- **Contenido desacoplado:** Las fuentes de datos descriptivas (`src/data/portfolio.ts` y `src/data/portfolio.en.ts`) comparten identificadores idénticos, permitiendo conmutación instantánea sin recarga de página.
- **Metadatos reactivos:** El título de página (`document.title`) y la descripción SEO (`meta[name="description"]`) se sincronizan automáticamente en función del idioma y la ruta activa.

### 2. Sistema de Doble Tema con Tokens CSS en Tiempo de Ejecución

Implementación bitemática mediante tokens CSS personalizados (`--ech-*`) definidos en `src/styles/main.css`:
- **Modo Oscuro (*Obsidian Cyber*):** Fondo `#0b0e14`, acento cian `#00e5ff`, superficies con contraste atenuado para entornos de baja luminosidad.
- **Modo Claro (*Soft Cyber*):** Fondo azul-grisáceo `#edf0f8`, superficies `#f5f7fa` y texto `#1a1f2e`, diseñado específicamente para reducir la fatiga visual sin deslumbrar.
- **Prevención de parpadeo (Anti-flash):** Un script síncrono inline en `index.html` lee `localStorage` y las preferencias del sistema (`prefers-color-scheme`) antes del primer renderizado del DOM.

### 3. Componentes Accesibles y sin Dependencias UI Externas

- **SettingsMenu:** Menú de ajustes en el navbar con selector de idioma (Sistema / ES / EN) y tema (Sistema / Oscuro / Claro), soporte de tecla `Escape`, retorno de foco al elemento disparador y atributos ARIA (`aria-haspopup`, `aria-expanded`).
- **ProjectQuickModal:** Ventana modal de vista rápida con trampa de foco (`useFocusTrap`) y bloqueo de desplazamiento del documento (`useScrollLock`).
- **Hero Canvas:** Fondo cinético con simulación física de partículas que se adapta al acento del tema activo y se desactiva de forma respetuosa ante `prefers-reduced-motion: reduce`.

---

## Casos de Estudio

El portafolio expone proyectos orientados a la resolución de problemas técnicos reales:

### 1. TilyShop Inventory — Gestión de Almacenes y Logística Offline-First
- **Enfoque:** Arquitectura frontend pensada para baja conectividad en depósitos, sincronización de transacciones por lotes e integridad de inventario.
- **Desafíos resueltos:** Reducción de latencia en consultas masivas mediante indexación local, gestión de colas de mutaciones pendientes y conciliación de estados.
- **Stack:** Vue 3, TypeScript, IndexedDB local, Tailwind CSS.

### 2. Gestión Médica — Plataforma Clínica y Expediente Electrónico
- **Enfoque:** Interfaz clínica modular para agenda médica en tiempo real, gestión de turnos y visualización de historias clínicas.
- **Desafíos resueltos:** Formularios clínicos dinámicos con validaciones estrictas, seguridad en el manejo de datos de pacientes y vistas optimizadas para consulta rápida.
- **Stack:** Vue 3, Composition API, Pinia, REST APIs.

### 3. ERP Contable / Lubriken — Motor de Doble Partida y Conciliación Fiscal
- **Enfoque:** Aplicación de contabilidad empresarial con libro mayor, balance de sumas y saldos, y módulo de conciliación bancaria.
- **Desafíos resueltos:** Renderizado de tablas financieras densas, precisión en operaciones numéricas decimales y exportación de reportes estructurados.
- **Stack:** Vue 3, TypeScript, Pinia, Tailwind CSS.

---

## Estructura del Proyecto

```
src/
├── components/
│   ├── detail/         # Cabecera técnica, auditoría, módulos arquitectónicos y galería
│   ├── home/           # Hero cinético, stack interactivo, proyectos, modal y contacto
│   ├── layout/         # AppNavbar, AppFooter y SettingsMenu accesible
│   └── ui/             # SectionHeading, TechIcon y componentes de soporte
├── composables/        # usePreferences, usePortfolioData, useFocusTrap, useScrollLock
├── data/               # portfolio.ts (ES) y portfolio.en.ts (EN) fuertemente tipados
├── i18n/               # Diccionarios de UI (es.ts, en.ts), función t() y resolución de idioma
├── router/             # Definición de rutas SPA, historial web y scroll reactivo
├── stores/             # Almacenes de Pinia (filtros tecnológicos y vista rápida)
├── styles/             # main.css con tokens CSS runtime y mapeo inline de Tailwind
├── types/              # Interfaces y contratos de dominio (proyectos, tecnologías, preferencias)
└── views/              # HomeView, ProjectDetailView y NotFoundView (404)
```

---

## Scripts y Flujo de Trabajo

El proyecto utiliza **pnpm** como gestor de paquetes exclusivo:

```bash
# Instalación de dependencias
pnpm install

# Servidor de desarrollo local (HMR)
pnpm dev

# Verificación de tipos estricta (vue-tsc + tsc)
pnpm typecheck

# Ejecución de pruebas unitarias (Vitest)
pnpm test

# Compilación de producción
pnpm build

# Pipeline de validación integral (Typecheck + Tests + Build)
pnpm verify

# Servir el build de producción localmente
pnpm preview
```

---

## Accesibilidad y Rendimiento

- **Navegación por teclado:** Enlaces de salto al contenido principal (`SkipLink`), contornos de foco visibles (`:focus-visible`) y cierre intuitivo con `Escape` en componentes modales.
- **Movimiento reducido:** Respeto íntegro de la preferencia `prefers-reduced-motion` del sistema operativo, congelando animaciones complejas y partículas del Hero.
- **Tipografías locales:** Carga autoalojada en formato WOFF2 mediante paquetes `@fontsource-variable`, eliminando peticiones externas a CDNs y mitigando desplazamientos de diseño (CLS).
- **Semántica HTML:** Uso estructurado de etiquetas `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>` y atributos ARIA en controles interactivos.

---

## Contacto

- **Ubicación:** Venezuela (UTC-4)
- **LinkedIn:** [linkedin.com/in/jonathanech](https://linkedin.com/in/jonathanech)
- **GitHub:** [github.com/JonathanECH](https://github.com/JonathanECH)
- **Portafolio en vivo:** [jonathanech-portfolio.vercel.app](https://jonathanech-portfolio.vercel.app)
