import { computed, ref, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export type SwipePointerEvent = Pick<PointerEvent, 'clientX' | 'clientY'> &
  Partial<Pick<PointerEvent, 'button' | 'pointerId' | 'pointerType'>>

export interface UseSwipeNavigationOptions {
  /**
   * Minimum horizontal distance (in pixels) required to trigger a slide change.
   * Defaults to 45px.
   */
  readonly threshold?: number
  /**
   * Callback invoked when a leftward swipe (advance to next) is completed.
   */
  readonly onNext?: () => void
  /**
   * Callback invoked when a rightward swipe (go back to previous) is completed.
   */
  readonly onPrevious?: () => void
  /**
   * Whether swipe navigation is currently enabled (e.g. false if only 1 slide).
   */
  readonly enabled?: MaybeRefOrGetter<boolean>
}

/**
 * Universal pointer-based swipe and drag gesture handler for lightboxes and carousels.
 * Works seamlessly across both touch devices (mobile, tablets) and mouse pointer (desktop).
 */
export function useSwipeNavigation(options: UseSwipeNavigationOptions = {}) {
  const threshold = options.threshold ?? 45

  const offsetX = ref(0)
  const isDragging = ref(false)
  const isSwiping = ref(false)
  const justSwiped = ref(false)

  let startX = 0
  let startY = 0
  let isPointerDown = false
  let activePointerId: number | null = null

  const isEnabled = computed(() => toValue(options.enabled) ?? true)

  function onPointerDown(event: SwipePointerEvent): void {
    if (!isEnabled.value) return
    // Only respond to primary click / touch
    if (event.button !== undefined && event.button !== 0 && event.pointerType === 'mouse') return

    isPointerDown = true
    activePointerId = event.pointerId ?? 1
    startX = event.clientX
    startY = event.clientY
    offsetX.value = 0
    isSwiping.value = false
    justSwiped.value = false
  }

  function onPointerMove(event: SwipePointerEvent): void {
    if (!isPointerDown) return
    if (activePointerId !== null && event.pointerId !== undefined && event.pointerId !== activePointerId) return

    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    if (!isSwiping.value) {
      // Check horizontal intent: must exceed 8px and horizontal delta > vertical delta
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isSwiping.value = true
        isDragging.value = true
      } else if (Math.abs(deltaY) > 15 && Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical scroll intent detected, abort horizontal swipe
        isPointerDown = false
        activePointerId = null
        return
      }
    }

    if (isSwiping.value) {
      offsetX.value = deltaX
    }
  }

  function onPointerUp(event: SwipePointerEvent): void {
    if (!isPointerDown) return
    if (activePointerId !== null && event.pointerId !== undefined && event.pointerId !== activePointerId) return

    isPointerDown = false
    activePointerId = null
    isDragging.value = false

    if (isSwiping.value) {
      justSwiped.value = true
      const distance = offsetX.value

      if (distance < -threshold) {
        options.onNext?.()
      } else if (distance > threshold) {
        options.onPrevious?.()
      }

      offsetX.value = 0
      isSwiping.value = false

      // Prevent accidental click events right after a swipe gesture
      setTimeout(() => {
        justSwiped.value = false
      }, 80)
    }
  }

  function onPointerCancel(event?: SwipePointerEvent): void {
    if (event && activePointerId !== null && event.pointerId !== undefined && event.pointerId !== activePointerId) return
    isPointerDown = false
    activePointerId = null
    isDragging.value = false
    isSwiping.value = false
    offsetX.value = 0
  }

  function reset(): void {
    isPointerDown = false
    activePointerId = null
    isDragging.value = false
    isSwiping.value = false
    justSwiped.value = false
    offsetX.value = 0
  }

  return {
    offsetX,
    isDragging,
    isSwiping,
    justSwiped,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    reset,
  }
}
