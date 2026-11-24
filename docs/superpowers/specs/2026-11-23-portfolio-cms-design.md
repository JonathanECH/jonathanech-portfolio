# Portfolio CMS — Design Spec

> Estado: aprobado en conversación el 2026-11-23; alcance por fases y decisiones
> de contenido actualizados el 2026-11-24. Este documento es la fuente de
> verdad del diseño; el plan de implementación está en
> `docs/superpowers/plans/2026-11-23-portfolio-cms.md`.

## Intención

Sustituir los datos escritos a mano por un pequeño CMS: una vista de admin para
gestionar proyectos y temas, invitaciones por proyecto para que los clientes
dejen testimonios, y moderación antes de publicarlos. Cualquier cambio aprobado
debe verse en `jonathanech.dev` **sin hacer deploy**.

La entrega se divide en dos fases. La **Fase 0** (noviembre de 2026) implementa
el tema navideño, su activación global restringida al admin y la retirada de las
métricas del sitio; la **Fase 1** (después de diciembre de 2026) implementa el
CMS completo. La Fase 0 adelanta la parte mínima del Worker necesaria para que
el admin cambie el tema de todos los visitantes sin deploy, y no debe dejar deuda
que obligue a rehacer el anti-flash o los estilos en Fase 1.

## Objetivos

- Publicar/editar proyectos bilingües (es/en) desde el panel sin tocar código.
- Activar un tema navideño global **solo desde el admin**, sin deploy; el
  visitante nunca tiene un control para activarlo ni desactivarlo.
- Que cada cliente deje **un testimonio por proyecto realizado**, previa invitación.
- Mostrar solo testimonios aprobados, en la home y al pie de su caso de estudio.
- Mostrar el testimonio en el idioma original en que lo escribió el cliente; el
  selector ES/EN traduce solo la interfaz del panel y del formulario.
- Guardar las imágenes en Cloudflare R2 con dominio propio.
- Conservar el HTML prerenderizado de la web pública (SEO/GEO actual).
- Retirar del sitio las métricas de auditoría de los proyectos, sin tocar la
  documentación donde se respaldan.

## No objetivos

- No migrar la web pública a SSR ni a otro framework.
- No crear una tabla `users` ni dar login a los clientes.
- No guardar imágenes como BLOB en Postgres.
- No depender de Supabase Auth: la autenticación de admin es propia.
- No eliminar métricas de `README.md`, `docs/AUDIT_AND_ROADMAP.md` ni del
  whitepaper PDF: el recorte es **solo del sitio** (datos, componentes y tests).
- No ofrecer el tema navideño en el `SettingsMenu` público: el visitante conserva
  su selector claro/oscuro, pero no puede activar ni desactivar el tema festivo.
- No activar la BD, la API Go ni las apps de admin/cliente hasta después de
  diciembre; en Fase 0 solo se adelanta el Worker mínimo del tema.

## Anti-objetivos (qué sería un fallo aunque funcione)

- Un panel que obligue a hacer deploy para publicar.
- Testimonios visibles sin consentimiento o sin aprobación.
- Un cambio de tema que provoque flash de contenido, pierda la preferencia
  guardada al desactivarse o rompa el contraste AA.
- Que un visitante pueda activar el navideño editando una cookie o una variable
  del bundle: el estado debe residir solo en el lado del servidor/Worker.
- Dos fuentes de verdad simultáneas para el tema (KV del Worker y
  `site_settings`) al terminar la Fase 1.
- Enlaces de invitación reutilizables sin control de caducidad.
- Registros en `project_images` cuyo objeto nunca llegó a R2 por una subida fallida.
- Bloques de métricas de auditoría (`audit.metrics`, `consistencyNote`) aún
  visibles en la web pública tras la Fase 0.
- Un selector de idioma que traduzca o reescriba el contenido del testimonio.

## Restricciones del proyecto

