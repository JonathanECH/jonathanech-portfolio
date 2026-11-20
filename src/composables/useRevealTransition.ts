/**
 * TransitionGroup hooks for cards that also use view() scroll animations.
 *
 * A scroll timeline owns `opacity`, `translate` and `scale` with fill `both`,
 * which would override the enter/leave transitions. Marking the element as
 * settled cancels that animation while Vue plays its enter/leave transition.
 *
 * As soon as the enter transition completes (`onAfterEnter`) or is interrupted
 * (`onEnterCancelled`), `reveal-settled` is removed unconditionally so every
 * card—whether in the default view, expanded via "Ver más" or filtered—always
 * retains its native `view(block)` scroll-driven reveal animation.
 */
export function useRevealTransition() {
  function settle(el: Element): void {
    el.classList.add('reveal-settled')
  }

  function releaseForScrollReveal(el: Element): void {
    el.classList.remove('reveal-settled')
  }

  return {
    onBeforeEnter: settle,
    onAfterEnter: releaseForScrollReveal,
    onEnterCancelled: releaseForScrollReveal,
    onBeforeLeave: settle,
  }
}
