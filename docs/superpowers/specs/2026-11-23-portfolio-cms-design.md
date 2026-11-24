# Portfolio CMS — Design Spec

> Estado: aprobado en conversación el 2026-11-23. Este documento es la fuente de
> verdad del diseño; el plan de implementación está en
> `docs/superpowers/plans/2026-11-23-portfolio-cms.md`.

## Intención

Sustituir los datos escritos a mano por un pequeño CMS: una vista de admin para
gestionar proyectos y temas, invitaciones por proyecto para que los clientes
dejen testimonios, y moderación antes de publicarlos. Cualquier cambio aprobado
debe verse en `jonathanech.dev` **sin hacer deploy**.

## Objetivos

- Publicar/editar proyectos bilingües (es/en) desde el panel sin tocar código.
- Activar un tema navideño global desde el panel, sin deploy.
- Que cada cliente deje **un testimonio por proyecto realizado**, previa invitación.
- Mostrar solo testimonios aprobados y con consentimiento explícito.
- Guardar las imágenes en Cloudflare R2 con dominio propio.
- Conservar el HTML prerenderizado de la web pública (SEO/GEO actual).

## No objetivos

- No migrar la web pública a SSR ni a otro framework.
- No crear una tabla `users` ni dar login a los clientes.
- No guardar imágenes como BLOB en Postgres.
- No depender de Supabase Auth: la autenticación de admin es propia.

## Anti-objetivos (qué sería un fallo aunque funcione)

- Un panel que obligue a hacer deploy para publicar.
- Testimonios visibles sin consentimiento o sin aprobación.
- Un cambio de tema que provoque flash de contenido o rompa el contraste AA.
- Enlaces de invitación reutilizables sin control de caducidad.

## Restricciones del proyecto

- `main` está desplegada en Vercel; todo cambio va en rama y PR con `pnpm verify` en verde.
- Web actual: Vue 3 + TypeScript estricto + Vite 8 + Vite SSG + Tailwind v4 + pnpm.
- `vercel.json` fue reparado el 2026-11-23 y contiene `cleanUrls`, `trailingSlash` y cabeceras de caché.
- Dominio en Cloudflare; Vercel sirve la web pública.
- Supabase local para desarrollo; Postgres en Supabase para producción.
- Backend en Go; ORM elegido: sqlc + pgx con migraciones SQL de Supabase CLI.

## Decisiones de diseño (cerradas)

### Esquema (8 tablas)

| Tabla | Decisiones clave |
| :--- | :--- |
| `admin_users` | `id UUID`, `email UNIQUE`, `password_hash` (argon2id), `created_at`, `last_login_at`. Una sola admin; sin roles. |
| `clients` | `id UUID`, `email UNIQUE`, `company`, `created_by` FK a `admin_users`, `created_at`. Sin contraseña. |
| `client_invites` | `id UUID`, `client_id` FK, `project_id` FK, `token_hash` UNIQUE, `expires_at`, `used_at`, `revoked_at`, `created_by`. Token en claro mostrado **una sola vez**; se guarda solo su hash. |
| `testimonials` | `id UUID`, `client_id` FK, `project_id` FK NOT NULL, `invite_id` FK, `UNIQUE (client_id, project_id)`, `content` CHECK 10–600, `display_name`/`display_role` como copia del momento, `status` CHECK (`pending`/`approved`/`rejected`), `consent_at`, `is_featured`, `sort_order`, `moderated_by`, `moderated_at`, timestamps. |
| `projects` | `id UUID`, `slug` UNIQUE, `sector`, `year INT`, `accent` con formato validado, `live_host`, `live_url`, `repo_url`, `featured`, `sort_order`, `published`, timestamps. |
| `project_translations` | PK `(project_id, locale)` con `locale CHECK IN ('es','en')`; `title`, `title_highlight`, `role`, `summary`, `problem`, `diagnosis`, `resolution`, `tech_tags JSONB`. |
| `project_images` | `id UUID`, `project_id` FK, `object_key`, `alt`, `width`, `height`, `sort_order`, `is_cover` con índice único parcial por proyecto. |
| `site_settings` | Fila única con `CHECK (id = 1)`: `active_theme`, `testimonials_enabled`, `updated_at`. |

### Flujos

1. El admin crea un cliente y una invitación **por proyecto**; el panel muestra el enlace `https://client.jonathanech.dev/<token>` una vez.
2. El cliente abre el enlace, ve solo ese proyecto, escribe el testimonial y marca un
   checkbox de consentimiento sin marcar por defecto.
3. Si el testimonio se rechaza, se genera otra invitación: el formulario recupera el
   borrador y actualiza **la misma fila** (`UNIQUE (client_id, project_id)`),
   volviendo a `pending`.
4. El admin aprueba o rechaza; solo `approved` con `consent_at` se expone al público.
5. Un Cloudflare Worker delante de Vercel inyecta en el HTML prerenderizado los
   proyectos y testimonios devueltos por la API Go, y fija una cookie de tema.
6. El script anti-flash de `index.html` prioriza la cookie del Worker sobre
   `localStorage`: el tema navideño sustituye por completo claro/oscuro. Al
   desactivarse, se restaura la preferencia guardada del visitante.
7. Las subidas de imágenes usan URLs prefirmadas: el navegador sube directo a R2;
   en la BD se guarda `object_key`, `alt`, `width` y `height`, nunca la URL completa.

### Topología

- `jonathanech.dev`: web pública actual (Vite SSG en Vercel) + Worker de Cloudflare delante.
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
