import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { projects } from './src/data/portfolio.ts'
import { buildSitemap } from './src/seo/sitemap.ts'

/**
 * Emits `sitemap.xml` on build and serves it in dev.
 *
 * URLs come from the same `projects` collection that renders the portfolio, so
 * adding a case study updates the sitemap automatically.
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
      return [...staticPaths, ...projects.map((project) => `/proyectos/${project.slug}`)]
    },
  },
}

export default defineConfig(config)
