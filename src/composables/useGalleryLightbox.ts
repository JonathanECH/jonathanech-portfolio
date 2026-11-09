import { computed, ref } from 'vue'
import type { GallerySlide } from '@/types/portfolio'

/**
 * State for the full-screen image viewer on the project detail gallery.
 *
 * Only slides backed by a real screenshot participate in the viewer; CSS
 * mockups cannot be enlarged. Navigation wraps within that image subset.
 */
export function useGalleryLightbox(slides: readonly GallerySlide[]) {
  const isOpen = ref(false)
  const activeIndex = ref(0)

  const imageSlides = computed<readonly GallerySlide[]>(() =>
    slides.filter((slide) => Boolean(slide.image)),
  )

  const activeSlide = computed<GallerySlide | null>(() => {
    if (!isOpen.value) {
      return null
    }

    return imageSlides.value[activeIndex.value] ?? null
  })

  function canOpen(slide: GallerySlide | undefined): slide is GallerySlide {
    return Boolean(slide?.image)
  }

  function open(slide: GallerySlide | undefined): void {
    if (!canOpen(slide)) {
      return
    }

    const index = imageSlides.value.findIndex((item) => item.id === slide.id)

    if (index === -1) {
      return
    }

    activeIndex.value = index
    isOpen.value = true
  }

  function close(): void {
    isOpen.value = false
    activeIndex.value = 0
  }

  function next(): void {
    const total = imageSlides.value.length

    if (!isOpen.value || total === 0) {
      return
    }

    activeIndex.value = (activeIndex.value + 1) % total
  }

  function previous(): void {
    const total = imageSlides.value.length

    if (!isOpen.value || total === 0) {
      return
    }

    activeIndex.value = (activeIndex.value - 1 + total) % total
  }

  return {
    isOpen,
    activeIndex,
    activeSlide,
    imageSlides,
    canOpen,
    open,
    close,
    next,
    previous,
  }
}
