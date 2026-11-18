<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, type RouteLocationRaw } from 'vue-router'
import { ArrowRight, Home, Terminal } from '@lucide/vue'
import { useI18n, type UiMessageKey } from '@/i18n'

const route = useRoute()
const { t } = useI18n()

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const MAX_DISPLAY_PATH_LENGTH = 64

const requestedPath = computed(() => {
  if (!isMounted.value) {
    return '/404'
  }

  const candidate = route.path && route.path !== '/' ? route.path : '/404'
  return candidate.length > MAX_DISPLAY_PATH_LENGTH
    ? `${candidate.slice(0, MAX_DISPLAY_PATH_LENGTH)}…`
    : candidate
})

interface QuickRoute {
  readonly code: string
  readonly labelKey: UiMessageKey
  readonly to: RouteLocationRaw
}

const quickRoutes: readonly QuickRoute[] = [
  { code: '#01', labelKey: 'notFound.routeHome', to: { path: '/', hash: '#inicio' } },
  { code: '#02', labelKey: 'notFound.routeStack', to: { path: '/', hash: '#stack' } },
  { code: '#03', labelKey: 'notFound.routeProjects', to: { path: '/', hash: '#proyectos' } },
  { code: '#04', labelKey: 'notFound.routeAbout', to: { path: '/', hash: '#sobre-mi' } },
  { code: '#05', labelKey: 'notFound.routeContact', to: { path: '/', hash: '#contacto' } },
]
</script>

