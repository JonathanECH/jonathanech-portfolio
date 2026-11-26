import { computed } from 'vue'
import { usePreferences } from '@/composables/usePreferences'
import { useRouteLocale } from '@/composables/useRouteLocale'
import type { PortfolioContent, ResolvedLocale } from '@/types/portfolio'
import { enContent, esContent } from './content'
import { enMessages } from './messages/en'
import { esMessages } from './messages/es'
import type { MessageParams, UiMessageKey, UiMessages } from './types'

const dictionaries: Record<ResolvedLocale, UiMessages> = {
  es: esMessages,
  en: enMessages,
}

const contents: Record<ResolvedLocale, PortfolioContent> = {
  es: esContent,
  en: enContent,
}

export function translate(
  messages: Record<string, string>,
  key: string,
  params?: MessageParams,
): string {
  const template = messages[key]

  if (template === undefined) {
    return key
  }

  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params?.[name]
    return value === undefined ? match : String(value)
  })
}

export function useI18n() {
  const { resolvedLocale } = usePreferences()
  const routeLocale = useRouteLocale()
  const locale = computed<ResolvedLocale>(() => routeLocale.value ?? resolvedLocale.value)

  const messages = computed<UiMessages>(() => dictionaries[locale.value])
  const content = computed<PortfolioContent>(() => contents[locale.value])

  function t(key: UiMessageKey, params?: MessageParams): string {
    return translate(messages.value, key, params)
  }

  return {
    locale,
    messages,
    content,
    t,
  }
}

export type { MessageParams, UiMessageKey, UiMessages }
