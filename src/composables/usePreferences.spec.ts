import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

interface RootStub {
  classList: {
    toggle: ReturnType<typeof vi.fn>
    remove: ReturnType<typeof vi.fn>
  }
  dataset: Record<string, string>
  lang: string
}

async function loadPreferences(cookie: string, storedTheme: string) {
  const root: RootStub = {
    classList: { toggle: vi.fn(), remove: vi.fn() },
    dataset: {},
    lang: '',
  }
  const themeColor = { content: '' }
  const setItem = vi.fn()
  const getItem = vi.fn(() => JSON.stringify({ theme: storedTheme, locale: 'es' }))

  vi.stubGlobal('document', {
    cookie,
    documentElement: root,
    querySelector: vi.fn(() => themeColor),
    createElement: vi.fn(() => ({ innerHTML: '', content: {} })),
  })
  vi.stubGlobal('window', {
    localStorage: { getItem, setItem },
    matchMedia: vi.fn(() => ({ matches: false, addEventListener: vi.fn() })),
    addEventListener: vi.fn(),
  })
  vi.stubGlobal('navigator', { language: 'es-VE' })

  const { nextTick } = await import('vue')
  const { CHRISTMAS_THEME_COLOR, initPreferences, setTheme } = await import(
    '@/composables/usePreferences'
  )

  initPreferences()
  await nextTick()

  return { root, themeColor, setItem, getItem, setTheme, nextTick, CHRISTMAS_THEME_COLOR }
}

describe('usePreferences with the worker-managed theme', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('keeps christmas even when the visitor switches dark or light', async () => {
    const context = await loadPreferences('ech_theme=christmas', 'light')

    expect(context.root.dataset.theme).toBe('christmas')
    expect(context.CHRISTMAS_THEME_COLOR).toBe('#071410')
    expect(context.themeColor.content).toBe(context.CHRISTMAS_THEME_COLOR)
    expect(context.root.classList.remove).toHaveBeenCalledWith('dark', 'light')

    context.setTheme('dark')
    await context.nextTick()
    expect(context.root.dataset.theme).toBe('christmas')
    expect(context.root.classList.toggle).not.toHaveBeenCalledWith('dark', true)

    context.setTheme('light')
    await context.nextTick()
    expect(context.root.dataset.theme).toBe('christmas')
    expect(context.root.classList.toggle).not.toHaveBeenCalledWith('light', true)
  })

  it('restores the stored preference while the worker cookie is default', async () => {
    const context = await loadPreferences('ech_theme=default', 'light')

    expect(context.root.dataset.theme).toBe('light')

    context.setTheme('dark')
    await context.nextTick()

    expect(context.root.dataset.theme).toBe('dark')
    expect(context.root.classList.toggle).toHaveBeenCalledWith('dark', true)
    expect(context.themeColor.content).toBe('#0B0E14')
  })

  it('ignores an unknown cookie value and falls back to the stored preference', async () => {
    const context = await loadPreferences('ech_theme=halloween', 'light')

    expect(context.root.dataset.theme).toBe('light')
    expect(context.root.dataset.theme).not.toBe('halloween')
  })
})
