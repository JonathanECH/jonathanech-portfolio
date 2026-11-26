import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import robotsTxt from '../../public/robots.txt?raw'
import { profile, projects } from '@/data/portfolio'
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_TYPE,
  DEFAULT_OG_IMAGE_WIDTH,
  HOME_SOCIAL_COPY,
  HOME_UPDATED_AT,
  homeUrl,
  PROJECT_OG_IMAGE_HEIGHT,
  PROJECT_OG_IMAGE_WIDTH,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
  defaultOgImageAlt,
  projectImage,
  projectSocialImage,
  projectUrl,
  resolveSocialImageMeta,
  siteName,
} from '@/seo/site'
import {
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  buildProjectJsonLd,
  buildProjectsItemList,
  buildStructuredData,
  buildWebSiteJsonLd,
  serializeJsonLd,
} from '@/seo/structured-data'
import { buildSitemap, buildSitemapEntries, renderSitemap } from '@/seo/sitemap'

const firstProject = projects[0]

/** Reads the frame dimensions from a JPEG's Start Of Frame marker. */
function readJpegSize(buffer: Buffer): { width: number; height: number } {
  let offset = 2

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }

    const marker = buffer[offset + 1]
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      }
    }

    offset += 2 + buffer.readUInt16BE(offset + 2)
  }

  throw new Error('JPEG frame dimensions not found')
}

describe('site URL helpers', () => {
  it('resolves relative and absolute URLs against the canonical domain', () => {
    expect(SITE_URL).toBe('https://jonathanech.dev')
    expect(SITE_URL).not.toContain('vercel.app')
    expect(absoluteUrl('/')).toBe('https://jonathanech.dev/')
    expect(absoluteUrl('proyectos')).toBe('https://jonathanech.dev/proyectos')
    expect(absoluteUrl('https://example.com/x')).toBe('https://example.com/x')
    expect(projectUrl('clima-vue')).toBe('https://jonathanech.dev/proyectos/clima-vue')
  })

  it('derives the structured-data image from the project gallery with a safe fallback', () => {
    expect(projectImage(firstProject)).toBe(
      `https://jonathanech.dev${firstProject.gallery.find((slide) => slide.image)?.image}`,
    )
    expect(projectImage({ ...firstProject, gallery: [] })).toBe(DEFAULT_OG_IMAGE)
  })

  it('resolves every project social card as a 1200×630 JPEG asset', () => {
    for (const project of projects) {
      const galleryImage = project.gallery.find((slide) => slide.image)?.image ?? ''
      const directory = galleryImage.slice(0, galleryImage.lastIndexOf('/'))
      const url = `${SITE_URL}${directory}/og-${project.slug}.jpg`
      const file = fileURLToPath(
        new URL(`../../public${directory}/og-${project.slug}.jpg`, import.meta.url),
      )
      const buffer = readFileSync(file)

      expect(projectSocialImage(project)).toBe(url)
      expect(buffer.subarray(0, 3)).toEqual(Buffer.from([0xff, 0xd8, 0xff]))
      expect(readJpegSize(buffer)).toEqual({
        width: PROJECT_OG_IMAGE_WIDTH,
        height: PROJECT_OG_IMAGE_HEIGHT,
      })
      expect(resolveSocialImageMeta(project)).toEqual({
        url,
        type: 'image/jpeg',
        width: PROJECT_OG_IMAGE_WIDTH,
        height: PROJECT_OG_IMAGE_HEIGHT,
      })
    }

    const defaultFile = fileURLToPath(new URL('../../public/og-image.jpg', import.meta.url))
    expect(readJpegSize(readFileSync(defaultFile))).toEqual({
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
    })
    expect(resolveSocialImageMeta({ ...firstProject, gallery: [] })).toEqual({
      url: DEFAULT_OG_IMAGE,
      type: DEFAULT_OG_IMAGE_TYPE,
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
    })
  })

  it('localizes home social copy, site name and default image alt text', () => {
    expect(siteName('es')).toBe('Jonathan Campos — Portafolio Frontend')
    expect(siteName('en')).toBe('Jonathan Campos — Frontend Portfolio')
    expect(HOME_SOCIAL_COPY.es.title).toContain('Desarrollador Web Frontend')
    expect(HOME_SOCIAL_COPY.en.title).toContain('Frontend Web Developer')
    expect(defaultOgImageAlt('es')).toContain('Desarrollador Web Frontend')
    expect(defaultOgImageAlt('en')).toContain('Frontend Web Developer')
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

  it('publishes the portfolio as a localized WebSite linked to the Person node', () => {
    const node = buildWebSiteJsonLd('en')

    expect(node['@type']).toBe('WebSite')
    expect(node.name).toBe(siteName('en'))
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

  it('exposes only valid CreativeWork properties', () => {
    const node = buildProjectJsonLd(firstProject, 'es')

    expect(node['@type']).toBe('CreativeWork')
    expect(node.headline).toBe(`${firstProject.title} ${firstProject.titleHighlight}`)
    expect(node.headline).not.toBe(`${firstProject.title}${firstProject.titleHighlight}`)
    expect(node.description).toBe(firstProject.summary)
    expect(node.abstract).toBe(firstProject.problem)
    expect(node.keywords).toBe(firstProject.techTags.join(', '))
    expect(node.image).toBe(projectImage(firstProject))
    expect(node.copyrightYear).toBe(Number(firstProject.year))
    expect(node).not.toHaveProperty('dateCreated')
    expect(node).not.toHaveProperty('workExample')
    expect(node).not.toHaveProperty('additionalProperty')
  })

  it('only advertises public repositories and live demos that really exist', () => {
    const clima = projects.find((project) => project.slug === 'clima-vue')
    const razetti = projects.find((project) => project.slug === 'gestion-medica')

    expect(clima && buildProjectJsonLd(clima, 'es')).toMatchObject({
      codeRepository: 'https://github.com/JonathanECH/clima-vue',
      sameAs: ['https://clima-vue-vert.vercel.app/'],
    })
    expect(buildProjectJsonLd(firstProject, 'es').sameAs).toEqual([
      'https://tilyshop-inventory.vercel.app/',
    ])
    expect(razetti && buildProjectJsonLd(razetti, 'es')).not.toHaveProperty('codeRepository')
  })

  it('builds a three-level breadcrumb ending on the case study', () => {
    const node = buildBreadcrumbJsonLd(firstProject, 'en')
    const items = node.itemListElement as { position: number; name: string; item: string }[]

    expect(items.map((item) => item.position)).toEqual([1, 2, 3])
    expect(items[0].name).toBe('Home')
    expect(items[0].item).toBe(homeUrl('en'))
    expect(items[2].item).toBe(projectUrl(firstProject.slug, 'en'))
  })

  it('composes one schema.org graph for home and project routes', () => {
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

    expect(home['@context']).toBe('https://schema.org')
    expect(detail['@context']).toBe('https://schema.org')
    expect(home['@graph'].map((node) => node['@type'])).toEqual([
      'Person',
      'WebSite',
      'ItemList',
    ])
    expect(detail['@graph'].map((node) => node['@type'])).toEqual([
      'Person',
      'WebSite',
      'CreativeWork',
      'BreadcrumbList',
    ])
  })

  it('serializes JSON-LD without allowing a script-closing sequence', () => {
    const json = serializeJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Thing',
          name: '</script><script>alert("xss")</script>',
        },
      ],
    })

    expect(json).not.toContain('</script>')
    expect(json).toContain('\\u003c/script>')
    expect(JSON.parse(json)).toMatchObject({
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'Thing' }],
    })
  })
})

