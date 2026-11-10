import { getCurrentInstance, onMounted, onUnmounted, watch, type Ref } from 'vue'
import type { Project } from '@/types/portfolio'

const DEFAULT_TITLE = 'Jonathan Campos — Desarrollador Frontend'
const DEFAULT_DESC =
  'Desarrollador Frontend especializado en Vue 3, TypeScript y arquitecturas web modernas. Casos de estudio de ingeniería, PWA offline-first y diseño de interfaces.'
const DEFAULT_IMAGE = 'https://jonathanech-portfolio.vercel.app/projects/tilyshop-inventory/dashboard-tilyshop-inventory.webp'
const BASE_URL = 'https://jonathanech-portfolio.vercel.app'

function setMetaContent(selector: string, content: string): void {
  if (typeof document === 'undefined') return
  const el = document.querySelector<HTMLMetaElement>(selector)
  if (el) {
    el.setAttribute('content', content)
  }
}

function setCanonicalHref(href: string): void {
  if (typeof document === 'undefined') return
  const el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (el) {
    el.setAttribute('href', href)
  }
}

export function useProjectSeo(projectRef: Ref<Project | undefined>): void {
  function applyProjectSeo(project: Project | undefined): void {
    if (typeof document === 'undefined') return

    if (!project) {
      resetSeo()
      return
    }

    const title = `${project.name} // Caso de Estudio — Jonathan Campos`
    const description = project.summary
    const url = `${BASE_URL}/proyectos/${project.slug}`
    const imageSlide = project.gallery.find((slide) => slide.image)
    const image = imageSlide?.image ? `${BASE_URL}${imageSlide.image}` : DEFAULT_IMAGE

    document.title = title
    setCanonicalHref(url)
    setMetaContent('meta[name="description"]', description)
    setMetaContent('meta[property="og:title"]', title)
    setMetaContent('meta[property="og:description"]', description)
    setMetaContent('meta[property="og:url"]', url)
    setMetaContent('meta[property="og:image"]', image)
    setMetaContent('meta[name="twitter:title"]', title)
    setMetaContent('meta[name="twitter:description"]', description)
    setMetaContent('meta[name="twitter:image"]', image)
  }

  function resetSeo(): void {
    if (typeof document === 'undefined') return

    document.title = DEFAULT_TITLE
    setCanonicalHref(`${BASE_URL}/`)
    setMetaContent('meta[name="description"]', DEFAULT_DESC)
    setMetaContent('meta[property="og:title"]', DEFAULT_TITLE)
    setMetaContent('meta[property="og:description"]', DEFAULT_DESC)
    setMetaContent('meta[property="og:url"]', `${BASE_URL}/`)
    setMetaContent('meta[property="og:image"]', DEFAULT_IMAGE)
    setMetaContent('meta[name="twitter:title"]', DEFAULT_TITLE)
    setMetaContent('meta[name="twitter:description"]', DEFAULT_DESC)
    setMetaContent('meta[name="twitter:image"]', DEFAULT_IMAGE)
  }

  if (getCurrentInstance()) {
    onMounted(() => {
      applyProjectSeo(projectRef.value)
    })

    onUnmounted(() => {
      resetSeo()
    })
  }

  watch(
    projectRef,
    (newProject) => {
      applyProjectSeo(newProject)
    },
    { immediate: true, flush: 'sync' },
  )
}
