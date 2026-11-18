import { onUnmounted, watch, type Ref } from 'vue'

/**
 * Native modal dialogs make the page inert but do not remove its scrollbar in
 * every engine. Keep a single lock so nested/overlapping dialogs cannot restore
 * scrolling before the last one closes.
 */
let lockCount = 0
let previousOverflow = ''
let previousPaddingRight = ''

export function lockPageScroll(): void {
  if (lockCount === 0) {
    const root = document.documentElement
    const scrollbarWidth = window.innerWidth - root.clientWidth

    previousOverflow = document.body.style.overflow
    previousPaddingRight = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'

    // Reserve the scrollbar width so hiding it does not shift the layout.
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  }

  lockCount += 1
}

export function unlockPageScroll(): void {
  if (lockCount === 0) {
    return
  }

  lockCount -= 1
  if (lockCount > 0) {
    return
  }

  document.body.style.overflow = previousOverflow
  document.body.style.paddingRight = previousPaddingRight
}

export function useScrollLock(locked: Ref<boolean>): void {
  watch(
    locked,
    (isLocked, wasLocked) => {
      if (isLocked === wasLocked) {
        return
      }

      if (isLocked) {
        lockPageScroll()
      } else {
        unlockPageScroll()
      }
    },
    { immediate: true },
  )

  onUnmounted(unlockPageScroll)
}
