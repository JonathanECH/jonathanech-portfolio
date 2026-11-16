import { describe, expect, it } from 'vitest'
import robotsTxt from '../../public/robots.txt?raw'
import { profile, projects } from '@/data/portfolio'
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_TYPE,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
  projectImage,
  projectUrl,
  resolveSocialImageMeta,
} from '@/seo/site'
import {
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  buildProjectJsonLd,
  buildProjectsItemList,
  buildStructuredData,
  buildWebSiteJsonLd,
} from '@/seo/structured-data'
import { buildSitemap, buildSitemapEntries, renderSitemap } from '@/seo/sitemap'

const firstProject = projects[0]

describe('site URL helpers', () => {
  it('resolves relative and absolute URLs against the canonical domain', () => {
    expect(SITE_URL).toBe('https://jonathanech.dev')
    expect(SITE_URL).not.toContain('vercel.app')
    expect(absoluteUrl('/')).toBe('https://jonathanech.dev/')
    expect(absoluteUrl('proyectos')).toBe('https://jonathanech.dev/proyectos')
    expect(absoluteUrl('https://example.com/x')).toBe('https://example.com/x')
    expect(projectUrl('clima-vue')).toBe('https://jonathanech.dev/proyectos/clima-vue')
  })

  it('derives a social image from the project gallery with a safe fallback', () => {
    expect(projectImage(firstProject)).toBe(
      `https://jonathanech.dev${firstProject.gallery.find((slide) => slide.image)?.image}`,
    )
    expect(
      projectImage({ ...firstProject, gallery: [] }),
    ).toBe(DEFAULT_OG_IMAGE)
  })

  it('resolves social image dimensions and mime type for home and project routes', () => {
    expect(resolveSocialImageMeta(null)).toEqual({
      url: DEFAULT_OG_IMAGE,
      type: DEFAULT_OG_IMAGE_TYPE,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
    })

    const projectMeta = resolveSocialImageMeta(firstProject)
    expect(projectMeta.url).toBe(projectImage(firstProject))
    expect(projectMeta.type).toBe('image/webp')
    expect(projectMeta.width).toBeGreaterThan(0)
    expect(projectMeta.height).toBeGreaterThan(0)

    expect(resolveSocialImageMeta({ ...firstProject, gallery: [] })).toEqual({
      url: DEFAULT_OG_IMAGE,
      type: DEFAULT_OG_IMAGE_TYPE,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
    })
  })
})

describe('JSON-LD builders', () => {
  it('describes the author as a Person with verifiable profiles', () => {
    const node = buildPersonJsonLd(profile, 'es')

    expect(node['@type']).toBe('Person')
    expect(node.name).toBe('Jonathan Campos')
    expect(node.jobTitle).toBe('Frontend Web Developer')
    expect(node.sameAs).toEqual([SOCIAL_PROFILES.github, SOCIAL_PROFILES.linkedin])
    expect(node.knowsAbout).toContain('Vue 3')
    expect(node.address).toMatchObject({ addressLocality: 'Barquisimeto', addressCountry: 'VE' })
  })

  it('publishes the portfolio as a WebSite linked to the Person node', () => {
    const node = buildWebSiteJsonLd('en')

    expect(node['@type']).toBe('WebSite')
    expect(node.url).toBe(SITE_URL)
    expect(node.inLanguage).toBe('en')
    expect(node.author).toEqual({ '@id': `${SITE_URL}/#person` })
  })

  it('lists every case study in the home ItemList', () => {
    const node = buildProjectsItemList(projects, 'es')

    expect(node['@type']).toBe('ItemList')
    expect(node.numberOfItems).toBe(projects.length)
    expect(node.itemListElement).toHaveLength(projects.length)
    expect((node.itemListElement as { url: string }[])[0].url).toBe(projectUrl(firstProject.slug))
  })

  it('exposes problem, stack and impact on the CreativeWork node', () => {
    const node = buildProjectJsonLd(firstProject, 'es')

    expect(node['@type']).toBe('CreativeWork')
    expect(node.description).toBe(firstProject.summary)
    expect(node.abstract).toBe(firstProject.problem)
    expect(node.keywords).toBe(firstProject.techTags.join(', '))
    expect(node.image).toBe(projectImage(firstProject))
    expect((node.workExample as unknown[]).length).toBe(firstProject.audit.metrics.length)
  })

  it('builds a three-level breadcrumb ending on the case study', () => {
    const node = buildBreadcrumbJsonLd(firstProject, 'en')
    const items = node.itemListElement as { position: number; name: string; item: string }[]

    expect(items.map((item) => item.position)).toEqual([1, 2, 3])
    expect(items[0].name).toBe('Home')
    expect(items[2].item).toBe(projectUrl(firstProject.slug))
  })

  it('composes the full graph for home and project routes', () => {
    const home = buildStructuredData({
      profile,
      projects,
      project: null,
      isHome: true,
      locale: 'es',
    })
    const detail = buildStructuredData({
      profile,
      projects,
      project: firstProject,
      isHome: false,
      locale: 'en',
    })

    expect(home.map((node) => node['@type'])).toEqual(['Person', 'WebSite', 'ItemList'])
    expect(detail.map((node) => node['@type'])).toEqual([
      'Person',
      'WebSite',
      'CreativeWork',
      'BreadcrumbList',
    ])
  })
})

describe('sitemap generation', () => {
  it('includes the home page and every case study', () => {
    const entries = buildSitemapEntries(projects, '2026-11-15')

    expect(entries).toHaveLength(projects.length + 1)
    expect(entries[0].url).toBe('https://jonathanech.dev/')
    expect(entries.every((entry) => entry.lastmod === '2026-11-15')).toBe(true)
    expect(entries.map((entry) => entry.url)).toContain(projectUrl(firstProject.slug))
  })

  it('renders valid XML with escaped values and priorities', () => {
    const xml = buildSitemap(projects, '2026-11-15')

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml).toContain('<priority>1</priority>')
    expect(xml).toContain('<priority>0.8</priority>')
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true)
  })

  it('escapes ampersands and quotes in URLs', () => {
    const xml = renderSitemap([
      { url: 'https://jonathanech.dev/?a=1&b="2"', changefreq: 'monthly' },
    ])

    expect(xml).toContain('&amp;')
    expect(xml).toContain('&quot;')
    expect(xml).not.toContain('b="2"')
  })

  it('keeps robots.txt free of blank lines inside User-agent record groups (RFC 9309)', () => {
    expect(robotsTxt).not.toMatch(/User-agent:[^\r\n]+\r?\n\r?\n(Allow|Disallow):/)
    expect(robotsTxt).toContain('Sitemap: https://jonathanech.dev/sitemap.xml')
  })
})
