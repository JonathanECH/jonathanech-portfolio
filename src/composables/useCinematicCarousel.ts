import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { GallerySlide } from '@/types/portfolio'

const DEFAULT_INTERVAL = 4800

export interface CinematicCarouselOptions {
  readonly interval?: number
  readonly autoplay?: boolean
}

export interface CinematicCarouselPauseOptions {
  /**
   * `true` (default) records a deliberate user pause so hover/focus resumes
   * never override it. Pass `false` for transient pauses (hover, focus,
   * visibility) that should resume automatically.
   */
  readonly manual?: boolean
}

export interface CinematicCarouselControls {
  readonly activeIndex: Ref<number>
  readonly activeSlide: ComputedRef<GallerySlide | undefined>
  readonly isPlaying: Ref<boolean>
  readonly progressKey: Ref<number>
  readonly reducedMotion: Ref<boolean>
  readonly next: () => void
  readonly prev: () => void
  readonly goTo: (index: number) => void
  readonly pause: (options?: CinematicCarouselPauseOptions) => void
  readonly resume: (options?: CinematicCarouselPauseOptions) => void
  readonly toggle: () => void
}

/**
 * Cinematic autoplay carousel for the project detail gallery.
 *
 * Timers are paused on hover/focus by the consumer through `pause({ manual: false })`,
 * stopped while the document is hidden, disabled under `prefers-reduced-motion: reduce`
 * and always cleared on unmount. Remaining time is preserved across transient pauses.
 */
export function useCinematicCarousel(
  slides: readonly GallerySlide[],
  options: CinematicCarouselOptions = {},
): CinematicCarouselControls {
  const interval = options.interval ?? DEFAULT_INTERVAL
  const autoplayEnabled = options.autoplay ?? true

  const activeIndex = ref(0)
  const isPlaying = ref(false)
  const progressKey = ref(0)

  const activeSlide = computed<GallerySlide | undefined>(() => slides[activeIndex.value])

  let timer: ReturnType<typeof setTimeout> | null = null
  let remaining = interval
  let startedAt = 0
  let manuallyPaused = false
  let documentHidden = false
  const reducedMotion = ref(false)
  let motionQuery: MediaQueryList | null = null

  function clearTimer(): void {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function stopClock(): void {
    if (timer !== null) {
      const elapsed = Date.now() - startedAt
      remaining = Math.max(remaining - elapsed, 0)
      clearTimer()
    }
  }

  function canAutoplay(): boolean {
    return (
      autoplayEnabled &&
      slides.length > 1 &&
      !manuallyPaused &&
      !documentHidden &&
      !reducedMotion.value
    )
  }

  function schedule(reset: boolean): void {
    // Accumulate elapsed time first; otherwise a running timer would subtract
    // its elapsed time from the freshly reset interval.
    stopClock()

    if (reset) {
      remaining = interval
    }

    if (!canAutoplay()) {
      isPlaying.value = false
      return
    }

    isPlaying.value = true
    startedAt = Date.now()
    timer = setTimeout(handleTick, remaining)
  }

  function handleTick(): void {
    timer = null
    remaining = interval
    advance()
  }

  function commit(index: number): void {
    const total = slides.length
    activeIndex.value = total > 0 ? ((index % total) + total) % total : 0
    progressKey.value += 1
    schedule(true)
  }

  function advance(): void {
    commit(activeIndex.value + 1)
  }

  function next(): void {
    advance()
  }

  function prev(): void {
    commit(activeIndex.value - 1)
  }

  function goTo(index: number): void {
    if (slides.length === 0) {
      return
    }
    commit(index)
  }

  function pause(pauseOptions: CinematicCarouselPauseOptions = {}): void {
    if (pauseOptions.manual ?? true) {
      manuallyPaused = true
    }
    stopClock()
    isPlaying.value = false
  }

  function resume(resumeOptions: CinematicCarouselPauseOptions = {}): void {
    if (resumeOptions.manual ?? true) {
      manuallyPaused = false
    }
    schedule(false)
  }

  function toggle(): void {
    if (isPlaying.value) {
      pause()
    } else {
      resume()
    }
  }

  function handleVisibilityChange(): void {
    documentHidden = document.visibilityState === 'hidden'
    if (documentHidden) {
      stopClock()
      isPlaying.value = false
      return
    }
    schedule(false)
  }

  function handleMotionPreference(event: MediaQueryListEvent): void {
    reducedMotion.value = event.matches
    if (reducedMotion.value) {
      stopClock()
      isPlaying.value = false
      return
    }
    schedule(false)
  }

  watch(
    () => slides.length,
    (total) => {
      if (total === 0) {
        activeIndex.value = 0
        progressKey.value += 1
        stopClock()
        isPlaying.value = false
        return
      }

      if (activeIndex.value >= total) {
        activeIndex.value = total - 1
        progressKey.value += 1
      }

      schedule(true)
    },
  )

  onMounted(() => {
    if (typeof window === 'undefined') {
      return
    }

    documentHidden = document.visibilityState === 'hidden'
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = motionQuery.matches
    motionQuery.addEventListener('change', handleMotionPreference)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    schedule(false)
  })

  onUnmounted(() => {
    stopClock()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    motionQuery?.removeEventListener('change', handleMotionPreference)
    motionQuery = null
  })

  return {
    activeIndex,
    activeSlide,
    isPlaying,
    progressKey,
    reducedMotion,
    next,
    prev,
    goTo,
    pause,
    resume,
    toggle,
  }
}
