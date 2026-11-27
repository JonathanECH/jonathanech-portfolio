# Portfolio CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear un CMS con panel de admin, invitaciones por proyecto y testimonios moderados, publicando los cambios en la web sin deploy. **Fase 0 (ahora, noviembre de 2026):** tema navideño y eliminación de las métricas del sitio. **Fase 1 (después de diciembre de 2026):** el resto del CMS; no iniciar antes de enero de 2027.

**Architecture:** Postgres en Supabase es la única fuente de verdad; un backend Go con sqlc/pgx confinado a `internal/repository/postgres/` expone una API pública y otra de admin a través de interfaces de `internal/domain`; dos apps Vue (admin y cliente) viven en subdominios propios; un Worker de Cloudflare inyecta un bloque JSON hidratable en el HTML prerenderizado de la web actual, que sigue en Vercel. La Fase 0 adelanta el Worker mínimo: Cloudflare KV guarda el estado global del tema y un endpoint autenticado permite al admin cambiarlo para todos sin deploy; la web pública solo lee la cookie resultante y no expone ningún control navideño.

**Tech Stack:** Vue 3.5 · TypeScript estricto · Vite 8 · Vite SSG · Tailwind v4 · pnpm · Go + sqlc + pgx · Supabase CLI (migraciones y pgTAP) · Cloudflare R2 · Cloudflare Workers · Vercel.

**Spec:** `docs/superpowers/specs/2026-11-23-portfolio-cms-design.md` (alcance por fases en «Alcance por fases»).

## Global Constraints

- `main` está desplegada: trabajar siempre en rama (`feat/`, `fix/`, `chore/`, `docs/`), PR con `pnpm verify` en verde y `git status` revisado antes de integrar.
- pnpm exclusivamente en el frontend; nunca `npm`/`yarn` ni editar `pnpm-lock.yaml` a mano.
- Verificación frontend: `pnpm verify` = typecheck + Vitest + build SSG; debe seguir pasando tras cada tarea.
- Go: `gofmt`, `go vet ./...` y `go test ./...` en verde antes de cada commit del backend.
- Contraseñas de admin con argon2id; nunca texto plano ni SHA simple.
- Cookie de sesión `ech_admin`: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, `Domain` configurado por entorno (`admin.localhost` en local, `admin.jonathanech.dev` en producción).
- Token de invitación: 32 bytes de `crypto/rand` en base64url; en BD solo `SHA-256` del token; el token en claro se devuelve una sola vez.
- `testimonials.content`: entre 10 y 600 caracteres; `testimonials` no tiene columna `locale` y se muestra en el idioma original en que lo escribió el cliente.
- `locale` (`es` | `en`) aplica únicamente a `project_translations`.
- `backend/internal/domain/` define modelos puros de Go (solo tipos nativos como `string` y `time.Time`, nunca `pgtype.*`), errores de dominio (`ErrNotFound`, `ErrConflict`, `ErrValidation`) e interfaces de repositorio.
- sqlc + pgx viven solo en `backend/internal/repository/postgres/` (código generado en `backend/internal/repository/postgres/store/`); ese paquete traduce `pgtype.*` a tipos nativos y errores de PostgreSQL (por ejemplo `23505`) a errores de dominio.
- `backend/internal/http/` solo depende de interfaces de `internal/domain`: nunca importa `pgx` ni `store.Queries`. Tests HTTP con repositorios en memoria; integración SQL en `repository/postgres`.
- `project_images.object_key` debe empezar por `projects/<slug>/`; se permiten solo WebP/PDF y hasta 10 MB.
- La API pública solo devuelve proyectos `published = true` y testimonios `approved` con `consent_at` no nulo.
- El tema navideño sustituye a claro/oscuro; la cookie `ech_theme` del Worker tiene prioridad sobre `localStorage`.
- `vercel.json` de la raíz está corregido: no tocar sus `cleanUrls`, `trailingSlash` ni cabeceras de caché.
- Fase 0 primero: tema navideño y retirada de métricas. Las tareas 1–10 no se comienzan hasta después de diciembre de 2026.
- Las métricas se eliminan **solo del sitio**: tipos, `portfolio.ts`, `portfolio.en.ts`, componentes y tests. No tocar `README.md`, `docs/AUDIT_AND_ROADMAP.md` ni el whitepaper PDF.
- Alcance exacto de la retirada: `AuditMetric`, `audit.metrics` y `audit.consistencyNote`. Fuera de alcance: `ZoomMetrics`, `profile.stats`, `profile.performance` y textos alternativos que mencionen «metrics».
- Contrato de tema desde Fase 0: `ech_theme` vale `default` o `christmas`; la cookie gana sobre `localStorage`; al volver a `default` se restaura la preferencia guardada.
- El visitante nunca activa ni desactiva el navideño: no hay opción en `SettingsMenu`, no se persiste en el bundle y la web pública nunca escribe la cookie. Solo el Worker la escribe.
- Estado global de Fase 0 en Cloudflare KV (clave `theme`); cambio solo por endpoint autenticado con secreto de admin comparado en tiempo constante, `Cache-Control: no-store` y 401 sin credencial. El secreto vive en el entorno del Worker, nunca en el frontend.
- En Fase 1 el valor de KV se migra una sola vez a `site_settings.active_theme`; se retiran el endpoint temporal y su secreto para no tener dos fuentes de verdad.
- Todo el contenido de los proyectos se migra a la BD excepto las métricas: `projects`, `project_translations`, `project_modules`, `gallery_slides` y `project_images`.
- Aprobar un testimonio equivale a publicarlo: no hay flag `published` en `testimonials`; se muestra en home y al pie de su proyecto.
- `apps/admin` y `apps/client` tienen diccionarios ES/EN propios con tests de paridad; el contenido del testimonio no se traduce.
- El Worker de Fase 1 actualiza también `sitemap.xml` y el JSON-LD por ruta con los slugs publicados.

## Review Focus

- **Token caducado, revocado o ya usado:** debe devolver 404/410 y no revelar datos del cliente ni del proyecto — cubierto en Task 7, paso 1.
- **Consentimiento ausente o contenido fuera de 10–600 caracteres:** no debe aceptarse ni publicarse — cubierto en Task 7, paso 1 y Task 8, paso 1.
- **Dos testimonios del mismo cliente para el mismo proyecto:** debe actualizar una sola fila, nunca crear dos — cubierto en Task 7, paso 1.
- **Proyecto no publicado o testimonio sin aprobar filtrándose en la API pública:** deben estar ausentes — cubierto en Task 3, paso 1 (HTTP con repositorio en memoria) y Task 3, paso 5 (integración en `repository/postgres`).
- **Contraseña, token o clave de objeto mal formada:** no debe almacenarse ni generarse una URL firmada — cubierto en Task 4, paso 1, Task 6, paso 1 y Task 5, paso 1.
- **Fuga de tipos de infraestructura a HTTP:** un `pgtype.*` o un `23505` no debe llegar a un handler; debe convertirse en `string`/`time.Time` y en `domain.ErrConflict` (409) — cubierto en Task 2, paso 4 y Task 4, paso 5.
- **Firma de imagen sin confirmación:** la URL prefirmada no debe insertar en `project_images`; solo el `201` tras el `200 OK` de R2 crea la fila — cubierto en Task 5, paso 1.
- **JSON inyectado por el Worker con `</script>` o etiquetas de un testimonio:** debe escaparse antes de insertarse y Vue debe hidratar de forma síncrona sin *mismatch*; un slug nuevo debe resolver al shell SPA antes del 404 — cubierto en Task 9, paso 1.
- **Métricas aún visibles en el sitio tras Fase 0:** `grep` de `audit.metrics`, `consistencyNote` y `AuditMetric` en `src/` debe devolver cero coincidencias, y los cuatro componentes no deben tener bloques de métricas — cubierto en Task 0B, pasos 1 y 4.
- **Tema navideño con flash o pérdida de preferencia:** la cookie debe ganar en el primer paint y también si el visitante cambia claro/oscuro, `default` debe restaurar `ech:preferences`, el contraste AA debe verificarse y `prefers-reduced-motion` debe respetarse — cubierto en Task 0A, pasos 1 y 5.
- **Tema activado por un visitante:** no debe existir opción navideña en `SettingsMenu` ni ruta que permita escribir la cookie sin el secreto de admin; una petición sin token devuelve 401 y no cambia KV — cubierto en Task 0A, pasos 1 y 5.
- **Selector ES/EN incompleto:** las claves de los diccionarios de `apps/admin` y `apps/client` deben ser idénticas; el contenido del testimonio debe permanecer en su idioma original — cubierto en Task 10, paso 1.
- **Proyecto nuevo invisible para crawlers:** el Worker debe añadir el slug a `sitemap.xml` y generar su JSON-LD — cubierto en Task 9, paso 1.

