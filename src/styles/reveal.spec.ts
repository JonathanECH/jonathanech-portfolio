import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { useRevealTransition } from '@/composables/useRevealTransition'

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
    expect(css).toMatch(
      /\.reveal\s*\{\s*opacity: 1;\s*transform: none;\s*translate: none;\s*scale: none;\s*\}/,
    )
  })

  it('defines compositor-friendly keyframes only inside the support query', () => {
    const supports = block(css, supportsToken)
    const stack = block(supports, '@keyframes reveal-stack')
    const project = block(supports, '@keyframes reveal-project')

    for (const [name, keyframes] of [
      ['reveal-stack', stack],
      ['reveal-project', project],
    ] as const) {
      expect(keyframes, name).toContain('opacity: 0')
      expect(keyframes, name).toContain('opacity: 1')
      expect(keyframes, name).not.toMatch(
        /\b(?:top|right|bottom|left|width|height|margin|padding|filter)\s*:/,
      )
      expect(keyframes, name).not.toContain('transform:')
    }

    expect(stack).toContain('translate: 0 28px')
    expect(stack).toContain('scale: 0.97')
    expect(project).toContain('translate: var(--reveal-x) var(--reveal-y)')
    expect(project).toContain('scale: var(--reveal-scale)')
  })

  it('activates the animation only with support and no reduced-motion preference', () => {
    const supports = block(css, supportsToken)
    expect(supports).toContain('@media (prefers-reduced-motion: no-preference)')
  })

  it('uses a bounded view timeline declared after the animation shorthand', () => {
    const supports = block(css, supportsToken)
    const cases = [
      ['stack', block(supports, '.reveal--stack {'), 'reveal-stack', 'entry 0% entry 85%'],
      ['project', block(supports, '.reveal--project {'), 'reveal-project', 'entry 0% entry 100%'],
    ] as const

    for (const [name, rule, animationName, range] of cases) {
      const animation = rule.indexOf(`animation: ${animationName} 1ms linear both;`)
      expect(animation, name).toBeGreaterThanOrEqual(0)
      expect(rule.indexOf('animation-timeline: view(block);'), name).toBeGreaterThan(animation)
      expect(rule.indexOf(`animation-range: ${range};`), name).toBeGreaterThan(animation)
    }
  })

  it('differentiates project reveals by breakpoint and grid position', () => {
    const supports = block(css, supportsToken)
    const tabletToken = '@media (prefers-reduced-motion: no-preference) and (min-width: 768px)'
    const desktopToken = '@media (prefers-reduced-motion: no-preference) and (min-width: 1024px)'

    expect(supports).toContain(tabletToken)
    expect(supports).toContain(desktopToken)

    const tablet = block(supports, tabletToken)
    expect(tablet).toContain('--reveal-x: 18px')
    expect(tablet).toContain('--reveal-y: 14px')
    expect(tablet).toContain('--reveal-scale: 0.985')
    expect(tablet).toContain('.reveal--project:nth-child(even)')
    expect(tablet).toContain('--reveal-x: -18px')
    expect(tablet).toContain('animation-range: entry 6% entry 100%')
    expect(tablet).toContain('animation-range: entry 12% entry 100%')

    const desktop = block(supports, desktopToken)
    expect(desktop).toContain('--reveal-x: 24px')
    expect(desktop).toContain('--reveal-scale: 0.98')
  })

  it('restores the final visible state under reduced motion', () => {
    const reduced = block(css, '@media (prefers-reduced-motion: reduce)')
    const reveal = block(reduced, '.reveal {')

    expect(reveal).toContain('animation: none;')
    expect(reveal).toContain('opacity: 1;')
    expect(reveal).toContain('transform: none;')
    expect(reveal).toContain('translate: none;')
    expect(reveal).toContain('scale: none;')

    expect(reduced).toContain('.project-enter-active')
    expect(reduced).toContain('.project-leave-active')
    expect(reduced).toContain('.project-move')
    expect(reduced).toContain('.tech-enter-active')
    expect(reduced).toContain('.tech-leave-active')
    expect(reduced).toContain('.tech-enter-from')
    expect(reduced).toContain('.project-enter-from')
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

    const showcase = readFileSync(new URL('../components/home/ProjectsShowcase.vue', import.meta.url), 'utf8')
    expect(showcase).toContain(
      'class="mt-8 grid list-none grid-cols-1 gap-6 overflow-x-clip md:grid-cols-2 lg:grid-cols-3"',
    )
  })

  it('keeps animated wrappers separate from the interactive cards', () => {
    const tech = readFileSync(new URL('../components/home/TechCard.vue', import.meta.url), 'utf8')
    expect(tech).toContain('class="reveal reveal--stack h-full" role="listitem"')
    expect(tech).toContain("transform: 'translateY(-1px) scale(0.99)'")
    expect(tech).toContain('@pointerdown="triggerTapFeedback"')
    expect(tech).toContain('hover:-translate-y-1')

    const project = readFileSync(new URL('../components/home/ProjectCard.vue', import.meta.url), 'utf8')
    expect(project).toContain('<li class="reveal reveal--project">')
    expect(project).toContain('hover:-translate-y-1')
  })

  it('settles TransitionGroup cards so view() cannot hide them', () => {
    const { onBeforeEnter, onBeforeLeave } = useRevealTransition()
    const classes = new Set<string>()
    const el = { classList: { add: (name: string) => classes.add(name) } } as unknown as Element

    onBeforeEnter(el)
    expect(classes.has('reveal-settled')).toBe(true)

    classes.clear()
    onBeforeLeave(el)
    expect(classes.has('reveal-settled')).toBe(true)
  })

  it('uses stable keys and settle hooks in both filtered grids', () => {
    const stack = readFileSync(new URL('../components/home/TechEcosystem.vue', import.meta.url), 'utf8')
    expect(stack).toContain('<TransitionGroup')
    expect(stack).toContain('@before-enter="onBeforeEnter"')
    expect(stack).toContain('@before-leave="onBeforeLeave"')
    expect(stack).toContain(':key="technology.id"')
    expect(stack).not.toContain('activeCategory}-${technology.id')

    const projects = readFileSync(
      new URL('../components/home/ProjectsShowcase.vue', import.meta.url),
      'utf8',
    )
    expect(projects).toContain('<TransitionGroup')
    expect(projects).toContain('tag="ul"')
    expect(projects).toContain('name="project"')
    expect(projects).toContain(':key="project.slug"')
    expect(projects).toContain('@before-enter="onBeforeEnter"')
    expect(projects).toContain('@before-leave="onBeforeLeave"')
    expect(projects).toContain('overflow-x-clip')
  })

  it('defines clean enter, leave and move transitions for both grids', () => {
    const stack = readFileSync(new URL('../components/home/TechEcosystem.vue', import.meta.url), 'utf8')
    expect(stack).toContain('.tech-enter-active')
    expect(stack).toContain('.tech-enter-from')
    expect(stack).toContain('.tech-move')
    expect(stack).toContain('transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1)')

    expect(css).toContain('.reveal.reveal-settled')
    expect(css).toContain('.project-enter-active')
    expect(css).toContain('.project-enter-from')
    expect(css).toContain('.project-leave-active')
    expect(css).toContain('.project-leave-to')
    expect(css).toContain('.project-move')

    const settled = block(css, '.reveal.reveal-settled')
    expect(settled).toContain('animation: none;')
    expect(settled).toContain('opacity: 1;')
    expect(settled).toContain('translate: none;')
    expect(settled).toContain('scale: none;')
  })
})
