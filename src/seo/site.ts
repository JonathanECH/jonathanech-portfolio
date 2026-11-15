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

export const DEFAULT_OG_IMAGE_ALT =
  'Jonathan Campos — Desarrollador Web Frontend especializado en Vue 3, Tailwind CSS y TypeScript'

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
