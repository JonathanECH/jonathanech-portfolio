import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const MAX_OBSERVE_ATTEMPTS = 120

export function useActiveSection(sectionIds: readonly string[], topOffset = 120) {
  const route = useRoute()
  const activeSection = ref(sectionIds[0] ?? '')
  let observer: IntersectionObserver | null = null
  let frame = 0
  let attempts = 0

  function observeSections(): void {
    cancelAnimationFrame(frame)
    observer?.disconnect()

    if (route.name !== 'home' || typeof IntersectionObserver === 'undefined') {
      return
    }

    const elements: HTMLElement[] = []
    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element) {
        elements.push(element)
      }
    }

    if (elements.length === 0) {
      if (attempts >= MAX_OBSERVE_ATTEMPTS) {
        return
      }
      attempts += 1
      frame = requestAnimationFrame(observeSections)
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const current = visible[0]
        if (current) {
          activeSection.value = current.target.id
        }
      },
      {
        rootMargin: `-${topOffset}px 0px -55% 0px`,
        threshold: [0.1, 0.3, 0.6],
      },
    )

    for (const element of elements) {
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
