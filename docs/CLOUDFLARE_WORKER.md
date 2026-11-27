# Worker de tema global: configuración en Cloudflare

Runbook operativo de la **Fase 0 del CMS**. El sitio estáticamente generado sigue
publicándose en Vercel; el Worker de Cloudflare se coloca delante del hostname
público, lee la KV `THEME_STATE` y fija la cookie `ech_theme` en cada respuesta
HTML. No hay base de datos ni backend propio.

> [!WARNING]
> `PUBLIC_SITE_ORIGIN` debe apuntar **al origen de Vercel**, nunca al mismo
> hostname donde enrutas el Worker. Si el Worker atiende `jonathanech.dev/*` y
> `PUBLIC_SITE_ORIGIN = "https://jonathanech.dev"`, el Worker se llama a sí mismo
> en bucle (timeout/524). Usa por ejemplo `https://<proyecto>.vercel.app`.

## Contrato que debe quedar desplegado

| Superficie | Comportamiento esperado |
| :--- | :--- |
| `GET /*` | Proxy al origen de Vercel; toda respuesta HTML lleva `Set-Cookie: ech_theme=<default\|christmas>; Path=/; Max-Age=31536000; SameSite=Lax; Secure` y `Cache-Control: private, no-cache`. |
| `GET /admin/theme` | Formulario temporal servido por el Worker: `noindex`, `no-store`, altura reservada para el feedback y el token nunca aparece en el HTML. |
| `POST /api/admin/theme` | `{ "theme": "default" \| "christmas" }` con `Authorization: Bearer <token>` → `204` + `no-store` y fija la cookie en el dispositivo que configura; sin token o token inválido → `401` sin escribir en KV; valor fuera del enum → `422`. |

KV: una sola clave `theme` con valores estrictos `default` o `christmas`. Si la
clave no existe o tiene otro valor, el Worker sirve `default`. KV es
eventualmente consistente: el cambio puede tardar hasta 60 s en otros dispositivos,
aunque el dispositivo que lo aplica recibe la cookie en la respuesta `204`.

## 1. Requisitos previos

- Cuenta de Cloudflare con la zona `jonathanech.dev` añadida y DNS **proxied**
  (nube naranja) hacia Vercel. Si el DNS lo gestiona solo Vercel, los *routes* de
  Workers no interceptan el tráfico: hay que migrar la zona a Cloudflare.
- Wrangler instalado en `worker/` (ya está en `devDependencies`) y autenticado:

```bash
cd worker
pnpm install
pnpm exec wrangler login
pnpm exec wrangler whoami   # confirma la cuenta correcta
```

## 2. Crear la KV y dejar el binding listo

```bash
cd worker
pnpm exec wrangler kv namespace create THEME_STATE
```

Copia el `id` que imprime y sustituye el marcador en `worker/wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "THEME_STATE"
id = "<ID_DEL_NAMESPACE>"
```

Alternativa: `wrangler kv namespace create THEME_STATE --update-config --binding THEME_STATE`
escribe el bloque automáticamente. No dejes `REEMPLAZAR_CON_EL_ID_DEL_NAMESPACE`.

## 3. Configurar el secreto del admin

Genera un token largo y guárdalo solo en Cloudflare:

```bash
openssl rand -hex 32
pnpm exec wrangler secret put THEME_ADMIN_TOKEN
```

Pega el valor cuando Wrangler lo pida. El secreto **nunca** se escribe en
`wrangler.toml` ni se commitea. Para probar en local crea `worker/.dev.vars`
(ya ignorado por Git):

```dotenv
THEME_ADMIN_TOKEN=<token-de-prueba>
PUBLIC_SITE_ORIGIN=https://<proyecto>.vercel.app
```

## 4. Verificar en local antes de desplegar

```bash
cd worker
pnpm test        # 11/11
pnpm typecheck
pnpm exec wrangler dev
```

Con el servidor en `http://localhost:8787` (en PowerShell usa `curl.exe`):

| Comando | Resultado esperado |
| :--- | :--- |
| `curl -i localhost:8787/` | `200`, `set-cookie: ech_theme=default; Path=/; Max-Age=31536000; SameSite=Lax; Secure`, `cache-control: private, no-cache` |
| `curl -i localhost:8787/api/admin/theme` | `401` (método distinto de `POST`) |
| `curl -i -X POST localhost:8787/api/admin/theme -H 'content-type: application/json' -d '{"theme":"christmas"}'` | `401`, KV sin cambios |
| `curl -i -X POST localhost:8787/api/admin/theme -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' -d '{"theme":"christmas"}'` | `204` sin cuerpo y la misma cookie `ech_theme=christmas` |
| `curl -i -X POST localhost:8787/api/admin/theme -H "Authorization: Bearer $TOKEN" -H 'content-type: application/json' -d '{"theme":"navidad"}'` | `422` |
| `curl -i localhost:8787/admin/theme` | `200`, `noindex`, `cache-control: no-store`, sin el token en el HTML |
| `curl -i localhost:8787/` de nuevo | `set-cookie: ech_theme=christmas; Path=/; Max-Age=31536000; SameSite=Lax; Secure` |

## 5. Desplegar y enrutar

1. Ajusta `PUBLIC_SITE_ORIGIN` en `worker/wrangler.toml` al hostname real de
   Vercel. Alternativamente, define la variable en el panel de Cloudflare; en ese
   caso despliega con `--keep-vars` para que Wrangler no borre las variables del
   panel:

   ```bash
   pnpm exec wrangler deploy --keep-vars
   ```

