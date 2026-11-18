# Guía de mantenimiento seguro

Procedimientos para mantener el portafolio en producción con el mínimo riesgo.
La rama `main` está desplegada en Vercel: **todo lo que llegue a `origin/main` se
publica automáticamente**.

---

## 1. Proteger `main` en GitHub

Esta configuración es manual (en este entorno no hay `gh` ni token de GitHub).
En **Settings → Branches → Branch protection rules → Add rule**:

| Ajuste | Valor |
| :--- | :--- |
| Branch name pattern | `main` |
| Require a pull request before merging | ✅ |
| Require approvals | 1 (o 0 si trabajas en solitario; el CI ya bloquea el merge) |
| Allow self-approved pull requests | ✅ si eres el único mantenedor |
| Require status checks to pass | ✅ → `Verify & Test / Typecheck, Vitest & Build` |
| Require branches to be up to date | ✅ |
| Block force pushes | ✅ |
| Block deletions | ✅ |
| Do not allow bypassing the above settings | ✅ |

Con esto, un push directo o un CI rojo no puede llegar a producción.

---

## 2. Versionado, tags y changelog

- El proyecto usa **SemVer**: `1.0.1` = corrección, `1.1.0` = funcionalidad nueva,
  `2.0.0` = cambio rompiente. Aunque es un paquete `private`, el número es la
  referencia interna de la release.
- Toda release lleva tres piezas: `package.json`, `CHANGELOG.md` y un tag anotado.

```bash
# Tras fusionar el PR en main y con el CI en verde
git switch main
git pull --ff-only origin main
git tag -a v1.0.1 -m "Release 1.0.1"
git push --follow-tags origin main
```

- Nunca reutilices ni muevas un tag ya publicado. Si el deploy salió mal, publica
  `v1.0.2`, no corrijas `v1.0.1`.
- `pnpm-lock.yaml` no almacena la versión del paquete, así que el bump no genera
  cambios en el lockfile.

---

## 3. Dependencias

- `.github/dependabot.yml` propone actualizaciones **semanales** de npm y GitHub
  Actions. Los cambios *minor/patch* se agrupan en un solo PR; los *major* se
  excluyen y se revisan a mano.
- Todo PR de Dependabot pasa por `pnpm verify` antes de poder fusionarse.
- Revisión manual ocasional:

```bash
pnpm audit --audit-level=high
pnpm outdated
```

- Si una actualización major es necesaria (Vue, Vite, Vitest), hazla en una rama
  `chore/deps-<paquete>` con `pnpm verify` completo. No la mezcles con cambios de
  contenido.

---

## 4. Monitoreo después del deploy

- El sitio incluye `@vercel/analytics`: revisa el panel de Vercel para ver
  **Core Web Vitals de campo** (LCP, INP, CLS). La verificación local es solo
  estática; los datos de campo son los que importan.
- Tras cada push a `main`, confirma en **Deployments** que el build terminó en
  *Ready* y abre `https://jonathanech.dev` para comprobar inicio, tema claro/oscuro
  y galería.
- Opcional pero recomendado: configurar un chequeo de uptime externo
  (UptimeRobot, Better Stack o similar) contra la URL de producción.

---

## 5. Rollback

Si una release falla, actúa en este orden:

1. **Vercel:** *Deployments* → selecciona el último deployment bueno →
   *… → Promote to Production*. Es la vía más rápida.
2. **Git:** revierte el merge en `main` en vez de reescribir el historial:

   ```bash
   git switch main
   git pull --ff-only origin main
   git revert -m 1 <hash-del-merge>
   git push origin main
   ```

3. Publica una versión nueva (`v1.0.x`) documentando el revert en el CHANGELOG.
4. **Evita** `git reset --hard`, `git push --force` y borrar tags ya publicados.

---

## 6. Higiene y control periódico

- Antes de cerrar una tarea, borra la rama local ya integrada:

  ```bash
  git branch --merged main | grep -vE '^\*|main' | xargs -r git branch -d
  ```

- Las ramas remotas obsoletas se revisan aparte; no las borres sin confirmar porque
  pueden contener trabajo de otras personas.
- Repite el escaneo de patrones web cuando haya cambios de UI:

  ```bash
  pnpx modern-web-guidance@latest legacy-scan . --json
  ```

  Referencia: 0 hallazgos sobre 52 reglas y 38 guías en la release 1.0.0.

---

## Checklist para cada cambio

1. Rama nueva desde `main` actualizado (`feat/`, `fix/`, `chore/`, `docs/`).
2. `pnpm verify` en verde (typecheck + tests + build).
3. PR a `main`; esperar el check `Verify & Test`.
4. Merge, tag si es release, y `git status` limpio antes del push.
5. Confirmar deploy y revisar analítica.
