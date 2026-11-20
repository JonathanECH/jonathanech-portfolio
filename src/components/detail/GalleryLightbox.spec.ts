import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const lightboxSource = readFileSync(
  fileURLToPath(new URL('./GalleryLightbox.vue', import.meta.url)),
  'utf8',
)

describe('gallery lightbox theme', () => {
  it('uses semantic surfaces instead of hardcoded dark colors', () => {
    expect(lightboxSource).toContain('bg-background/95')
    expect(lightboxSource).toContain('bg-surface/80')
    expect(lightboxSource).toContain('text-foreground')
    expect(lightboxSource).toContain('text-muted')
    expect(lightboxSource).not.toMatch(/\bbg-black(?:\/\d+)?\b/)
    expect(lightboxSource).not.toMatch(/\bbg-white(?:\/\d+)?\b/)
    expect(lightboxSource).not.toMatch(/\bborder-white(?:\/\d+)?\b/)
    expect(lightboxSource.replace(/selection:text-white/g, '')).not.toMatch(
      /\btext-white(?:\/\d+)?\b/,
    )
  })

  it('keeps selected text readable in both themes', () => {
    expect(lightboxSource).toContain('selection:bg-cyan-accent/30')
    expect(lightboxSource).toContain('selection:text-foreground')
    expect(lightboxSource).toContain('dark:selection:text-white')
  })

  it('adapts the native backdrop to the active theme', () => {
    expect(lightboxSource).toContain(':root.light .lightbox-dialog::backdrop')
  })

  it('locks the page scroll and contains backdrop scrolling', () => {
    expect(lightboxSource).toContain("from '@/composables/useScrollLock'")
    expect(lightboxSource).toContain('useScrollLock(toRef(props, \'open\'))')
    expect(lightboxSource).toContain('overscroll-behavior: contain')
    expect(lightboxSource).toMatch(/\.lightbox-dialog::backdrop\s*\{[\s\S]*?overflow: hidden/)
  })

  it('wires ctrl + wheel zoom to the viewer', () => {
    expect(lightboxSource).toContain('@wheel="zoom.onWheel"')
  })

  it('hides the caption footer while the image is zoomed', () => {
    expect(lightboxSource).toContain('v-show="!zoom.isZoomed.value"')
  })

  it('shows touch and pointer hints only for their input device', () => {
    expect(lightboxSource).toContain("t('gallery.fullHintTouch')")
    expect(lightboxSource).toContain("t('gallery.fullHintPointer')")
    expect(lightboxSource).not.toContain("t('gallery.fullHint')")
    expect(lightboxSource).toContain('@media (pointer: coarse)')
    expect(lightboxSource).toContain('@media (pointer: fine)')
  })

  it('keeps swipe suppression when the slide changes', () => {
    const slideWatcher = lightboxSource.match(
      /watch\(\s*\(\) => props\.slide\?\.id,\s*\(\) => \{[\s\S]*?\},\s*\)/,
    )?.[0]

    expect(slideWatcher).toBeDefined()
    expect(slideWatcher).toContain('zoom.resetZoom(true)')
    expect(slideWatcher).not.toContain('swipe.reset()')
  })
})

describe('gallery lightbox image loading', () => {
  it('starts loading when the open state or active source changes', () => {
    expect(lightboxSource).toContain('const isImageLoading = ref(false)')
    expect(lightboxSource).toContain('ref<HTMLImageElement | null>(null)')
    expect(lightboxSource).toContain('const imageSourceKey = computed(')
    expect(lightboxSource).toContain('props.slide.id}:${props.slide.image}')
    expect(lightboxSource).toMatch(/watch\(\s*imageSourceKey,/)
    expect(lightboxSource).toContain('startImageLoading()')
    expect(lightboxSource).toContain('await nextTick()')
    expect(lightboxSource).toContain('syncImageLoading()')
  })

  it('hides the skeleton on load, error and cached images', () => {
    expect(lightboxSource).toContain('@load="finishImageLoading"')
    expect(lightboxSource).toContain('@error="finishImageLoading"')
    expect(lightboxSource).toContain('image?.complete && image.naturalWidth > 0')
  })

  it('renders a decorative skeleton without blocking pointer input', () => {
    expect(lightboxSource).toContain('v-if="isImageLoading"')
    expect(lightboxSource).toContain('aria-hidden="true"')
    expect(lightboxSource).toContain('pointer-events-none')
    expect(lightboxSource).toContain('motion-safe:animate-pulse')
  })
})
