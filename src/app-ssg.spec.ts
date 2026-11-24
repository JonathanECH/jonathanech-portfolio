import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const mainSource = readFileSync(fileURLToPath(new URL('./main.ts', import.meta.url)), 'utf8')
const appSource = readFileSync(fileURLToPath(new URL('./App.vue', import.meta.url)), 'utf8')
const indexSource = readFileSync(fileURLToPath(new URL('../index.html', import.meta.url)), 'utf8')
const detailViewSource = readFileSync(
  fileURLToPath(new URL('./views/ProjectDetailView.vue', import.meta.url)),
  'utf8',
)
const projectSources = {
  ProjectCard: readFileSync(
    fileURLToPath(new URL('./components/home/ProjectCard.vue', import.meta.url)),
    'utf8',
  ),
  ProjectQuickModal: readFileSync(
    fileURLToPath(new URL('./components/home/ProjectQuickModal.vue', import.meta.url)),
    'utf8',
  ),
  ChallengeAudit: readFileSync(
    fileURLToPath(new URL('./components/detail/ChallengeAudit.vue', import.meta.url)),
    'utf8',
  ),
  ProjectHeader: readFileSync(
    fileURLToPath(new URL('./components/detail/ProjectHeader.vue', import.meta.url)),
    'utf8',
  ),
}

describe('SSG locale hydration', () => {
  it('starts preferences after the first render', () => {
    expect(mainSource).not.toContain('initPreferences')
    expect(mainSource).toContain('inject({ mode:')
    expect(appSource).toMatch(/onMounted\(\(\) => \{\s*initPreferences\(\)\s*\}\)/)
  })

  it('keeps the pre-paint preference script', () => {
    expect(indexSource).toContain("localStorage.getItem('ech:preferences')")
    expect(indexSource).toContain('root.lang = locale')
  })
})

describe('project detail gallery locale', () => {
  it('remounts the gallery when the locale changes', () => {
    expect(detailViewSource).toContain('const { t, locale } = useI18n()')
    expect(detailViewSource).toContain(':key="`${project.slug}-${locale}`"')
  })
})

describe('prerendered project surfaces', () => {
  it('omits audit metric blocks from every rendered project surface', () => {
    for (const [name, source] of Object.entries(projectSources)) {
      expect(source, name).not.toMatch(/audit\.(?:metrics)|consistency(?:Note)/)
    }
  })

  it('keeps the hero metrics label for profile performance figures', () => {
    for (const locale of ['es', 'en']) {
      const messages = readFileSync(
        fileURLToPath(new URL(`./i18n/messages/${locale}.ts`, import.meta.url)),
        'utf8',
      )
      expect(messages, locale).toContain("'hero.metrics'")
    }
  })
})
