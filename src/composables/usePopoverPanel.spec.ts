import type { Ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { syncPopoverPanel } from '@/composables/usePopoverPanel'

function createPanel(isOpen = false) {
  return {
    matches: vi.fn((selector: string) => selector === ':popover-open' && isOpen),
    showPopover: vi.fn(),
    hidePopover: vi.fn(),
    focus: vi.fn(),
  }
}

function asRef(value: HTMLElement | null): Ref<HTMLElement | null> {
  return { value } as Ref<HTMLElement | null>
}

describe('syncPopoverPanel', () => {
  it('shows the panel only after it has been rendered', async () => {
    const panel = createPanel()
    const ref = asRef(null)

    await syncPopoverPanel(true, ref, async () => {
      ref.value = panel as unknown as HTMLElement
    })

    expect(panel.showPopover).toHaveBeenCalledOnce()
    expect(panel.focus).toHaveBeenCalledOnce()
  })

  it('does not call showPopover twice when the browser already opened it', async () => {
    const panel = createPanel(true)

    await syncPopoverPanel(
      true,
      asRef(panel as unknown as HTMLElement),
      async () => undefined,
    )

    expect(panel.showPopover).not.toHaveBeenCalled()
    expect(panel.focus).toHaveBeenCalledOnce()
  })

  it('hides an open panel when state closes', async () => {
    const panel = createPanel(true)
    const flush = vi.fn(async () => undefined)

    await syncPopoverPanel(false, asRef(panel as unknown as HTMLElement), flush)

    expect(panel.hidePopover).toHaveBeenCalledOnce()
    expect(flush).not.toHaveBeenCalled()
  })
})
