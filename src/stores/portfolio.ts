import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from '@/i18n'
import type { Project, TechFilter, Technology } from '@/types/portfolio'

const TECH_PREVIEW_COUNT = 4

export const usePortfolioStore = defineStore('portfolio', () => {
  const { content } = useI18n()

  const activeCategory = ref<TechFilter>('all')
  const quickViewSlug = ref<string | null>(null)
  const isTechGridExpanded = ref(false)

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

  const visibleTechnologies = computed<readonly Technology[]>(() => {
    if (activeCategory.value !== 'all' || isTechGridExpanded.value) {
      return filteredTechnologies.value
    }

    return filteredTechnologies.value.slice(0, TECH_PREVIEW_COUNT)
  })

  const canToggleTechGrid = computed(
    () => activeCategory.value === 'all' && filteredTechnologies.value.length > TECH_PREVIEW_COUNT,
  )

  function setCategory(category: TechFilter): void {
    activeCategory.value = category
    isTechGridExpanded.value = false
  }

  function toggleTechGrid(): void {
    isTechGridExpanded.value = !isTechGridExpanded.value
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
    isTechGridExpanded,
    filteredTechnologies,
    visibleTechnologies,
    categoryCounts,
    canToggleTechGrid,
    quickViewProject,
    isQuickViewOpen,
    setCategory,
    toggleTechGrid,
    openQuickView,
    closeQuickView,
  }
})
