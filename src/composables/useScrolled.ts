import { onMounted, onUnmounted, ref } from 'vue'

export function useScrolled(threshold = 12) {
  const scrolled = ref(false)

  function onScroll(): void {
    scrolled.value = window.scrollY > threshold
  }

  onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { scrolled }
}