## File Structure

```
# Fase 0 — ahora
worker/package.json                                  # dependencias y script de test del Worker
worker/wrangler.toml                                 # KV binding THEME_STATE + secreto THEME_ADMIN_TOKEN
worker/src/index.ts                                  # endpoint admin, cookie ech_theme y pase del HTML
worker/src/index.spec.ts                             # tests del endpoint y de la cookie
src/composables/usePreferences.ts                    # no sobrescribir el tema cuando manda la cookie
src/styles/main.css                                  # tokens del tema navideño (AA)
index.html                                           # anti-flash: cookie > localStorage
src/types/portfolio.ts                               # quitar AuditMetric
src/data/portfolio.ts, src/data/portfolio.en.ts      # quitar metrics/consistencyNote
src/components/home/ProjectCard.vue                  # quitar bloque de métricas
src/components/home/ProjectQuickModal.vue            # quitar bloque de métricas
src/components/detail/ChallengeAudit.vue             # quitar bloque de métricas
src/components/detail/ProjectHeader.vue              # quitar bloque de métricas
# Fase 1 — después de diciembre
supabase/migrations/20261123000000_cms_schema.sql   # 10 tablas, constraints e índices
supabase/tests/cms_schema.test.sql                  # pgTAP del esquema
supabase/seed.sql                                   # fixtures locales
backend/go.mod, backend/sqlc.yaml
backend/cmd/api/main.go                             # arranque, env, router
backend/internal/domain/                             # modelos puros, errores, interfaces de repositorio
backend/queries/                                     # SQL fuente de sqlc
backend/internal/repository/postgres/                # implementaciones, mappers y tests de integración
backend/internal/repository/postgres/store/          # código generado por sqlc
backend/internal/http/                               # handlers + tests con repositorios en memoria
backend/internal/auth/                               # argon2id, sesión, tokens
backend/internal/r2/                                 # URL prefirmada
worker/wrangler.toml, worker/src/index.ts, worker/src/index.spec.ts
apps/admin/                                          # panel Vue con selector ES/EN
apps/client/                                         # formulario Vue con selector ES/EN
apps/shared/src/types.ts                             # espejo TS de los tipos públicos
src/components/home/TestimonialsSection.vue          # consumo síncrono de __ECH_CMS_DATA__
src/views/ProjectDetailView.vue                      # rutas dinámicas con datos del Worker
```

---

## Fase 0 — se implementa ahora (noviembre de 2026)

### Task 0A: Tema navideño controlado solo por el admin

**Files:**
- Create: `worker/package.json`, `worker/wrangler.toml`, `worker/src/index.ts`, `worker/src/index.spec.ts`
- Modify: `src/composables/usePreferences.ts`, `src/styles/main.css`, `index.html`
- Test: `src/composables/usePreferences.spec.ts` (nuevo), `src/app-ssg.spec.ts`, `src/styles/theme.spec.ts` (nuevo)

**Interfaces:**
- Consumes: Cloudflare KV `THEME_STATE` (clave `theme`), el secreto `THEME_ADMIN_TOKEN`, `ech:preferences` en `localStorage` y el anti-flash actual de `index.html`.
- Produces: `GET /admin/theme` → formulario mínimo (`noindex`, `no-store`) donde el admin introduce el token; `POST /api/admin/theme` con `{theme: "default" | "christmas"}` y `Authorization: Bearer <THEME_ADMIN_TOKEN>` → `204`, actualiza KV; sin token o con token inválido → `401` sin escribir en KV; valor fuera del enum → `422`. Toda respuesta HTML del Worker fija `ech_theme` con el valor de KV (`Path=/; SameSite=Lax`) y deja pasar el HTML de Vercel. El anti-flash prioriza la cookie, aplica `data-theme="christmas"` antes del primer paint, ignora valores inválidos y restaura `ech:preferences` cuando la cookie vale `default`. `usePreferences` no sobrescribe el tema mientras la cookie sea `christmas`, incluso si el visitante cambia claro/oscuro. Tokens CSS con contraste AA y animaciones bajo `prefers-reduced-motion`. **No se añade ninguna opción navideña en `SettingsMenu` ni claves i18n nuevas.**

- [ ] **Step 1: Escribir los tests que fallan**

`worker/src/index.spec.ts` con KV y `fetch` simulados aserta: sin KV, `GET /` pasa el HTML y fija `ech_theme=default`; con KV en `christmas`, fija `ech_theme=christmas`; `POST /api/admin/theme` sin token y con token inválido devuelve `401` y KV no cambia (comparación en tiempo constante); con token válido y valor `christmas` devuelve `204` y actualiza KV; un valor fuera del enum devuelve `422`; el token no aparece en el HTML de `/admin/theme` y las respuestas de administración llevan `Cache-Control: no-store`. `app-ssg.spec.ts` aserta que el script inline lee la cookie, aplica `data-theme="christmas"` y cambia `theme-color` antes del primer paint, ignora valores desconocidos y restaura la preferencia guardada con `default`. `usePreferences.spec.ts` aserta que con la cookie en `christmas`, cambiar a `dark`/`light` no altera `data-theme`, y que con `default` el comportamiento es el actual. `theme.spec.ts` comprueba contraste AA de los tokens sobre fondo y superficie y que no hay animaciones fuera de `@media (prefers-reduced-motion: no-preference)`. Un test adicional aserta que `SettingsMenu.vue` y los mensajes ES/EN no contienen `christmas`.

- [ ] **Step 2: Verificar que falla**

Run: `cd worker && pnpm test && cd ../.. && pnpm test -- src/composables/usePreferences.spec.ts src/app-ssg.spec.ts src/styles/theme.spec.ts`
Expected: FAIL, módulos y comportamientos aún no implementados.

- [ ] **Step 3: Implementar Worker, tokens y anti-flash**

`index.ts` hace de proxy delante de Vercel: lee KV, fija la cookie en las respuestas HTML y sirve el formulario y el endpoint de administración; valida el token con comparación en tiempo constante y el valor con un enum estricto; `wrangler.toml` declara el binding KV y la variable secreta (documentar cómo se configura, nunca en el repo). Añadir los tokens navideños en `main.css` sin hardcodear colores en componentes; actualizar el script inline de `index.html` y `usePreferences` para que la cookie gane siempre. No crear backend Go, BD ni apps; no tocar `SettingsMenu` ni los diccionarios i18n.

