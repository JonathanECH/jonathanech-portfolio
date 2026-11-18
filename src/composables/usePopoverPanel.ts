import type { Ref } from 'vue'

type PopoverElement = HTMLElement & {
  showPopover?: () => void
  hidePopover?: () => void
}

/**
 * Keeps a Vue-rendered `popover` panel in sync with component state.
 *
 * The panel may not exist yet when the state changes (for example, when it is
 * behind `v-if`), so the ref is always read after the DOM has been flushed.
 */
export async function syncPopoverPanel(
  isOpen: boolean,
  panelRef: Ref<HTMLElement | null>,
  flush: () => Promise<void>,
): Promise<void> {
  if (isOpen) {
    await flush()

    const panel = panelRef.value as PopoverElement | null
    if (!panel) {
      return
    }

    if (typeof panel.showPopover === 'function' && !panel.matches(':popover-open')) {
      panel.showPopover()
    }

    panel.focus()
    return
  }

  const panel = panelRef.value as PopoverElement | null
  if (typeof panel?.hidePopover === 'function' && panel.matches(':popover-open')) {
    panel.hidePopover()
  }
}
