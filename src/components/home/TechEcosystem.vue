<script setup lang="ts">
import { computed } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import TechCard from '@/components/home/TechCard.vue'
import { useI18n } from '@/i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import type { TechFilter, Technology } from '@/types/portfolio'

const store = usePortfolioStore()
const { content, t } = useI18n()
const techFilterOptions = computed(() => content.value.techFilterOptions)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const activeCategory = computed<TechFilter>(() => store.activeCategory)
const categoryCounts = computed(() => store.categoryCounts)
const filteredTechnologies = computed<readonly Technology[]>(() => store.filteredTechnologies)

const activeFilterLabel = computed(
  () =>
    techFilterOptions.value.find((option) => option.value === activeCategory.value)?.label ??
    t('tech.allFallback'),
)

function isActive(filter: TechFilter): boolean {
  return activeCategory.value === filter
}

function setCategory(filter: TechFilter): void {
  store.setCategory(filter)
}

function cardDelay(index: number): string {
  return prefersReducedMotion ? '0ms' : `${index * 55}ms`
}
</script>

<template>
  <section
    id="stack"
    class="relative w-full scroll-mt-20 overflow-hidden border-t border-border/60 bg-surface/30 py-20 lg:py-28"
  >
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute inset-0 bg-grid-fine opacity-40" />
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--ech-accent-rgb),0.06),transparent_55%)]"
      />
    </div>

    <div class="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-12">
      <SectionHeading
        :code="t('tech.code')"
        :title="t('tech.title')"
        :highlight="t('tech.highlight')"
        :description="t('tech.description')"
      />

      <div
        class="mt-8 flex flex-wrap items-center gap-2.5"
        role="group"
        :aria-label="t('tech.filterAria')"
      >
        <button
          v-for="option in techFilterOptions"
          :key="option.value"
          type="button"
          :aria-pressed="isActive(option.value)"
          class="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-all duration-200 sm:text-[11px]"
          :class="
            isActive(option.value)
              ? 'border-cyan-accent bg-cyan-accent text-black shadow-[0_0_18px_rgba(var(--ech-accent-rgb),0.28)]'
              : 'border-border bg-surface-card/60 text-muted hover:border-border-hover hover:text-foreground'
          "
          @click="setCategory(option.value)"
        >
          {{ option.label }}
          <span
            class="text-[9px] tabular-nums sm:text-[10px]"
            :class="isActive(option.value) ? 'text-black/60' : 'text-muted/60'"
          >
            {{ categoryCounts[option.value] }}
          </span>
        </button>
      </div>

      <p class="sr-only" aria-live="polite">
        {{
          t('tech.showing', {
            count: filteredTechnologies.length,
            category: activeFilterLabel,
          })
        }}
      </p>

      <div class="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TechCard
          v-for="(technology, index) in filteredTechnologies"
          :key="`${activeCategory}-${technology.id}`"
          :technology="technology"
          :index="index"
          class="animate-fade-up"
          :style="{ animationDelay: cardDelay(index) }"
        />
      </div>

      <div
        class="mt-6 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50 sm:text-[10px]"
      >
        <span>
          {{ t('tech.modulesLoaded', { count: filteredTechnologies.length.toString().padStart(2, '0') }) }}
        </span>
        <span>{{ t('tech.filter', { category: activeFilterLabel }) }}</span>
      </div>
    </div>
  </section>
</template>
