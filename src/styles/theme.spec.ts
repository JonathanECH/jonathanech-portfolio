import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(fileURLToPath(new URL('./main.css', import.meta.url)), 'utf8')
const christmasBlock =
  css.match(/\[data-theme=['"]christmas['"]\]\s*\{([\s\S]*?)\}/)?.[1] ?? ''

function token(name: string): string {
  return christmasBlock.match(new RegExp(`--ech-${name}:\\s*([^;]+);`))?.[1]?.trim() ?? ''
}

function relativeLuminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/../g)!
    .map((value) => parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  )
  return (lighter + 0.05) / (darker + 0.05)
}

describe('christmas theme tokens', () => {
  it('replaces every semantic runtime token', () => {
    const names = [
      'background',
      'surface',
      'surface-card',
      'surface-card-hover',
      'border',
      'border-hover',
      'accent',
      'accent-contrast',
      'accent-glow',
      'muted',
      'foreground',
      'foreground-soft',
      'ink-rgb',
      'danger',
      'danger-soft',
      'warning',
      'warning-soft',
      'success',
      'grid-line',
      'grid-line-strong',
      'grid-blend',
      'particle-rgb',
      'selection-bg',
      'selection-color',
      'scrollbar-track',
      'scrollbar-thumb',
      'scrollbar-thumb-hover',
      'glass',
      'focus',
      'spotlight-core',
      'spotlight-mid',
      'razetti-accent',
    ]

    for (const name of names) {
      expect(token(name), name).not.toBe('')
    }
  })

  it('meets WCAG AA on backgrounds, surfaces, labels and the primary CTA', () => {
    const background = token('background')
    const surfaceCard = token('surface-card')

    for (const [foreground, backgroundToken] of [
      ['foreground', 'background'],
      ['foreground', 'surface-card'],
      ['muted', 'background'],
      ['muted', 'surface-card'],
      ['razetti-accent', 'surface-card'],
      ['warning', 'background'],
      ['danger-soft', 'background'],
      ['success', 'surface-card'],
    ]) {
      const backgroundValue = backgroundToken === 'background' ? background : surfaceCard
      expect(
        contrastRatio(token(foreground), backgroundValue),
        `${foreground} on ${backgroundToken}`,
      ).toBeGreaterThanOrEqual(4.5)
    }

    expect(contrastRatio(token('accent-contrast'), token('accent'))).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps theme motion inside no-preference and starts with no transition', () => {
    expect(christmasBlock).not.toMatch(/transition|animation/)

    const motionBlock =
      css.match(
        /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*\[data-theme=['"]christmas['"]\]\s+body\s*\{([\s\S]*?)\}\s*\}/,
      )?.[1] ?? ''

    expect(motionBlock).toMatch(/transition:\s*background-color/)
    expect(motionBlock).toMatch(/transition:[\s\S]*color/)
    expect(motionBlock).not.toMatch(/\ball\b|width|height|top|left/)
  })

  it('never exposes the global theme in the public settings or i18n', () => {
    const sources = {
      SettingsMenu: readFileSync(
        fileURLToPath(new URL('../components/layout/SettingsMenu.vue', import.meta.url)),
        'utf8',
      ),
      es: readFileSync(fileURLToPath(new URL('../i18n/messages/es.ts', import.meta.url)), 'utf8'),
      en: readFileSync(fileURLToPath(new URL('../i18n/messages/en.ts', import.meta.url)), 'utf8'),
    }

    for (const [name, source] of Object.entries(sources)) {
      expect(source.toLowerCase(), name).not.toContain('christmas')
    }
  })
})