2. En el panel: **Workers & Pages → jonathanech-theme-worker → Settings →
   Triggers → Routes → Add route**:

   | Campo | Valor |
   | :--- | :--- |
   | Zone | `jonathanech.dev` |
   | Route | `jonathanech.dev/*` |
   | Worker | `jonathanech-theme-worker` |

   Añade `www.jonathanech.dev/*` solo si Vercel sirve `www` sin redirigir al
   dominio raíz. Otra opción es declarar la ruta en `wrangler.toml`:

   ```toml
   [[routes]]
   pattern = "jonathanech.dev/*"
   zone_id = "<ZONE_ID>"
   ```

   y volver a desplegar.

3. Confirma en **Deployments → Versions** que la versión activa es la que acabas
   de subir. El Worker no se publica solo por hacer push: el deploy es manual.

## 6. DNS, SSL y caché en Cloudflare

- **DNS:** el registro de `jonathanech.dev` debe estar *Proxied* (nube naranja)
  apuntando a Vercel; de lo contrario la petición no pasa por el Worker.
- **SSL/TLS:** modo **Full (Strict)** para que el salto Worker → Vercel no rompa
  HTTPS.
- **Caché:** no actives reglas de tipo *Cache Everything* sobre HTML. El Worker
  ya envía `private, no-cache` para páginas y `no-store` para `/admin/theme` y
  `/api/admin/theme`; una regla que sobrescriba esas cabeceras puede congelar la
  cookie de un visitante o el estado del panel.
- Las cabeceras de `robots.txt`, `sitemap.xml`, `llms.txt` y assets con hash ya
  viven en `vercel.json`; mientras Vercel siga siendo el origen no hace falta
  duplicarlas en Cloudflare.

## 7. Comprobación en producción

```bash
curl.exe -sSI https://jonathanech.dev/ | Select-String 'set-cookie|cache-control'
curl.exe -sS  https://jonathanech.dev/ | Select-String 'rel="alternate" type="text/plain"'
curl.exe -sS -o NUL -w '%{http_code}' https://jonathanech.dev/api/admin/theme
curl.exe -sS  https://jonathanech.dev/admin/theme | Select-String 'noindex|aria-live'
curl.exe -sSI https://jonathanech.dev/llms.txt | Select-String 'cache-control'
```

Esperado: cookie con el valor actual de KV, `private, no-cache` en HTML, el
`<link>` de `llms.txt` en el `<head>`, `401` en la API sin token, el formulario
con `noindex`/`aria-live` y `llms.txt` servido con su caché de una hora.

Después abre `https://jonathanech.dev/admin/theme`, introduce el token y prueba:

1. **Navideño** → `204` y, al recargar, `ech_theme=christmas` con el tema oscuro
   verdoso aplicado antes del primer paint (`theme-color: #071410`), sin flash.
2. **Predeterminado** → `ech_theme=default` y cada visitante recupera su
   preferencia guardada en `ech:preferences`.
3. Comprueba en móvil que la guirnalda no deforma los bombillos y que sube con
   el scroll sin tapar tarjetas.

## 8. Operación y rollback

- **Cambiar el tema sin deploy:** panel `/admin/theme` o la API:

  ```bash
  curl.exe -X POST https://jonathanech.dev/api/admin/theme \
    -H "Authorization: Bearer <TOKEN>" \
    -H "content-type: application/json" \
    -d '{"theme":"default"}'
  ```

- **Volver a Vercel sin el Worker:** elimina la ruta en *Triggers → Routes*. El
  tráfico vuelve directo al origen y deja de fijarse la cookie.
- **Romper el código del Worker:** *Workers & Pages → Versions* → promote de una
  versión anterior, o `wrangler deployments list` y re-desplegar el commit bueno.
- **Rotar el token:** vuelve a ejecutar `wrangler secret put THEME_ADMIN_TOKEN`.
  Los secretos no se borran al desplegar; actualiza también cualquier `.dev.vars`.

En Fase 1 este valor migrará a `site_settings.active_theme` y se retirarán
`/admin/theme`, `/api/admin/theme` y `THEME_ADMIN_TOKEN` para no tener dos fuentes
de verdad. No hagas ese cambio todavía.

## 9. Solución de problemas

| Síntoma | Causa probable | Acción |
| :--- | :--- | :--- |
| Timeout o 524 en el sitio | `PUBLIC_SITE_ORIGIN` apunta al hostname enrutado por el Worker | Cambiarlo al origen de Vercel y re-desplegar |
| No aparece `set-cookie` | La ruta no alcanza el Worker o una regla cachea HTML | Revisar *Routes* y desactivar *Cache Everything* |
| `/admin/theme` devuelve 401 | Secreto ausente o token mal copiado | `wrangler secret put THEME_ADMIN_TOKEN` |
| El tema no cambia para un visitante | Cookie `ech_theme` antigua o caché compartida | Borrar la cookie y comprobar `no-store`/`private, no-cache` |
| El tema tarda en verse en otros dispositivos | Consistencia eventual de KV (hasta 60 s) | El dispositivo que aplica el cambio ya recibe la cookie en el `204`; espera ese margen y vuelve a cargar |
| El tema se pierde al cerrar el navegador móvil | Cookie de sesión | Verificar `Max-Age=31536000; Secure` en la respuesta; si falta, el Worker desplegado es anterior |
| 403 en las rutas de admin | WAF o Bot Management de Cloudflare | Permitir `/admin/theme` y `/api/admin/theme` para tu IP |
| `wrangler deploy` borra variables del panel | Falta `--keep-vars` | Re-desplegar con `--keep-vars` |
