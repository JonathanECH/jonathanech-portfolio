import { computed, getCurrentInstance, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import type { ResolvedLocale } from '@/types/portfolio'
import { isEnglishPath } from '@/utils/localized-path'

/** The URL wins over stored preferences so prerendered `/en` pages stay English. */
export function useRouteLocale(): ComputedRef<ResolvedLocale | null> {
  const route = getCurrentInstance() ? useRoute() : null
  return computed(() => (route && isEnglishPath(route.path) ? 'en' : null))
}
