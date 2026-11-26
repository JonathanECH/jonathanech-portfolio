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
    const about = block(supports, '@keyframes reveal-about')
    const contact = block(supports, '@keyframes reveal-contact')
    const metric = block(supports, '@keyframes about-metric-fill')

    for (const [name, keyframes] of [
      ['reveal-stack', stack],
      ['reveal-project', project],
      ['reveal-about', about],
      ['reveal-contact', contact],
    ] as const) {
      expect(keyframes, name).toContain('opacity: 0')
      expect(keyframes, name).toContain('opacity: 1')
      expect(keyframes, name).not.toMatch(
        /\b(?:top|right|bottom|left|width|height|margin|padding|filter)\s*:/,
      )
      expect(keyframes, name).not.toContain('transform:')
    }

    expect(stack).toContain('translate: 0 60px')
    expect(stack).toContain('scale: 0.86')
    expect(project).toContain('translate: var(--reveal-x) var(--reveal-y)')
    expect(project).toContain('scale: var(--reveal-scale)')
    expect(about).toContain('translate: 0 18px')
    expect(contact).toContain('translate: var(--contact-x) var(--contact-y)')
    expect(contact).toContain('scale: var(--contact-scale)')

    expect(metric).toContain('transform: scaleX(0)')
    expect(metric).toContain('transform: scaleX(1)')
    expect(metric).not.toMatch(
      /\b(?:top|right|bottom|left|width|height|margin|padding|filter)\s*:/,
    )
  })

  it('activates the animation only with support and no reduced-motion preference', () => {
    const supports = block(css, supportsToken)
    expect(supports).toContain('@media (prefers-reduced-motion: no-preference)')
  })

  it('uses a bounded view timeline declared after the animation shorthand', () => {
    const supports = block(css, supportsToken)
    const cases = [
      ['stack', block(supports, '.reveal--stack {'), 'reveal-stack', 'entry 0% entry 85%'],
      ['project', block(supports, '.reveal--project {'), 'reveal-project', 'entry 0% entry 70%'],
      ['about', block(supports, '.reveal--about {'), 'reveal-about', 'entry 0% entry 90%'],
      [
        'contact',
        block(supports, '.reveal--contact {'),
        'reveal-contact',
        'var(--contact-entry) entry 100%',
      ],
      [
        'metric fill',
        block(supports, '.about-metric-fill {'),
        'about-metric-fill',
        'var(--metric-entry) cover 50%',
      ],
    ] as const

    for (const [name, rule, animationName, range] of cases) {
      const animation = rule.indexOf(`animation: ${animationName} 1ms linear both;`)
      expect(animation, name).toBeGreaterThanOrEqual(0)
      expect(rule.indexOf('animation-timeline: view(block);'), name).toBeGreaterThan(animation)
      expect(rule.indexOf(`animation-range: ${range};`), name).toBeGreaterThan(animation)
    }
  })

  it('staggers contact cards and all four metric bars without orphan timeline rules', () => {
    const supports = block(css, supportsToken)

    const contactRanges = [
      'entry 0%',
      'entry 4%',
      'entry 8%',
      'entry 12%',
    ] as const
    for (const [index, value] of contactRanges.entries()) {
      const selector = index === 0 ? '.reveal--contact {' : `.reveal--contact:nth-child(${index + 1}) {`
      expect(block(supports, selector), selector).toContain(`--contact-entry: ${value};`)
    }

    const metricRanges = [
      'cover 10%',
      'cover 14%',
      'cover 18%',
      'cover 22%',
    ] as const
    for (const [index, value] of metricRanges.entries()) {
      const selector = index === 0 ? '.about-metric {' : `.about-metric:nth-child(${index + 1}) {`
      expect(block(supports, selector), selector).toContain(`--metric-entry: ${value};`)
    }

    expect(block(supports, '.about-metric-fill {')).toContain('transform-origin: left;')

    for (const selector of [
      '.reveal--contact:nth-child(2) {',
      '.reveal--contact:nth-child(3) {',
      '.reveal--contact:nth-child(4) {',
      '.about-metric:nth-child(2) {',
      '.about-metric:nth-child(3) {',
      '.about-metric:nth-child(4) {',
    ]) {
      const rule = block(supports, selector)
      expect(rule, selector).not.toContain('animation:')
      expect(rule, selector).not.toContain('animation-timeline:')
      expect(rule, selector).not.toContain('animation-range:')
    }
  })

  it('differentiates project reveals by breakpoint and grid position', () => {
    const supports = block(css, supportsToken)
    const mobileToken = '@media (prefers-reduced-motion: no-preference) and (max-width: 767px)'
    const tabletToken = '@media (prefers-reduced-motion: no-preference) and (min-width: 768px)'
    const desktopToken = '@media (prefers-reduced-motion: no-preference) and (min-width: 1024px)'

    expect(supports).toContain(mobileToken)
    expect(supports).toContain(tabletToken)
    expect(supports).toContain(desktopToken)

    const mobileProject = block(block(supports, mobileToken), '.reveal--project {')
    expect(mobileProject).toContain('--reveal-y: 12px;')
    expect(mobileProject).not.toContain('animation-range:')

    const tablet = block(supports, tabletToken)
    expect(tablet).toContain('--reveal-x: 18px')
    expect(tablet).toContain('--reveal-y: 14px')
    expect(tablet).toContain('--reveal-scale: 0.985')
    expect(tablet).toContain('.reveal--project:nth-child(even)')
    expect(tablet).toContain('--reveal-x: -18px')
    expect(tablet).toContain('animation-range: entry 6% entry 70%')
    expect(tablet).toContain('animation-range: entry 12% entry 70%')

    const desktop = block(supports, desktopToken)
    expect(desktop).toContain('--reveal-x: 24px')
    expect(desktop).toContain('--reveal-scale: 0.98')
    expect(desktop).toContain('--contact-x: -44px')
    expect(desktop).toContain('--contact-x: -18px')
    expect(desktop).toContain('--contact-x: 18px')
    expect(desktop).toContain('--contact-x: 44px')
    expect(desktop).toContain('animation-range: var(--contact-entry) entry 85%')
  })

  it('restores the final visible state under reduced motion', () => {
    const reduced = block(css, '@media (prefers-reduced-motion: reduce)')
    const reveal = block(reduced, '.reveal {')

    expect(reveal).toContain('animation: none;')
    expect(reveal).toContain('opacity: 1;')
    expect(reveal).toContain('transform: none;')
    expect(reveal).toContain('translate: none;')
    expect(reveal).toContain('scale: none;')

    const metricFill = block(reduced, '.about-metric-fill {')
    expect(metricFill).toContain('animation: none;')
    expect(metricFill).toContain('transform: none;')

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

  it('settles TransitionGroup cards only during enter/leave and always restores view() reveal afterwards', () => {
    const { onBeforeEnter, onAfterEnter, onEnterCancelled, onBeforeLeave } = useRevealTransition()
    const classes = new Set<string>()
    const el = {
      classList: {
        add: (name: string) => classes.add(name),
        remove: (name: string) => classes.delete(name),
      },
    } as unknown as Element

    onBeforeEnter(el)
    expect(classes.has('reveal-settled')).toBe(true)

    onAfterEnter(el)
    expect(classes.has('reveal-settled')).toBe(false)

    onBeforeEnter(el)
    expect(classes.has('reveal-settled')).toBe(true)

    onEnterCancelled(el)
    expect(classes.has('reveal-settled')).toBe(false)

    onBeforeLeave(el)
    expect(classes.has('reveal-settled')).toBe(true)
  })

  it('uses stable keys and settle hooks in both filtered grids', () => {
    const stack = readFileSync(new URL('../components/home/TechEcosystem.vue', import.meta.url), 'utf8')
    expect(stack).toContain('<TransitionGroup')
    expect(stack).toContain('@before-enter="onBeforeEnter"')
    expect(stack).toContain('@after-enter="onAfterEnter"')
    expect(stack).toContain('@enter-cancelled="onEnterCancelled"')
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
    expect(projects).toContain('@after-enter="onAfterEnter"')
    expect(projects).toContain('@enter-cancelled="onEnterCancelled"')
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

  it('reveals the about blocks and fills metrics without layout animation', () => {
    const about = readFileSync(new URL('../components/home/AboutSection.vue', import.meta.url), 'utf8')

    expect(about).toContain('class="reveal reveal--about h-full lg:col-span-7"')
    expect(about).toContain('class="reveal reveal--about rounded-2xl')
    expect(about).toContain('class="reveal reveal--about flex flex-1 flex-col')
    expect(about).toContain('class="about-metric"')
    expect(about).toContain('class="mt-1.5 h-1.5 overflow-clip rounded-full bg-foreground/10"')
    expect(about).toContain('class="about-metric-fill h-full rounded-full')
    expect(about).toContain(':style="{ width: `${metric.value}%` }"')
    expect(about).toContain('role="progressbar"')
    expect(about).toContain(':aria-valuenow="metric.value"')
  })

  it('reveals contact channels and keeps copy feedback accessible', () => {
    const contact = readFileSync(
      new URL('../components/home/ContactSection.vue', import.meta.url),
      'utf8',
    )

    expect(contact).toContain('class="relative overflow-clip rounded-2xl')
    expect(contact).toContain('class="reveal reveal--contact h-full"')
    expect(contact).toContain('class="contact-card group relative flex h-full flex-col')
    expect(contact).toContain('motion-safe:hover:-translate-y-1')
    expect(contact).toContain('motion-safe:group-focus-within:-translate-y-1')
    expect(contact).toContain('group-focus-within:border-border-hover')
    expect(contact).toContain('class="contact-copy-button relative z-10')
    expect(contact).toContain('@click.stop="copyEmail(channel.copyValue ?? channel.value)"')
    expect(contact).toContain('aria-live="polite"')
    expect(contact).toContain(
      "isCopied('email') ? 'border-cyan-accent/60 bg-cyan-accent/10 text-cyan-accent' : ''",
    )
    expect(contact).toContain('motion-safe:active:scale-[0.98]')
    expect(contact).toContain(':key="channel.id"')
  })

  it('uses shared motion tokens and explicit interactive transition properties', () => {
    expect(css).toContain('--ease-out: cubic-bezier(0.23, 1, 0.32, 1);')
    expect(css).toContain('--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);')

    const interactive = block(css, '.interactive-transition')
    expect(interactive).toContain('border-color 160ms var(--ease-out)')
    expect(interactive).toContain('transform 160ms var(--ease-out)')
    expect(interactive).not.toContain('all')
  })
})

describe('home viewport sizing contract', () => {
  const sections = [
    ['TechEcosystem.vue', '../components/home/TechEcosystem.vue'],
    ['ProjectsShowcase.vue', '../components/home/ProjectsShowcase.vue'],
    ['AboutSection.vue', '../components/home/AboutSection.vue'],
    ['ContactSection.vue', '../components/home/ContactSection.vue'],
  ] as const

  it('keeps the hero at one viewport minimum on desktop with a fluid vertical rhythm', () => {
    const hero = readFileSync(new URL('../components/home/HeroSection.vue', import.meta.url), 'utf8')
    const openingTag = hero.match(/<section\s[^>]*>/)?.[0] ?? ''

    expect(openingTag).toContain('min-h-screen')
    expect(openingTag).toContain('lg:min-h-svh')
    expect(hero).toContain('class="hero-content')
    for (const token of ['lg:pt-[clamp(', 'lg:pb-[clamp(', 'lg:mt-[clamp(']) {
      expect(hero, token).toContain(token)
    }
  })

  it('centers every remaining home section within one desktop viewport without fixing its height', () => {
    for (const [name, path] of sections) {
      const source = readFileSync(new URL(path, import.meta.url), 'utf8')
      const openingTag = source.match(/<section\s[^>]*>/)?.[0] ?? ''

      for (const token of ['lg:min-h-svh', 'flex', 'flex-col', 'justify-center', 'lg:py-28']) {
        expect(openingTag, `${name}: ${token}`).toContain(token)
      }
      expect(openingTag, name).not.toMatch(/(?:^|\s)h-(?:screen|\[)/)
    }
  })

  it('keeps the short-desktop hero adjustment desktop-only and static', () => {
    expect(css).toContain('@media (min-width: 1024px) and (max-height: 760px)')
    expect(css).toContain('.hero-content')
    expect(css).toContain('padding-block-start: clamp(')
    expect(css).toContain('padding-block-end: clamp(')
  })
})
