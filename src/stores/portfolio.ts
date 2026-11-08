import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from '@/i18n'
import type { Project, TechFilter, Technology } from '@/types/portfolio'

export const usePortfolioStore = defineStore('portfolio', () => {
  const { content } = useI18n()

  const activeCategory = ref<TechFilter>('all')
  const quickViewSlug = ref<string | null>(null)

  const technologies = computed<readonly Technology[]>(() => content.value.technologies)
  const projects = computed<readonly Project[]>(() => content.value.projects)

  const filteredTechnologies = computed<readonly Technology[]>(() => {
    if (activeCategory.value === 'all') {
      return technologies.value
    }

    return technologies.value.filter((tech) => tech.category === activeCategory.value)
  })

  const categoryCounts = computed<Record<TechFilter, number>>(() => {
    const counts: Record<TechFilter, number> = {
      all: technologies.value.length,
      frontend: 0,
      backend: 0,
      database: 0,
      devops: 0,
    }

    for (const tech of technologies.value) {
      counts[tech.category] += 1
    }

    return counts
  })

  const quickViewProject = computed<Project | null>(
    () => projects.value.find((project) => project.slug === quickViewSlug.value) ?? null,
  )

  const isQuickViewOpen = computed(() => quickViewProject.value !== null)

  function setCategory(category: TechFilter): void {
    activeCategory.value = category
  }

  function openQuickView(slug: string): void {
    if (projects.value.some((project) => project.slug === slug)) {
      quickViewSlug.value = slug
    }
  }

  function closeQuickView(): void {
    quickViewSlug.value = null
  }

  return {
    activeCategory,
    quickViewSlug,
    filteredTechnologies,
    categoryCounts,
    quickViewProject,
    isQuickViewOpen,
    setCategory,
    openQuickView,
    closeQuickView,
  }
})
