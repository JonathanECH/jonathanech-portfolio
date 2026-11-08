import { onMounted, onUnmounted, ref } from 'vue'

export function useActiveSection(sectionIds: readonly string[], topOffset = 120) {
  const activeSection = ref(sectionIds[0] ?? '')
  let observer: IntersectionObserver | null = null

  onMounted(() => {
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

    for (const id of sectionIds) {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { activeSection }
}
