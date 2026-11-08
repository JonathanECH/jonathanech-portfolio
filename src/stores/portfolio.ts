import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { projects, technologies } from '@/data/portfolio'
import type { Project, TechCategory, TechFilter, Technology } from '@/types/portfolio'

export const usePortfolioStore = defineStore('portfolio', () => {
  const activeCategory = ref<TechFilter>('all')
  const quickViewSlug = ref<string | null>(null)

  const filteredTechnologies = computed<readonly Technology[]>(() => {
    if (activeCategory.value === 'all') {
      return technologies
    }

    return technologies.filter((tech) => tech.category === activeCategory.value)
  })

  const categoryCounts = computed<Record<TechFilter, number>>(() => {
    const counts: Record<TechFilter, number> = {
      all: technologies.length,
      frontend: 0,
      backend: 0,
      database: 0,
      devops: 0,
    }

    for (const tech of technologies) {
      counts[tech.category] += 1
    }

    return counts
  })

  const quickViewProject = computed<Project | null>(
    () => projects.find((project) => project.slug === quickViewSlug.value) ?? null,
  )

  const isQuickViewOpen = computed(() => quickViewProject.value !== null)

  function setCategory(category: TechFilter): void {
    activeCategory.value = category
  }

  function resetFilters(): void {
    activeCategory.value = 'all'
  }

  function openQuickView(slug: string): void {
    if (projects.some((project) => project.slug === slug)) {
      quickViewSlug.value = slug
    }
  }

  function closeQuickView(): void {
    quickViewSlug.value = null
  }

  function countByCategory(category: TechCategory): number {
    return categoryCounts.value[category]
  }

  return {
    activeCategory,
    quickViewSlug,
    filteredTechnologies,
    categoryCounts,
    quickViewProject,
    isQuickViewOpen,
    setCategory,
    resetFilters,
    openQuickView,
    closeQuickView,
    countByCategory,
  }
})
