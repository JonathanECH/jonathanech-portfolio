import { inject } from '@vercel/analytics'
import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/jetbrains-mono'
import './styles/main.css'
import App from './App.vue'
import { initPreferences } from './composables/usePreferences'
import { routes, scrollBehavior } from './router'

// `ViteSSG` creates the app, installs the router (memory history while
// prerendering, web history in the browser) and installs the unhead client.
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ app, router }) => {
    // `vite-ssg` registers an internal `(to, from, next) => next()` guard right
    // after this callback, which triggers `[VUE_ROUTER_R0025]` in Vue Router 5.
    // Adapting 3-arg guards to a 2-arg return-based guard preserves `vite-ssg`
    // initial-state hydration without invoking Vue Router's deprecated `next()`.
    const rawBeforeEach = router.beforeEach.bind(router)
    router.beforeEach = (guard) => {
      if (guard.length < 3) {
        return rawBeforeEach(guard)
      }

      return rawBeforeEach((to, from) => {
        let forwarded: unknown
        const outcome = guard.call(undefined, to, from, ((arg?: unknown) => {
          forwarded = arg
        }) as Parameters<typeof guard>[2])

        return (outcome !== undefined ? outcome : forwarded) as ReturnType<typeof guard>
      })
    }

    app.use(createPinia())

    if (!import.meta.env.SSR) {
      initPreferences()
      inject({ mode: import.meta.env.PROD ? 'production' : 'development' })
    }
  },
)
