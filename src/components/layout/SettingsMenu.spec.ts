import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const settingsMenuSource = readFileSync(
  fileURLToPath(new URL('./SettingsMenu.vue', import.meta.url)),
  'utf8',
)
const navbarSource = readFileSync(
  fileURLToPath(new URL('./AppNavbar.vue', import.meta.url)),
  'utf8',
)

describe('settings menu trigger', () => {
  it('is always rendered in the navbar', () => {
    expect(navbarSource).toContain('<SettingsMenu />')
    expect(settingsMenuSource).not.toMatch(/<button[^>]*\bv-(?:if|show)\b/)
    expect(settingsMenuSource).not.toMatch(/<div\s+ref="rootRef"[^>]*\bhidden\b/)
  })

  it('keeps an accessible, visible icon button', () => {
    const trigger = settingsMenuSource.match(/<button[\s\S]*?<\/button>/)?.[0]

    const openingTag = trigger?.match(/<button[\s\S]*?>/)?.[0]

    expect(trigger).toBeDefined()
    expect(openingTag).toContain('type="button"')
    expect(openingTag).toContain(':aria-label="t(\'settings.ariaLabel\')"')
    expect(openingTag).toContain('h-10 w-10')
    expect(openingTag).not.toMatch(/\bhidden\b/)
    expect(trigger).toContain('<Settings')
  })

  it('positions the panel under the navbar button like before', () => {
    expect(settingsMenuSource).not.toContain('popover=')
    expect(settingsMenuSource).toContain('class="absolute right-0 top-[calc(100%+0.6rem)]')
    expect(settingsMenuSource).toContain('await nextTick()')
    expect(settingsMenuSource).toContain('panelRef.value?.focus()')
  })

  it('restores focus to the mobile menu button when the mobile menu is dismissed', () => {
    expect(navbarSource).toContain('ref="menuButtonRef"')
    expect(navbarSource).toContain('menuButtonRef.value?.focus()')
  })
})
