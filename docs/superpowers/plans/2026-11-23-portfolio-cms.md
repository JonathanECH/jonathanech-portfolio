# Portfolio CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear un CMS con panel de admin, invitaciones por proyecto y testimonios moderados, publicando los cambios en la web sin deploy.

**Architecture:** Postgres en Supabase es la única fuente de verdad; un backend Go con sqlc/pgx expone una API pública y otra de admin; dos apps Vue (admin y cliente) viven en subdominios propios; un Worker de Cloudflare inyecta el contenido de la API en el HTML prerenderizado de la web actual, que sigue en Vercel.

**Tech Stack:** Vue 3.5 · TypeScript estricto · Vite 8 · Vite SSG · Tailwind v4 · pnpm · Go + sqlc + pgx · Supabase CLI (migraciones y pgTAP) · Cloudflare R2 · Cloudflare Workers · Vercel.

**Spec:** `docs/superpowers/specs/2026-11-23-portfolio-cms-design.md`

## Global Constraints

- `main` está desplegada: trabajar siempre en rama (`feat/`, `fix/`, `chore/`, `docs/`), PR con `pnpm verify` en verde y `git status` revisado antes de integrar.
- pnpm exclusivamente en el frontend; nunca `npm`/`yarn` ni editar `pnpm-lock.yaml` a mano.
- Verificación frontend: `pnpm verify` = typecheck + Vitest + build SSG; debe seguir pasando tras cada tarea.
- Go: `gofmt`, `go vet ./...` y `go test ./...` en verde antes de cada commit del backend.
- Contraseñas de admin con argon2id; nunca texto plano ni SHA simple.
- Cookie de sesión `ech_admin`: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, `Domain` configurado por entorno (`admin.localhost` en local, `admin.jonathanech.dev` en producción).
- Token de invitación: 32 bytes de `crypto/rand` en base64url; en BD solo `SHA-256` del token; el token en claro se devuelve una sola vez.
- `testimonials.content`: entre 10 y 600 caracteres; `locale` solo `es` o `en`.
- `project_images.object_key` debe empezar por `projects/<slug>/`; se permiten solo WebP/PDF y hasta 10 MB.
- La API pública solo devuelve proyectos `published = true` y testimonios `approved` con `consent_at` no nulo.
- El tema navideño sustituye a claro/oscuro; la cookie `ech_theme` del Worker tiene prioridad sobre `localStorage`.
- `vercel.json` de la raíz está corregido: no tocar sus `cleanUrls`, `trailingSlash` ni cabeceras de caché.

## Review Focus

- **Token caducado, revocado o ya usado:** debe devolver 404/410 y no revelar datos del cliente ni del proyecto — cubierto en Task 7, paso 1.
- **Consentimiento ausente o contenido fuera de 10–600 caracteres:** no debe aceptarse ni publicarse — cubierto en Task 7, paso 1 y Task 8, paso 1.
- **Dos testimonios del mismo cliente para el mismo proyecto:** debe actualizar una sola fila, nunca crear dos — cubierto en Task 7, paso 1.
- **Proyecto no publicado o testimonio sin aprobar filtrándose en la API pública:** deben estar ausentes — cubierto en Task 3, paso 1.
- **Contraseña, token o clave de objeto mal formada:** no debe almacenarse ni generarse una URL firmada — cubierto en Task 4, paso 1, Task 6, paso 1 y Task 5, paso 1.
- **HTML inyectado por el Worker con caracteres de un testimonio:** debe escaparse antes de insertarse — cubierto en Task 9, paso 1.

## File Structure

