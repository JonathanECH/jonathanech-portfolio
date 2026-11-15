import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/jetbrains-mono'
import './styles/main.css'
import App from './App.vue'
import { initPreferences } from './composables/usePreferences'
import { reveal } from './directives/reveal'
import { routes, scrollBehavior } from './router'

// `ViteSSG` creates the app, installs the router (memory history while
// prerendering, web history in the browser) and installs the unhead client.
export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ app }) => {
    app.directive('reveal', reveal)
    app.use(createPinia())

    if (!import.meta.env.SSR) {
      initPreferences()
    }
  },
)