- `main` está desplegada en Vercel; todo cambio va en rama y PR con `pnpm verify` en verde.
- Web actual: Vue 3 + TypeScript estricto + Vite 8 + Vite SSG + Tailwind v4 + pnpm.
- `vercel.json` fue reparado el 2026-11-23 y contiene `cleanUrls`, `trailingSlash` y cabeceras de caché.
- Dominio en Cloudflare; Vercel sirve la web pública.
- Supabase local para desarrollo; Postgres en Supabase para producción.
- Backend en Go; sqlc + pgx con migraciones SQL de Supabase CLI, confinados a `backend/internal/repository/postgres/`.
- Patrón Repositorio: `backend/internal/domain/` define modelos puros de Go (solo tipos nativos como `string` y `time.Time`, nunca `pgtype.*`), errores de dominio (`ErrNotFound`, `ErrConflict`, etc.) e interfaces de repositorio. `backend/internal/http/` depende solo de esas interfaces y nunca importa `pgx` ni el paquete generado `store`.
- `locale` (`es` | `en`) aplica únicamente a `project_translations`; `testimonials` no tiene columna `locale` y se muestra en el idioma original en que lo escribió el cliente.

## Alcance por fases

### Fase 0 — se implementa ahora (noviembre de 2026)

1. **Tema navideño con interruptor de admin.** El visitante conserva su selector
   claro/oscuro (`system`/`dark`/`light`) en `ech:preferences`, pero no ve ninguna
   opción navideña. El estado global vive en Cloudflare KV del Worker (clave
   `theme`, valores `default`/`christmas`) y solo se cambia mediante un endpoint
   autenticado del Worker con un secreto de admin comparado en tiempo constante.
   El Worker fija la cookie `ech_theme` en las respuestas HTML; el script
   anti-flash de `index.html` la prioriza sobre `localStorage`, aplica el tema
   antes del primer paint y, cuando vuelve a `default`, restaura la preferencia
   guardada. El tema navideño sustituye por completo a claro/oscuro. El endpoint
   y su secreto son temporales: Fase 1 los sustituye por la sesión de admin y
   `site_settings.active_theme`.
2. **Métricas fuera del sitio.** Se eliminan `AuditMetric`, `audit.metrics` y
   `audit.consistencyNote` de los tipos y de los dos archivos de datos, y sus
   bloques de `ProjectCard.vue`, `ProjectQuickModal.vue`, `ChallengeAudit.vue` y
   `ProjectHeader.vue`, con sus tests. Quedan intactos `README.md`,
   `docs/AUDIT_AND_ROADMAP.md` y el whitepaper PDF. Fuera de alcance:
   `ZoomMetrics` (interno del visor), `profile.stats`/`profile.performance` y
   los textos alternativos que describen capturas con la palabra «metrics».

La Fase 0 se entrega en ramas `feat/` con `pnpm verify` en verde y no crea
migraciones, backend Go ni apps nuevas; sí crea el Worker mínimo con KV y el
endpoint autenticado del tema.

### Fase 1 — después de diciembre de 2026

El resto del CMS: esquema de 10 tablas, backend Go, API pública y de admin,
apps `admin.` y `client.`, invitaciones, moderación y publicación sin deploy. No
se comienza antes de enero de 2027. La Fase 1 reutiliza el contrato de
`ech_theme` y el Worker de Fase 0: mueve el estado a
`site_settings.active_theme`, migra una sola vez el valor de KV a la fila única,
retira el endpoint temporal y su secreto, y usa la sesión de admin. Queda una
sola fuente de verdad y el script anti-flash no cambia.

## Decisiones de diseño (cerradas)

### Arquitectura de backend (Patrón Repositorio)

- `backend/internal/domain/`: modelos puros (`string`, `time.Time`, `[]string`), errores de dominio (`ErrNotFound`, `ErrConflict`, `ErrValidation`) e interfaces (`ProjectRepository`, `TestimonialRepository`, `AdminRepository`, `ClientRepository`, `InviteRepository`, `SettingsRepository`, `ImageRepository`).
- `backend/internal/repository/postgres/`: implementaciones con sqlc + pgx; el código generado vive en `backend/internal/repository/postgres/store/`. Este paquete traduce `pgtype.*` a tipos nativos y códigos de PostgreSQL (por ejemplo `23505`) a errores de dominio.
- `backend/internal/http/`: handlers y middleware solo consumen interfaces de `internal/domain`. Los tests HTTP usan repositorios en memoria; las pruebas de integración SQL viven en `repository/postgres`.