```
supabase/migrations/20261123000000_cms_schema.sql   # 8 tablas, constraints e índices
supabase/tests/cms_schema.test.sql                  # pgTAP del esquema
supabase/seed.sql                                   # fixtures locales
backend/go.mod, backend/sqlc.yaml
backend/cmd/api/main.go                             # arranque, env, router
backend/internal/store/                              # código generado por sqlc
backend/queries/                                     # SQL fuente de sqlc
backend/internal/http/                               # handlers + tests
backend/internal/auth/                               # argon2id, sesión, tokens
backend/internal/r2/                                 # URL prefirmada
worker/wrangler.toml, worker/src/index.ts, worker/src/index.spec.ts
apps/admin/                                          # panel Vue
apps/client/                                         # formulario Vue
apps/shared/src/types.ts                             # espejo TS de los tipos públicos
index.html                                           # prioridad de cookie en anti-flash
src/components/home/TestimonialsSection.vue          # marcador de inyección
```

---

### Task 1: Esquema y migraciones de Supabase

**Files:**
- Create: `supabase/migrations/20261123000000_cms_schema.sql`
- Create: `supabase/tests/cms_schema.test.sql`
- Create: `supabase/seed.sql`

**Interfaces:**
- Consumes: ninguna.
- Produces: las 8 tablas del spec con sus constraints; nombres y columnas exactos que usarán `backend/queries/*.sql`.

- [ ] **Step 1: Escribir el test pgTAP que falla**

`supabase/tests/cms_schema.test.sql` debe comprobar: existencia de `admin_users`, `clients`, `client_invites`, `testimonials`, `projects`, `project_translations`, `project_images`, `site_settings`; `UNIQUE (client_id, project_id)` en `testimonials`; `CHECK (locale IN ('es','en'))`; `CHECK (id = 1)` en `site_settings`; `CHECK (char_length(content) BETWEEN 10 AND 600)`; índice único parcial de `is_cover` por proyecto; y que `token_hash` sea `UNIQUE` y no exista columna `token`.

- [ ] **Step 2: Verificar que falla**

Run: `supabase test db`
Expected: FAIL porque las tablas no existen.

- [ ] **Step 3: Crear la migración con las 8 tablas**

Usar `UUID` con `gen_random_uuid()`, `TIMESTAMPTZ`, FKs con `ON DELETE` explícito, `TEXT CHECK` para `status` y `active_theme`, y `JSONB` para `tech_tags`. No crear columnas que el spec no define.

- [ ] **Step 4: Verificar que pasa**

Run: `supabase db reset && supabase test db`
Expected: PASS con todos los asertos.

- [ ] **Step 5: Sembrar fixtures locales**

`supabase/seed.sql` inserta 1 admin, 1 cliente, 1 proyecto publicado con traducciones `es`/`en`, 1 invitación activa y 1 testimonio `pending`; el token de prueba se guarda ya hasheado.

- [ ] **Step 6: Commit**

```bash
git add supabase/ && git commit -m "feat: add CMS database schema"
```

---

### Task 2: Esqueleto Go, sqlc y health check

**Files:**
- Create: `backend/go.mod`, `backend/sqlc.yaml`
- Create: `backend/cmd/api/main.go`
- Create: `backend/internal/http/health.go`
- Test: `backend/internal/http/health_test.go`
- Generate: `backend/internal/store/db.go`, `backend/internal/store/models.go`

**Interfaces:**
- Consumes: esquema de Task 1.
- Produces: `GET /health` → `200 {"status":"ok"}`; `store.New(db *pgxpool.Pool) *Queries` y `store.Queries` usados por todas las tareas siguientes.

- [ ] **Step 1: Escribir el test que falla**

`health_test.go` usa `httptest` sobre `NewRouter()` y aserta código 200, `Content-Type: application/json` y cuerpo `{"status":"ok"}`.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http -run TestHealth -v`
Expected: FAIL, `NewRouter` no definido.

- [ ] **Step 3: Crear módulo, configuración de sqlc y router**

`sqlc.yaml` apunta a `./queries` y genera paquete `store` con `pgx/v5`; `main.go` lee `DATABASE_URL` y `PORT`, crea el pool y arranca el servidor. `NewRouter()` devuelve un `http.Handler` sin depender de la BD.

- [ ] **Step 4: Generar código y verificar**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http -run TestHealth -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/ && git commit -m "feat: scaffold Go API with sqlc and health check"
```

