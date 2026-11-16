import type { Project } from '@/types/portfolio'

/**
 * Single source of truth for the canonical site identity.
 *
 * Every canonical URL, Open Graph tag, JSON-LD node and sitemap entry must be
 * derived from these constants so the domain only has to change here.
 */
export const SITE_URL = 'https://jonathanech.dev'
export const SITE_NAME = 'Jonathan Campos — Portafolio Frontend'
export const SITE_AUTHOR = 'Jonathan Campos'
export const SITE_AUTHOR_ALTERNATE = 'JonathanECH'
export const SITE_JOB_TITLE = 'Frontend Web Developer'
export const SITE_EMAIL = 'jonathancamposbusiness@gmail.com'
export const SITE_LOCALE = 'es_VE'
export const SITE_LOCALE_ALTERNATE = 'en_US'

export const SITE_ADDRESS = {
  city: 'Barquisimeto',
  region: 'Lara',
  country: 'VE',
} as const

export const SOCIAL_PROFILES = {
  github: 'https://github.com/JonathanECH',
  linkedin: 'https://www.linkedin.com/in/jonathanech',
} as const

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`
export const DEFAULT_OG_IMAGE_TYPE = 'image/jpeg'
export const DEFAULT_OG_IMAGE_WIDTH = 2848
export const DEFAULT_OG_IMAGE_HEIGHT = 1504

export const DEFAULT_OG_IMAGE_ALT =
  'Jonathan Campos — Desarrollador Web Frontend especializado en Vue 3, Tailwind CSS y TypeScript'

export interface SocialImageMeta {
  readonly url: string
  readonly type: 'image/jpeg' | 'image/webp' | 'image/png'
  readonly width: number
  readonly height: number
}

const PROJECT_IMAGE_DIMENSIONS: Readonly<Record<string, { width: number; height: number }>> = {
  'tilyshop-inventory': { width: 1364, height: 767 },
  'clima-vue': { width: 1280, height: 989 },
  'gestion-medica': { width: 1364, height: 767 },
  'erp-contable': { width: 1364, height: 723 },
}

/**
 * Social copy used for the home page. The static tags in `index.html` mirror
 * these values so crawlers that do not execute JavaScript still get a card.
 */
export const HOME_SOCIAL_TITLE = 'Jonathan Campos - Desarrollador Web Frontend'
export const HOME_SOCIAL_DESCRIPTION =
  'Portafolio profesional. Especialista en Vue 3, Tailwind CSS y TypeScript.'

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function projectUrl(slug: string): string {
  return absoluteUrl(`/proyectos/${slug}`)
}

export function projectImage(project: Project): string {
  const slide = project.gallery.find((item) => Boolean(item.image))
  return slide?.image ? absoluteUrl(slide.image) : DEFAULT_OG_IMAGE
}

function inferImageType(url: string): 'image/jpeg' | 'image/webp' | 'image/png' {
  const lower = url.toLowerCase()
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.png')) return 'image/png'
  return 'image/jpeg'
}

export function resolveSocialImageMeta(project: Project | null): SocialImageMeta {
  if (!project) {
    return {
      url: DEFAULT_OG_IMAGE,
      type: DEFAULT_OG_IMAGE_TYPE,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
    }
  }

  const url = projectImage(project)
  if (url === DEFAULT_OG_IMAGE) {
    return {
      url: DEFAULT_OG_IMAGE,
      type: DEFAULT_OG_IMAGE_TYPE,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
    }
  }

  const dims = PROJECT_IMAGE_DIMENSIONS[project.slug] ?? { width: 1200, height: 630 }
  return {
    url,
    type: inferImageType(url),
    width: dims.width,
    height: dims.height,
  }
}
