/**
 * TransitionGroup hooks for cards that also use view() scroll animations.
 *
 * A scroll timeline owns `opacity`, `translate` and `scale` with fill `both`,
 * which would override the enter/leave transitions. Marking the element as
 * settled cancels that animation before Vue applies its transition classes,
 * and keeps the card visible afterwards even if it is inserted below the
 * viewport ("Ver más") or re-added by a filter.
 */
export function useRevealTransition() {
  function settle(el: Element): void {
    el.classList.add('reveal-settled')
  }

  return {
    onBeforeEnter: settle,
    onBeforeLeave: settle,
  }
}