---

### Task 3: API pública de contenido

**Files:**
- Create: `backend/queries/public.sql`
- Create: `backend/internal/http/types.go`
- Create: `backend/internal/http/public.go`
- Test: `backend/internal/http/public_test.go`

**Interfaces:**
- Consumes: `store.Queries` (Task 2), fixtures de Task 1.
- Produces: `GET /api/public/content` → `PublicContent` con campos `theme: string`, `projects: []PublicProject`, `testimonials: []PublicTestimonial`. `PublicProject` incluye `slug`, `sector`, `year`, `accent`, `live_host`, `live_url`, `repo_url`, `featured`, `sort_order`, `images: []PublicImage`, `translations: map[string]PublicTranslation`. `PublicTestimonial` incluye `id`, `project_slug`, `display_name`, `display_role`, `content`.

- [ ] **Step 1: Escribir el test que falla**

`public_test.go` siembra un proyecto publicado y otro con `published=false`, un testimonio aprobado con `consent_at` y otro `pending`; aserta que la respuesta incluye solo el proyecto publicado, solo el testimonio aprobado, las dos claves de `translations` y `theme` leyéndose de `site_settings`.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http -run TestPublicContent -v`
Expected: FAIL, handler no definido.

- [ ] **Step 3: Escribir consultas sqlc e implementar handler**

`public.sql` filtra por `published`, `status = 'approved' AND consent_at IS NOT NULL`, y ordena por `sort_order`. `types.go` declara los tipos exactos de la interfaz; `public.go` agrupa traducciones e imágenes por proyecto.

- [ ] **Step 4: Generar y verificar**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http -run TestPublicContent -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/ && git commit -m "feat: add public content API"
```

---

### Task 4: Autenticación de admin

**Files:**
- Create: `backend/internal/auth/password.go`, `backend/internal/auth/session.go`
- Create: `backend/queries/admin_users.sql`
- Create: `backend/internal/http/admin_auth.go`
- Test: `backend/internal/auth/password_test.go`, `backend/internal/auth/session_test.go`, `backend/internal/http/admin_auth_test.go`

**Interfaces:**
- Consumes: `store.Queries`.
- Produces: `POST /api/admin/login` `{email,password}` → 204 + cookie `ech_admin`; `POST /api/admin/logout` → 204; `GET /api/admin/me` → 200 `{id,email}`; middleware `RequireAdmin(next http.Handler) http.Handler`; `auth.HashPassword(string) (string,error)` y `auth.VerifyPassword(hash,password string) bool`.

- [ ] **Step 1: Escribir los tests que fallan**

Asertar: `HashPassword` produce un prefijo argon2id y `VerifyPassword` acepta la contraseña correcta y rechaza la incorrecta; la cookie emitida tiene `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/` y el `Domain` de entorno; `GET /api/admin/me` sin cookie devuelve 401; login con contraseña incorrecta devuelve 401 y no fija cookie.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/auth ./internal/http -run 'Test(Password|Session|AdminAuth)' -v`
Expected: FAIL.

- [ ] **Step 3: Implementar hash, sesión y middleware**

Firmar la cookie con HMAC-SHA256 usando `SESSION_SECRET`, incluir `id` y `expiry`, y actualizar `last_login_at` tras login correcto. No guardar sesiones en BD.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/auth ./internal/http -run 'Test(Password|Session|AdminAuth)' -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/ && git commit -m "feat: add admin authentication"
```

---

### Task 5: CRUD de proyectos, ajustes y subida a R2

**Files:**
- Create: `backend/queries/admin_projects.sql`, `backend/queries/admin_settings.sql`
- Create: `backend/internal/http/admin_projects.go`, `backend/internal/http/admin_uploads.go`
- Create: `backend/internal/r2/signed_url.go`
- Test: `backend/internal/http/admin_projects_test.go`, `backend/internal/r2/signed_url_test.go`