describe('sitemap generation', () => {
  it('publishes both locales with real lastmod and reciprocal hreflang', () => {
    const entries = buildSitemapEntries(projects)
    const xml = buildSitemap(projects)
    const realDates = new Set([HOME_UPDATED_AT, ...projects.map((project) => project.updatedAt)])

    expect(entries).toHaveLength((projects.length + 1) * 2)
    expect(entries.map((entry) => entry.url)).toEqual([
      homeUrl('es'),
      homeUrl('en'),
      ...projects.flatMap((project) => [
        projectUrl(project.slug, 'es'),
        projectUrl(project.slug, 'en'),
      ]),
    ])
    expect(entries.every((entry) => Boolean(entry.lastmod && realDates.has(entry.lastmod)))).toBe(true)
    expect(entries[0].alternates).toEqual([
      { hreflang: 'es', href: homeUrl('es') },
      { hreflang: 'en', href: homeUrl('en') },
      { hreflang: 'x-default', href: homeUrl('es') },
    ])
    expect(xml).toContain(`<lastmod>${HOME_UPDATED_AT}</lastmod>`)
    expect(xml).toContain(
      `<xhtml:link rel="alternate" hreflang="en" href="${homeUrl('en')}" />`,
    )
    expect(xml).toContain(
      `<xhtml:link rel="alternate" hreflang="x-default" href="${homeUrl('es')}" />`,
    )
  })

  it('renders valid XML with escaped values and priorities', () => {
    const xml = buildSitemap(projects)

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    )
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
