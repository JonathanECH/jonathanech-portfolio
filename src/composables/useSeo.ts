import { computed } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/i18n'
import { buildStructuredData } from '@/seo/structured-data'
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_AUTHOR,
  SITE_LOCALE,
  SITE_LOCALE_ALTERNATE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  projectImage,
  projectUrl,
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
    if (route.name !== 'project-detail') {
      return null
    }

    const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
    return content.value.projects.find((item) => item.slug === slug) ?? null
  })

  const isHome = computed(() => route.name === 'home')
  const isNotFound = computed(() => route.name === 'not-found')
  const isMissingProject = computed(() => route.name === 'project-detail' && !project.value)

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
      return projectUrl(project.value.slug)
    }

    if (isHome.value) {
      return `${SITE_URL}/`
    }

    return absoluteUrl(route.path)
  })

  const socialImage = computed(() =>
    project.value ? projectImage(project.value) : DEFAULT_OG_IMAGE,
  )

  const socialImageAlt = computed(() =>
    project.value
      ? `${project.value.name} — ${project.value.audit.badge}`
      : DEFAULT_OG_IMAGE_ALT,
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
    ogSiteName: SITE_NAME,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonicalUrl,
    ogImage: socialImage,
    ogImageAlt: socialImageAlt,
    ogLocale: computed(() => (locale.value === 'es' ? SITE_LOCALE : SITE_LOCALE_ALTERNATE)),
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: socialImage,
    twitterImageAlt: socialImageAlt,
  })

  useHead(() => ({
    htmlAttrs: { lang: locale.value },
    link: [{ rel: 'canonical', href: canonicalUrl.value }],
    script: buildStructuredData({
      profile: content.value.profile,
      projects: content.value.projects,
      project: project.value,
      isHome: isHome.value,
      locale: locale.value,
    }).map((node, index) => ({
      type: 'application/ld+json',
      key: `portfolio-jsonld-${index}`,
      innerHTML: JSON.stringify(node),
    })),
  }))
}
