import type { Profile, Project, ResolvedLocale } from '@/types/portfolio'
import {
  DEFAULT_OG_IMAGE,
  SITE_ADDRESS,
  SITE_AUTHOR,
  SITE_AUTHOR_ALTERNATE,
  SITE_EMAIL,
  SITE_JOB_TITLE,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
  projectImage,
  projectUrl,
  siteName,
} from './site'
import { localizedPath } from '@/utils/localized-path'

export type JsonLdNode = Record<string, unknown> & { '@type': string }

export interface JsonLdGraph {
  readonly '@context': 'https://schema.org'
  readonly '@graph': JsonLdNode[]
}

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

const CORE_SKILLS = [
  'Vue 3',
  'TypeScript',
  'Tailwind CSS',
  'Vite',
  'Pinia',
  'JavaScript',
  'HTML5',
  'CSS3',
  'Progressive Web Apps',
  'REST APIs',
  'Technical SEO',
  'Web Accessibility',
] as const

function localized(locale: ResolvedLocale, es: string, en: string): string {
  return locale === 'es' ? es : en
}

export function buildPersonJsonLd(profile: Profile, locale: ResolvedLocale): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_AUTHOR,
    alternateName: SITE_AUTHOR_ALTERNATE,
    jobTitle: SITE_JOB_TITLE,
    description: profile.bio,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    email: `mailto:${SITE_EMAIL}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_ADDRESS.city,
      addressRegion: SITE_ADDRESS.region,
      addressCountry: SITE_ADDRESS.country,
    },
    sameAs: [SOCIAL_PROFILES.github, SOCIAL_PROFILES.linkedin],
    knowsAbout: [...CORE_SKILLS],
    knowsLanguage: ['es-VE', 'en'],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: localized(
        locale,
        'IUTEPAL — TSU en Informática',
        'IUTEPAL — Associate Degree in Computer Science',
      ),
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: SITE_JOB_TITLE,
      occupationLocation: {
        '@type': 'City',
        name: SITE_ADDRESS.city,
      },
      skills: localized(
        locale,
        'Vue 3, TypeScript, Tailwind CSS, arquitectura frontend y accesibilidad web',
        'Vue 3, TypeScript, Tailwind CSS, frontend architecture and web accessibility',
      ),
    },
  }
}

export function buildWebSiteJsonLd(locale: ResolvedLocale): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: siteName(locale),
    alternateName: localized(locale, 'Portafolio de Jonathan Campos', 'Jonathan Campos Portfolio'),
    url: SITE_URL,
    description: localized(
      locale,
      'Portafolio profesional de Jonathan Campos, desarrollador web frontend especializado en Vue 3, Tailwind CSS y TypeScript.',
      'Professional portfolio of Jonathan Campos, frontend web developer specializing in Vue 3, Tailwind CSS and TypeScript.',
    ),
    inLanguage: locale === 'es' ? 'es-VE' : 'en',
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
  }
}

export function buildProjectsItemList(
  projects: readonly Project[],
  locale: ResolvedLocale,
): JsonLdNode {
  return {
    '@type': 'ItemList',
    name: localized(locale, 'Casos de estudio de Jonathan Campos', 'Jonathan Campos case studies'),
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.name,
      description: project.summary,
      url: projectUrl(project.slug, locale),
      image: projectImage(project),
    })),
  }
}

export function buildProjectJsonLd(project: Project, locale: ResolvedLocale): JsonLdNode {
  return {
    '@type': 'CreativeWork',
    '@id': `${projectUrl(project.slug, locale)}#case-study`,
    name: project.name,
    headline: `${project.title} ${project.titleHighlight}`,
    description: project.summary,
    abstract: project.problem,
    url: projectUrl(project.slug, locale),
    image: projectImage(project),
    copyrightYear: Number(project.year),
    creativeWorkStatus: project.status,
    inLanguage: locale === 'es' ? 'es-VE' : 'en',
    keywords: project.techTags.join(', '),
    genre: project.sector,
    author: { '@id': PERSON_ID },
    creator: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: projectUrl(project.slug, locale),
    about: project.techTags.map((tag) => ({ '@type': 'Thing', name: tag })),
    ...(project.links.repo && project.links.repo !== SOCIAL_PROFILES.github
      ? { codeRepository: project.links.repo }
      : {}),
    ...(project.links.demo ? { sameAs: [project.links.demo] } : {}),
  }
}

export function buildBreadcrumbJsonLd(project: Project, locale: ResolvedLocale): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: localized(locale, 'Inicio', 'Home'),
        item: absoluteUrl(localizedPath('/', locale)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: localized(locale, 'Proyectos', 'Projects'),
        item: absoluteUrl(`${localizedPath('/', locale)}#proyectos`),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.name,
        item: projectUrl(project.slug, locale),
      },
    ],
  }
}

export interface StructuredDataInput {
  readonly profile: Profile
  readonly projects: readonly Project[]
  readonly project: Project | null
  readonly isHome: boolean
  readonly locale: ResolvedLocale
}

export function buildStructuredData(input: StructuredDataInput): JsonLdGraph {
  const nodes: JsonLdNode[] = [
    buildPersonJsonLd(input.profile, input.locale),
    buildWebSiteJsonLd(input.locale),
  ]

  if (input.isHome) {
    nodes.push(buildProjectsItemList(input.projects, input.locale))
  }

  if (input.project) {
    nodes.push(
      buildProjectJsonLd(input.project, input.locale),
      buildBreadcrumbJsonLd(input.project, input.locale),
    )
  }

  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

/**
 * Serializes JSON-LD for inline `<script>` tags.
 *
 * Escaping `<` prevents a `</script>` sequence inside any content string from
 * terminating the script element early while keeping the JSON valid.
 */
export function serializeJsonLd(graph: JsonLdGraph): string {
  return JSON.stringify(graph).replace(/</g, '\\u003c')
}
