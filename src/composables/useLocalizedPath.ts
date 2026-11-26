import { computed } from 'vue'
import { useI18n } from '@/i18n'
import { localizedPath } from '@/utils/localized-path'

export function useLocalizedPath() {
  const { locale } = useI18n()

  const homePath = computed(() => localizedPath('/', locale.value))

  function projectPath(slug: string): string {
    return localizedPath(`/proyectos/${slug}`, locale.value)
  }

  function withLocale(path: string): string {
    return localizedPath(path, locale.value)
  }

  return { homePath, projectPath, withLocale }
}