- [ ] **Step 4: Verificar que pasa**

Run: `cd worker && pnpm test && cd ../.. && pnpm verify && grep -R -n -i 'christmas' src/components/layout/SettingsMenu.vue src/i18n/messages/ ; test $? -eq 1`
Expected: PASS; build SSG sigue generando las 6 páginas, sin flash en el HTML fuente y sin opción navideña pública.

- [ ] **Step 5: Smoke test local**

Run: `cd worker && wrangler dev`; `curl -s -o /dev/null -w '%{http_code}' localhost:8787/api/admin/theme` → 401; con `-H "Authorization: Bearer <token>"` y `{"theme":"christmas"}` → 204; `curl -sI localhost:8787/ | grep -i '^set-cookie: ech_theme=christmas'` → presente.

- [ ] **Step 6: Commit**

```bash
git add worker/ src/ index.html && git commit -m "feat: add admin-controlled christmas theme without deploy"
```

---

### Task 0B: Eliminar las métricas del sitio

**Files:**
- Modify: `src/types/portfolio.ts`, `src/data/portfolio.ts`, `src/data/portfolio.en.ts`, `src/components/home/ProjectCard.vue`, `src/components/home/ProjectQuickModal.vue`, `src/components/detail/ChallengeAudit.vue`, `src/components/detail/ProjectHeader.vue`
- Test: `src/stores/portfolio.spec.ts`
- Verify: `grep -R -n -E 'audit\.metrics|consistencyNote|AuditMetric' src/` → sin coincidencias

**Interfaces:**
- Consumes: tipos y datos actuales de los cuatro proyectos.
- Produces: `AuditReport` sin `metrics` ni `consistencyNote`, tipo `AuditMetric` eliminado, ningún bloque de métricas en la UI. `diagnosis`, `resolution` y `badge` se conservan. `README.md`, `docs/AUDIT_AND_ROADMAP.md` y el whitepaper quedan intactos.

- [ ] **Step 1: Escribir los tests que fallan**

En `stores/portfolio.spec.ts`: sustituir los asertos de `audit.metrics` y `consistencyNote` por asertos de que el campo ya no existe en tipos ni datos (`'metrics' in audit === false`), y mantener las comprobaciones de `diagnosis`, `resolution` y `badge`. `app-ssg.spec.ts` no debe esperar bloques de métricas en el HTML prerenderizado. La clave `hero.metrics` se conserva porque etiqueta las cifras del perfil, no las métricas de auditoría de proyectos.

- [ ] **Step 2: Verificar que falla**

Run: `pnpm test -- src/stores/portfolio.spec.ts src/app-ssg.spec.ts`
Expected: FAIL porque los datos todavía incluyen `metrics`.

- [ ] **Step 3: Quitar los campos y los bloques visuales**

Eliminar `AuditMetric`, `audit.metrics` y `audit.consistencyNote` de `types/portfolio.ts` y de los dos archivos de datos; quitar los bloques `v-for` de los cuatro componentes y los imports/estilos que queden sin uso. No tocar `profile.stats`, `profile.performance`, `ZoomMetrics` ni los textos alternativos de capturas. Al retirar los bloques, conservar la altura de las tarjetas para evitar CLS.

- [ ] **Step 4: Verificar que pasa**

Run: `pnpm verify && grep -R -n -E 'audit\.metrics|consistencyNote|AuditMetric' src/ ; test $? -eq 1 && git status --short`
Expected: PASS, `grep` sin coincidencias y `git status` solo con archivos de `src/` e `index.html` de las Tasks 0A/0B. Ningún cambio en documentación ni whitepaper.

- [ ] **Step 5: Commit**

```bash
git add src/ && git commit -m "refactor: remove audit metrics from the site"
```

---

## Fase 1 — después de diciembre de 2026 (no iniciar antes de enero de 2027)

### Task 1: Esquema y migraciones de Supabase

**Files:**
- Create: `supabase/migrations/20261123000000_cms_schema.sql`
- Create: `supabase/tests/cms_schema.test.sql`
- Create: `supabase/seed.sql`

**Interfaces:**
- Consumes: ninguna.
- Produces: las 10 tablas del spec con sus constraints; nombres y columnas exactos que usarán `backend/queries/*.sql`. Todo el contenido del proyecto se migra salvo las métricas.

- [ ] **Step 1: Escribir el test pgTAP que falla**

`supabase/tests/cms_schema.test.sql` debe comprobar: existencia de `admin_users`, `clients`, `client_invites`, `testimonials`, `projects`, `project_translations`, `project_modules`, `gallery_slides`, `project_images`, `site_settings`; `clients.name` como `TEXT NOT NULL`; que `testimonials` **no** tenga columna `locale` ni `published`; `UNIQUE (client_id, project_id)` en `testimonials`; `CHECK (locale IN ('es','en'))` en `project_translations`, `project_modules` y `gallery_slides`; `UNIQUE (project_id, locale, code)` en `project_modules` y `UNIQUE (project_id, locale, slide_id)` en `gallery_slides`; `CHECK (id = 1)` en `site_settings`; `CHECK (char_length(content) BETWEEN 10 AND 600)`; índice único parcial de `is_cover` por proyecto; que `token_hash` sea `UNIQUE` y no exista columna `token`; y que **no** existan columnas `metrics` ni `consistency_note` en `project_translations`.

- [ ] **Step 2: Verificar que falla**

Run: `supabase test db`
Expected: FAIL porque las tablas no existen.

- [ ] **Step 3: Crear la migración con las 10 tablas**

Usar `UUID` con `gen_random_uuid()`, `TIMESTAMPTZ`, FKs con `ON DELETE` explícito, `TEXT CHECK` para `status` y `active_theme`, y `JSONB` para `tech_tags`, `challenge_points` y `points`. `year` es `TEXT`. `projects` incluye `client`, `duration`, `status`, `stack_key`, `live_url`, `repo_url`, `whitepaper_url`; `project_translations` incluye `name`, `gallery_description`, `challenge_intro`, `diagnosis`, `resolution` y `audit_badge`. No crear columnas de métricas ni columnas que el spec no define.

- [ ] **Step 4: Verificar que pasa**

Run: `supabase db reset && supabase test db`
Expected: PASS con todos los asertos.

- [ ] **Step 5: Sembrar fixtures locales**

`supabase/seed.sql` inserta 1 admin, 1 cliente con `name` no nulo, 1 proyecto publicado con traducciones `es`/`en`, sus 3 módulos y 3 slides de galería por idioma, 1 invitación activa y 1 testimonio `pending`; el token de prueba se guarda ya hasheado. Sin filas de métricas.

- [ ] **Step 6: Commit**

```bash
git add supabase/ && git commit -m "feat: add CMS database schema"
```

### Task 1A (Opcional — Enero 2027): Migrar hosting estático de Vercel a Cloudflare

**Goal:** Unificar el hosting del sitio estático (Vite SSG) en Cloudflare (Pages o Workers Static Assets) para eliminar el doble salto de red (`Worker → Vercel`), simplificar la caché/SSL y preparar el despliegue conjunto con el CMS.

