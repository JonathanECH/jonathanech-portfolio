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
})
