<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft, ArrowRight } from '@lucide/vue'
import { useI18n } from '@/i18n'
import type { Project } from '@/types/portfolio'

defineProps<{
  previous: Project | null
  next: Project | null
}>()

const { t } = useI18n()
</script>

<template>
  <nav class="border-t border-border" :aria-label="t('pager.aria')">
    <div class="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-12">
      <div class="grid gap-px overflow-hidden rounded border border-border bg-border sm:grid-cols-2">
        <RouterLink
          v-if="previous"
          :to="`/proyectos/${previous.slug}`"
          class="group flex items-center gap-4 bg-background p-5 transition-colors duration-300 hover:bg-surface-card sm:p-6"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border text-foreground/60 transition-all duration-300 group-hover:-translate-x-1 group-hover:border-border-hover group-hover:text-cyan-accent"
            aria-hidden="true"
          >
            <ArrowLeft :size="17" />
          </span>
          <span class="min-w-0">
            <span class="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {{ t('pager.previous') }}
            </span>
            <span
              class="mt-1 block text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-cyan-accent"
            >
              {{ previous.name }}
            </span>
            <span class="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/35">
              {{ previous.sector }}
            </span>
          </span>
        </RouterLink>

        <div
          v-else
          class="flex items-center gap-4 bg-background p-5 text-foreground/25 sm:p-6"
          aria-disabled="true"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border/60"
            aria-hidden="true"
          >
            <ArrowLeft :size="17" />
          </span>
          <span class="min-w-0">
            <span class="block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/25">
              {{ t('pager.previous') }}
            </span>
            <span class="mt-1 block text-base font-semibold leading-snug text-foreground/30">
              {{ t('pager.noPrevious') }}
            </span>
            <span class="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/15">
              {{ t('pager.start') }}
            </span>
          </span>
        </div>

        <RouterLink
          v-if="next"
          :to="`/proyectos/${next.slug}`"
          class="group flex items-center justify-end gap-4 bg-background p-5 text-right transition-colors duration-300 hover:bg-surface-card sm:p-6"
        >
          <span class="min-w-0">
            <span class="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              {{ t('pager.next') }}
            </span>
            <span
              class="mt-1 block text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-cyan-accent"
            >
              {{ next.name }}
            </span>
            <span class="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/35">
              {{ next.sector }}
            </span>
          </span>
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border text-foreground/60 transition-all duration-300 group-hover:translate-x-1 group-hover:border-border-hover group-hover:text-cyan-accent"
            aria-hidden="true"
          >
            <ArrowRight :size="17" />
          </span>
        </RouterLink>

        <div
          v-else
          class="flex items-center justify-end gap-4 bg-background p-5 text-right text-foreground/25 sm:p-6"
          aria-disabled="true"
        >
          <span class="min-w-0">
            <span class="block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/25">
              {{ t('pager.next') }}
            </span>
            <span class="mt-1 block text-base font-semibold leading-snug text-foreground/30">
              {{ t('pager.noNext') }}
            </span>
            <span class="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/15">
              {{ t('pager.end') }}
            </span>
          </span>
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border/60"
            aria-hidden="true"
          >
            <ArrowRight :size="17" />
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>