**Interfaces:**
- Consumes: `RequireAdmin` (Task 4).
- Produces: `POST /api/admin/projects`; `PATCH /api/admin/projects/{id}`; `PUT /api/admin/projects/{id}/translations/{locale}`; `POST /api/admin/projects/{id}/images/signed-url` → `{url, object_key}`; `PUT /api/admin/settings` → 204. Tipos de petición: `CreateProjectRequest`, `UpdateProjectRequest`, `UpsertTranslationRequest`, `SignedUrlRequest{content_type,size,alt,width,height,is_cover}`, `SettingsRequest{active_theme,testimonials_enabled}`.

- [ ] **Step 1: Escribir los tests que fallan**

Asertar: slug duplicado → 409; publicar con alguna traducción faltante → 422; marcar una segunda imagen `is_cover` → 409 y la primera sigue siendo la portada; `PUT /api/admin/settings` mantiene una sola fila; `signed_url` rechaza clave fuera de `projects/<slug>/`, tipo distinto de WebP/PDF y tamaño > 10 MB con 422.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http ./internal/r2 -run 'Test(AdminProjects|SignedUrl)' -v`
Expected: FAIL.

- [ ] **Step 3: Implementar handlers y firma S3**

Usar `aws-sdk-go-v2/service/s3` con el `endpoint` de R2, `region: auto` y URL prefirmada con expiración de 15 minutos. La respuesta al cliente incluye `object_key`, nunca la URL definitiva.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http ./internal/r2 -run 'Test(AdminProjects|SignedUrl)' -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/ && git commit -m "feat: add project and settings admin API"
```

---

### Task 6: Clientes e invitaciones por proyecto

**Files:**
- Create: `backend/internal/auth/token.go`
- Create: `backend/queries/admin_invites.sql`
- Create: `backend/internal/http/admin_invites.go`
- Test: `backend/internal/auth/token_test.go`, `backend/internal/http/admin_invites_test.go`

**Interfaces:**
- Consumes: `RequireAdmin` (Task 4), proyectos de Task 5.
- Produces: `POST /api/admin/clients` `{email,company}` → 201 `{id}`; `POST /api/admin/clients/{id}/invites` `{project_id,expires_in_days}` → 201 `{url,token}`; `POST /api/admin/clients/{id}/invites/{invite_id}/revoke` → 204. `auth.NewInviteToken() (plain string, hash string, err error)`.

- [ ] **Step 1: Escribir los tests que fallan**

Asertar: `plain` tiene 43 caracteres base64url y `hash` es SHA-256 de `plain`; la BD no contiene el token en claro; crear dos invitaciones activas para el mismo par cliente/proyecto devuelve 409; revocar devuelve 204 y el token deja de ser válido; la respuesta incluye `url` con `client.jonathanech.dev/<token>` y el token solo aparece en esa respuesta.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/auth ./internal/http -run 'Test(InviteToken|AdminInvites)' -v`
Expected: FAIL.

- [ ] **Step 3: Implementar generación, hash y endpoints**

Usar `crypto/rand`, `sha256.Sum256` y `base64.RawURLEncoding`. La restricción de invitación activa se resuelve con un índice único parcial sobre `(client_id, project_id)` donde `used_at IS NULL AND revoked_at IS NULL`.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/auth ./internal/http -run 'Test(InviteToken|AdminInvites)' -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/ && git commit -m "feat: add clients and project invitations"
```

---

### Task 7: Envío del testimonio

**Files:**
- Create: `backend/queries/public_invites.sql`, `backend/queries/testimonials.sql`
- Create: `backend/internal/http/public_invites.go`, `backend/internal/http/testimonials.go`
- Test: `backend/internal/http/public_invites_test.go`, `backend/internal/http/testimonials_test.go`

