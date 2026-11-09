import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { contactChannels, profile, projects, technologies } from '@/data/portfolio'
import { enContent } from '@/data/portfolio.en'
import { usePortfolioStore } from '@/stores/portfolio'
import { usePortfolioData } from '@/composables/usePortfolioData'

describe('portfolio data integrity', () => {
  it('exposes the twenty-three technologies across the four ecosystem categories', () => {
    expect(technologies).toHaveLength(23)
    expect(new Set(technologies.map((tech) => tech.id)).size).toBe(23)
    expect(technologies.filter((tech) => tech.category === 'frontend')).toHaveLength(8)
    expect(technologies.filter((tech) => tech.category === 'backend')).toHaveLength(7)
    expect(technologies.filter((tech) => tech.category === 'database')).toHaveLength(2)
    expect(technologies.filter((tech) => tech.category === 'devops')).toHaveLength(6)
  })

  it('defines unique projects with complete case-study content', () => {
    expect(projects).toHaveLength(3)
    expect(new Set(projects.map((project) => project.slug)).size).toBe(3)

    for (const project of projects) {
      expect(project.galleryDescription.trim().length).toBeGreaterThan(0)
      expect(project.gallery.length).toBeGreaterThanOrEqual(3)
      expect(project.modules).toHaveLength(3)
      expect(project.challenge.findings.length).toBeGreaterThan(0)
      expect(project.audit.discrepancy).toMatch(/%$/)
      expect(project.techTags.length).toBeGreaterThan(0)
    }
  })

  it('keeps the TilyShop audit metrics aligned with the brief', () => {
    const tilyshop = projects.find((project) => project.slug === 'tilyshop-inventory')

    expect(tilyshop?.name).toBe('TilyShop Inventory')
    expect(tilyshop?.audit.latencyBefore).toBe('4,820 ms')
    expect(tilyshop?.audit.latencyAfter).toBe('42 ms')
    expect(tilyshop?.audit.discrepancy).toBe('0.00%')
  })

  it('exposes a complete profile and four direct contact channels', () => {
    expect(profile.headline).toEqual(['DESARROLLADOR WEB FRONTEND', 'ARQUITECTO DE SOFTWARE'])
    expect(profile.performance).toHaveLength(4)
    expect(contactChannels).toHaveLength(4)
    expect(contactChannels.find((channel) => channel.id === 'email')?.copyValue).toBe(
      'jonathancamposbusiness@gmail.com',
    )
    expect(contactChannels.find((channel) => channel.id === 'whatsapp')?.value).toBe(
      '+58 4121966931',
    )
    expect(contactChannels.find((channel) => channel.id === 'whatsapp')?.href).toBe(
      'https://wa.me/584121966931',
    )
  })

  it('frames artificial intelligence as a strategic tool in both locales', () => {
    expect(profile.bioAi).toContain(
      'Utilizo la Inteligencia Artificial no solo como asistente de código, sino como una herramienta estratégica para optimizar flujos de desarrollo, mejorar la accesibilidad y elevar la experiencia final del usuario (UX).',
    )
    expect(enContent.profile.bioAi).toContain(
      'I use Artificial Intelligence not only as a coding assistant, but as a strategic tool to optimize development workflows, improve accessibility and elevate the final user experience (UX).',
    )
  })
})

describe('portfolio store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with every technology and computes the filter counters', () => {
    const store = usePortfolioStore()

    expect(store.activeCategory).toBe('all')
    expect(store.filteredTechnologies).toHaveLength(23)
    expect(store.categoryCounts).toEqual({
      all: 23,
      frontend: 8,
      backend: 7,
      database: 2,
      devops: 6,
    })
  })

  it('filters the technology grid by category', () => {
    const store = usePortfolioStore()

    store.setCategory('backend')

    expect(store.activeCategory).toBe('backend')
    expect(store.filteredTechnologies).toHaveLength(7)
    expect(store.filteredTechnologies.every((tech) => tech.category === 'backend')).toBe(true)
  })

  it('opens and closes the quick view for a known project', () => {
    const store = usePortfolioStore()

    store.openQuickView('tilyshop-inventory')

    expect(store.isQuickViewOpen).toBe(true)
    expect(store.quickViewProject?.slug).toBe('tilyshop-inventory')

    store.closeQuickView()

    expect(store.isQuickViewOpen).toBe(false)
    expect(store.quickViewProject).toBeNull()
  })

  it('ignores unknown project slugs in the quick view', () => {
    const store = usePortfolioStore()

    store.openQuickView('does-not-exist')

    expect(store.isQuickViewOpen).toBe(false)
    expect(store.quickViewProject).toBeNull()
  })

  it('collapses the all-technologies grid to the first four items', () => {
    const store = usePortfolioStore()

    expect(store.visibleTechnologies).toHaveLength(4)
    expect(store.canToggleTechGrid).toBe(true)
    expect(store.isTechGridExpanded).toBe(false)
  })

  it('expands and collapses the all-technologies grid', () => {
    const store = usePortfolioStore()

    store.toggleTechGrid()

    expect(store.isTechGridExpanded).toBe(true)
    expect(store.visibleTechnologies).toHaveLength(23)

    store.toggleTechGrid()

    expect(store.isTechGridExpanded).toBe(false)
    expect(store.visibleTechnologies).toHaveLength(4)
  })

  it('shows every technology of a category and hides the toggle', () => {
    const store = usePortfolioStore()

    store.setCategory('backend')

    expect(store.visibleTechnologies).toHaveLength(7)
    expect(store.canToggleTechGrid).toBe(false)
  })

  it('resets the expansion when the category changes', () => {
    const store = usePortfolioStore()

    store.toggleTechGrid()
    store.setCategory('frontend')
    store.setCategory('all')

    expect(store.isTechGridExpanded).toBe(false)
    expect(store.visibleTechnologies).toHaveLength(4)
  })
})

describe('usePortfolioData', () => {
  it('finds a project by slug and returns null-safe neighbours with wrap-around', () => {
    const { getProjectBySlug, getProjectNeighbors } = usePortfolioData()

    expect(getProjectBySlug('tilyshop-inventory')?.name).toBe('TilyShop Inventory')

    const first = getProjectNeighbors('tilyshop-inventory')
    expect(first.previous?.slug).toBe('erp-contable')
    expect(first.next?.slug).toBe('gestion-medica')

    const last = getProjectNeighbors('erp-contable')
    expect(last.previous?.slug).toBe('gestion-medica')
    expect(last.next?.slug).toBe('tilyshop-inventory')
  })

  it('returns no neighbours for an unknown slug', () => {
    const { getProjectNeighbors } = usePortfolioData()

    expect(getProjectNeighbors('unknown')).toEqual({ previous: null, next: null })
  })
})