- [ ] Replicar las reglas de `vercel.json` (`cleanUrls`, `trailingSlash: false` y cabeceras de caché) en la configuración de Cloudflare (`_headers` / `_redirects` o `wrangler.toml`) verificando que `/en` y `/en/proyectos/<slug>` no generen redirecciones con barra final.
- [ ] Actualizar el Worker para servir los activos estáticos directamente desde Cloudflare en lugar de hacer proxy hacia Vercel.
- [ ] Evaluar alojar también `apps/admin` y `apps/client` en Cloudflare con enrutamiento `/api/*` hacia `api.jonathanech.dev`.
- [ ] Verificar en producción `sitemap.xml`, `robots.txt`, `llms.txt`, `hreflang` y `pnpm verify` en verde antes de retirar el proyecto de Vercel.

---

### Task 2: Dominio, repositorio Postgres, sqlc y health check

**Files:**
- Create: `backend/go.mod`, `backend/sqlc.yaml`
- Create: `backend/internal/domain/models.go`, `backend/internal/domain/errors.go`, `backend/internal/domain/repositories.go`
- Create: `backend/internal/repository/postgres/pool.go`, `backend/internal/repository/postgres/mappers.go`
- Create: `backend/cmd/api/main.go`
- Create: `backend/internal/http/health.go`
- Test: `backend/internal/http/health_test.go`, `backend/internal/repository/postgres/mappers_test.go`, `backend/internal/repository/postgres/integration_test.go`
- Generate: `backend/internal/repository/postgres/store/db.go`, `backend/internal/repository/postgres/store/models.go`

**Interfaces:**
- Consumes: esquema de Task 1.
- Produces: `GET /health` → `200 {"status":"ok"}`; `NewRouter(repos domain.Repositories) http.Handler`; `postgres.New(pool *pgxpool.Pool) domain.Repositories`; errores `domain.ErrNotFound`, `domain.ErrConflict`, `domain.ErrValidation`; y `domain.Repositories` con los campos `Admins`, `Projects`, `Modules`, `Slides`, `Images`, `Testimonials`, `Clients`, `Invites`, `Settings`, cuyos tipos son:
  - `AdminRepository.GetByEmail(ctx, email string) (Admin, error)`, `UpdateLastLogin(ctx, id string, at time.Time) error`
  - `ProjectRepository.ListPublished(ctx) ([]Project, error)`, `ListAll(ctx) ([]Project, error)`, `GetBySlug(ctx, slug string) (Project, error)`, `Create(ctx, Project) (Project, error)`, `Update(ctx, Project) error`, `UpsertTranslation(ctx, projectID, locale string, translation Translation) error`. Los modelos `Project` y `Translation` contienen todo el contenido del sitio salvo las métricas.
  - `ModuleRepository.Upsert(ctx, projectID, locale string, modules []Module) error`, `SlidesRepository.Upsert(ctx, projectID, locale string, slides []Slide) error`
  - `ImageRepository.Insert(ctx, Image) (Image, error)`, `Delete(ctx, id string) error`
  - `TestimonialRepository.ListApproved(ctx) ([]Testimonial, error)`, `ListByStatus(ctx, status string) ([]Testimonial, error)`, `Upsert(ctx, Testimonial) (Testimonial, error)`, `SetStatus(ctx, id, status, moderatorID string, at time.Time) error`
  - `ClientRepository.Create(ctx, Client) (Client, error)`, `List(ctx) ([]Client, error)`
  - `InviteRepository.Create(ctx, Invite) (Invite, error)`, `GetByTokenHash(ctx, hash string) (Invite, error)`, `Revoke(ctx, id string) error`, `MarkUsed(ctx, id string, at time.Time) error`
  - `SettingsRepository.Get(ctx) (Settings, error)`, `Update(ctx, Settings) error`

- [ ] **Step 1: Escribir los tests que fallan**

`health_test.go` usa `httptest` sobre `NewRouter(domain.Repositories{})` y aserta código 200, `Content-Type: application/json` y cuerpo `{"status":"ok"}`. `mappers_test.go` aserta que un `pgtype.Text` nulo se convierte en `string` vacío, un `pgconn.PgError` con código `23505` se convierte en `domain.ErrConflict` y `pgx.ErrNoRows` en `domain.ErrNotFound`.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http ./internal/repository/postgres -run 'Test(Health|DomainMapping)' -v`
Expected: FAIL, paquetes `domain` y `postgres` no definidos.

- [ ] **Step 3: Crear el dominio, sqlc y el router**

`domain/models.go` usa solo tipos nativos (`string`, `time.Time`, `[]string`); `errors.go` declara los errores de dominio; `repositories.go` declara las interfaces y el struct `domain.Repositories`. `sqlc.yaml` lee `./queries`, genera en `./internal/repository/postgres/store` con paquete `store` y `pgx/v5`. `main.go` lee `DATABASE_URL` y `PORT`, crea el pool, llama a `postgres.New(pool)` y pasa el resultado a `NewRouter`. `backend/internal/http/` no importa `pgx` ni `store`.

- [ ] **Step 4: Implementar mappers y verificar**

`mappers.go` traduce `pgtype.*` a tipos nativos y códigos PostgreSQL a errores de dominio. Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http ./internal/repository/postgres -run 'Test(Health|DomainMapping)' -v`
Expected: PASS.

- [ ] **Step 5: Añadir test de integración del repositorio**

`integration_test.go` usa el Postgres local de Supabase: insertar un email duplicado debe devolver `domain.ErrConflict`, y una búsqueda sin filas debe devolver `domain.ErrNotFound`, sin exponer `pgx` al handler.
Run: `cd backend && go test ./internal/repository/postgres -run TestRepositoryErrorMapping -v` (con `supabase start` activo).
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/ && git commit -m "feat: add domain repository boundary and Go API scaffold"
```

---

### Task 3: API pública de contenido

**Files:**
- Create: `backend/queries/public.sql`
- Create: `backend/internal/http/types.go`
- Create: `backend/internal/http/public.go`
- Create: `backend/internal/repository/postgres/public_repository.go`
- Test: `backend/internal/http/public_test.go`, `backend/internal/repository/postgres/public_repository_test.go`

**Interfaces:**
- Consumes: `domain.ProjectRepository`, `domain.TestimonialRepository`, `domain.SettingsRepository` (Task 2) y fixtures de Task 1.
- Produces: `GET /api/public/content` → `PublicContent` con campos `theme: string`, `projects: []PublicProject`, `testimonials: []PublicTestimonial`. `PublicProject` incluye `slug`, `sector`, `year`, `status`, `client`, `duration`, `stack_key`, `accent`, `live_host`, `live_url`, `repo_url`, `whitepaper_url`, `featured`, `sort_order`, `images: []PublicImage`, `translations: map[string]PublicTranslation`, y por traducción `name`, `title`, `title_highlight`, `role`, `summary`, `problem`, `tech_tags`, `gallery_description`, `challenge`, `modules`, `gallery_slides`, `diagnosis`, `resolution`, `audit_badge`. **No incluye métricas** (`metrics`/`consistencyNote`). `PublicTestimonial` incluye `id`, `project_slug`, `display_name`, `display_role`, `content`, `is_featured`, `sort_order` y **no** incluye `locale`. Los DTOs de `http/types.go` se construyen desde modelos de `domain`, nunca desde `store.*`.

- [ ] **Step 1: Escribir el test que falla**

`public_test.go` usa repositorios en memoria que implementan las interfaces de `domain` y siembra un proyecto publicado y otro con `published=false`, un testimonio aprobado con `consent_at` y otro `pending`; aserta que la respuesta incluye solo el proyecto publicado, solo el testimonio aprobado, las dos claves de `translations` y `theme` leyéndose de `site_settings`.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http -run TestPublicContent -v`
Expected: FAIL, handler no definido.

