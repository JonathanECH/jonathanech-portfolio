import type { Project, ResolvedLocale } from '@/types/portfolio'
import { HOME_UPDATED_AT, homeUrl, projectUrl } from './site.ts'

export type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export interface SitemapAlternate {
  readonly hreflang: string
  readonly href: string
}

export interface SitemapEntry {
  readonly url: string
  readonly lastmod?: string
  readonly changefreq?: ChangeFrequency
  readonly priority?: number
  readonly alternates?: readonly SitemapAlternate[]
}

const LOCALES: readonly ResolvedLocale[] = ['es', 'en']

function alternates(esUrl: string, enUrl: string): readonly SitemapAlternate[] {
  return [
    { hreflang: 'es', href: esUrl },
    { hreflang: 'en', href: enUrl },
    { hreflang: 'x-default', href: esUrl },
  ]
}

export function buildSitemapEntries(projects: readonly Project[]): SitemapEntry[] {
  const homeAlternates = alternates(homeUrl('es'), homeUrl('en'))

  return [
    ...LOCALES.map((locale) => ({
      url: homeUrl(locale),
      lastmod: HOME_UPDATED_AT,
      changefreq: 'monthly' as const,
      priority: locale === 'es' ? 1 : 0.9,
      alternates: homeAlternates,
    })),
    ...projects.flatMap((project) => {
      const projectAlternates = alternates(
        projectUrl(project.slug, 'es'),
        projectUrl(project.slug, 'en'),
      )

      return LOCALES.map((locale) => ({
        url: projectUrl(project.slug, locale),
        lastmod: project.updatedAt,
        changefreq: 'monthly' as const,
        priority: locale === 'es' ? 0.8 : 0.7,
        alternates: projectAlternates,
      }))
    }),
  ]
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function renderSitemap(entries: readonly SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lines = [`    <loc>${escapeXml(entry.url)}</loc>`]
      for (const alternate of entry.alternates ?? []) {
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}" />`,
        )
      }
      if (entry.lastmod) lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`)
      if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`)
      if (entry.priority !== undefined) lines.push(`    <priority>${entry.priority}</priority>`)

      return `  <url>\n${lines.join('\n')}\n  </url>`
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>',
    '',
  ].join('\n')
}

export function buildSitemap(projects: readonly Project[]): string {
  return renderSitemap(buildSitemapEntries(projects))
}
