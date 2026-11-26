import { describe, expect, it } from 'vitest'
import { activeSectionFromBounds } from '@/composables/useActiveSection'

const TOP_OFFSET = 120
const VIEWPORT_HEIGHT = 844

describe('active section geometry', () => {
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
