import { computed } from 'vue'
import { useI18n } from '@/i18n'
import type { Project } from '@/types/portfolio'

interface ProjectNeighbors {
  readonly previous: Project | null
  readonly next: Project | null
}

export function usePortfolioData() {
  const { content } = useI18n()

  const technologies = computed(() => content.value.technologies)
  const techFilterOptions = computed(() => content.value.techFilterOptions)
  const projects = computed(() => content.value.projects)
  const profile = computed(() => content.value.profile)
  const contactChannels = computed(() => content.value.contactChannels)

  function getProjectBySlug(slug: string): Project | undefined {
    return projects.value.find((project) => project.slug === slug)
  }

  function getProjectNeighbors(slug: string): ProjectNeighbors {
    const list = projects.value
    const index = list.findIndex((project) => project.slug === slug)

    if (index === -1) {
      return { previous: null, next: null }
    }

    const previous = list[(index - 1 + list.length) % list.length] ?? null
    const next = list[(index + 1) % list.length] ?? null

    return { previous, next }
  }

  return {
    technologies,
    techFilterOptions,
    projects,
    profile,
    contactChannels,
    getProjectBySlug,
    getProjectNeighbors,
  }
}
