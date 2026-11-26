import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const MAX_OBSERVE_ATTEMPTS = 120

interface SectionBounds {
  readonly id: string
  readonly top: number
  readonly bottom: number
}

export function activeSectionFromBounds(
  sections: readonly SectionBounds[],
  topOffset: number,
  viewportHeight: number,
): string | null {
  const bandTop = topOffset
  const bandBottom = viewportHeight * 0.45

  return (
    sections
      .filter((section) => section.bottom > bandTop && section.top < bandBottom)
      .sort((a, b) => b.top - a.top)[0]?.id ?? null
  )
}

export function useActiveSection(sectionIds: readonly string[], topOffset = 120) {
  const route = useRoute()
  const activeSection = ref(sectionIds[0] ?? '')
  let observer: IntersectionObserver | null = null
  let observedElements: HTMLElement[] = []
  let frame = 0
  let attempts = 0

  function updateActiveFromGeometry(): void {
    const bounds = observedElements.map((element) => {
      const { top, bottom } = element.getBoundingClientRect()
      return { id: element.id, top, bottom }
    })
    const current = activeSectionFromBounds(bounds, topOffset, window.innerHeight)

    if (current) {
      activeSection.value = current
    }
  }

  function observeSections(): void {
    cancelAnimationFrame(frame)
    observer?.disconnect()
    observedElements = []

    if (
      (route.name !== 'home' && route.name !== 'home-en') ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return
    }

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element) {
        observedElements.push(element)
      }
    }

    if (observedElements.length === 0) {
      if (attempts >= MAX_OBSERVE_ATTEMPTS) {
        return
      }
      attempts += 1
      frame = requestAnimationFrame(observeSections)
      return
    }

    observer = new IntersectionObserver(
      () => {
        updateActiveFromGeometry()
      },
      {
        rootMargin: `-${topOffset}px 0px -55% 0px`,
        threshold: [0, 0.1, 0.3, 0.6],
      },
    )

    for (const element of observedElements) {
      observer.observe(element)
    }
  }

  // `main.ts` mounts the app before the initial navigation resolves, so on a
  // hard reload the route name changes from `undefined` to `home` while
  // `fullPath` stays `/`. Watching both covers that case and route changes.
  watch(
    () => `${String(route.name)}:${route.fullPath}`,
    () => {
      activeSection.value = sectionIds[0] ?? ''
      attempts = 0
      observeSections()
    },
    { flush: 'post' },
  )

  onMounted(() => {
    observeSections()
  })

  onUnmounted(() => {
    cancelAnimationFrame(frame)
    observer?.disconnect()
  })

  return { activeSection }
}
