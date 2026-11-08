import { describe, expect, it } from 'vitest'
import {
  isLocaleMode,
  isThemeMode,
  parsePreferences,
  resolveLocale,
  resolveTheme,
  serializePreferences,
} from '@/composables/preferences'

describe('resolveTheme', () => {
  it('follows the system when the mode is system', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })

  it('lets an explicit mode win over the system', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
  })
})

describe('resolveLocale', () => {
  it('follows the browser language when the mode is system', () => {
    expect(resolveLocale('system', 'en-US')).toBe('en')
    expect(resolveLocale('system', 'es-VE')).toBe('es')
  })

  it('falls back to Spanish for unknown system languages', () => {
    expect(resolveLocale('system', 'fr-FR')).toBe('es')
    expect(resolveLocale('system', '')).toBe('es')
  })

  it('lets an explicit locale win over the browser', () => {
    expect(resolveLocale('en', 'es-VE')).toBe('en')
    expect(resolveLocale('es', 'en-US')).toBe('es')
  })
})

describe('preferences storage', () => {
  it('parses valid preferences', () => {
    expect(parsePreferences('{"theme":"light","locale":"en"}')).toEqual({
      theme: 'light',
      locale: 'en',
    })
  })

  it('falls back to system defaults for missing or invalid data', () => {
    expect(parsePreferences(null)).toEqual({ theme: 'system', locale: 'system' })
    expect(parsePreferences('not json')).toEqual({ theme: 'system', locale: 'system' })
    expect(parsePreferences('{"theme":"neon","locale":"fr"}')).toEqual({
      theme: 'system',
      locale: 'system',
    })
  })

  it('serializes a round trip', () => {
    const prefs = { theme: 'dark', locale: 'es' } as const

    expect(parsePreferences(serializePreferences(prefs))).toEqual(prefs)
  })

  it('guards mode values', () => {
    expect(isThemeMode('dark')).toBe(true)
    expect(isThemeMode('neon')).toBe(false)
    expect(isLocaleMode('en')).toBe(true)
    expect(isLocaleMode('fr')).toBe(false)
  })
})
