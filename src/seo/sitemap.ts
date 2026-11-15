import type { Project } from '@/types/portfolio'
import { SITE_URL, projectUrl } from './site.ts'

export type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export interface SitemapEntry {
  readonly url: string
  readonly lastmod?: string
  readonly changefreq?: ChangeFrequency
  readonly priority?: number
}

export function buildSitemapEntries(
  projects: readonly Project[],
  lastmod = new Date().toISOString().slice(0, 10),
): SitemapEntry[] {
  return [
    { url: `${SITE_URL}/`, lastmod, changefreq: 'monthly', priority: 1 },
    ...projects.map((project) => ({
      url: projectUrl(project.slug),
      lastmod,
      changefreq: 'monthly' as const,
      priority: 0.8,
    })),
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
      if (entry.lastmod) lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`)
      if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`)
      if (entry.priority !== undefined) lines.push(`    <priority>${entry.priority}</priority>`)

      return `  <url>\n${lines.join('\n')}\n  </url>`
    })
    .join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n')
}

export function buildSitemap(
  projects: readonly Project[],
  lastmod = new Date().toISOString().slice(0, 10),
): string {
  return renderSitemap(buildSitemapEntries(projects, lastmod))
}