- [ ] **Step 3: Escribir consultas, repositorio y handler**

`public.sql` filtra por `published`, `status = 'approved' AND consent_at IS NOT NULL`, y ordena por `sort_order`. `public_repository.go` implementa los métodos de `domain` y traduce `pgtype.*` a tipos nativos; `types.go` declara los DTOs exactos; `public.go` agrupa traducciones e imágenes por proyecto consumiendo solo interfaces.

- [ ] **Step 4: Generar y verificar**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http -run TestPublicContent -v`
Expected: PASS.

- [ ] **Step 5: Añadir test de integración del repositorio**

`public_repository_test.go` consulta el Postgres local de Supabase y aserta los mismos filtros (`published`, `approved` con `consent_at`) y la presencia de `es` y `en` en las traducciones.
Run: `cd backend && go test ./internal/repository/postgres -run TestPublicQueries -v`.
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/ && git commit -m "feat: add public content API"
```

---

### Task 4: Autenticación de admin

**Files:**
- Create: `backend/internal/auth/password.go`, `backend/internal/auth/session.go`
- Create: `backend/queries/admin_users.sql`
- Create: `backend/internal/repository/postgres/admin_repository.go`
- Create: `backend/internal/http/admin_auth.go`
- Test: `backend/internal/auth/password_test.go`, `backend/internal/auth/session_test.go`, `backend/internal/http/admin_auth_test.go`, `backend/internal/repository/postgres/admin_repository_test.go`

**Interfaces:**
- Consumes: `domain.AdminRepository` (Task 2) y fixtures de Task 1.
- Produces: `POST /api/admin/login` `{email,password}` → 204 + cookie `ech_admin`; `POST /api/admin/logout` → 204; `GET /api/admin/me` → 200 `{id,email}`; middleware `RequireAdmin(next http.Handler) http.Handler`; `auth.HashPassword(string) (string,error)` y `auth.VerifyPassword(hash,password string) bool`. El handler nunca recibe `store.Queries`.

- [ ] **Step 1: Escribir los tests que fallan**

`admin_auth_test.go` usa un `domain.AdminRepository` en memoria. Asertar: `HashPassword` produce un prefijo argon2id y `VerifyPassword` acepta la contraseña correcta y rechaza la incorrecta; la cookie emitida tiene `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/` y el `Domain` de entorno; `GET /api/admin/me` sin cookie devuelve 401; login con contraseña incorrecta devuelve 401 y no fija cookie.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/auth ./internal/http -run 'Test(Password|Session|AdminAuth)' -v`
Expected: FAIL.

- [ ] **Step 3: Implementar repositorio, hash, sesión y middleware**

`admin_repository.go` implementa `GetByEmail` y `UpdateLastLogin` devolviendo modelos de `domain`. Firmar la cookie con HMAC-SHA256 usando `SESSION_SECRET`, incluir `id` y `expiry`, y actualizar `last_login_at` a través de la interfaz. No guardar sesiones en BD.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/auth ./internal/http -run 'Test(Password|Session|AdminAuth)' -v`
Expected: PASS.

- [ ] **Step 5: Añadir test de integración del repositorio**

`admin_repository_test.go` aserta contra el Postgres local que un email duplicado devuelve `domain.ErrConflict` (no un `PgError`) y que `UpdateLastLogin` persiste la marca de tiempo.
Run: `cd backend && go test ./internal/repository/postgres -run TestAdminRepository -v`.
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/ && git commit -m "feat: add admin authentication"
```

---

### Task 5: CRUD de proyectos, ajustes e imágenes en R2

**Files:**
- Create: `backend/queries/admin_projects.sql`, `backend/queries/admin_settings.sql`
- Create: `backend/internal/http/admin_projects.go`, `backend/internal/http/admin_images.go`
- Create: `backend/internal/repository/postgres/project_repository.go`, `backend/internal/repository/postgres/module_repository.go`, `backend/internal/repository/postgres/slide_repository.go`, `backend/internal/repository/postgres/image_repository.go`, `backend/internal/repository/postgres/settings_repository.go`
- Create: `backend/internal/r2/signed_url.go`
- Test: `backend/internal/http/admin_projects_test.go`, `backend/internal/http/admin_images_test.go`, `backend/internal/r2/signed_url_test.go`, `backend/internal/repository/postgres/image_repository_test.go`, `backend/internal/repository/postgres/project_content_repository_test.go`

**Interfaces:**
- Consumes: `RequireAdmin` (Task 4), `domain.ProjectRepository`, `domain.ModuleRepository`, `domain.SlidesRepository`, `domain.ImageRepository`, `domain.SettingsRepository` (Task 2).
- Produces: `GET /api/admin/projects` (incluye borradores `published = false`); `POST /api/admin/projects`; `PATCH /api/admin/projects/{id}`; `PUT /api/admin/projects/{id}/translations/{locale}` con todo el contenido por idioma (sin métricas); `PUT /api/admin/projects/{id}/modules/{locale}` y `PUT /api/admin/projects/{id}/slides/{locale}` (reemplazo atómico por idioma); `GET /api/admin/settings`; `PUT /api/admin/settings` → 204; `POST /api/admin/projects/{id}/images/signed-url` con `{content_type, size}` → `{url, object_key}` (sin escribir en BD); `POST /api/admin/projects/{id}/images` con `{object_key, alt, width, height, is_cover}` → `201` (tras `200 OK` de R2); `DELETE /api/admin/projects/{id}/images/{image_id}` → `204`. Tipos de petición: `CreateProjectRequest`, `UpdateProjectRequest`, `UpsertTranslationRequest`, `UpsertModulesRequest`, `UpsertSlidesRequest`, `SignedUrlRequest{content_type,size}`, `ConfirmImageRequest{object_key,alt,width,height,is_cover}`, `SettingsRequest{active_theme,testimonials_enabled}`. Ningún tipo expone `metrics` ni `consistencyNote`.

- [ ] **Step 1: Escribir los tests que fallan**

Con repositorios en memoria: slug duplicado → 409 vía `domain.ErrConflict`; publicar con alguna traducción faltante → 422; `GET /api/admin/projects` incluye un proyecto con `published=false`; `GET /api/admin/settings` devuelve la fila única; marcar una segunda imagen `is_cover` → 409 y la primera sigue siendo la portada. Con R2 simulado: `signed_url` rechaza clave fuera de `projects/<slug>/`, tipo distinto de WebP/PDF y tamaño > 10 MB con 422; `signed_url` **no** inserta en `project_images`; confirmar sin `200 OK` de R2 no inserta; confirmar con `200 OK` inserta y devuelve 201; `DELETE` devuelve 204.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http ./internal/r2 -run 'Test(AdminProjects|AdminImages|SignedUrl)' -v`
Expected: FAIL.

- [ ] **Step 3: Implementar repositorios, handlers y firma S3**

Los tres repositorios implementan interfaces de `domain` y traducen `pgtype.*`. Usar `aws-sdk-go-v2/service/s3` con el `endpoint` de R2, `region: auto` y URL prefirmada con expiración de 15 minutos. La confirmación solo llama a `ImageRepository.Insert` después de comprobar el `200 OK` de R2; la respuesta incluye `object_key`, nunca la URL definitiva.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http ./internal/r2 -run 'Test(AdminProjects|AdminImages|SignedUrl)' -v`
Expected: PASS.

- [ ] **Step 5: Añadir test de integración de imágenes**

`image_repository_test.go` comprueba contra el Postgres local que no existe fila en `project_images` antes de la confirmación, que la segunda portada devuelve `domain.ErrConflict` y que `Delete` elimina solo la fila indicada.
Run: `cd backend && go test ./internal/repository/postgres -run TestImageRepository -v`.
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/ && git commit -m "feat: add project and settings admin API"
```

