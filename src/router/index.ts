import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function waitForHashTarget(hash: string, timeout = 1200): Promise<Element | null> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(null)
      return
    }
    const id = hash.startsWith('#') ? hash.slice(1) : hash
    const immediate = document.getElementById(id)
    if (immediate) {
      resolve(immediate)
      return
    }
    const startedAt = Date.now()
    function poll(): void {
      const element = document.getElementById(id)
      if (element) {
        resolve(element)
        return
      }
      if (Date.now() - startedAt >= timeout) {
        resolve(null)
        return
      }
      requestAnimationFrame(poll)
    }
    requestAnimationFrame(poll)
  })
}

/**
 * Route table shared by the SPA and by `vite-ssg`.
 *
 * The router instance is created by `ViteSSG` so the same routes can be
 * rendered with a memory history during static generation and with the web
 * history in the browser.
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/en',
    name: 'home-en',
    component: HomeView,
  },
  {
    path: '/proyectos/:slug',
    name: 'project-detail',
    component: () => import('@/views/ProjectDetailView.vue'),
    props: true,
  },
  {
    path: '/en/proyectos/:slug',
    name: 'project-detail-en',
    component: () => import('@/views/ProjectDetailView.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  // Scrolling is meaningless while prerendering and jsdom does not implement it.
  if (import.meta.env.SSR) {
    return false
  }

  if (savedPosition) {
    return savedPosition
  }
  if (to.hash) {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    return waitForHashTarget(to.hash).then((element) =>
      element ? { el: element, top: 72, behavior } : { top: 0 },
    )
  }
  return { top: 0 }
}
