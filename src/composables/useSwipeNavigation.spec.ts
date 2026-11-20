import { describe, expect, it, vi } from 'vitest'
import { effectScope, ref } from 'vue'
import { useSwipeNavigation, type SwipePointerEvent } from './useSwipeNavigation'

function createPointerEvent(init: Partial<SwipePointerEvent> = {}): SwipePointerEvent {
  return {
    clientX: 0,
    clientY: 0,
    button: 0,
    pointerId: 1,
    pointerType: 'touch',
    ...init,
  }
}

describe('useSwipeNavigation', () => {
  it('keeps justSwiped during the synthetic click window', () => {
    vi.useFakeTimers()
    try {
      const swipe = useSwipeNavigation({ threshold: 40 })

      swipe.onPointerDown(createPointerEvent({ clientX: 200, clientY: 100 }))
      swipe.onPointerMove(createPointerEvent({ clientX: 140, clientY: 100 }))
      swipe.onPointerUp(createPointerEvent({ clientX: 140, clientY: 100 }))

      expect(swipe.justSwiped.value).toBe(true)

      vi.advanceTimersByTime(80)
      expect(swipe.justSwiped.value).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('clears the click suppression timer on reset, onPointerDown and scope dispose', () => {
    vi.useFakeTimers()
    try {
      const swipe = useSwipeNavigation({ threshold: 40 })

      swipe.onPointerDown(createPointerEvent({ clientX: 200, clientY: 100 }))
      swipe.onPointerMove(createPointerEvent({ clientX: 140, clientY: 100 }))
      swipe.onPointerUp(createPointerEvent({ clientX: 140, clientY: 100 }))

      expect(swipe.justSwiped.value).toBe(true)
      expect(vi.getTimerCount()).toBe(1)

      swipe.reset()
      expect(swipe.justSwiped.value).toBe(false)
      expect(vi.getTimerCount()).toBe(0)

      swipe.onPointerDown(createPointerEvent({ clientX: 200, clientY: 100 }))
      swipe.onPointerMove(createPointerEvent({ clientX: 140, clientY: 100 }))
      swipe.onPointerUp(createPointerEvent({ clientX: 140, clientY: 100 }))
      expect(vi.getTimerCount()).toBe(1)

      swipe.onPointerDown(createPointerEvent({ clientX: 200, clientY: 100 }))
      expect(swipe.justSwiped.value).toBe(false)
      expect(vi.getTimerCount()).toBe(0)

      const scope = effectScope()
      const scopedSwipe = scope.run(() => useSwipeNavigation({ threshold: 40 }))!

      scopedSwipe.onPointerDown(createPointerEvent({ clientX: 200, clientY: 100 }))
      scopedSwipe.onPointerMove(createPointerEvent({ clientX: 140, clientY: 100 }))
      scopedSwipe.onPointerUp(createPointerEvent({ clientX: 140, clientY: 100 }))
      expect(vi.getTimerCount()).toBe(1)

      scope.stop()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('triggers onNext when swiping left past threshold', () => {
    const onNext = vi.fn()
    const onPrevious = vi.fn()
    const swipe = useSwipeNavigation({
      threshold: 40,
      onNext,
      onPrevious,
    })

    swipe.onPointerDown(createPointerEvent({ clientX: 200, clientY: 100 }))
    swipe.onPointerMove(createPointerEvent({ clientX: 180, clientY: 100 }))
    expect(swipe.isSwiping.value).toBe(true)
    expect(swipe.offsetX.value).toBe(-20)

    swipe.onPointerMove(createPointerEvent({ clientX: 140, clientY: 100 }))
    expect(swipe.offsetX.value).toBe(-60)

    swipe.onPointerUp(createPointerEvent({ clientX: 140, clientY: 100 }))

    expect(onNext).toHaveBeenCalledOnce()
    expect(onPrevious).not.toHaveBeenCalled()
    expect(swipe.offsetX.value).toBe(0)
    expect(swipe.isDragging.value).toBe(false)
  })

  it('triggers onPrevious when swiping right past threshold', () => {
    const onNext = vi.fn()
    const onPrevious = vi.fn()
    const swipe = useSwipeNavigation({
      threshold: 40,
      onNext,
      onPrevious,
    })

    swipe.onPointerDown(createPointerEvent({ clientX: 100, clientY: 100 }))
    swipe.onPointerMove(createPointerEvent({ clientX: 160, clientY: 100 }))
    swipe.onPointerUp(createPointerEvent({ clientX: 160, clientY: 100 }))

    expect(onPrevious).toHaveBeenCalledOnce()
    expect(onNext).not.toHaveBeenCalled()
  })

  it('does not trigger navigation when swipe is below threshold', () => {
    const onNext = vi.fn()
    const onPrevious = vi.fn()
    const swipe = useSwipeNavigation({
      threshold: 50,
      onNext,
      onPrevious,
    })

    swipe.onPointerDown(createPointerEvent({ clientX: 100, clientY: 100 }))
    swipe.onPointerMove(createPointerEvent({ clientX: 80, clientY: 100 })) // -20px
    swipe.onPointerUp(createPointerEvent({ clientX: 80, clientY: 100 }))

    expect(onNext).not.toHaveBeenCalled()
    expect(onPrevious).not.toHaveBeenCalled()
    expect(swipe.offsetX.value).toBe(0)
  })

  it('aborts when user motion is predominantly vertical (e.g. scroll attempt)', () => {
    const onNext = vi.fn()
    const swipe = useSwipeNavigation({ threshold: 40, onNext })

    swipe.onPointerDown(createPointerEvent({ clientX: 100, clientY: 100 }))
    swipe.onPointerMove(createPointerEvent({ clientX: 102, clientY: 130 })) // vertical 30px
    swipe.onPointerMove(createPointerEvent({ clientX: 50, clientY: 130 })) // subsequent horizontal

    swipe.onPointerUp(createPointerEvent({ clientX: 50, clientY: 130 }))

    expect(onNext).not.toHaveBeenCalled()
  })

  it('respects the enabled flag (e.g. single slide)', () => {
    const onNext = vi.fn()
    const enabled = ref(false)
    const swipe = useSwipeNavigation({
      threshold: 40,
      onNext,
      enabled,
    })

    swipe.onPointerDown(createPointerEvent({ clientX: 100, clientY: 100 }))
    swipe.onPointerMove(createPointerEvent({ clientX: 40, clientY: 100 }))
    swipe.onPointerUp(createPointerEvent({ clientX: 40, clientY: 100 }))

    expect(onNext).not.toHaveBeenCalled()
  })

  it('works with mouse pointers on desktop', () => {
    const onNext = vi.fn()
    const swipe = useSwipeNavigation({ threshold: 40, onNext })

    swipe.onPointerDown(createPointerEvent({ clientX: 200, clientY: 100, pointerType: 'mouse', button: 0 }))
    swipe.onPointerMove(createPointerEvent({ clientX: 140, clientY: 100, pointerType: 'mouse' }))
    swipe.onPointerUp(createPointerEvent({ clientX: 140, clientY: 100, pointerType: 'mouse' }))

    expect(onNext).toHaveBeenCalledOnce()
  })
})