---

### Task 6: Clientes e invitaciones por proyecto

**Files:**
- Create: `backend/internal/auth/token.go`
- Create: `backend/queries/admin_invites.sql`
- Create: `backend/internal/repository/postgres/client_repository.go`, `backend/internal/repository/postgres/invite_repository.go`
- Create: `backend/internal/http/admin_invites.go`
- Test: `backend/internal/auth/token_test.go`, `backend/internal/http/admin_invites_test.go`, `backend/internal/repository/postgres/invite_repository_test.go`

**Interfaces:**
- Consumes: `RequireAdmin` (Task 4), `domain.ClientRepository`, `domain.InviteRepository` (Task 2), proyectos de Task 5.
- Produces: `GET /api/admin/clients` → 200 con `id`, `name`, `email`, `company`; `POST /api/admin/clients` `{name,email,company}` → 201 `{id}`; `POST /api/admin/clients/{id}/invites` `{project_id,expires_in_days}` → 201 `{url,token}`; `POST /api/admin/clients/{id}/invites/{invite_id}/revoke` → 204. `auth.NewInviteToken() (plain string, hash string, err error)`.

- [ ] **Step 1: Escribir los tests que fallan**

Con repositorios en memoria asertar: `GET /api/admin/clients` devuelve `name`; `POST /api/admin/clients` exige `name`; `plain` tiene 43 caracteres base64url y `hash` es SHA-256 de `plain`; la BD no contiene el token en claro; crear dos invitaciones activas para el mismo par cliente/proyecto devuelve 409 vía `domain.ErrConflict`; revocar devuelve 204 y el token deja de ser válido; la respuesta incluye `url` con `client.jonathanech.dev/<token>` y el token solo aparece en esa respuesta.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/auth ./internal/http -run 'Test(InviteToken|AdminInvites)' -v`
Expected: FAIL.

- [ ] **Step 3: Implementar generación, hash, repositorios y endpoints**

Usar `crypto/rand`, `sha256.Sum256` y `base64.RawURLEncoding`. Los repositorios devuelven modelos de `domain` y traducen errores PostgreSQL. La restricción de invitación activa se resuelve con un índice único parcial sobre `(client_id, project_id)` donde `used_at IS NULL AND revoked_at IS NULL`.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/auth ./internal/http -run 'Test(InviteToken|AdminInvites)' -v`
Expected: PASS.

- [ ] **Step 5: Añadir test de integración de invitaciones**

`invite_repository_test.go` comprueba contra el Postgres local que el token en claro no se persiste, que el índice parcial devuelve `domain.ErrConflict` al crear una segunda invitación activa y que `Revoke` invalida la búsqueda por hash.
Run: `cd backend && go test ./internal/repository/postgres -run TestInviteRepository -v`.
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/ && git commit -m "feat: add clients and project invitations"
```

---

### Task 7: Envío del testimonio

**Files:**
- Create: `backend/queries/public_invites.sql`, `backend/queries/testimonials.sql`
- Create: `backend/internal/repository/postgres/testimonial_repository.go`
- Create: `backend/internal/http/public_invites.go`, `backend/internal/http/testimonials.go`
- Test: `backend/internal/http/public_invites_test.go`, `backend/internal/http/testimonials_test.go`, `backend/internal/repository/postgres/testimonial_repository_test.go`

**Interfaces:**
- Consumes: `domain.InviteRepository`, `domain.ClientRepository` (Task 6), `domain.TestimonialRepository` (Task 2), esquema de Task 1.
- Produces: `GET /api/public/invites/{token}` → `InviteView{client_name, project: {slug, title}, existing_testimonial?: {content, display_role}}`, donde `client_name` procede de `clients.name` y `existing_testimonial` aparece solo si ya existe la fila `(client_id, project_id)`; `POST /api/public/testimonials` con cuerpo `{token,content,author_role,consent}` → 201 `{id,status:"pending"}`. Ni `InviteView` ni el testimonio incluyen `locale`.

- [ ] **Step 1: Escribir los tests que fallan**

Con repositorios en memoria asertar: token inexistente → 404; token expirado o revocado → 410; sin fila previa, `existing_testimonial` ausente; tras un rechazo y nueva invitación, `existing_testimonial` devuelve `content` y `display_role` del borrador para que `apps/client` lo precargue; `client_name` sale de `clients.name`; `consent=false` → 422; contenido de 9 y 601 caracteres → 422; envío válido crea fila `pending` con `consent_at`, `display_name` tomado de `clients.name` y marca `used_at`; un segundo envío con el mismo token → 409; tras rechazo y nueva invitación, el envío actualiza la misma fila y la deja `pending`, sin crear un segundo registro; la respuesta no contiene campo `locale`.

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http -run 'Test(PublicInvites|Testimonials)' -v`
Expected: FAIL.

- [ ] **Step 3: Implementar repositorio y handlers**

La resolución de token compara siempre el hash; el upsert usa `ON CONFLICT (client_id, project_id)` y guarda `display_name` desde `clients.name` y `display_role` desde la invitación o el borrador existente, no desde parámetros libres del formulario. El repositorio traduce `pgtype.*` a modelos de `domain`.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http -run 'Test(PublicInvites|Testimonials)' -v`
Expected: PASS.

- [ ] **Step 5: Añadir test de integración de testimonios**

`testimonial_repository_test.go` comprueba contra el Postgres local que el upsert mantiene una sola fila por `(client_id, project_id)`, que el estado vuelve a `pending` y que el borrador se recupera con `content` y `display_role`.
Run: `cd backend && go test ./internal/repository/postgres -run TestTestimonialRepository -v`.
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/ && git commit -m "feat: add testimonial submission flow"
```

---

### Task 8: Moderación

**Files:**
- Create: `backend/queries/admin_testimonials.sql`, `backend/internal/http/admin_testimonials.go`
- Test: `backend/internal/http/admin_testimonials_test.go`

**Interfaces:**
- Consumes: `RequireAdmin` (Task 4), `domain.TestimonialRepository` (Task 2).
- Produces: `GET /api/admin/testimonials?status=pending|approved|rejected`; `POST /api/admin/testimonials/{id}/approve`; `POST /api/admin/testimonials/{id}/reject`. Sin `locale` en la respuesta.

- [ ] **Step 1: Escribir el test que falla**

Asertar: el listado respeta `status`; aprobar sin `consent_at` devuelve 422; aprobar con consentimiento fija `status='approved'`, `moderated_by` y `moderated_at`; rechazar fija `status='rejected'`; un testimonio rechazado no aparece en `GET /api/public/content` (Task 3).

- [ ] **Step 2: Verificar que falla**

Run: `cd backend && go test ./internal/http -run TestAdminTestimonials -v`
Expected: FAIL.

- [ ] **Step 3: Implementar endpoints**

Tomar `moderated_by` de la sesión de admin, nunca del cuerpo de la petición, y usar `TestimonialRepository.SetStatus` sin importar `pgx` ni `store`.

- [ ] **Step 4: Verificar que pasa**

