import type { ExecutionContext } from '@cloudflare/workers-types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import worker, { themeTokenMatches } from './index'

type WorkerEnv = Parameters<typeof worker.fetch>[1]

const CONTEXT = {} as ExecutionContext
const ADMIN_TOKEN = 'test-admin-token'

function createEnv(storedTheme: string | null = null, token: string = ADMIN_TOKEN) {
  const store = new Map<string, string>()
  if (storedTheme) {
    store.set('theme', storedTheme)
  }

  const get = vi.fn(async (key: string) => store.get(key) ?? null)
  const put = vi.fn(async (key: string, value: string) => {
    store.set(key, value)
  })

  const env = {
    THEME_STATE: { get, put },
    THEME_ADMIN_TOKEN: token,
    PUBLIC_SITE_ORIGIN: 'https://origin.test',
  } as unknown as WorkerEnv

  return { env, get, put, store }
}

function htmlResponse(): Response {
  return new Response('<!doctype html><html><body>origin html</body></html>', {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

function postTheme(
  env: WorkerEnv,
  body: unknown,
  authorization?: string,
): Promise<Response> {
  return worker.fetch(
    new Request('https://worker.test/api/admin/theme', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(authorization ? { authorization } : {}),
      },
      body: JSON.stringify(body),
    }),
    env,
    CONTEXT,
  )
}

describe('theme worker', () => {
  let originFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    originFetch = vi.fn(async () => htmlResponse())
    vi.stubGlobal('fetch', originFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('passes Vercel HTML through and defaults the cookie when KV is empty', async () => {
    const { env, get, put } = createEnv(null)

    const response = await worker.fetch(
      new Request('https://worker.test/?from=home'),
      env,
      CONTEXT,
    )

    expect(response.status).toBe(200)
    expect(await response.text()).toContain('origin html')
    expect(response.headers.get('set-cookie')).toBe('ech_theme=default; Path=/; SameSite=Lax')
    expect(get).toHaveBeenCalledWith('theme')
    expect(put).not.toHaveBeenCalled()

    const upstream = originFetch.mock.calls[0]?.[0] as Request
    expect(new URL(upstream.url).origin).toBe('https://origin.test')
    expect(new URL(upstream.url).search).toBe('?from=home')
  })

  it('fixes the cookie from KV when the global theme is christmas', async () => {
    const { env } = createEnv('christmas')

    const response = await worker.fetch(new Request('https://worker.test/'), env, CONTEXT)

    expect(response.status).toBe(200)
    expect(response.headers.get('set-cookie')).toBe('ech_theme=christmas; Path=/; SameSite=Lax')
  })

  it('ignores an invalid KV value and uses the default theme', async () => {
    const { env } = createEnv('halloween')

    const response = await worker.fetch(new Request('https://worker.test/'), env, CONTEXT)

    expect(response.headers.get('set-cookie')).toBe('ech_theme=default; Path=/; SameSite=Lax')
  })

  it('rejects a missing token without writing to KV', async () => {
    const { env, put } = createEnv('default')

    const response = await postTheme(env, { theme: 'christmas' })

    expect(response.status).toBe(401)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(put).not.toHaveBeenCalled()
    expect(originFetch).not.toHaveBeenCalled()
  })

  it('rejects a wrong token of the same length without writing to KV', async () => {
    const { env, put } = createEnv('default')

    const response = await postTheme(env, { theme: 'christmas' }, 'Bearer test-admin-tokeN')

    expect(response.status).toBe(401)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(put).not.toHaveBeenCalled()
  })

  it('updates KV and returns 204 for an authorized enum value', async () => {
    const { env, put } = createEnv('default')

    const response = await postTheme(env, { theme: 'christmas' }, `Bearer ${ADMIN_TOKEN}`)

    expect(response.status).toBe(204)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(put).toHaveBeenCalledWith('theme', 'christmas')
  })

  it('rejects a value outside the enum without writing to KV', async () => {
    const { env, put } = createEnv('default')

    const response = await postTheme(env, { theme: 'halloween' }, `Bearer ${ADMIN_TOKEN}`)

    expect(response.status).toBe(422)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(put).not.toHaveBeenCalled()
  })

  it('serves a noindex, no-store admin form that never contains the token', async () => {
    const { env } = createEnv('default', 'super-secret-admin-token')

    const response = await worker.fetch(
      new Request('https://worker.test/admin/theme'),
      env,
      CONTEXT,
    )
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('set-cookie')).toBe('ech_theme=default; Path=/; SameSite=Lax')
    expect(html).toContain('name="robots" content="noindex, nofollow"')
    expect(html).not.toContain('super-secret-admin-token')
    expect(html).toContain('aria-live="polite"')
    expect(html).toContain('disabled')
    expect(html).toContain('/api/admin/theme')
    expect(originFetch).not.toHaveBeenCalled()
  })

  it('hashes both tokens before comparing so length cannot short-circuit', async () => {
    const digest = vi.spyOn(crypto.subtle, 'digest')

    expect(await themeTokenMatches('short', 'a-much-longer-token')).toBe(false)
    expect(digest).toHaveBeenCalledTimes(2)

    digest.mockClear()
    expect(await themeTokenMatches(ADMIN_TOKEN, ADMIN_TOKEN)).toBe(true)
    expect(digest).toHaveBeenCalledTimes(2)
  })
})
