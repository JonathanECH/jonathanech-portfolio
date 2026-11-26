import type { ResolvedLocale } from '@/types/portfolio'

export const EN_PATH_PREFIX = '/en'

export function isEnglishPath(path: string): boolean {
  return path === EN_PATH_PREFIX || path.startsWith(`${EN_PATH_PREFIX}/`)
}

/**
 * Maps a canonical Spanish path to its English counterpart and back.
 * Paths are expected without query or hash; callers append fragments themselves.
 */
export function localizedPath(path: string, locale: ResolvedLocale): string {
  if (locale === 'en') {
    if (path === '/') {
      return EN_PATH_PREFIX
    }
    return isEnglishPath(path) ? path : `${EN_PATH_PREFIX}${path}`
  }

  if (path === EN_PATH_PREFIX) {
    return '/'
  }
  return path.startsWith(`${EN_PATH_PREFIX}/`) ? path.slice(EN_PATH_PREFIX.length) : path
}
