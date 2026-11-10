import { describe, expect, it } from 'vitest'
import { projects } from '@/data/portfolio'
import { useGalleryLightbox } from '@/composables/useGalleryLightbox'
import type { GallerySlide } from '@/types/portfolio'

function projectGallery(slug: string) {
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    throw new Error(`Missing project fixture: ${slug}`)
  }

  return project.gallery
}

describe('useGalleryLightbox', () => {
  it('only collects slides that contain a real image', () => {
    const gallery = projectGallery('tilyshop-inventory')
    const lightbox = useGalleryLightbox(gallery)

    expect(lightbox.imageSlides.value).toHaveLength(4)
    expect(lightbox.imageSlides.value.every((slide) => Boolean(slide.image))).toBe(true)
  })

  it('opens a slide with a real image at the matching position', () => {
    const gallery = projectGallery('tilyshop-inventory')
    const lightbox = useGalleryLightbox(gallery)

    lightbox.open(gallery[2])

    expect(lightbox.isOpen.value).toBe(true)
    expect(lightbox.activeSlide.value?.id).toBe('sales')
    expect(lightbox.activeIndex.value).toBe(2)
  })

  it('ignores slides without an image', () => {
    const slideWithoutImage: GallerySlide = {
      id: 'mock-no-image',
      title: 'Mock Slide Without Image',
      caption: 'Mock caption',
      path: 'mock/path',
      variant: 'medical',
      badges: ['Mock'],
    }
    const lightbox = useGalleryLightbox([slideWithoutImage])

    expect(lightbox.canOpen(slideWithoutImage)).toBe(false)

    lightbox.open(slideWithoutImage)

    expect(lightbox.isOpen.value).toBe(false)
    expect(lightbox.activeSlide.value).toBeNull()
  })

  it('cycles forward and backward through image slides', () => {
    const gallery = projectGallery('tilyshop-inventory')
    const lightbox = useGalleryLightbox(gallery)

    lightbox.open(gallery[0])
    lightbox.next()
    expect(lightbox.activeSlide.value?.id).toBe('admin')

    lightbox.previous()
    expect(lightbox.activeSlide.value?.id).toBe('dashboard')

    lightbox.previous()
    expect(lightbox.activeSlide.value?.id).toBe('profile')

    lightbox.next()
    expect(lightbox.activeSlide.value?.id).toBe('dashboard')
  })

  it('closes the lightbox and resets the position', () => {
    const gallery = projectGallery('tilyshop-inventory')
    const lightbox = useGalleryLightbox(gallery)

    lightbox.open(gallery[1])
    lightbox.close()

    expect(lightbox.isOpen.value).toBe(false)
    expect(lightbox.activeIndex.value).toBe(0)
    expect(lightbox.activeSlide.value).toBeNull()
  })
})
