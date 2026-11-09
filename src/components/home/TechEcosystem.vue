<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown } from '@lucide/vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import TechCard from '@/components/home/TechCard.vue'
import { useI18n } from '@/i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import type { TechFilter } from '@/types/portfolio'

const store = usePortfolioStore()
const { content, t } = useI18n()
const techFilterOptions = computed(() => content.value.techFilterOptions)

const activeCategory = computed<TechFilter>(() => store.activeCategory)
const categoryCounts = computed(() => store.categoryCounts)
const filteredTechnologies = computed(() => store.filteredTechnologies)
const visibleTechnologies = computed(() => store.visibleTechnologies)
const canToggleTechGrid = computed(() => store.canToggleTechGrid)
const isTechGridExpanded = computed(() => store.isTechGridExpanded)

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

function toggleTechGrid(): void {
  store.toggleTechGrid()
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

      <TransitionGroup
        id="tech-grid"
        tag="div"
        name="tech"
        role="list"
        :aria-label="t('tech.gridAria')"
        class="mt-8 grid grid-cols-2 gap-3.5 lg:grid-cols-3 xl:grid-cols-4"
      >
        <TechCard
          v-for="(technology, index) in visibleTechnologies"
          :key="`${activeCategory}-${technology.id}`"
          v-reveal="Math.min(index, 6) * 45"
          :technology="technology"
          :index="index"
        />
      </TransitionGroup>

      <div v-if="canToggleTechGrid" class="mt-7 flex justify-center">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-card/60 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-all duration-300 hover:border-border-hover hover:text-cyan-accent active:scale-[0.98] active:border-cyan-accent active:text-cyan-accent sm:text-[11px]"
          :aria-expanded="isTechGridExpanded"
          aria-controls="tech-grid"
          @click="toggleTechGrid"
        >
          {{ isTechGridExpanded ? t('tech.showLess') : t('tech.showMore') }}
          <ChevronDown
            :size="14"
            aria-hidden="true"
            class="transition-transform duration-300"
            :class="isTechGridExpanded ? 'rotate-180' : ''"
          />
        </button>
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

<style scoped>
.tech-move {
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
}

.tech-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.tech-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