### Esquema (10 tablas)

| Tabla | Decisiones clave |
| :--- | :--- |
| `admin_users` | `id UUID`, `email UNIQUE`, `password_hash` (argon2id), `created_at`, `last_login_at`. Una sola admin; sin roles. |
| `clients` | `id UUID`, `name TEXT NOT NULL`, `email UNIQUE`, `company`, `created_by` FK a `admin_users`, `created_at`. Sin contraseña. |
| `client_invites` | `id UUID`, `client_id` FK, `project_id` FK, `token_hash` UNIQUE, `expires_at`, `used_at`, `revoked_at`, `created_by`. Token en claro mostrado **una sola vez**; se guarda solo su hash. |
| `testimonials` | `id UUID`, `client_id` FK, `project_id` FK NOT NULL, `invite_id` FK, `UNIQUE (client_id, project_id)`, `content` CHECK 10–600, `display_name`/`display_role` como copia del momento, `status` CHECK (`pending`/`approved`/`rejected`), `consent_at`, `is_featured`, `sort_order`, `moderated_by`, `moderated_at`, timestamps. Sin columna `locale`: se muestra en el idioma original en que lo escribió el cliente. **No tiene flag `published`**: aprobar (`approved` + `consent_at`) equivale a publicar. |
| `projects` | `id UUID`, `slug` UNIQUE, `sector`, `year TEXT`, `status`, `client`, `duration`, `stack_key`, `accent` con formato validado, `live_host`, `live_url`, `repo_url`, `whitepaper_url`, `featured`, `sort_order`, `published`, timestamps. |
| `project_translations` | PK `(project_id, locale)` con `locale CHECK IN ('es','en')`; `name`, `title`, `title_highlight`, `role`, `summary`, `problem`, `tech_tags JSONB`, `gallery_description`, `challenge_intro`, `challenge_points JSONB`, `diagnosis`, `resolution`, `audit_badge`. **Sin columnas `metrics` ni `consistency_note`**: las métricas no se migran a la BD. |
| `project_modules` | `id UUID`, `project_id` FK, `locale CHECK IN ('es','en')`, `code`, `sort_order`, `title`, `subtitle`, `description`, `points JSONB`, `icon`; `UNIQUE (project_id, locale, code)`. |
| `gallery_slides` | `id UUID`, `project_id` FK, `locale CHECK IN ('es','en')`, `slide_id`, `title`, `caption`, `path`, `badges JSONB`, `image_object_key`, `alt`, `sort_order`; `UNIQUE (project_id, locale, slide_id)`. |
| `project_images` | `id UUID`, `project_id` FK, `object_key`, `alt`, `width`, `height`, `sort_order`, `is_cover` con índice único parcial por proyecto. |
| `site_settings` | Fila única con `CHECK (id = 1)`: `active_theme`, `testimonials_enabled`, `updated_at`. |

Todo el contenido de los proyectos que hoy vive en `portfolio.ts` /
`portfolio.en.ts` pasa a la BD —incluidos retos, módulos, galería y enlaces—
**excepto las métricas de auditoría**, que desaparecen del sitio en Fase 0. `year`
pasa a `TEXT` para conservar el formato actual sin conversiones en el DTO.

### Flujos

1. El admin crea un cliente y una invitación **por proyecto**; el panel muestra el enlace `https://client.jonathanech.dev/<token>` una vez.
2. El cliente abre el enlace, ve solo ese proyecto, escribe el testimonial y marca un
   checkbox de consentimiento sin marcar por defecto.
3. Si el testimonio se rechaza, se genera otra invitación:
   `GET /api/public/invites/{token}` devuelve
   `InviteView{client_name, project: {slug, title}, existing_testimonial?: {content, display_role}}`
   cuando ya existe una fila para `(client_id, project_id)`, de modo que `apps/client`
   precargue el borrador anterior y actualice **la misma fila**
   (`UNIQUE (client_id, project_id)`), volviendo a `pending`.
