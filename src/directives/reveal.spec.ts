import { readFileSync } from 'node:fs'
import type { ObjectDirective } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reveal } from '@/directives/reveal'

const directive = reveal as ObjectDirective<HTMLElement, number | undefined>
type MountedHook = NonNullable<typeof directive.mounted>
type UnmountedHook = NonNullable<typeof directive.unmounted>

const observers: FakeObserver[] = []

class FakeObserver {
  readonly targets: Element[] = []
  readonly unobserved: Element[] = []
  disconnected = false

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    observers.push(this)
  }

  observe(target: Element): void {
    this.targets.push(target)
  }

  unobserve(target: Element): void {
    this.unobserved.push(target)
  }

  disconnect(): void {
    this.disconnected = true
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  emit(entry: Partial<IntersectionObserverEntry>): void {
    this.callback(
      [{ isIntersecting: true, target: this.targets[0]!, ...entry } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
}

function createElement() {
  const classes = new Set<string>()
  const styles = new Map<string, string>()
  const element = {
    style: {
      setProperty: (name: string, value: string): void => {
        styles.set(name, value)
      },
    },
    classList: {
      add: (name: string): void => {
        classes.add(name)
      },
      contains: (name: string): boolean => classes.has(name),
    },
  } as unknown as HTMLElement

  return { element, classes, styles }
}

function mount(element: HTMLElement, value?: number): void {
  const mounted = directive.mounted as MountedHook
  mounted(
    element,
    { value } as Parameters<MountedHook>[1],
    {} as Parameters<MountedHook>[2],
    null as Parameters<MountedHook>[3],
  )
}

function unmount(element: HTMLElement): void {
  const unmounted = directive.unmounted as UnmountedHook
  unmounted(
    element,
    {} as Parameters<UnmountedHook>[1],
    {} as Parameters<UnmountedHook>[2],
    null as Parameters<UnmountedHook>[3],
  )
}

beforeEach(() => {
  observers.length = 0
  vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) })
  vi.stubGlobal('IntersectionObserver', FakeObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('reveal directive', () => {
  it('writes the stagger delay as a CSS custom property', () => {
    const { element, styles } = createElement()
    mount(element, 240)

    expect(styles.get('--reveal-delay')).toBe('240ms')
  })

  it('reveals immediately when the user prefers reduced motion', () => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) })
    const { element, classes } = createElement()
    mount(element)

    expect(classes.has('is-visible')).toBe(true)
    expect(observers).toHaveLength(0)
  })

  it('reveals immediately when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const { element, classes } = createElement()
    mount(element)

    expect(classes.has('is-visible')).toBe(true)
  })

  it('only reveals after the element intersects and then stops observing', () => {
    const { element, classes } = createElement()
    mount(element)

    expect(observers).toHaveLength(1)
    expect(observers[0]!.targets).toEqual([element])
    expect(observers[0]!.options).toEqual({
      threshold: 0.15,
      rootMargin: '0px 0px -48px 0px',
    })

    observers[0]!.emit({ isIntersecting: false })
    expect(classes.has('is-visible')).toBe(false)

    observers[0]!.emit({ isIntersecting: true })
    expect(classes.has('is-visible')).toBe(true)
    expect(observers[0]!.unobserved).toEqual([element])
  })

  it('disconnects its observer on unmount', () => {
    const { element } = createElement()
    mount(element)
    unmount(element)

    expect(observers[0]!.disconnected).toBe(true)
  })
})

describe('reveal stylesheet', () => {
  const css = readFileSync(new URL('../styles/main.css', import.meta.url), 'utf8')

  function rule(selector: string): string {
    const start = css.indexOf(`${selector} {`)
    expect(start, selector).toBeGreaterThanOrEqual(0)
    return css.slice(start, css.indexOf('}', start))
  }

  it('declares the transition on the base rule so the visible state animates', () => {
    const base = rule('html.js .reveal')
    expect(base).toContain('transition:')
    expect(base).toContain('transition-delay:')
  })

  it('keeps only the hidden state properties in the not-visible rule', () => {
    const hidden = rule('html.js .reveal:not(.is-visible)')
    expect(hidden).toContain('opacity: 0')
    expect(hidden).toContain('transform: translateY(18px)')
    expect(hidden).not.toContain('transition')
    expect(hidden).not.toContain('will-change')
  })

  it('keeps reveal sections laid out for IntersectionObserver', () => {
    expect(css).toContain('.deferred-section:not(:has(.reveal))')
  })
})