<template>
  <section
    class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-12 lg:pb-28 lg:pt-36"
    aria-labelledby="not-found-title"
  >
    <!-- Ambient Background Layers -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute inset-0 bg-grid-fine opacity-50" />
      <div
        class="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-accent/10 via-cyan-accent/5 to-transparent blur-3xl md:h-[44rem] md:w-[44rem]"
      />
      <div
        class="absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-cyan-accent/5 blur-[120px]"
      />

      <!-- Decorative CAD Technical Mesh -->
      <svg
        class="absolute inset-0 h-full w-full stroke-foreground/[0.04] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id="not-found-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke-width="1" />
            <circle cx="0" cy="0" r="1" class="fill-cyan-accent/25" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#not-found-grid)" />
      </svg>
    </div>

    <div class="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
      <!-- Status Eyebrow Badge -->
      <div
        class="inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-border bg-surface-card/80 px-4 py-1.5 backdrop-blur-md"
      >
        <span class="flex items-center gap-1.5" aria-hidden="true">
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75"
            />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-danger" />
          </span>
          <span class="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan-accent" />
        </span>

        <span
          class="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-accent sm:text-xs"
        >
          {{ t('notFound.code') }}
        </span>

        <span
          class="hidden border-l border-border pl-2.5 font-mono text-[10px] tracking-[0.14em] text-muted sm:inline"
        >
          {{ t('notFound.sysTag') }}
        </span>
      </div>

      <!-- Monumental 404 Visual Anchor -->
      <div class="relative my-3 flex select-none items-center justify-center sm:my-4" aria-hidden="true">
        <!-- Ambient Backlight -->
        <span
          class="pointer-events-none absolute inset-0 -translate-y-2 font-sans text-[116px] font-black leading-none tracking-[-0.06em] text-cyan-accent opacity-20 blur-2xl sm:text-[160px] md:text-[210px]"
        >
          404
        </span>

        <!-- Primary Glyph Display -->
        <span
          class="relative bg-gradient-to-b from-foreground via-foreground/85 to-muted/40 bg-clip-text font-sans text-[116px] font-black leading-none tracking-[-0.06em] text-transparent drop-shadow-[0_10px_35px_rgba(var(--ech-accent-rgb),0.25)] sm:text-[160px] md:text-[210px]"
        >
          404
        </span>

        <!-- Cyber Coordinate Tag -->
        <div
          class="absolute -right-2 top-3 flex flex-col items-start gap-0.5 rounded border border-border bg-surface/85 px-2.5 py-1 backdrop-blur-md sm:-right-4 sm:top-7 md:top-10"
        >
          <span class="font-mono text-[10px] tracking-[0.18em] text-cyan-accent">
            {{ t('notFound.coordinate') }}
          </span>
          <span class="font-mono text-[10px] tracking-[0.12em] text-muted">
            {{ t('notFound.latLng') }}
          </span>
        </div>

        <!-- Left Technical Micro-Ruler -->
        <div
          class="absolute -left-8 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-1.5 opacity-60 md:flex"
        >
          <span class="h-px w-6 bg-cyan-accent" />
          <span class="h-px w-3 bg-muted" />
          <span class="h-px w-4 bg-cyan-accent" />
          <span class="h-px w-2 bg-muted" />
          <span
            class="mt-2 rotate-180 font-mono text-[10px] tracking-[0.22em] text-cyan-accent [writing-mode:vertical-rl]"
          >
            {{ t('notFound.rulerLabel') }}
          </span>
        </div>
      </div>

      <!-- Editorial Error Headline & Description -->
      <div class="mt-2 max-w-2xl px-2">
        <h1
          id="not-found-title"
          class="font-sans text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl"
        >
          {{ t('notFound.title') }}
        </h1>

        <p
          class="mt-4 text-balance text-sm leading-relaxed text-muted sm:text-base lg:text-[17px]"
        >
          {{ t('notFound.description') }}
        </p>
      </div>

      <!-- Diagnostics Terminal Console (sys_router.log) -->
      <div
        class="relative mt-8 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface-card/75 text-left shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:mt-9"
        role="region"
        :aria-label="t('notFound.terminalAria')"
      >
        <!-- Top Edge Highlight -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/60 to-transparent"
        />

        <!-- Terminal Top Bar -->
        <div
          class="flex items-center justify-between gap-2 border-b border-border bg-surface-card/80 px-4 py-2.5 sm:px-5"
        >
          <div class="flex min-w-0 items-center gap-2">
            <div class="flex shrink-0 items-center gap-1.5" aria-hidden="true">
              <span class="h-2.5 w-2.5 rounded-full bg-danger/75" />
              <span class="h-2.5 w-2.5 rounded-full bg-warning-soft/75" />
              <span class="h-2.5 w-2.5 rounded-full bg-cyan-accent/75" />
            </div>
            <span class="ml-1.5 truncate font-mono text-[10px] tracking-wide text-muted sm:text-xs">
              sys_router.log
              <span class="text-foreground/25" aria-hidden="true">//</span>
              <span class="text-foreground/75">audit-trace</span>
            </span>
          </div>

          <div class="flex shrink-0 items-center gap-1.5">
            <span class="h-1.5 w-1.5 rounded-full bg-danger" aria-hidden="true" />
            <span
              class="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted"
            >
              {{ t('notFound.streamLive') }}
            </span>
          </div>
        </div>

        <!-- Terminal Diagnostic Body -->
        <div
          class="space-y-2.5 p-4 font-mono text-[11px] leading-relaxed text-foreground/85 sm:p-5 sm:text-xs"
        >
          <div class="flex min-w-0 flex-wrap items-baseline gap-2">
            <span class="font-semibold text-cyan-accent">&gt; REQUEST_URI:</span>
            <code
              class="max-w-full truncate break-all rounded border border-border bg-background/70 px-2 py-0.5 font-mono text-[11px] text-foreground"
            >
              {{ requestedPath }}
            </code>
            <span class="text-[10px] text-muted">{{ t('notFound.logOrigin') }}</span>
          </div>

          <div class="flex flex-wrap items-baseline gap-2">
            <span class="font-semibold text-danger">&gt; STATUS:</span>
            <span class="font-semibold text-danger">404 NOT_FOUND</span>
            <span class="text-[10px] text-muted">{{ t('notFound.logProtocol') }}</span>
          </div>

          <div class="flex flex-wrap items-baseline gap-2">
            <span class="font-semibold text-cyan-accent">&gt; RESOLUTION:</span>
            <span class="text-foreground/90">{{ t('notFound.logResolution') }}</span>
          </div>

          <div class="flex flex-wrap items-baseline gap-2">
            <span class="font-semibold text-warning-soft">&gt; DIAGNOSTIC:</span>
            <span class="text-foreground/90">{{ t('notFound.logDiagnostic') }}</span>
          </div>

          <div class="flex flex-wrap items-baseline gap-2 pt-0.5">
            <span class="font-semibold text-cyan-accent">&gt; ACTION:</span>
            <span class="text-cyan-accent">{{ t('notFound.logAction') }}</span>
            <span
              class="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-cursor bg-cyan-accent align-middle"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <!-- Call to Actions -->
      <div
        class="mt-12 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center"
      >
        <RouterLink
          :to="{ path: '/', hash: '#proyectos' }"
          class="group inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-accent px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-contrast shadow-[0_0_0_0_rgba(var(--ech-accent-rgb),0)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(var(--ech-accent-rgb),0.45)] active:scale-[0.98] sm:text-xs"
        >
          <Terminal :size="16" aria-hidden="true" />
          {{ t('notFound.exploreProjects') }}
          <ArrowRight
            :size="14"
            class="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </RouterLink>

        <RouterLink
          to="/"
          class="group inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface/60 px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:border-border-hover hover:bg-surface-card hover:text-cyan-accent active:scale-[0.98] sm:text-xs"
        >
          <Home :size="16" aria-hidden="true" />
          {{ t('notFound.backHome') }}
        </RouterLink>
      </div>

      <!-- Quick Navigation Jump Badges (Breadcrumb Fallback) -->
      <nav
        class="mt-11 flex w-full max-w-2xl flex-col items-center border-t border-border/60 pt-7"
        :aria-label="t('notFound.recommendedAria')"
      >
        <p class="mb-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          {{ t('notFound.recommendedRoutes') }}
        </p>

        <ul class="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          <li v-for="item in quickRoutes" :key="item.code">
            <RouterLink
              :to="item.to"
              class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-card/60 px-3 py-1.5 font-mono text-[11px] text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:bg-surface-card-hover hover:text-cyan-accent"
            >
              <span class="text-[10px] text-cyan-accent">{{ item.code }}</span>
              <span>{{ t(item.labelKey) }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>
