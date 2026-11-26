import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { projects } from './src/data/portfolio.ts'
import { buildSitemap } from './src/seo/sitemap.ts'

const CRITICAL_FONT_PATTERNS = [
  /^assets\/plus-jakarta-sans-latin-wght-normal-.*\.woff2$/,
  /^assets\/jetbrains-mono-latin-wght-normal-.*\.woff2$/,
] as const

/**
 * Emits `sitemap.xml` on build, serves it in dev, and injects `<link rel="preload">`
 * hints for the two primary Latin variable WOFF2 fonts so the browser fetches them
 * in parallel with the stylesheet.
 */
function sitemapPlugin(): Plugin {
  let isSsrBuild = false
  let sitemap = ''

  return {
    name: 'portfolio-sitemap',
    configResolved(config) {
      isSsrBuild = Boolean(config.build.ssr)
      sitemap = buildSitemap(projects)
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== '/sitemap.xml') {
          next()
          return
        }

        response.setHeader('Content-Type', 'application/xml; charset=utf-8')
        response.end(sitemap)
      })
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) {
          return []
        }

        const tags: HtmlTagDescriptor[] = []
        for (const fileName of Object.keys(ctx.bundle)) {
          if (CRITICAL_FONT_PATTERNS.some((pattern) => pattern.test(fileName))) {
            tags.push({
              tag: 'link',
              attrs: {
                rel: 'preload',
                href: `/${fileName}`,
                as: 'font',
                type: 'font/woff2',
                crossorigin: '',
              },
              injectTo: 'head',
            })
          }
        }

        return tags
      },
    },
    generateBundle() {
      if (isSsrBuild) {
        return
      }

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemap,
      })
    },
  }
}

const config = {
  plugins: [vue(), tailwindcss(), sitemapPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
  },
  ssgOptions: {
    // `/proyectos/clima-vue` -> `/proyectos/clima-vue.html`
    dirStyle: 'flat',
    formatting: 'none',
    // jsdom globals keep DOM-only setup code safe while prerendering.
    mock: true,
    // Critical CSS is not required for SEO and beasties is an optional peer.
    beastiesOptions: false,
    includedRoutes(paths: string[]): string[] {
      const staticPaths = paths.filter((path) => !path.includes(':') && !path.includes('*'))
      return Array.from(
        new Set([
          ...staticPaths,
          '/404',
          ...projects.flatMap((project) => [
            `/proyectos/${project.slug}`,
            `/en/proyectos/${project.slug}`,
          ]),
        ]),
      )
    },
  },
}

export default defineConfig(config)
