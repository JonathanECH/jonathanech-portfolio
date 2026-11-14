import { createRouter, createWebHistory } from 'vue-router'
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/proyectos/:slug',
      name: 'project-detail',
      component: () => import('@/views/ProjectDetailView.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
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
  },
})

export default router
