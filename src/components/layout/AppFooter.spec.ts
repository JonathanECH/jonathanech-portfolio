import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const footerSource = readFileSync(fileURLToPath(new URL('./AppFooter.vue', import.meta.url)), 'utf8')
const contactSource = readFileSync(
  fileURLToPath(new URL('../home/ContactSection.vue', import.meta.url)),
  'utf8',
)

describe('app footer', () => {
  it('renders the localized copyright instead of hardcoded text', () => {
    expect(footerSource).toContain("t('footer.copyright')")
    expect(footerSource).not.toContain('© 2026 Jonathan Campos //')
    expect(footerSource).not.toMatch(/derechos reservados|rights reserved/i)
  })

  it('exposes the machine-readable summary from the footer', () => {
    expect(footerSource).toContain('href="/llms.txt"')
    expect(footerSource).toContain("t('footer.llms')")
  })

  it('binds contact link rel attributes from the centralized channel data', () => {
    expect(footerSource).toContain(':rel="link.rel"')
    expect(footerSource).not.toContain('me noopener noreferrer')
    expect(contactSource).toContain(':rel="channel.rel"')
    expect(contactSource).not.toContain('me noopener noreferrer')
  })
})