**Interfaces:**
- Consumes: tokens de Task 6, esquema de Task 1.
- Produces: `GET /api/public/invites/{token}` → `InviteView{client_name, project:{slug,title}}`; `POST /api/public/testimonials` con cuerpo `{token,content,author_role,consent}` → 201 `{id,status:"pending"}`.

- [ ] **Step 1: Escribir los tests que fallan**

Asertar: token inexistente → 404; token expirado o revocado → 410; `consent=false` → 422; contenido de 9 y 601 caracteres → 422; envío válido crea fila `pending` con `consent_at` y marca `used_at`; un segundo envío con el mismo token → 409; tras rechazo y nueva invitación, el envío actualiza la misma fila y la deja `pending`, sin crear un segundo registro.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http -run 'Test(PublicInvites|Testimonials)' -v`
Expected: FAIL.

- [ ] **Step 3: Implementar consultas y handlers**

La resolución de token compara siempre el hash; el upsert usa `ON CONFLICT (client_id, project_id)` y guarda `display_name`/`display_role` desde el cliente y la invitación, no desde parámetros libres del formulario.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http -run 'Test(PublicInvites|Testimonials)' -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/ && git commit -m "feat: add testimonial submission flow"
```

---

### Task 8: Moderación

**Files:**
- Create: `backend/queries/admin_testimonials.sql`, `backend/internal/http/admin_testimonials.go`
- Test: `backend/internal/http/admin_testimonials_test.go`

**Interfaces:**
- Consumes: `RequireAdmin` (Task 4).
- Produces: `GET /api/admin/testimonials?status=pending|approved|rejected`; `POST /api/admin/testimonials/{id}/approve`; `POST /api/admin/testimonials/{id}/reject`.

- [ ] **Step 1: Escribir el test que falla**

Asertar: el listado respeta `status`; aprobar sin `consent_at` devuelve 422; aprobar con consentimiento fija `status='approved'`, `moderated_by` y `moderated_at`; rechazar fija `status='rejected'`; un testimonio rechazado no aparece en `GET /api/public/content` (Task 3).

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http -run TestAdminTestimonials -v`
Expected: FAIL.

- [ ] **Step 3: Implementar endpoints**

Tomar `moderated_by` de la sesión de admin, nunca del cuerpo de la petición.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http -run TestAdminTestimonials -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/ && git commit -m "feat: add testimonial moderation API"
```

---

### Task 9: Worker de Cloudflare y tema global

**Files:**
- Create: `worker/package.json`, `worker/wrangler.toml`, `worker/src/index.ts`, `worker/src/index.spec.ts`
- Create: `src/components/home/TestimonialsSection.vue`
- Modify: `index.html` (script anti-flash)

**Interfaces:**
- Consumes: `GET /api/public/content` (Task 3).
- Produces: HTML servido con testimonios inyectados en `<!--ECH_CMS_TESTIMONIALS-->`; cookie `ech_theme` con valor `default` o `christmas`; envvars `PUBLIC_SITE_ORIGIN` y `API_ORIGIN`.

- [ ] **Step 1: Escribir el test que falla**

Con `fetch` simulado, asertar: el HTML devuelto contiene el texto del testimonio aprobado; los caracteres `<script>` de un testimonio se escapan; cuando la API responde `theme: "christmas"` la respuesta fija `Set-Cookie: ech_theme=christmas; Path=/; SameSite=Lax`; si la API falla, se sirve el HTML original sin cookie y sin error 500; el script anti-flash prioriza `ech_theme` sobre `localStorage` y restaura la preferencia guardada cuando la cookie vale `default`.

- [ ] **Step 2: Verificar que falla**

Run: `cd worker && pnpm test`
Expected: FAIL, módulo no existe.

- [ ] **Step 3: Añadir marcadores al SSG e implementar el Worker**

`TestimonialsSection.vue` renderiza el contenedor con el comentario marcador; `index.ts` usa `HTMLRewriter` sobre la respuesta de Vercel, inserta el HTML escapado y añade la cookie; configurar TTL corto para la petición a la API.

