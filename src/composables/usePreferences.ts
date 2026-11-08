import { computed, ref, watch } from 'vue'
import {
  parsePreferences,
  resolveLocale,
  resolveTheme,
  serializePreferences,
} from '@/composables/preferences'
import type {
  LocaleMode,
  Preferences,
  ResolvedLocale,
  ResolvedTheme,
  ThemeMode,
} from '@/types/portfolio'

export const PREFERENCES_STORAGE_KEY = 'ech:preferences'

const themeMode = ref<ThemeMode>('system')
const localeMode = ref<LocaleMode>('system')
const systemDark = ref(false)
const systemLanguage = ref('es')

let initialized = false

const resolvedTheme = computed<ResolvedTheme>(() =>
  resolveTheme(themeMode.value, systemDark.value),
)

const resolvedLocale = computed<ResolvedLocale>(() =>
  resolveLocale(localeMode.value, systemLanguage.value),
)

function currentPreferences(): Preferences {
  return { theme: themeMode.value, locale: localeMode.value }
}

function readStoredPreferences(): Preferences {
  if (typeof window === 'undefined') {
    return { theme: 'system', locale: 'system' }
  }

  try {
    return parsePreferences(window.localStorage.getItem(PREFERENCES_STORAGE_KEY))
  } catch {
    return { theme: 'system', locale: 'system' }
  }
}

function applyToDocument(): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement

  root.classList.toggle('dark', resolvedTheme.value === 'dark')
  root.classList.toggle('light', resolvedTheme.value === 'light')
  root.dataset.theme = resolvedTheme.value
  root.lang = resolvedLocale.value

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')

  if (themeColor) {
    themeColor.content = resolvedTheme.value === 'dark' ? '#0B0E14' : '#EDF0F8'
  }
}

function persistPreferences(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      serializePreferences(currentPreferences()),
    )
  } catch {
    // Storage can be unavailable in private mode; preferences stay in memory.
  }
}

export function initPreferences(): void {
  if (initialized || typeof window === 'undefined') {
    return
  }

  initialized = true

  const stored = readStoredPreferences()
  themeMode.value = stored.theme
  localeMode.value = stored.locale

  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemDark.value = darkQuery.matches
  systemLanguage.value = navigator.language || 'es'

  darkQuery.addEventListener('change', (event) => {
    systemDark.value = event.matches
  })

  window.addEventListener('languagechange', () => {
    systemLanguage.value = navigator.language || 'es'
  })

  watch(
    [themeMode, localeMode],
    () => {
      persistPreferences()
      applyToDocument()
    },
    { flush: 'post' },
  )

  watch([resolvedTheme, resolvedLocale], applyToDocument, { flush: 'post' })

  applyToDocument()
}

export function setTheme(mode: ThemeMode): void {
  themeMode.value = mode
}

export function setLocale(mode: LocaleMode): void {
  localeMode.value = mode
}

export function usePreferences() {
  return {
    themeMode,
    localeMode,
    resolvedTheme,
    resolvedLocale,
    setTheme,
    setLocale,
    initPreferences,
  }
}
