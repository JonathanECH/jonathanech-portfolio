import { computed } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/i18n'
import { buildStructuredData, serializeJsonLd } from '@/seo/structured-data'
import {
  HOME_SOCIAL_COPY,
  SITE_AUTHOR,
  SITE_LOCALE,
  SITE_LOCALE_ALTERNATE,
  absoluteUrl,
  defaultOgImageAlt,
  homeUrl,
  projectUrl,
  resolveSocialImageMeta,
  siteName,
} from '@/seo/site'
import type { Project } from '@/types/portfolio'

const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const ROBOTS_NO_INDEX = 'noindex, follow'

/**
 * Route-aware document head for every page.
 *
 * `@unhead/vue` renders these tags during `vite-ssg` prerendering, so crawlers
 * and generative engines receive the final title, description, canonical URL,
 * social card and JSON-LD graph without executing JavaScript.
 */
export function useSeo(): void {
  const route = useRoute()
  const { content, locale, t } = useI18n()

  const project = computed<Project | null>(() => {
    if (route.name !== 'project-detail' && route.name !== 'project-detail-en') {
      return null
    }

    const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
    return content.value.projects.find((item) => item.slug === slug) ?? null
  })

  const isHome = computed(() => route.name === 'home' || route.name === 'home-en')
  const isNotFound = computed(() => route.name === 'not-found')
  const isMissingProject = computed(
    () =>
      (route.name === 'project-detail' || route.name === 'project-detail-en') && !project.value,
  )

  const title = computed(() => {
    if (isHome.value) {
      return t('meta.homeTitle')
    }

    if (isNotFound.value) {
      return t('meta.notFoundTitle')
    }

    if (isMissingProject.value) {
      return t('meta.projectNotFoundTitle')
    }

    if (project.value) {
      return t('meta.projectTitle', { name: project.value.name })
    }

    return t('meta.homeTitle')
  })

  const description = computed(() => {
    if (project.value) {
      return project.value.summary
    }

    if (isNotFound.value || isMissingProject.value) {
      return t('meta.notFoundDescription')
    }

    return t('meta.description')
  })

  const canonicalUrl = computed(() => {
    if (project.value) {
      return projectUrl(project.value.slug, locale.value)
    }

    if (isHome.value) {
      return homeUrl(locale.value)
    }

    return absoluteUrl(route.path)
  })

  const hreflangUrls = computed(() => {
    if (isNotFound.value || isMissingProject.value) {
      return null
    }

    if (project.value) {
      const slug = project.value.slug
      return { es: projectUrl(slug, 'es'), en: projectUrl(slug, 'en') }
    }

    if (isHome.value) {
      return { es: homeUrl('es'), en: homeUrl('en') }
    }

    return null
  })

  const socialImageMeta = computed(() => resolveSocialImageMeta(project.value))
  const socialImage = computed(() => socialImageMeta.value.url)
  const socialImageType = computed(() => socialImageMeta.value.type)
  const socialImageWidth = computed(() => socialImageMeta.value.width)
  const socialImageHeight = computed(() => socialImageMeta.value.height)

  const homeSocialCopy = computed(() => HOME_SOCIAL_COPY[locale.value])

  const socialTitle = computed(() =>
    isHome.value ? homeSocialCopy.value.title : title.value,
  )

  const socialDescription = computed(() =>
    isHome.value ? homeSocialCopy.value.description : description.value,
  )

  const socialImageAlt = computed(() =>
    project.value
      ? `${project.value.name} — ${project.value.audit.badge}`
      : defaultOgImageAlt(locale.value),
  )

  const robots = computed(() =>
    isNotFound.value || isMissingProject.value ? ROBOTS_NO_INDEX : ROBOTS_INDEX,
  )

  useSeoMeta({
    title,
    description,
    author: SITE_AUTHOR,
    robots,
    ogType: computed(() => (project.value ? 'article' : 'website')),
    ogSiteName: computed(() => siteName(locale.value)),
    ogTitle: socialTitle,
    ogDescription: socialDescription,
    ogUrl: canonicalUrl,
    ogImage: socialImage,
    ogImageWidth: socialImageWidth,
    ogImageHeight: socialImageHeight,
    ogImageAlt: socialImageAlt,
    ogLocale: computed(() => (locale.value === 'es' ? SITE_LOCALE : SITE_LOCALE_ALTERNATE)),
    ogLocaleAlternate: computed(() =>
      locale.value === 'es' ? [SITE_LOCALE_ALTERNATE] : [SITE_LOCALE],
    ),
    twitterCard: 'summary_large_image',
    twitterTitle: socialTitle,
    twitterDescription: socialDescription,
    twitterImage: socialImage,
    twitterImageAlt: socialImageAlt,
  })

  type HeadLink = {
    readonly rel: string
    readonly href: string
    readonly hreflang?: string
    readonly key?: string
  }

  useHead(() => ({
    htmlAttrs: { lang: locale.value },
    link: ((): HeadLink[] => {
      if (isNotFound.value || isMissingProject.value) {
        return []
      }

      const links: HeadLink[] = [{ rel: 'canonical', href: canonicalUrl.value, key: 'canonical' }]
      const alternates = hreflangUrls.value

      if (alternates) {
        links.push(
          { rel: 'alternate', href: alternates.es, hreflang: 'es', key: 'hreflang-es' },
          { rel: 'alternate', href: alternates.en, hreflang: 'en', key: 'hreflang-en' },
          { rel: 'alternate', href: alternates.es, hreflang: 'x-default', key: 'hreflang-default' },
        )
      }

      return links
    })(),
    meta: [{ property: 'og:image:type', content: socialImageType.value }],
    script: [
      {
        type: 'application/ld+json',
        key: 'portfolio-jsonld',
        innerHTML: serializeJsonLd(
          buildStructuredData({
            profile: content.value.profile,
            projects: content.value.projects,
            project: project.value,
            isHome: isHome.value,
            locale: locale.value,
          }),
        ),
      },
    ],
  }))
}
