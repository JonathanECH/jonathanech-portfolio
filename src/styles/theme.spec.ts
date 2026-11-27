import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(fileURLToPath(new URL('./main.css', import.meta.url)), 'utf8')
const christmasBlock =
  css.match(/\[data-theme=['"]christmas['"]\]\s*\{([\s\S]*?)\}/)?.[1] ?? ''
const appSource = readFileSync(fileURLToPath(new URL('../App.vue', import.meta.url)), 'utf8')
const navbarSource = readFileSync(
  fileURLToPath(new URL('../components/layout/AppNavbar.vue', import.meta.url)),
  'utf8',
)
const heroSource = readFileSync(
  fileURLToPath(new URL('../components/home/HeroSection.vue', import.meta.url)),
  'utf8',
)
const snowfallSource = readFileSync(
  fileURLToPath(new URL('../components/ui/ChristmasSnowfall.vue', import.meta.url)),
  'utf8',
)

function token(name: string): string {
  return christmasBlock.match(new RegExp(`--ech-${name}:\\s*([^;]+);`))?.[1]?.trim() ?? ''
}

function keyframes(name: string): string {
  return css.match(new RegExp(`@keyframes ${name}\\s*\\{([\\s\\S]*?)\\n  \\}`))?.[1] ?? ''
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
  it('replaces every semantic runtime token with the pine and gold palette', () => {
    const names = [
      'background',
      'surface',
      'surface-card',
      'surface-card-hover',
      'border',
      'border-hover',
      'accent',
      'accent-hover',
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
      'festive-accent',
      'festive-red',
      'xmas-cable',
      'hero-halo',
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

    expect(token('background')).toBe('#071410')
    expect(token('surface-card')).toBe('#0d2019')
    expect(token('surface-card-hover')).toBe('#122a21')
    expect(token('foreground')).toBe('#f8f5ee')
    expect(token('foreground-soft')).toBe('#c4d1cb')
    expect(token('muted')).toBe('#8fa69c')
    expect(token('accent')).toBe('#f5c96b')
    expect(token('accent-hover')).toBe('#fbd98a')
    expect(token('accent-contrast')).toBe('#071410')
    expect(token('festive-accent')).toBe('#f25c6e')
    expect(token('festive-red')).toBe('#d93848')
    expect(token('border')).toBe('rgba(245, 201, 107, 0.22)')
    expect(token('border-hover')).toBe('rgba(245, 201, 107, 0.55)')
    expect(css).toContain(
      'radial-gradient(ellipse 60% 45% at 50% 28%, rgba(245, 201, 107, 0.11), rgba(217, 56, 72, 0.04) 55%, transparent 75%)',
    )
  })

  it('meets WCAG AA for text, secondary text, labels, accent and festive badge', () => {
    const backgrounds = [token('background'), token('surface-card')]

    for (const background of backgrounds) {
      for (const foreground of [
        'foreground',
        'foreground-soft',
        'muted',
        'accent',
        'festive-accent',
      ]) {
        expect(
          contrastRatio(token(foreground), background),
          `${foreground} on ${background}`,
        ).toBeGreaterThanOrEqual(4.5)
      }
    }

    expect(contrastRatio(token('accent-contrast'), token('accent'))).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps every christmas animation inside no-preference and starts with no transition', () => {
    expect(christmasBlock).not.toMatch(/transition|animation/)
    expect(css).toMatch(/\.christmas-decor \{\s*display: none;\s*\}/)
    expect(css).toMatch(
      /html\[data-theme='christmas'\] \.christmas-decor \{\s*display: block;\s*\}/,
    )

    const motionStart = css.indexOf("[data-theme='christmas'] body")
    const motionEnd = css.indexOf('@keyframes fade-up')
    const xmasMotion = css.slice(motionStart, motionEnd)

    expect(motionStart).toBeGreaterThan(-1)
    expect(motionEnd).toBeGreaterThan(motionStart)
    expect(xmasMotion).toContain('@keyframes xmas-twinkle')
    expect(xmasMotion).toContain('@keyframes xmas-sway')
    expect(xmasMotion).toContain('@keyframes xmas-fall')
    expect(xmasMotion).not.toMatch(/transition:[^;]*(all|width|height|top|left)/)
    expect(css.match(/@media \(prefers-reduced-motion: no-preference\)/g)?.length).toBeGreaterThan(1)
  })

  it('uses only compositor-friendly properties for the seasonal keyframes', () => {
    const twinkle = keyframes('xmas-twinkle')
    const sway = keyframes('xmas-sway')
    const fall = keyframes('xmas-fall')

    expect(twinkle).toMatch(/opacity:/)
    expect(twinkle).not.toMatch(/transform|width|height|top|left/)

    expect(sway).toMatch(/transform:\s*rotate/)
    expect(sway).not.toMatch(/opacity|translate/)

    expect(fall).toMatch(/transform:\s*translateY/)
    expect(fall).toMatch(/rotate/)
    expect(fall).toMatch(/opacity:/)
  })

  it('renders decorations from deterministic, hidden markup', () => {
    expect(appSource).toContain('xmas-bulb xmas-bulb-a')
    expect(appSource).toContain('xmas-bulb xmas-bulb-b')
    expect(navbarSource).not.toContain('xmas-bulb')
    expect(heroSource).toContain('christmas-decor--desktop')
    expect(heroSource).toContain('xmas-badge')
    expect(appSource).toContain('<ChristmasSnowfall />')
    expect(snowfallSource).toContain('aria-hidden="true"')
    expect(snowfallSource).not.toContain('Math.random')
    expect(snowfallSource.match(/duration: '/g)).toHaveLength(16)
  })

  it('scrolls the garland with the document without distorting the bulbs', () => {
    expect(appSource).toContain('absolute inset-x-0 top-18 z-0 h-7 overflow-hidden')
    expect(appSource).toContain('preserveAspectRatio="xMidYMin slice"')
    expect(appSource).not.toContain('preserveAspectRatio="none"')
    expect(appSource).toContain('aria-hidden="true"')
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
