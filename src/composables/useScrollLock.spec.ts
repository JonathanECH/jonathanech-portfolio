import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { lockPageScroll, unlockPageScroll } from '@/composables/useScrollLock'

const bodyStyle = { overflow: '', paddingRight: '' }

beforeEach(() => {
  bodyStyle.overflow = ''
  bodyStyle.paddingRight = ''

  vi.stubGlobal('document', {
    documentElement: { clientWidth: 980 },
    body: { style: bodyStyle },
  })
  vi.stubGlobal('window', { innerWidth: 1000 })
})

afterEach(() => {
  unlockPageScroll()
  vi.unstubAllGlobals()
})

describe('page scroll lock', () => {
  it('hides the scrollbar and compensates its width', () => {
    lockPageScroll()

    expect(bodyStyle.overflow).toBe('hidden')
    expect(bodyStyle.paddingRight).toBe('calc(0px + 20px)')
  })

  it('keeps the page locked until the last overlay unlocks', () => {
    lockPageScroll()
    lockPageScroll()

    unlockPageScroll()
    expect(bodyStyle.overflow).toBe('hidden')

    unlockPageScroll()
    expect(bodyStyle.overflow).toBe('')
    expect(bodyStyle.paddingRight).toBe('')
  })

  it('preserves and restores pre-existing inline styles', () => {
    bodyStyle.overflow = 'auto'
    bodyStyle.paddingRight = '8px'

    lockPageScroll()
    expect(bodyStyle.paddingRight).toBe('calc(8px + 20px)')

    unlockPageScroll()

    expect(bodyStyle.overflow).toBe('auto')
    expect(bodyStyle.paddingRight).toBe('8px')
  })

  it('does not touch styles when nothing is locked', () => {
    unlockPageScroll()

    expect(bodyStyle.overflow).toBe('')
    expect(bodyStyle.paddingRight).toBe('')
  })
})
