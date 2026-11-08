<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, ArrowUpRight, ExternalLink, FileText } from '@lucide/vue'
import { useI18n } from '@/i18n'
import type { Project } from '@/types/portfolio'

const props = defineProps<{ project: Project }>()
const { t } = useI18n()

const accentStyle = computed<Record<string, string>>(() => ({
  '--project-accent': props.project.accent,
}))

const metaChips = computed<readonly { label: string; value: string }[]>(() => [
  { label: t('detail.role'), value: props.project.role },
  { label: t('detail.client'), value: props.project.client },
  { label: t('detail.duration'), value: props.project.duration },
])
</script>

<template>
  <header
    class="relative isolate overflow-hidden border-b border-border"
    :style="accentStyle"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-grid-fine opacity-70"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[26rem] w-[52rem] max-w-full -translate-x-1/2 rounded-full bg-[color:var(--project-accent)]/10 blur-3xl"
      aria-hidden="true"
    />

    <div
      class="mx-auto w-full max-w-7xl px-5 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:px-12 lg:pb-20 lg:pt-32"
    >
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <nav
          :aria-label="t('detail.breadcrumbAria')"
          class="flex min-w-0 flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:text-[11px]"
        >
          <RouterLink
            :to="{ path: '/', hash: '#proyectos' }"
            class="group inline-flex items-center gap-2 text-muted transition-colors duration-200 hover:text-white"
          >
            <ArrowLeft
              :size="12"
              aria-hidden="true"
              class="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>{{ t('detail.projects') }}</span>
          </RouterLink>
          <span class="text-white/20" aria-hidden="true">/</span>
          <span class="text-white/75">{{ project.name }}</span>
        </nav>

        <div class="flex flex-wrap items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span class="rounded border border-border bg-surface-card/70 px-2.5 py-1 text-muted">
            {{ t('detail.year', { year: project.year }) }}
          </span>
          <span
            class="inline-flex items-center gap-1.5 rounded border border-[color:var(--project-accent)]/30 bg-[color:var(--project-accent)]/10 px-2.5 py-1 text-[color:var(--project-accent)]"
          >
            <span
              class="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[color:var(--project-accent)]"
              aria-hidden="true"
            />
            {{ project.status }}
          </span>
        </div>
      </div>

      <div class="max-w-5xl">
        <p
          class="mt-9 font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--project-accent)] sm:mt-10 sm:text-[11px]"
        >
          // {{ project.sector }} // {{ project.year }}
        </p>

        <h1
          class="mt-4 font-sans text-[clamp(2.25rem,7vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
        >
          {{ project.title }}
          <span class="text-cyan-accent text-glow">{{ project.titleHighlight }}</span>
        </h1>

        <p class="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
          {{ project.summary }}
        </p>

        <div
          class="mt-7 max-w-3xl border-l-2 border-[color:var(--project-accent)]/60 bg-surface-card/40 px-4 py-3 sm:px-5"
        >
          <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            {{ t('detail.problem') }}
          </p>
          <p class="mt-2 text-sm leading-relaxed text-white/60 sm:text-[15px]">
            {{ project.problem }}
          </p>
        </div>

        <ul class="mt-8 flex flex-wrap gap-2" :aria-label="t('detail.metadataAria')">
          <li
            v-for="chip in metaChips"
            :key="chip.label"
            class="inline-flex max-w-full items-baseline gap-2 rounded border border-border bg-surface/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
          >
            <span class="shrink-0 text-white/30">{{ chip.label }}</span>
            <span class="min-w-0 text-white/75 normal-case tracking-normal">{{ chip.value }}</span>
          </li>
        </ul>

        <div
          v-if="project.links.demo || project.links.repo || project.links.whitepaper"
          class="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            v-if="project.links.demo"
            :href="project.links.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex items-center gap-2 rounded bg-cyan-accent px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,229,255,0.35)]"
          >
            {{ t('detail.demo') }}
            <ArrowUpRight
              :size="15"
              aria-hidden="true"
              class="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
            <span class="sr-only">{{ t('detail.opensNewTab') }}</span>
          </a>

          <a
            v-if="project.links.repo"
            :href="project.links.repo"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex items-center gap-2 rounded border border-border bg-surface-card/60 px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/85 transition-all duration-300 hover:border-border-hover hover:text-cyan-accent"
          >
            {{ t('detail.viewCode') }}
            <ExternalLink :size="14" aria-hidden="true" />
            <span class="sr-only">{{ t('detail.opensNewTab') }}</span>
          </a>

          <a
            v-if="project.links.whitepaper"
            :href="project.links.whitepaper"
            download
            class="group inline-flex items-center gap-2 rounded border border-border bg-surface-card/60 px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/70 transition-all duration-300 hover:border-border-hover hover:text-white"
          >
            {{ t('detail.whitepaper') }}
            <FileText :size="14" aria-hidden="true" />
            <span class="sr-only">{{ t('detail.downloadPdf') }}</span>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
