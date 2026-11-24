import type { ExecutionContext, ExportedHandler, KVNamespace } from '@cloudflare/workers-types'

export interface Env {
  THEME_STATE: KVNamespace
  THEME_ADMIN_TOKEN: string
  PUBLIC_SITE_ORIGIN?: string
}

type Theme = 'default' | 'christmas'

const THEME_KEY = 'theme'
const THEME_COOKIE = 'ech_theme'
const THEMES: readonly Theme[] = ['default', 'christmas']
const NO_STORE = 'no-store'

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

/** Hashes both inputs so a wrong length cannot short-circuit the comparison. */
export async function themeTokenMatches(provided: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const [providedDigest, expectedDigest] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ])

  const providedBytes = new Uint8Array(providedDigest)
  const expectedBytes = new Uint8Array(expectedDigest)
  let difference = 0

  for (let index = 0; index < providedBytes.length; index += 1) {
    difference |= providedBytes[index]! ^ expectedBytes[index]!
  }

  return difference === 0
}

async function readTheme(env: Env): Promise<Theme> {
  const stored = await env.THEME_STATE.get(THEME_KEY)
  return isTheme(stored) ? stored : 'default'
}

function withThemeCookie(response: Response, theme: Theme): Response {
  const headers = new Headers(response.headers)
  headers.set('Set-Cookie', `${THEME_COOKIE}=${theme}; Path=/; SameSite=Lax`)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function withNoStore(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', NO_STORE)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function isHtml(response: Response): boolean {
  return (response.headers.get('content-type') ?? '').toLowerCase().includes('text/html')
}

async function proxy(request: Request, env: Env): Promise<Response> {
  const origin = env.PUBLIC_SITE_ORIGIN ?? 'https://jonathanech.dev'
  const incoming = new URL(request.url)
  const target = new URL(`${incoming.pathname}${incoming.search}`, origin)
  const headers = new Headers(request.headers)
  headers.delete('host')

  const upstream = new Request(target.toString(), {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? null : request.body,
    redirect: 'manual',
  })

  return fetch(upstream)
}

function invalidThemeResponse(status: number, message: string): Response {
  return withNoStore(
    new Response(message, {
      status,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    }),
  )
}

async function handleThemeUpdate(request: Request, env: Env): Promise<Response> {
  const authorization = request.headers.get('authorization') ?? ''
  const bearer = /^Bearer (.+)$/.exec(authorization)?.[1] ?? ''
  const expected = env.THEME_ADMIN_TOKEN

  if (!expected || !(await themeTokenMatches(bearer, expected))) {
    return withNoStore(
      new Response('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Bearer' },
      }),
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return invalidThemeResponse(422, 'Invalid JSON body')
  }

  const theme =
    payload && typeof payload === 'object' ? (payload as { theme?: unknown }).theme : undefined

  if (!isTheme(theme)) {
    return invalidThemeResponse(422, 'Invalid theme value')
  }

  await env.THEME_STATE.put(THEME_KEY, theme)
  return withNoStore(new Response(null, { status: 204 }))
}

function adminForm(theme: Theme): Response {
  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="color-scheme" content="dark" />
    <title>Tema global — Jonathan ECH</title>
    <style>
      :root { color-scheme: dark; font-family: ui-monospace, monospace; background: #0b0e14; color: #fff; }
      body { max-width: 36rem; margin: 4rem auto; padding: 0 1.25rem; line-height: 1.6; }
      fieldset { border: 1px solid #334155; border-radius: 0.75rem; padding: 1rem; }
      input, button { font: inherit; padding: 0.6rem 0.8rem; }
      button { cursor: pointer; margin-right: 0.5rem; }
      button:disabled { cursor: wait; opacity: 0.6; }
      #status { min-height: 1.5rem; margin-top: 1rem; }
    </style>
  </head>
  <body>
    <h1>Tema global del portafolio</h1>
    <p>Estado actual: <strong>${theme}</strong>. El cambio afecta a todos los visitantes sin deploy.</p>
    <form id="theme-form">
      <label for="token">Token de administrador</label><br />
      <input id="token" name="token" type="password" autocomplete="off" required /><br /><br />
      <fieldset>
        <legend>Activar para todos</legend>
        <button type="submit" name="theme" value="default">Predeterminado</button>
        <button type="submit" name="theme" value="christmas">Navideño</button>
      </fieldset>
      <p id="status" role="status" aria-live="polite"></p>
    </form>
    <script>
      const form = document.getElementById('theme-form')
      const status = document.getElementById('status')
      const token = document.getElementById('token')
      form.addEventListener('submit', async (event) => {
        event.preventDefault()
        const button = event.submitter
        const selected = button.value
        button.disabled = true
        button.setAttribute('aria-busy', 'true')
        status.textContent = 'Aplicando tema…'
        try {
          const response = await fetch('/api/admin/theme', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              Authorization: 'Bearer ' + token.value,
            },
            body: JSON.stringify({ theme: selected }),
          })
          status.textContent = response.status === 204
            ? (selected === 'christmas' ? 'Tema navideño activado para todos.' : 'Tema predeterminado restaurado para todos.')
            : response.status === 401 ? 'Token no válido.' : 'No se pudo actualizar el tema.'
        } catch {
          status.textContent = 'No se pudo actualizar el tema.'
        } finally {
          button.disabled = false
          button.removeAttribute('aria-busy')
        }
      })
    </script>
  </body>
</html>
`

  return withNoStore(
    new Response(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    }),
  )
}

const worker = {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const path = new URL(request.url).pathname

    if (path === '/api/admin/theme' && request.method === 'POST') {
      return handleThemeUpdate(request, env)
    }

    if (path === '/admin/theme' && (request.method === 'GET' || request.method === 'HEAD')) {
      const theme = await readTheme(env)
      return withThemeCookie(adminForm(theme), theme)
    }

    const theme = await readTheme(env)
    const response = await proxy(request, env)
    return isHtml(response) ? withThemeCookie(response, theme) : response
  },
} satisfies ExportedHandler<Env>

export default worker
