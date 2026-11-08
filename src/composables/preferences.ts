import type {
  LocaleMode,
  Preferences,
  ResolvedLocale,
  ResolvedTheme,
  ThemeMode,
} from '@/types/portfolio'

const THEME_MODES: readonly ThemeMode[] = ['system', 'dark', 'light']
const LOCALE_MODES: readonly LocaleMode[] = ['system', 'es', 'en']

export function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && THEME_MODES.includes(value as ThemeMode)
}

export function isLocaleMode(value: unknown): value is LocaleMode {
  return typeof value === 'string' && LOCALE_MODES.includes(value as LocaleMode)
}

export function resolveTheme(mode: ThemeMode, systemDark: boolean): ResolvedTheme {
  if (mode === 'system') {
    return systemDark ? 'dark' : 'light'
  }

  return mode
}

export function resolveLocale(mode: LocaleMode, navigatorLanguage: string): ResolvedLocale {
  if (mode !== 'system') {
    return mode
  }

  return navigatorLanguage.toLowerCase().startsWith('en') ? 'en' : 'es'
}

export function parsePreferences(raw: string | null): Preferences {
  if (!raw) {
    return { theme: 'system', locale: 'system' }
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>

    return {
      theme: isThemeMode(parsed.theme) ? parsed.theme : 'system',
      locale: isLocaleMode(parsed.locale) ? parsed.locale : 'system',
    }
  } catch {
    return { theme: 'system', locale: 'system' }
  }
}

export function serializePreferences(preferences: Preferences): string {
  return JSON.stringify({ theme: preferences.theme, locale: preferences.locale })
}
