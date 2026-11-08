import {
  contactChannels,
  profile,
  projects,
  techFilterOptions,
  technologies,
} from '@/data/portfolio'
import type { Project } from '@/types/portfolio'

interface ProjectNeighbors {
  readonly previous: Project | null
  readonly next: Project | null
}

export function usePortfolioData() {
  function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((project) => project.slug === slug)
  }

  function getProjectNeighbors(slug: string): ProjectNeighbors {
    const index = projects.findIndex((project) => project.slug === slug)

    if (index === -1) {
      return { previous: null, next: null }
    }

    const previous = projects[(index - 1 + projects.length) % projects.length] ?? null
    const next = projects[(index + 1) % projects.length] ?? null

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