- [ ] **Step 4: Verificar que pasa y no rompe la web**

Run: `cd worker && pnpm test && cd ../.. && pnpm verify`
Expected: PASS; build SSG sigue generando 6 páginas.

- [ ] **Step 5: Smoke test local**

Run: `cd worker && wrangler dev` y, en otra terminal, `curl -s localhost:8787 | grep -q 'Texto del testimonio de prueba'` → el contenido inyectado aparece y el marcador ya no está en el HTML servido.

- [ ] **Step 6: Commit**

```bash
git add worker/ index.html src/components/home/TestimonialsSection.vue && git commit -m "feat: inject CMS content and global theme at the edge"
```

---

### Task 10: Apps de admin y cliente, dominios y documentación

**Files:**
- Create: `apps/admin/`, `apps/client/`, `apps/shared/src/types.ts`
- Modify: `pnpm-workspace.yaml` (añadir `apps/*` y conservar `onlyBuiltDependencies`)
- Create: `apps/admin/vercel.json`, `apps/client/vercel.json`
- Modify: `README.md`, `docs/MAINTENANCE.md`

**Interfaces:**
- Consumes: todas las rutas de Task 3–8; `apps/shared/src/types.ts` es el espejo TS de `PublicContent`, `PublicProject`, `PublicTranslation`, `PublicImage`, `PublicTestimonial`, `InviteView` y `TestimonialStatus`.
- Produces: panel en `admin.jonathanech.dev` y formulario en `client.jonathanech.dev`; ambos reenvían `/api/*` a `api.jonathanech.dev` con rewrite de Vercel.

- [ ] **Step 1: Escribir tests que fallan en las dos apps**

Admin: el formulario de proyecto exige slug y traducciones `es` y `en`; el panel oculta acciones hasta recibir 200 de `/api/admin/me`. Cliente: el envío exige consentimiento marcado y contenido de 10–600 caracteres; el token inválido muestra un estado de error sin formulario.

- [ ] **Step 2: Verificar que falla**

Run: `pnpm --filter admin test && pnpm --filter client test`
Expected: FAIL.

- [ ] **Step 3: Implementar las dos apps y el cliente API compartido**

Usar `apiFetch` con `credentials: 'same-origin'` y cookies HttpOnly; en cliente, el token viaja en la petición, nunca en `localStorage`. Aplicar `prefers-reduced-motion` y `focus-visible` en ambos paneles.

- [ ] **Step 4: Configurar rewrites y entornos**

Cada `vercel.json` reenvía `/api/(.*)` a `https://api.jonathanech.dev/api/$1`; documentar envvars (`DATABASE_URL`, `SESSION_SECRET`, `R2_*`, `API_ORIGIN`) y los DNS de los cuatro subdominios en Cloudflare.

- [ ] **Step 5: Verificar todo y documentar**

Run: `pnpm verify && pnpm --filter admin test && pnpm --filter client test && git status --short`
Expected: PASS y sin archivos inesperados; README y MAINTENANCE describen el nuevo flujo y el orden de despliegue (BD → API → Worker → apps).

- [ ] **Step 6: Commit**

```bash
git add apps/ pnpm-workspace.yaml README.md docs/MAINTENANCE.md && git commit -m "feat: add admin and client apps with deployment config"
```

## Verification Commands

- `supabase start && supabase db reset && supabase test db` → esquema y constraints.
- `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./...` → API Go.
- `cd worker && pnpm test && wrangler dev` → inyección y cookie de tema.
- `pnpm verify` → typecheck, 124+ tests y build SSG de la web pública.
- `pnpm --filter admin test && pnpm --filter client test` → panel y formulario.
- Smoke final: aprobar un testimonio en el panel y recargar `jonathanech.dev` sin deploy, comprobando que aparece y que con `active_theme='christmas'` el tema festivo gana sobre la preferencia local.
