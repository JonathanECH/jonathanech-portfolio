import type { Project, ResolvedLocale } from '@/types/portfolio'
import { localizedPath } from '../utils/localized-path.ts'

/**
 * Single source of truth for the canonical site identity.
 *
 * Every canonical URL, Open Graph tag, JSON-LD node and sitemap entry must be
 * derived from these constants so the domain only has to change here.
 */
export const SITE_URL = 'https://jonathanech.dev'
export const SITE_AUTHOR = 'Jonathan Campos'
export const SITE_AUTHOR_ALTERNATE = 'JonathanECH'
export const SITE_JOB_TITLE = 'Frontend Web Developer'
export const SITE_EMAIL = 'jonathancamposbusiness@gmail.com'
export const SITE_LOCALE = 'es_VE'
export const SITE_LOCALE_ALTERNATE = 'en_US'

// shortcut: manual home date, move to the CMS publish timestamp when available.
export const HOME_UPDATED_AT = '2026-11-26'

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

/**
 * Project cards are generated as 1200×630 JPEG files because some social
 * crawlers still reject WebP and `summary_large_image` expects ~1.91:1.
 * Each card lives next to the first gallery image as `og-<slug>.jpg`.
 */
export const PROJECT_OG_IMAGE_WIDTH = 1200
export const PROJECT_OG_IMAGE_HEIGHT = 630

export function siteName(locale: ResolvedLocale): string {
  return locale === 'es'
    ? 'Jonathan Campos — Portafolio Frontend'
    : 'Jonathan Campos — Frontend Portfolio'
}

export function defaultOgImageAlt(locale: ResolvedLocale): string {
  return locale === 'es'
    ? 'Jonathan Campos — Desarrollador Web Frontend especializado en Vue 3, Tailwind CSS y TypeScript'
    : 'Jonathan Campos — Frontend Web Developer specializing in Vue 3, Tailwind CSS and TypeScript'
}

/**
 * Social copy used for the home page, localized to match `og:locale`.
 * The static tags in `index.html` mirror the Spanish values so crawlers that
 * do not execute JavaScript still get a card.
 */
export const HOME_SOCIAL_COPY: Readonly<
  Record<ResolvedLocale, { readonly title: string; readonly description: string }>
> = {
  es: {
    title: 'Jonathan Campos — Desarrollador Web Frontend',
    description:
      'Portafolio profesional. Especialista en Vue 3, Tailwind CSS y TypeScript.',
  },
  en: {
    title: 'Jonathan Campos — Frontend Web Developer',
    description:
      'Professional portfolio. Specializing in Vue 3, Tailwind CSS and TypeScript.',
  },
}

export interface SocialImageMeta {
  readonly url: string
  readonly type: 'image/jpeg' | 'image/webp' | 'image/png'
  readonly width: number
  readonly height: number
}

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function localizedUrl(path: string, locale: ResolvedLocale): string {
  return absoluteUrl(localizedPath(path, locale))
}

export function homeUrl(locale: ResolvedLocale = 'es'): string {
  return localizedUrl('/', locale)
}

export function projectUrl(slug: string, locale: ResolvedLocale = 'es'): string {
  return localizedUrl(`/proyectos/${slug}`, locale)
}

export function projectImage(project: Project): string {
  const slide = project.gallery.find((item) => Boolean(item.image))
  return slide?.image ? absoluteUrl(slide.image) : DEFAULT_OG_IMAGE
}

export function projectSocialImage(project: Project): string {
  const slide = project.gallery.find((item) => Boolean(item.image))

  if (!slide?.image?.startsWith('/')) {
    return DEFAULT_OG_IMAGE
  }

  const directory = slide.image.slice(0, slide.image.lastIndexOf('/'))
  return absoluteUrl(`${directory}/og-${project.slug}.jpg`)
}

export function resolveSocialImageMeta(project: Project | null): SocialImageMeta {
  const url = project ? projectSocialImage(project) : DEFAULT_OG_IMAGE

  if (url === DEFAULT_OG_IMAGE) {
    return {
      url: DEFAULT_OG_IMAGE,
      type: DEFAULT_OG_IMAGE_TYPE,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
    }
  }

  return {
    url,
    type: 'image/jpeg',
    width: PROJECT_OG_IMAGE_WIDTH,
    height: PROJECT_OG_IMAGE_HEIGHT,
  }
}
