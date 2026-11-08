<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight, Gauge } from '@lucide/vue'
import { useI18n } from '@/i18n'
import type { Project } from '@/types/portfolio'

const props = defineProps<{
  project: Project
  index: number
}>()

const emit = defineEmits<{
  'open-quick-view': [slug: string]
}>()

const { t } = useI18n()

const BARS = [38, 62, 48, 76, 58, 90] as const

function openQuickView(): void {
  emit('open-quick-view', props.project.slug)
}
</script>

<template>
  <div class="animate-fade-up" :style="`animation-delay: ${index * 70}ms`">
    <article
      class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-[0_18px_40px_-24px_rgba(0,229,255,0.45)]"
      :style="`--accent: ${project.accent}`"
    >
      <!-- Lightweight local CSS/SVG preview built from the project gallery -->
      <div class="relative h-48 overflow-hidden border-b border-border bg-background/70" aria-hidden="true">
        <div class="absolute inset-0 bg-grid-fine opacity-50" />
        <div
          class="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl"
          :style="{ backgroundColor: project.accent }"
        />

        <div class="relative flex h-full flex-col gap-3 p-4">
          <div class="flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-white/20" />
            <span class="h-2 w-2 rounded-full bg-white/20" />
            <span class="h-2 w-2 rounded-full bg-white/20" />
            <span
              class="ml-2 flex min-w-0 items-center gap-1 rounded border border-border/70 bg-surface/70 px-2 py-0.5 font-mono text-[9px] text-muted"
            >
              <span
                class="h-1 w-1 shrink-0 rounded-full"
                :style="{ backgroundColor: project.accent }"
              />
              <span class="truncate">{{ project.liveHost }}</span>
            </span>
          </div>

          <div class="flex min-h-0 flex-1 gap-3">
            <div
              class="hidden w-24 shrink-0 flex-col gap-2 rounded-lg border border-border/60 bg-surface/40 p-2 sm:flex"
            >
              <span
                v-for="(slide, slideIndex) in project.gallery"
                :key="slide.id"
                class="flex items-center gap-1.5"
              >
                <span
                  class="h-1 w-1 shrink-0 rounded-full"
                  :style="{
                    backgroundColor: slideIndex === 0 ? project.accent : 'rgba(255,255,255,0.22)',
                  }"
                />
                <span
                  class="h-1 min-w-0 flex-1 rounded-full"
                  :class="slideIndex === 0 ? 'bg-white/30' : 'bg-white/10'"
                />
              </span>
            </div>

            <div class="flex min-w-0 flex-1 flex-col gap-2">
              <div
                class="flex flex-1 items-end gap-1.5 rounded-lg border border-border/60 bg-surface/40 p-2.5"
              >
                <span
                  v-for="(bar, barIndex) in BARS"
                  :key="barIndex"
                  class="flex-1 rounded-sm"
                  :style="{
                    height: `${bar}%`,
                    backgroundColor:
                      barIndex === BARS.length - 1 ? project.accent : 'rgba(255,255,255,0.14)',
                  }"
                />
              </div>
              <div class="flex gap-1.5 overflow-hidden">
                <span
                  v-for="slide in project.gallery.slice(0, 3)"
                  :key="slide.id"
                  class="min-w-0 flex-1 truncate rounded border border-border/60 bg-surface/50 px-1.5 py-1 font-mono text-[8px] uppercase tracking-[0.08em] text-muted"
                >
                  {{ slide.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-1 flex-col p-5 sm:p-6">
        <div class="flex items-center justify-between gap-3">
          <span
            class="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]"
          >
            <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: project.accent }" />
            {{ project.sector }}
          </span>
          <span class="shrink-0 font-mono text-[10px] text-muted">{{ project.year }}</span>
        </div>

        <h3 class="mt-4 font-sans text-lg font-bold tracking-tight text-white sm:text-xl">
          {{ project.title }}
          <span class="text-[var(--accent)]">{{ project.titleHighlight }}</span>
        </h3>

        <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{{ project.summary }}</p>

        <div class="mt-4 flex flex-wrap gap-1.5">
          <span
            v-for="tag in project.techTags.slice(0, 4)"
            :key="tag"
            class="rounded border border-border/70 bg-background/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-cyan-accent/90"
          >
            {{ tag }}
          </span>
        </div>

        <span
          class="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-cyan-accent"
        >
          {{ t('projects.viewCase') }}
          <ArrowRight
            :size="12"
            aria-hidden="true"
            class="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>

        <div class="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div
            class="flex min-w-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted"
          >
            <Gauge :size="12" class="shrink-0 text-cyan-accent" aria-hidden="true" />
            <span class="truncate text-white">{{ project.audit.latencyAfter }}</span>
            <span class="shrink-0 text-border">//</span>
            <span class="truncate">{{ project.audit.discrepancy }}</span>
          </div>

          <button
            type="button"
            class="relative z-10 inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-border-hover hover:text-cyan-accent"
            :aria-label="t('projects.quickViewAria', { name: project.name })"
            @click.prevent.stop="openQuickView"
          >
            {{ t('projects.quickView') }}
          </button>
        </div>
      </div>

      <!-- Stretched link: the whole card navigates to the case study -->
      <RouterLink
        :to="`/proyectos/${project.slug}`"
        class="absolute inset-0 z-0 rounded-2xl focus-visible:bg-cyan-accent/5 focus-visible:outline-offset-[-2px]"
        :aria-label="t('projects.viewFullAria', { name: project.name })"
      />
    </article>
  </div>
</template>