Run: `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./internal/http -run TestAdminTestimonials -v`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/ && git commit -m "feat: add testimonial moderation API"
```

---

### Task 9: Worker de Cloudflare, JSON hidratable y tema global

**Files:**
- Modify: `worker/wrangler.toml`, `worker/src/index.ts`, `worker/src/index.spec.ts` (creados en Task 0A)
- Create: `src/composables/useCmsData.ts`
- Create: `src/components/home/TestimonialsSection.vue`
- Test: `src/composables/useCmsData.spec.ts`
- Modify: `src/views/ProjectDetailView.vue`; `index.html` solo si hace falta ampliar el anti-flash, sin cambiar la precedencia de la cookie

**Interfaces:**
- Consumes: `GET /api/public/content` (Task 3) y el contrato de `ech_theme` creado en Task 0A.
- Produces: HTML servido con un bloque `<script id="__ECH_CMS_DATA__" type="application/json">` que contiene `projects` y `testimonials` escapados; `sitemap.xml` con los slugs publicados y JSON-LD por ruta; cookie `ech_theme` con valor `default` o `christmas` según `site_settings.active_theme` (mismo nombre y valores que en Fase 0, sin cambiar el anti-flash); fallback de `/proyectos/:slug` al shell SPA con `200` antes del 404. `useCmsData(): CmsData` lee y parsea ese bloque **de forma síncrona** desde `document` durante `setup()`; `TestimonialsSection.vue` muestra los aprobados en la home ordenados por `is_featured`/`sort_order` y `ProjectDetailView.vue` filtra por `project_slug`, ambos sin `fetch` ni `onMounted` para evitar *hydration mismatch*. Si no hay testimonios, la sección se oculta para no provocar CLS. Envvars: `PUBLIC_SITE_ORIGIN`, `API_ORIGIN`.

- [ ] **Step 1: Escribir los tests que fallan**

Con `fetch` simulado, `worker/src/index.spec.ts` aserta: el HTML contiene `<script id="__ECH_CMS_DATA__" type="application/json">` y su contenido parseado incluye `projects` y `testimonials`; un testimonio con `</script><img onerror=...>` queda escapado como `\u003c` y no aparece como HTML ejecutable; `theme: "christmas"` fija `Set-Cookie: ech_theme=christmas; Path=/; SameSite=Lax`; si la API falla se sirve el HTML original sin cookie y sin 500; y una petición a `/proyectos/nuevo-slug` con `404` del origen devuelve `200` con el shell y el JSON inyectado. También aserta que `sitemap.xml` contiene el slug nuevo y que el JSON-LD de `/proyectos/<slug>` usa el título y la descripción de la BD. En la web, `useCmsData.spec.ts` aserta que el helper devuelve los datos parseados de forma síncrona, que la home solo muestra testimonios ordenados por `is_featured`/`sort_order`, que el detalle filtra por `project_slug` y que una lista vacía oculta la sección; además el script anti-flash prioriza `ech_theme` sobre `localStorage` y restaura la preferencia guardada cuando la cookie vale `default`.

- [ ] **Step 2: Verificar que falla**

Run: `cd worker && pnpm test && cd ../.. && pnpm test -- src/composables/useCmsData.spec.ts`
Expected: FAIL, módulos no existen.

- [ ] **Step 3: Implementar el bloque JSON, el helper y el fallback**

`index.ts` usa `HTMLRewriter` para insertar el bloque JSON justo antes de `</body>`, serializando `<`, `>` y `&` como `\u003c`, `\u003e`, `\u0026`, sin inyectar HTML crudo; configurar TTL corto para la API. Ante un `404` del origen en `/proyectos/:slug`, solicitar `/index.html`, devolverlo con `200` y el JSON inyectado. El mismo contenido publicado alimenta `sitemap.xml` y el JSON-LD de cada ruta para que los proyectos nuevos sean indexables sin deploy. La cookie de tema se escribe con los mismos valores del contrato de Task 0A, sin modificar el anti-flash: se migra una sola vez el valor de KV a `site_settings.active_theme`, se retiran `/admin/theme`, `/api/admin/theme` y `THEME_ADMIN_TOKEN`, y el panel de admin pasa a ser el único control. `useCmsData.ts` lee `textContent` del elemento con id `__ECH_CMS_DATA__` y hace `JSON.parse` en `setup()`.

- [ ] **Step 4: Verificar que pasa y no rompe la web**

Run: `cd worker && pnpm test && cd ../.. && pnpm verify`
Expected: PASS; build SSG sigue generando 6 páginas y no hay marcadores de inyección en el HTML fuente.

- [ ] **Step 5: Smoke test local**

Run: `cd worker && wrangler dev` y, en otra terminal, `curl -s localhost:8787 | grep -q '__ECH_CMS_DATA__'`; `curl -s localhost:8787/proyectos/nuevo-slug -o /dev/null -w '%{http_code}'` → 200.

- [ ] **Step 6: Commit**

```bash
git add worker/ index.html src/composables/ src/components/home/TestimonialsSection.vue src/views/ProjectDetailView.vue && git commit -m "feat: inject hydratable CMS data and global theme at the edge"
```

---

### Task 10: Apps de admin y cliente, dominios y documentación

**Files:**
- Create: `apps/admin/`, `apps/client/`, `apps/shared/src/types.ts`
- Modify: `pnpm-workspace.yaml` (añadir `apps/*` y conservar `onlyBuiltDependencies`)
- Create: `apps/admin/vercel.json`, `apps/client/vercel.json`
- Modify: `README.md`, `docs/MAINTENANCE.md`

**Interfaces:**
- Consumes: todas las rutas de Task 3–8; `apps/shared/src/types.ts` es el espejo TS de `PublicContent`, `PublicProject`, `PublicTranslation`, `PublicImage`, `PublicTestimonial`, `InviteView` (con `existing_testimonial?`, sin `locale`), `TestimonialStatus`, `SignedUrlRequest`, `SignedUrlResponse` y `ConfirmImageRequest`. `CmsData` se comparte con `useCmsData` de la web.
- Produces: panel en `admin.jonathanech.dev` y formulario en `client.jonathanech.dev`; ambos reenvían `/api/*` a `api.jonathanech.dev` con rewrite de Vercel. Cada app tiene selector ES/EN con diccionario propio y paridad de claves; traduce etiquetas, validaciones y estados, nunca el `content` del testimonio, que se muestra en el idioma original.

- [ ] **Step 1: Escribir tests que fallan en las dos apps**

Admin: el formulario de proyecto exige slug y traducciones `es` y `en` (con módulos y slides), no ofrece campos de métricas; el panel oculta acciones hasta recibir 200 de `/api/admin/me`; la subida de imágenes sigue el orden firma → confirmación y no crea la fila antes del `200 OK` de R2. Cliente: `existing_testimonial` precarga `content` y `display_role` del borrador; el envío exige consentimiento marcado y contenido de 10–600 caracteres; el token inválido muestra un estado de error sin formulario. En ambas apps, un test de paridad aserta que los diccionarios ES/EN tienen exactamente las mismas claves y que cambiar de idioma no altera el contenido del testimonio.

- [ ] **Step 2: Verificar que falla**

Run: `pnpm --filter admin test && pnpm --filter client test`
Expected: FAIL.

- [ ] **Step 3: Implementar las dos apps y el cliente API compartido**

Usar `apiFetch` con `credentials: 'same-origin'` y cookies HttpOnly; en cliente, el token viaja en la petición, nunca en `localStorage`, y el borrador se precarga desde `InviteView` antes del primer render. El selector ES/EN se persiste por app y solo cambia la interfaz. La web pública consume `__ECH_CMS_DATA__` de forma síncrona, sin `fetch` inicial que provoque *mismatch*. Aplicar `prefers-reduced-motion` y `focus-visible` en ambos paneles.

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

### Fase 0 (se ejecuta ahora, tras cada tarea)

- `cd worker && pnpm test && cd ../.. && pnpm verify` → tests del endpoint y de la cookie, typecheck, todos los tests en verde y build SSG de las 6 páginas; sin números de tests fijos en la documentación.
- `grep -R -n -E 'audit\.metrics|consistencyNote|AuditMetric' src/ ; test $? -eq 1` → métricas ausentes del sitio.
- `grep -R -n -i 'christmas' src/components/layout/SettingsMenu.vue src/i18n/messages/ ; test $? -eq 1` → ningún control navideño público.
- `git status --short` → solo archivos de `src/`, `index.html` y `worker/`; `README.md`, `docs/AUDIT_AND_ROADMAP.md` y el whitepaper sin cambios.
- Smoke: con `wrangler dev`, activar y desactivar el tema desde `/admin/theme` con el token, recargar como visitante sin parpadeo, comprobar que `ech_theme` se fija para todos, que un token inválido devuelve 401 y que al volver a `default` se restaura la preferencia previa; verificar contraste AA y `prefers-reduced-motion`.

### Fase 1 (después de diciembre)

- `supabase start && supabase db reset && supabase test db` → 10 tablas, `clients.name`, ausencia de `locale` y de `published` en `testimonials`, ausencia de columnas de métricas y constraints.
- `cd backend && sqlc generate && gofmt -w . && go vet ./... && go test ./...` → dominio, HTTP con repositorios en memoria e integración en `repository/postgres` (errores `23505`, mapeo `pgtype.*`, filtros públicos, upsert, contenido completo de proyectos y firma/confirmación de imágenes).
- `cd worker && pnpm test && wrangler dev` → bloque `__ECH_CMS_DATA__` escapado, sitemap y JSON-LD con slugs nuevos, fallback `/proyectos/:slug` y cookie `ech_theme` con el contrato de Fase 0; `grep` confirma que ya no existen `/admin/theme` ni `THEME_ADMIN_TOKEN` y que el tema se lee de `site_settings`.
- `pnpm verify && pnpm test -- src/composables/useCmsData.spec.ts` → hidratación síncrona, testimonios en home/detalle sin CLS, typecheck, tests y build SSG.
- `pnpm --filter admin test && pnpm --filter client test` → panel, subida en dos pasos, precarga del borrador y paridad ES/EN sin traducir el contenido del testimonio.
- Smoke final: aprobar un testimonio y crear un proyecto en el panel, recargar `jonathanech.dev` sin deploy, comprobar que ambos aparecen en `__ECH_CMS_DATA__`, en `sitemap.xml` y en el JSON-LD, que `/proyectos/<slug-nuevo>` devuelve 200, que no hay filas huérfanas en `project_images` tras una firma sin confirmar y que con `active_theme='christmas'` el tema festivo gana sobre la preferencia local.

## Estado de implementación — Fase 0 (2026-11-24)

Ejecutada en orden **0B → 0A** por petición explícita, sobre la rama
`feat/portfolio-cms` (commits `5f1b197` → `21a23a4`), sin tocar `main`.
La spec de diseño sigue siendo la autoridad; esta sección solo registra el
resultado, no cambia el contrato.

| Tarea | Resultado | Evidencia |
| :--- | :--- | :--- |
| **0B** | Completada | `AuditMetric`, `audit.metrics` y `audit.consistencyNote` ausentes de `src/`; `diagnosis`, `resolution`, `badge`, `ZoomMetrics`, `profile.stats`, `profile.performance`, alt texts, README, `docs/AUDIT_AND_ROADMAP.md` y whitepaper conservados. Alturas de tarjetas reservadas con `min-h-*`. |
| **0A** | Completada | Worker con KV `THEME_STATE` (clave `theme`, enum `default` \| `christmas`), secreto `THEME_ADMIN_TOKEN`, cookie `ech_theme` en toda respuesta HTML, `GET /admin/theme`, `POST /api/admin/theme` (401/422/204), tokens CSS de contraste AA y anti-flash con cookie > `ech:preferences`. Sin opción navideña en `SettingsMenu` ni claves i18n nuevas. |
| **Despliegue 0A** | Completada (Worker) | Ruta `jonathanech.dev/*` añadida: la wildcard `*.jonathanech.dev/*` no interceptaba el apex. Smoke en producción: `200` con `ech_theme=default`, `401` en la API y `noindex`/`aria-live` en `/admin/theme`. KV remoto sin clave `theme` → `default`. Runbook en `docs/CLOUDFLARE_WORKER.md`. Pendiente: deploy de Vercel y revisión de SSL/caché en el panel. |
| **Revisión final** | Completada | Revisor independiente: dos hallazgos Important corregidos con tests RED→GREEN en `c7576f8` — la cookie no puede ser congelada por un caché compartido (`Cache-Control: private, no-cache` en HTML) y `GET /api/admin/theme` devuelve 401 sin llegar al proxy. |
| **Documentación** | Completada | `CHANGELOG.md`, `README.md` y `docs/AUDIT_AND_ROADMAP.md` describen el alcance, el despliegue del Worker y la vuelta a `default` (commit `21a23a4`). |

Verificación final ejecutada sobre el árbol integrado:
`cd worker && pnpm test` → 11/11; `cd worker && pnpm typecheck` → limpio;
`pnpm verify` → 135/135 tests, 15 archivos, typecheck y 6 páginas SSG;
ambos `grep` de métricas y de UI/i18n navideña sin coincidencias; smoke con
`wrangler dev` → `GET /api/admin/theme` 401, `POST` sin token 401, `POST` con
token 204, HTML con `ech_theme=christmas` y `private, no-cache`.

Decisiones registradas durante la ejecución: el orden 0B→0A; sincronización de
plan/spec aprobados desde esta misma rama; configuración adicional del Worker
(`tsconfig.json`, `packageManager`, `allowBuilds`, ignores de `.wrangler` y
`.dev.vars`); formulario de admin servido por el Worker; y las decisiones
finales de la revisión (endpoint temporal sin rate limiting, cookie `Secure` y
persistente con `Max-Age=31536000` pero sin `HttpOnly` porque el anti-flash la
lee desde JS, CI sin tests del Worker y AA verificado en tokens semánticos, no
en opacidades preexistentes).

### Comentario de despliegue (2026-11-27)

El Worker de Task 0A está activo en `jonathanech.dev/*`. La ruta original
`*.jonathanech.dev/*` no interceptaba el apex: la home no fijaba `ech_theme` y
`/api/admin/theme` devolvía 404. Se añadió la ruta explícita y el smoke en
producción confirmó `200` + `ech_theme=default`, `401` en la API y
`noindex`/`aria-live` en `/admin/theme`. El KV remoto no tiene la clave `theme`,
así que el valor efectivo sigue siendo `default`; el `christmas` que devuelve
`wrangler kv key get` sin `--remote` era solo el KV local. El deploy de Vercel ya
publicó la guirnalda y el `<link rel="alternate">` de `llms.txt`; sigue pendiente
confirmar en el panel SSL **Full (Strict)** y que no haya reglas de *Cache
Everything* sobre HTML.

Ajuste posterior: la cookie `ech_theme` lleva `Max-Age=31536000` y `Secure`, y el
`POST` del panel también la fija, para que el dispositivo que configura vea el
cambio sin recargar y el móvil no la pierda al cerrar el navegador. KV es
eventualmente consistente: otros dispositivos pueden tardar hasta 60 s.

Fase 1 permanece intacta y no se inicia antes de enero de 2027.
