import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { activeSectionFromBounds } from '@/composables/useActiveSection'

const source = readFileSync(fileURLToPath(new URL('./useActiveSection.ts', import.meta.url)), 'utf8')

const TOP_OFFSET = 120
const VIEWPORT_HEIGHT = 844

describe('active section geometry', () => {
  it('observes sections on both localized home routes', () => {
    expect(source).toContain("route.name !== 'home' && route.name !== 'home-en'")
  })

  it('highlights the newest section when two sections cross the band', () => {
    const active = activeSectionFromBounds(
      [
        { id: 'stack', top: -900, bottom: 180 },
        { id: 'proyectos', top: 60, bottom: 1200 },
      ],
      TOP_OFFSET,
      VIEWPORT_HEIGHT,
    )

    expect(active).toBe('proyectos')
  })

  it('keeps the previous highlight when no section is inside the band', () => {
    const active = activeSectionFromBounds(
      [{ id: 'sobre-mi', top: 500, bottom: 1400 }],
      TOP_OFFSET,
      VIEWPORT_HEIGHT,
    )

    expect(active).toBeNull()
  })
})
