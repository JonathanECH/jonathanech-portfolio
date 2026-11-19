import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./main.css', import.meta.url), 'utf8')
const supportsToken = '@supports ((animation-timeline: view()) and (animation-range: entry))'

function block(source: string, token: string): string {
  const start = source.indexOf(token)
  expect(start, token).toBeGreaterThanOrEqual(0)

  const open = source.indexOf('{', start)
  expect(open, token).toBeGreaterThan(start)

  let depth = 0
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') {
      depth += 1
    } else if (source[index] === '}') {
      depth -= 1
      if (depth === 0) {
        return source.slice(open + 1, index)
      }
    }
  }

  throw new Error(`Unclosed CSS block: ${token}`)
}

describe('scroll-driven reveal contract', () => {
  it('keeps cards fully visible when view timelines are unsupported', () => {
    expect(css).toMatch(/\.reveal\s*\{\s*opacity: 1;\s*transform: none;\s*translate: none;\s*\}/)
  })

  it('defines compositor-friendly keyframes only inside the support query', () => {
    const supports = block(css, supportsToken)
    const keyframes = block(supports, '@keyframes reveal-on-scroll')

    expect(keyframes).toContain('opacity: 0')
    expect(keyframes).toContain('translate: 0 18px')
    expect(keyframes).toContain('opacity: 1')
    expect(keyframes).toContain('translate: 0 0')
    expect(keyframes).not.toMatch(/\b(?:top|right|bottom|left|width|height|margin|padding|filter)\s*:/)
    expect(keyframes).not.toContain('transform:')
  })

  it('activates the animation only with support and no reduced-motion preference', () => {
    const supports = block(css, supportsToken)
    expect(supports).toContain('@media (prefers-reduced-motion: no-preference)')
  })

  it('uses a bounded view timeline declared after the animation shorthand', () => {
    const supports = block(css, supportsToken)
    const animation = supports.indexOf('animation: reveal-on-scroll 1ms linear both;')
    const timeline = supports.indexOf('animation-timeline: view(block);')
    const range = supports.indexOf('animation-range: entry 0% entry 100%;')

    expect(animation).toBeGreaterThanOrEqual(0)
    expect(timeline).toBeGreaterThan(animation)
    expect(range).toBeGreaterThan(animation)
  })

  it('restores the final visible state under reduced motion', () => {
    const reduced = block(css, '@media (prefers-reduced-motion: reduce)')
    const reveal = block(reduced, '.reveal {')

    expect(reveal).toContain('animation: none;')
    expect(reveal).toContain('opacity: 1;')
    expect(reveal).toContain('transform: none;')
    expect(reveal).toContain('translate: none;')
  })

  it('removes the JavaScript-only reveal hooks', () => {
    expect(css).not.toMatch(/html\.js|\.is-visible|--reveal-delay/)

    const sources = [
      ['main.ts', '../main.ts'],
      ['index.html', '../../index.html'],
      ['ProjectCard.vue', '../components/home/ProjectCard.vue'],
      ['TechCard.vue', '../components/home/TechCard.vue'],
      ['ProjectsShowcase.vue', '../components/home/ProjectsShowcase.vue'],
    ] as const

    for (const [name, path] of sources) {
      const source = readFileSync(new URL(path, import.meta.url), 'utf8')
      expect(source, name).not.toMatch(
        /v-reveal|app\.directive\(\s*['"]reveal['"]|classList\.add\(\s*['"]js['"]|--reveal-delay|is-visible/,
      )
    }

    expect(existsSync(new URL('../directives/reveal.ts', import.meta.url))).toBe(false)
    expect(existsSync(new URL('../directives/reveal.spec.ts', import.meta.url))).toBe(false)
  })

  it('keeps reveal sections laid out for view timeline geometry', () => {
    expect(css).toContain('.deferred-section:not(:has(.reveal))')
    expect(css).toContain('content-visibility: auto;')
  })

  it('does not create nested scrollports around revealed cards', () => {
    const sections = [
      ['TechEcosystem.vue', '../components/home/TechEcosystem.vue', 'overflow-clip'],
      ['ProjectsShowcase.vue', '../components/home/ProjectsShowcase.vue', undefined],
    ] as const

    for (const [name, path, clipUtility] of sections) {
      const source = readFileSync(new URL(path, import.meta.url), 'utf8')
      const start = source.indexOf('<section')
      expect(start, name).toBeGreaterThanOrEqual(0)
      const openingTag = source.slice(start, source.indexOf('>', start))

      expect(openingTag, name).not.toContain('overflow-hidden')
      if (clipUtility) {
        expect(openingTag, name).toContain(clipUtility)
      }
    }
  })
})