4. El admin aprueba o rechaza. Aprobar equivale a publicar: solo `approved` con
   `consent_at` se expone al público; no existe un flag `published` adicional en
   `testimonials`. Los testimonios aprobados aparecen en la home (ordenados por
   `is_featured` y `sort_order`) y al pie del proyecto indicado por
   `project_slug`. Si no hay ninguno, la sección se oculta para no provocar CLS.
5. Un Cloudflare Worker delante de Vercel inyecta en el HTML prerenderizado un bloque
   `<script id="__ECH_CMS_DATA__" type="application/json">` con `projects` y
   `testimonials` (escapando `</script>` y secuencias peligrosas para evitar XSS), y fija
   una cookie de tema. Vue consume ese JSON de forma síncrona durante la hidratación
   (`TestimonialsSection.vue` y las vistas `/proyectos/:slug`) para no provocar
   *hydration mismatch*. Las rutas de proyectos creados sin deploy se resuelven al shell
   SPA con esos datos/API antes de caer en 404.
6. El Worker es el único que escribe `ech_theme` (desde KV en Fase 0, desde
   `site_settings` en Fase 1). El script anti-flash de `index.html` prioriza esa
   cookie sobre `localStorage`: el tema navideño sustituye por completo
   claro/oscuro. Al desactivarse, se restaura la preferencia guardada del
   visitante. La web pública nunca ofrece el control navideño.
7. Las subidas a R2 ocurren en dos fases para no dejar registros huérfanos:
   1. `POST /api/admin/projects/{id}/images/signed-url` con `{content_type, size}` →
      `{url, object_key}`; valida prefijo `projects/<slug>/`, solo WebP/PDF y ≤ 10 MB,
      sin escribir aún en BD.
   2. `POST /api/admin/projects/{id}/images` con
      `{object_key, alt, width, height, is_cover}` → `201`, solo después de recibir
      `200 OK` de R2; inserta en `project_images`.
   3. `DELETE /api/admin/projects/{id}/images/{image_id}` → `204`.
   En la BD se guarda `object_key`, nunca la URL completa.
8. `admin.jonathanech.dev` y `client.jonathanech.dev` tienen cada uno su selector
   ES/EN con diccionarios propios y tests de paridad de claves. Traducen
   etiquetas, validaciones y estados; nunca el `content` del testimonio, que se
   muestra tal como lo escribió el cliente.
9. Puesto que las rutas y el contenido salen de la BD, el Worker también inyecta
   los slugs publicados en `sitemap.xml` y el JSON-LD de cada ruta, no solo el
   bloque `__ECH_CMS_DATA__`. Sin esto, un proyecto creado sin deploy existiría
   pero sería invisible para los crawlers.

### Topología

- `jonathanech.dev`: web pública actual (Vite SSG en Vercel) + Worker de Cloudflare delante. El Worker existe desde Fase 0 y entonces solo gestiona el tema global con KV y su endpoint de admin; en Fase 1 se amplía con el JSON y el contenido.
- `admin.jonathanech.dev`: panel Vue (build propio del mismo repo).
- `client.jonathanech.dev`: formulario Vue (build propio del mismo repo).
- `api.jonathanech.dev`: único backend Go. Cada app de Vercel reenvía `/api/*` a ese
  host mediante rewrite, así el navegador no hace peticiones cross-origin y la
  cookie de admin puede ser `SameSite=Lax`.
- Subidas a R2 bajo `projects/<slug>/...`, servidas desde un subdominio de Cloudflare.

## Decisiones dejadas al implementador

- Versión concreta de Go y proveedor de hosting del backend (Fly.io, Railway o similar).
- Paleta y componentes visuales del tema navideño, manteniendo contraste AA.
- Textos exactos ES/EN del panel y del formulario (la web pública ya tiene i18n propio).
- Estrategia de caché del Worker: se recomienda TTL corto para `/api/public/content`.
