import type { Directive } from 'vue'

const observers = new WeakMap<HTMLElement, IntersectionObserver>()

/**
 * Reveals an element the first time it enters the viewport. Works on touch
 * devices where `:hover` never fires, and falls back to an immediate reveal
 * when the browser lacks IntersectionObserver or reduced motion is requested.
 */
export const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    el.style.setProperty('--reveal-delay', `${binding.value ?? 0}ms`)

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -48px 0px' },
    )

    observer.observe(el)
    observers.set(el, observer)
  },
  unmounted(el) {
    observers.get(el)?.disconnect()
    observers.delete(el)
  },
}
