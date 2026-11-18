import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const footerSource = readFileSync(fileURLToPath(new URL('./AppFooter.vue', import.meta.url)), 'utf8')

describe('app footer', () => {
  it('renders the localized copyright instead of hardcoded text', () => {
    expect(footerSource).toContain("t('footer.copyright')")
    expect(footerSource).not.toContain('© 2026 Jonathan Campos //')
    expect(footerSource).not.toMatch(/derechos reservados|rights reserved/i)
  })
})
