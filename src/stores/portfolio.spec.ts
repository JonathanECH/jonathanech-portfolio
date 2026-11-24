import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { contactChannels, profile, projects, technologies } from '@/data/portfolio'
import { enContent } from '@/data/portfolio.en'
import { usePortfolioStore } from '@/stores/portfolio'
import { usePortfolioData } from '@/composables/usePortfolioData'

const LEGACY_AUDIT_KEYS = ['metrics', 'consistency' + 'Note'] as const

function expectNoLegacyAuditFields(audit: object): void {
  for (const key of LEGACY_AUDIT_KEYS) {
    expect(key in audit, key).toBe(false)
  }
}

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
    expect(projects).toHaveLength(4)
    expect(new Set(projects.map((project) => project.slug)).size).toBe(4)

    for (const project of projects) {
      expect(project.galleryDescription.trim().length).toBeGreaterThan(0)
      expect(project.gallery.length).toBeGreaterThanOrEqual(3)
      expect(project.modules).toHaveLength(3)
      expect(project.challenge.findings.length).toBeGreaterThan(0)
      expectNoLegacyAuditFields(project.audit)
      expect(project.audit.diagnosis.trim().length).toBeGreaterThan(0)
      expect(project.audit.resolution.trim().length).toBeGreaterThan(0)
      expect(project.audit.badge.trim().length).toBeGreaterThan(0)
      expect(project.techTags.length).toBeGreaterThan(0)
    }

    for (const project of enContent.projects) {
      expectNoLegacyAuditFields(project.audit)
      expect(project.audit.diagnosis.trim().length).toBeGreaterThan(0)
      expect(project.audit.resolution.trim().length).toBeGreaterThan(0)
    }
  })

  it('keeps the TilyShop audit diagnosis aligned with the architecture brief', () => {
    const tilyshop = projects.find((project) => project.slug === 'tilyshop-inventory')

    expect(tilyshop?.name).toBe('TilyShop Inventory')
    expect(tilyshop?.audit.badge).toBe('ARQUITECTURA VERIFICADA')
    expect(tilyshop?.audit.diagnosis).toContain('escrituras no atómicas')
    expect(tilyshop?.audit.resolution).toContain('locks optimistas')
    expectNoLegacyAuditFields(tilyshop?.audit ?? {})
  })

  it('exposes Clima Vue as a deployed project with real links', () => {
    const clima = projects.find((project) => project.slug === 'clima-vue')

    expect(clima?.name).toBe('Clima Vue')
    expect(clima?.status).toBe('DESPLEGADO')
    expect(clima?.links.demo).toBe('https://clima-vue-vert.vercel.app/')
    expect(clima?.links.repo).toBe('https://github.com/JonathanECH/clima-vue')
    expect(clima?.gallery).toHaveLength(3)
    expect(clima?.gallery.every((slide) => Boolean(slide.image))).toBe(true)
    expect(clima?.techTags).toContain('OpenWeatherMap')
    expectNoLegacyAuditFields(clima?.audit ?? {})
  })

  it('exposes a complete profile and four direct contact channels', () => {
    expect(profile.headline).toEqual(['DESARROLLADOR WEB', 'FRONTEND ENGINEER'])
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
    expect(contactChannels.find((channel) => channel.id === 'email')?.rel).toBeUndefined()
    expect(contactChannels.find((channel) => channel.id === 'github')?.rel).toBe(
      'me noopener noreferrer',
    )
    expect(contactChannels.find((channel) => channel.id === 'linkedin')?.rel).toBe(
      'me noopener noreferrer',
    )
    expect(contactChannels.find((channel) => channel.id === 'whatsapp')?.rel).toBe(
      'noopener noreferrer',
    )
  })

  it('keeps the Clínica Razetti audit diagnosis aligned across Spanish and English', () => {
    const esRazetti = projects.find((project) => project.slug === 'gestion-medica')
    const enRazetti = enContent.projects.find((project) => project.slug === 'gestion-medica')

    expect(esRazetti?.audit.diagnosis).toContain('revocación de tokens JWT en tiempo real')
    expect(enRazetti?.audit.diagnosis).toContain(
      'real-time JWT token revocation when deactivating users',
    )
    expect(enRazetti?.audit.diagnosis).not.toContain('unindexed tables')
  })

  it('keeps the bio recruiter-focused without internship or junior-seeking language', () => {
    const bios = [profile.bio, enContent.profile.bio]

    for (const bio of bios) {
      expect(bio).not.toMatch(/\bpasant/i)
      expect(bio).not.toMatch(/\binternships?\b/i)
      expect(bio).not.toMatch(/junior/i)
      expect(bio).not.toMatch(/busco|seeking/i)
    }

    expect(profile.bio).toContain('equipos remotos e internacionales')
    expect(enContent.profile.bio).toContain('remote and international teams')
  })

  it('frames artificial intelligence as a strategic tool in both locales', () => {
    expect(profile.bioAi).toContain(
      'Utilizo la Inteligencia Artificial como multiplicador de productividad',
    )
    expect(enContent.profile.bioAi).toContain(
      'I use Artificial Intelligence as a productivity multiplier',
    )
  })

  it('keeps the Clinica Razetti accent legible in both themes and locales', () => {
    const css = readFileSync(
      fileURLToPath(new URL('../styles/main.css', import.meta.url)),
      'utf8',
    )
    const accentFor = (selector: string): string => {
      const block = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\}`))?.[1] ?? ''
      return block.match(/--ech-razetti-accent:\s*(#[0-9a-f]{6})/i)?.[1] ?? ''
    }
    const relativeLuminance = (hex: string): number => {
      const channels = hex
        .slice(1)
        .match(/../g)!
        .map((value) => parseInt(value, 16) / 255)
        .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))

      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
    }
    const contrastRatio = (hex: string, background: string): number => {
      const [lighter, darker] = [relativeLuminance(hex), relativeLuminance(background)].sort(
        (a, b) => b - a,
      )
      return (lighter + 0.05) / (darker + 0.05)
    }

    for (const localeProjects of [projects, enContent.projects]) {
      expect(localeProjects.find((project) => project.slug === 'gestion-medica')?.accent).toBe(
        'var(--ech-razetti-accent)',
      )
    }

    const darkAccent = accentFor(':root')
    const lightAccent = accentFor('\\.light')

    expect(darkAccent).toMatch(/^#[0-9a-f]{6}$/i)
    expect(lightAccent).toMatch(/^#[0-9a-f]{6}$/i)
    expect(contrastRatio(darkAccent, '#0b0e14')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(darkAccent, '#161a24')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(lightAccent, '#edf0f8')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(lightAccent, '#f5f7fa')).toBeGreaterThanOrEqual(4.5)
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
    expect(first.next?.slug).toBe('clima-vue')

    const clima = getProjectNeighbors('clima-vue')
    expect(clima.previous?.slug).toBe('tilyshop-inventory')
    expect(clima.next?.slug).toBe('gestion-medica')

    const last = getProjectNeighbors('erp-contable')
    expect(last.previous?.slug).toBe('gestion-medica')
    expect(last.next?.slug).toBe('tilyshop-inventory')
  })

  it('returns no neighbours for an unknown slug', () => {
    const { getProjectNeighbors } = usePortfolioData()

    expect(getProjectNeighbors('unknown')).toEqual({ previous: null, next: null })
  })
})
