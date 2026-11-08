import { onUnmounted, watch, type Ref } from 'vue'

export function useScrollLock(locked: Ref<boolean>) {
  let previousOverflow = ''
  let previousPaddingRight = ''

  function lock(): void {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    previousOverflow = document.body.style.overflow
    previousPaddingRight = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  }

  function unlock(): void {
    document.body.style.overflow = previousOverflow
    document.body.style.paddingRight = previousPaddingRight
  }

  watch(
    locked,
    (isLocked) => {
      if (isLocked) {
        lock()
      } else {
        unlock()
      }
    },
    { immediate: true },
  )

  onUnmounted(unlock)

  return { lock, unlock }
}
