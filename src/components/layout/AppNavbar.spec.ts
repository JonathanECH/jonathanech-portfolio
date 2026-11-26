import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const navbarSource = readFileSync(new URL('./AppNavbar.vue', import.meta.url), 'utf8')

describe('mobile navigation', () => {
  it('closes the menu when the settings trigger is used', () => {
    expect(navbarSource).toContain('<div @pointerdown="closeMobileMenu()">')
    expect(navbarSource).toContain('<SettingsMenu />')
  })

  it('keeps the menu inside the viewport and scrolls it without moving the page', () => {
    expect(navbarSource).toContain('max-h-[calc(100dvh-5.5rem)]')
    expect(navbarSource).toContain('overflow-y-auto overscroll-contain')
    expect(navbarSource).toContain('@pointerdown.prevent="closeMobileMenu(true)"')
  })

  it('returns focus to the trigger after choosing a link', () => {
    expect(navbarSource).toContain('@click="closeMobileMenu(true)"')
    expect(navbarSource).toContain('menuButtonRef.value?.focus()')
  })
})
